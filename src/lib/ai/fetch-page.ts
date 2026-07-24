import dns from "node:dns/promises";
import net from "node:net";

const FETCH_TIMEOUT_MS = 8000;
const MAX_BYTES = 300_000;

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

function isPrivateOrLoopbackIp(ip: string): boolean {
  if (net.isIPv4(ip)) {
    const parts = ip.split(".").map(Number);
    const [a, b] = parts;
    if (a === 127) return true; // loopback
    if (a === 10) return true; // private
    if (a === 172 && b >= 16 && b <= 31) return true; // private
    if (a === 192 && b === 168) return true; // private
    if (a === 169 && b === 254) return true; // link-local (incl. cloud metadata)
    if (a === 0) return true;
    return false;
  }
  if (net.isIPv6(ip)) {
    const lower = ip.toLowerCase();
    if (lower === "::1") return true; // loopback
    if (lower.startsWith("fc") || lower.startsWith("fd")) return true; // unique local
    if (lower.startsWith("fe80")) return true; // link-local
    return false;
  }
  return true; // unknown format — treat as unsafe
}

function normalizeUrl(input: string): URL | null {
  let candidate = input.trim();
  if (!/^https?:\/\//i.test(candidate)) {
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

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function fetchPageSignals(rawUrl: string): Promise<FetchPageResult> {
  const url = normalizeUrl(rawUrl);
  if (!url) return { ok: false, errorCode: "INVALID_URL" };

  const hostname = url.hostname;
  if (hostname === "localhost") return { ok: false, errorCode: "BLOCKED_HOST" };

  try {
    const resolved = net.isIP(hostname) ? [hostname] : (await dns.lookup(hostname, { all: true })).map((r) => r.address);
    if (resolved.length === 0 || resolved.some(isPrivateOrLoopbackIp)) {
      return { ok: false, errorCode: "BLOCKED_HOST" };
    }
  } catch {
    return { ok: false, errorCode: "DNS_ERROR" };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url.toString(), {
      signal: controller.signal,
      redirect: "follow",
      headers: { "User-Agent": "LeadFlowAI-WebsiteAnalyzer/1.0" },
    });

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
        finalUrl: response.url,
        isHttps: response.url.startsWith("https://"),
        title: titleMatch?.[1]?.trim() || null,
        metaDescription: descMatch?.[1]?.trim() || null,
        hasViewportMeta: viewportMatch,
        textSnippet: text,
        htmlLength: received.length,
      },
    };
  } catch {
    return { ok: false, errorCode: "FETCH_FAILED" };
  } finally {
    clearTimeout(timeout);
  }
}
