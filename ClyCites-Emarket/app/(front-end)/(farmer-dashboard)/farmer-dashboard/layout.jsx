import FarmerSidebar from "@/components/farmer/FarmerSidebar"
import FarmerNavbar from "@/components/farmer/FarmerNavbar"
import Footer from "@/components/frontend/Footer"

export default function FarmerDashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <FarmerNavbar />
      <div className="flex flex-1">
        <FarmerSidebar />
        <main className="flex-1 ml-64">
          <div className="p-6">{children}</div>
          <Footer />
        </main>
      </div>
    </div>
  )
}
