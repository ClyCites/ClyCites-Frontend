import { GlobalTopbar } from "@/components/layout/GlobalTopbar";
import { Footer } from "@/components/layout/Footer";

export default function MarketLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <GlobalTopbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
