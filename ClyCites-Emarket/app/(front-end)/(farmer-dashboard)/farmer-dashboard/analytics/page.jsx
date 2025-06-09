import { getData } from "@/lib/getData"
import SalesAnalytics from "@/components/farmer/SalesAnalytics"
import ProductAnalytics from "@/components/farmer/ProductAnalytics"
import CustomerAnalytics from "@/components/farmer/CustomerAnalytics"

export default async function FarmerAnalyticsPage() {
  const products = (await getData("products")) || []
  const orders = (await getData("orders")) || []

  // In a real app, filter by current farmer's data
  const farmerProducts = products.slice(0, 10)
  const farmerOrders = orders.slice(0, 20)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your business performance</p>
        </div>
      </div>

      <SalesAnalytics orders={farmerOrders} />
      <ProductAnalytics products={farmerProducts} />
      <CustomerAnalytics orders={farmerOrders} />
    </div>
  )
}
