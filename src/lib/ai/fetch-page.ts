import dns from "node:dns/promises";
import net from "node:net";

const FETCH_TIMEOUT_MS = 8000;
const DNS_TIMEOUT_MS = 3000;
const MAX_BYTES = 300_000;
const MAX_REDIRECTS = 5;

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
    if (resolved.length === 0 || resolved.some(isPrivateOrLoopbackIp)) {
      return { ok: false, errorCode: "BLOCKED_HOST" };
    }
    return { ok: true };
  } catch {
    return { ok: false, errorCode: "DNS_ERROR" };
  }
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
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
      headers: { "User-Agent": "LeadFlowAI-WebsiteAnalyzer/1.0" },
    });

    const isRedirect = response.status >= 300 && response.status < 400;
    if (!isRedirect) {
      return { ok: true, response, finalUrl: currentUrl };
    }

    const location = response.headers.get("location");
    if (!location) return { ok: false, errorCode: "FETCH_FAILED" };

    let nextUrl: URL;
    try {
      nextUrl = new URL(location, currentUrl);
    } catch {
      return { ok: false, errorCode: "FETCH_FAILED" };
    }
    if (nextUrl.protocol !== "http:" && nextUrl.protocol !== "https:") {
      return { ok: false, errorCode: "BLOCKED_HOST" };
    }
    currentUrl = nextUrl;
  }

  return { ok: false, errorCode: "TOO_MANY_REDIRECTS" };
}

export async function fetchPageSignals(rawUrl: string): Promise<FetchPageResult> {
  const url = normalizeUrl(rawUrl);
  if (!url) return { ok: false, errorCode: "INVALID_URL" };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const fetchResult = await safeFetch(url, controller.signal);
    if (!fetchResult.ok) return fetchResult;
    const { response, finalUrl } = fetchResult;

    if (!response.ok) return { ok: false, errorCode: "FETCH_FAILED" };

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
    if (err instanceof Error && err.name === "AbortError") {
      return { ok: false, errorCode: "FETCH_TIMEOUT" };
    }
    return { ok: false, errorCode: "FETCH_FAILED" };
  } finally {
    clearTimeout(timeout);
  }
}
