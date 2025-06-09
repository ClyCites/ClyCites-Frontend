import { getData } from "@/lib/getData"
import OrdersList from "@/components/buyer/OrdersList"
import OrderFilters from "@/components/buyer/OrderFilters"

export default async function BuyerOrdersPage() {
  const orders = (await getData("orders")) || []

  // In a real app, filter by current user's orders
  const userOrders = orders.slice(0, 20)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Orders</h1>
        <p className="text-gray-600 dark:text-gray-400">Track and manage your orders</p>
      </div>

      <OrderFilters />
      <OrdersList orders={userOrders} />
    </div>
  )
}
