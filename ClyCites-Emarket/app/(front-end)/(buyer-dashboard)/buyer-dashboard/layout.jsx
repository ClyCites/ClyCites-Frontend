import BuyerSidebar from "@/components/buyer/BuyerSidebar"
import BuyerNavbar from "@/components/buyer/BuyerNavbar"
import Footer from "@/components/frontend/Footer"

export default function BuyerDashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <BuyerNavbar />
      <div className="flex flex-1">
        <BuyerSidebar />
        <main className="flex-1 ml-64">
          <div className="p-6">{children}</div>
          <Footer />
        </main>
      </div>
    </div>
  )
}
