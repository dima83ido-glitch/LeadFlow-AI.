import dns from "node:dns/promises";
import net from "node:net";

// Real-world sites (shared hosting, cold-starting free-tier hosts, etc.)
// routinely take several seconds to first byte. 8s was cutting off pages
// that would otherwise have loaded fine, especially across a redirect hop.
// This is the ceiling for a single fetch attempt — see WAKE_UP_TOTAL_BUDGET_MS
// for the separate, longer ceiling that covers a full cold-start retry cycle.
const FETCH_TIMEOUT_MS = 15000;
const DNS_TIMEOUT_MS = 3000;
const MAX_BYTES = 300_000;
const MAX_REDIRECTS = 5;

// Free-tier PaaS hosts (Render, Heroku, Fly.io, ...) spin their app down
// after inactivity and "wake" it on the next request — standard practice is
// to answer that request with `503 + Retry-After` while the origin boots
// (verified directly against a real hibernating Render app: an immediate
// 503 with `Retry-After`, then the identical URL serving the real page
// within ~14s once woken). Treating that as a hard failure on the first
// hit — what this file used to do — means a "sleeping" site can never be
// analyzed at all. This budget bounds how long we're willing to wait
// through that wake cycle before actually giving up.
const WAKE_UP_TOTAL_BUDGET_MS = 45_000;
// A generous safety cap against an infinite loop, not the real limit — the
// time budget above is what actually bounds this in practice (verified
// against a real hibernating Render app: it can take several 5s-apart
// checks before the origin is fully up).
const WAKE_UP_MAX_ATTEMPTS = 12;
const WAKE_UP_MIN_DELAY_MS = 2000;
const WAKE_UP_MAX_DELAY_MS = 6000;

export type PageSignals = {
  finalUrl: string;
  isHttps: boolean;
  title: string | null;
  metaDescription: string | null;
  hasViewportMeta: boolean;
  textSnippet: string;
  htmlLength: number;
};

export type FetchPageResult = { ok: true; signals: PageSignals } | { ok: false; errorCode: string };

function isPrivateIPv4(ip: string): boolean {
  const parts = ip.split(".").map(Number);
  const [a, b] = parts;
  if (a === 127) return true; // loopback
  if (a === 10) return true; // private
  if (a === 172 && b >= 16 && b <= 31) return true; // private
  if (a === 192 && b === 168) return true; // private
  if (a === 169 && b === 254) return true; // link-local (incl. cloud metadata)
  if (a === 100 && b >= 64 && b <= 127) return true; // carrier-grade NAT
  if (a === 0) return true; // "this network"
  if (a >= 224) return true; // multicast + reserved + broadcast
  return false;
}

function isPrivateOrLoopbackIp(ip: string): boolean {
  if (net.isIPv4(ip)) {
    return isPrivateIPv4(ip);
  }
  if (net.isIPv6(ip)) {
    const lower = ip.toLowerCase();
    if (lower === "::1" || lower === "::") return true; // loopback / unspecified
    if (lower.startsWith("fc") || lower.startsWith("fd")) return true; // unique local
    if (lower.startsWith("fe80")) return true; // link-local
    const mapped = lower.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
    if (mapped) return isPrivateIPv4(mapped[1]); // IPv4-mapped IPv6
    return false;
  }
  return true; // unknown format — treat as unsafe
}

function normalizeUrl(input: string): URL | null {
  let candidate = input.trim();
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(candidate)) {
    // Already has an explicit scheme — only http(s) is acceptable.
    if (!/^https?:\/\//i.test(candidate)) return null;
  } else {
    // Bare hostname (e.g. "example.com") — default to https.
    candidate = `https://${candidate}`;
  }
  try {
    const url = new URL(candidate);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url;
  } catch {
    return null;
  }
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error("timeout")), ms);
    }),
  ]);
}

/**
 * Resolves `hostname` and confirms every A/AAAA record is a public address.
 * Re-run on every hop of a redirect chain — otherwise a malicious site can
 * pass this check on its own domain, then 302 the actual request at a
 * private/link-local target (e.g. cloud metadata) that was never checked.
 */
async function assertPublicHost(hostname: string): Promise<{ ok: true } | { ok: false; errorCode: string }> {
  if (hostname === "localhost") return { ok: false, errorCode: "BLOCKED_HOST" };

  try {
    const resolved = net.isIP(hostname)
      ? [hostname]
      : (await withTimeout(dns.lookup(hostname, { all: true }), DNS_TIMEOUT_MS)).map((r) => r.address);
    console.log(`[fetch-page] DNS ${hostname} -> [${resolved.join(", ")}]`);
    if (resolved.length === 0 || resolved.some(isPrivateOrLoopbackIp)) {
      console.warn(`[fetch-page] DNS ${hostname} resolved to a blocked/private address: [${resolved.join(", ")}]`);
      return { ok: false, errorCode: "BLOCKED_HOST" };
    }
    return { ok: true };
  } catch (err) {
    console.error(`[fetch-page] DNS lookup failed for ${hostname}:`, err instanceof Error ? err.message : err);
    return { ok: false, errorCode: "DNS_ERROR" };
  }
}

