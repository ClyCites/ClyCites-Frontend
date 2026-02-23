import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Weather & Alerts",
  description: "Weather forecasts and climate intelligence for farmers",
};

export default function WeatherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
