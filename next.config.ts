import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  experimental: {
    cpus: 1,
    // Enables next/navigation's `forbidden()`/`unauthorized()` so admin
    // gating can return a real HTTP 403 instead of a soft redirect.
    authInterrupts: true,
    // Only pull in the modules a page actually imports from these
    // barrel-style packages instead of bundling the whole library.
    optimizePackageImports: [
      "lucide-react",
      "recharts",
      "date-fns",
      "@tanstack/react-table",
      "react-day-picker",
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Voice Mode needs microphone access (SpeechRecognition + the
          // listening waveform's getUserMedia level meter) — scoped to this
          // origin only. Camera and geolocation are still unused anywhere
          // in the app, so they stay blocked.
          { key: "Permissions-Policy", value: "camera=(), microphone=(self), geolocation=()" },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
