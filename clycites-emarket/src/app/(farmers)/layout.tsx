import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Farmers Hub",
  description: "Manage your farms, crops, and agricultural records",
};

export default function FarmersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
