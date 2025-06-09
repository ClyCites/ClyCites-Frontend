import { getData } from "@/lib/getData"
import FarmerStats from "@/components/farmer/FarmerStats"
import RecentSales from "@/components/farmer/RecentSales"
import ProductPerformance from "@/components/farmer/ProductPerformance"

export default async function FarmerDashboard() {
  const products = (await getData("products")) || []
  const orders = (await getData("orders")) || []

  // In a real app, filter by current farmer's products
  const farmerProducts = products.slice(0, 10)
  const farmerOrders = orders.slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Farmer Dashboard</h1>
      </div>

      <FarmerStats products={farmerProducts} orders={farmerOrders} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentSales orders={farmerOrders} />
        <ProductPerformance products={farmerProducts} />
      </div>
    </div>
  )
}
