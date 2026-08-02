import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset your password",
  description: "Get a link to reset your Nexora account password.",
};

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
