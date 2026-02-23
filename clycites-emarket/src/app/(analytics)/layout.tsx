import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics",
  description: "Dashboards and data insights",
};

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
