import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  experimental: {
    cpus: 1,
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
};

export default withNextIntl(nextConfig);
