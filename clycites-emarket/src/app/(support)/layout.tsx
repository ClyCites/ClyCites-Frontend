import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help & Support",
  description: "Get help and support",
};

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
