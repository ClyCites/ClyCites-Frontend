import { getData } from "@/lib/getData"
import FarmerStats from "@/components/farmer/FarmerStats"
import RecentSales from "@/components/farmer/RecentSales"
import ProductPerformance from "@/components/farmer/ProductPerformance"
import SalesChart from "@/components/farmer/SalesChart"
import TopProducts from "@/components/farmer/TopProducts"

export default async function FarmerDashboard() {
  const products = (await getData("products")) || []
  const orders = (await getData("orders")) || []
  const farmers = (await getData("farmers")) || []

  // In a real app, filter by current farmer's data
  const farmerProducts = products.slice(0, 10)
  const farmerOrders = orders.slice(0, 5)
  const currentFarmer = farmers[0] || {}

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Farmer Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Welcome back, {currentFarmer.name || "Farmer"}!</p>
        </div>
      </div>

      <FarmerStats products={farmerProducts} orders={farmerOrders} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart orders={farmerOrders} />
        <TopProducts products={farmerProducts} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentSales orders={farmerOrders} />
        <ProductPerformance products={farmerProducts} />
      </div>
    </div>
  )
}
