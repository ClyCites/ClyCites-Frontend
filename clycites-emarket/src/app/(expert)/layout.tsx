import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research Portal",
  description: "Agricultural datasets and expert knowledge",
};

export default function ResearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