/**
 * The `(?:<\/script>|$)` / `(?:>|$)` fallbacks matter because the response
 * can be cut off mid-tag by the `MAX_BYTES` cap below — without a "or end
 * of string" escape, an unclosed `<script>` left dangling by truncation
 * would never match its (missing) closing tag, and the raw JS inside it
 * would leak straight into the "visible text" the AI is asked to analyze
 * (confirmed against a real page: linear.app's inline theme-init script
 * landed exactly at the truncation boundary and leaked verbatim).
 */
function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?(?:<\/script>|$)/gi, " ")
    .replace(/<style[\s\S]*?(?:<\/style>|$)/gi, " ")
    .replace(/<[^>]*(?:>|$)/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Below this many characters of extracted visible text, a page has either
// failed to render meaningfully (a client-rendered SPA shell with no
// server-side HTML — confirmed against real sites: linear.app serves only
// its <title> server-side, 43 chars once scripts are correctly stripped)
// or is otherwise not worth analyzing. Handing the AI almost nothing
// produces a fabricated-feeling report built mostly from the title/URL,
// which isn't a "real" analysis. 60 sits above that confirmed-garbage case
// and below a confirmed-legitimate minimal page (example.com, 142 chars).
const MIN_TEXT_LENGTH = 60;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** True for the standard "temporarily unavailable, try again" signal (RFC 7231 §6.6.4) that free-tier PaaS hosts use while cold-starting a hibernated app. */
function isWakeUpSignal(response: Response): boolean {
  return response.status === 503 && response.headers.get("retry-after") !== null;
}

function wakeUpDelayMs(response: Response): number {
  const header = Number(response.headers.get("retry-after"));
  const requested = Number.isFinite(header) && header > 0 ? header * 1000 : WAKE_UP_MIN_DELAY_MS;
  return Math.min(Math.max(requested, WAKE_UP_MIN_DELAY_MS), WAKE_UP_MAX_DELAY_MS);
}

/**
 * Fetches `startUrl`, manually following redirects (rather than letting
 * `fetch` do it) so every hop can be re-validated against the SSRF
 * allowlist before we ever connect to it.
 */
async function safeFetch(
  startUrl: URL,
  signal: AbortSignal,
): Promise<{ ok: true; response: Response; finalUrl: URL } | { ok: false; errorCode: string }> {
  let currentUrl = startUrl;

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const safety = await assertPublicHost(currentUrl.hostname);
    if (!safety.ok) return safety;

    const response = await fetch(currentUrl.toString(), {
      signal,
      redirect: "manual",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; NexoraAI-WebsiteAnalyzer/1.0; +https://nexora.ai/website-analyzer)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    console.log(
      `[fetch-page] hop=${hop} url=${currentUrl.toString()} status=${response.status} content-type=${response.headers.get("content-type")}`,
    );

    const isRedirect = response.status >= 300 && response.status < 400;
    if (!isRedirect) {
      return { ok: true, response, finalUrl: currentUrl };
    }

    const location = response.headers.get("location");
    if (!location) {
      console.error(`[fetch-page] redirect status ${response.status} from ${currentUrl} had no Location header`);
      return { ok: false, errorCode: "FETCH_FAILED" };
    }

    let nextUrl: URL;
    try {
      nextUrl = new URL(location, currentUrl);
    } catch (err) {
      console.error(`[fetch-page] redirect Location header "${location}" from ${currentUrl} is not a valid URL:`, err);
      return { ok: false, errorCode: "FETCH_FAILED" };
    }
    if (nextUrl.protocol !== "http:" && nextUrl.protocol !== "https:") {
      console.warn(`[fetch-page] redirect to non-http(s) URL blocked: ${nextUrl}`);
      return { ok: false, errorCode: "BLOCKED_HOST" };
    }
    currentUrl = nextUrl;
  }

  console.warn(`[fetch-page] too many redirects starting from ${startUrl}`);
  return { ok: false, errorCode: "TOO_MANY_REDIRECTS" };
}

export async function fetchPageSignals(rawUrl: string): Promise<FetchPageResult> {
  const url = normalizeUrl(rawUrl);
  if (!url) {
    console.warn(`[fetch-page] rejected unparseable/non-http(s) input URL: ${JSON.stringify(rawUrl)}`);
    return { ok: false, errorCode: "INVALID_URL" };
  }

  console.log(`[fetch-page] start rawUrl=${JSON.stringify(rawUrl)} normalizedUrl=${url.toString()}`);
  const overallStarted = Date.now();

  for (let wakeAttempt = 0; ; wakeAttempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
      const fetchResult = await safeFetch(url, controller.signal);
      if (!fetchResult.ok) {
        console.error(`[fetch-page] ${url}: safeFetch failed with errorCode=${fetchResult.errorCode}`);
        return fetchResult;
      }
      const { response, finalUrl } = fetchResult;

      if (!response.ok) {
        const elapsedMs = Date.now() - overallStarted;
        const waking = isWakeUpSignal(response);
        console.warn(
          `[fetch-page] ${finalUrl}: non-ok response status=${response.status} waking=${waking} ` +
            `retry-after=${response.headers.get("retry-after")} elapsedMs=${elapsedMs} attempt=${wakeAttempt}`,
        );

        if (waking && wakeAttempt < WAKE_UP_MAX_ATTEMPTS - 1 && elapsedMs < WAKE_UP_TOTAL_BUDGET_MS) {
          const delayMs = wakeUpDelayMs(response);
          console.log(
            `[fetch-page] ${finalUrl}: looks like a free-tier host cold-starting — waiting ${delayMs}ms and retrying (attempt ${wakeAttempt + 1}/${WAKE_UP_MAX_ATTEMPTS})`,
          );
          await sleep(delayMs);
          continue;
        }

        if (waking) {
          console.error(`[fetch-page] ${finalUrl}: never finished waking up within ${WAKE_UP_TOTAL_BUDGET_MS}ms budget`);
          return { ok: false, errorCode: "SITE_WAKING_UP" };
        }

        // 401/403/429 from the target almost always means bot/WAF protection
        // rejected our request, not that the URL is wrong — surface that
        // distinction so the user isn't told to "check the URL" for a page
        // that loads fine in a real browser. 503 (without a wake-up signal)
        // is included too: several common bot-mitigation layers (rate
        // limiters, JS-challenge middleware) return 503 for suspected-bot
        // traffic rather than 403.
        if ([401, 403, 429, 503].includes(response.status)) {
          return { ok: false, errorCode: "FETCH_BLOCKED" };
        }
        return { ok: false, errorCode: "FETCH_FAILED" };
      }

      const reader = response.body?.getReader();
      let received = "";
      if (reader) {
        const decoder = new TextDecoder();
        let bytes = 0;
        while (bytes < MAX_BYTES) {
          const { done, value } = await reader.read();
          if (done) break;
          bytes += value.byteLength;
          received += decoder.decode(value, { stream: true });
        }
        await reader.cancel().catch(() => {});
      } else {
        received = await response.text();
      }

      const titleMatch = received.match(/<title[^>]*>([^<]*)<\/title>/i);
      const descMatch = received.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i);
      const viewportMatch = /<meta[^>]+name=["']viewport["']/i.test(received);
      const text = stripHtml(received).slice(0, 4000);

      console.log(
        `[fetch-page] ${finalUrl}: downloaded ${received.length} bytes, extracted ${text.length} chars of visible text, title=${JSON.stringify(titleMatch?.[1]?.trim() ?? null)}`,
      );

      if (text.length < MIN_TEXT_LENGTH) {
        console.warn(`[fetch-page] ${finalUrl}: extracted text (${text.length} chars) is below MIN_TEXT_LENGTH=${MIN_TEXT_LENGTH}`);
        return { ok: false, errorCode: "INSUFFICIENT_CONTENT" };
      }

      return {
        ok: true,
        signals: {
          finalUrl: finalUrl.toString(),
          isHttps: finalUrl.protocol === "https:",
          title: titleMatch?.[1]?.trim() || null,
          metaDescription: descMatch?.[1]?.trim() || null,
          hasViewportMeta: viewportMatch,
          textSnippet: text,
          htmlLength: received.length,
        },
      };
    } catch (err) {
      const elapsedMs = Date.now() - overallStarted;
      if (err instanceof Error && err.name === "AbortError") {
        console.error(`[fetch-page] ${url}: fetch attempt timed out after ${FETCH_TIMEOUT_MS}ms (elapsed total ${elapsedMs}ms)`);
        return { ok: false, errorCode: "FETCH_TIMEOUT" };
      }
      // This used to be a bare `return { errorCode: "FETCH_FAILED" }` with no
      // logging at all — every real network failure (connection refused/
      // reset, TLS/certificate errors, protocol errors, DNS failures inside
      // undici's own resolver) was silently swallowed, which is why
      // production logs showed nothing. `cause` is where Node's fetch puts
      // the actual underlying system error (e.g. ECONNRESET, CERT_HAS_EXPIRED).
      const cause = err instanceof Error ? (err as Error & { cause?: unknown }).cause : undefined;
      console.error(
        `[fetch-page] ${url}: unexpected exception after ${elapsedMs}ms — ` +
          `name=${err instanceof Error ? err.name : typeof err} message=${err instanceof Error ? err.message : String(err)} ` +
          `cause=${cause instanceof Error ? `${cause.name}: ${cause.message}` : String(cause)}`,
        err,
      );
      return { ok: false, errorCode: "FETCH_FAILED" };
    } finally {
      clearTimeout(timeout);
    }
  }
}
