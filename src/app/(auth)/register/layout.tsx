import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create your account",
  description: "Start your free Nexora trial — no credit card required.",
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
