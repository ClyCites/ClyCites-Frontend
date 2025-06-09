import { getData } from "@/lib/getData"
import BuyerStats from "@/components/buyer/BuyerStats"
import RecentOrders from "@/components/buyer/RecentOrders"
import FavoriteProducts from "@/components/buyer/FavoriteProducts"
import OrderChart from "@/components/buyer/OrderChart"

export default async function BuyerDashboard() {
  const orders = (await getData("orders")) || []
  const products = (await getData("products")) || []

  // In a real app, filter by current user's orders
  const userOrders = orders.slice(0, 5)
  const favoriteProducts = products.slice(0, 4)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's what's happening with your orders.</p>
      </div>

      <BuyerStats orders={userOrders} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrderChart orders={userOrders} />
        <RecentOrders orders={userOrders} />
      </div>

      <FavoriteProducts products={favoriteProducts} />
    </div>
  )
}
