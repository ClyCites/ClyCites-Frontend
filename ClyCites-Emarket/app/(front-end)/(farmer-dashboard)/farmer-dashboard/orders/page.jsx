import { getData } from "@/lib/getData"
import FarmerOrdersList from "@/components/farmer/FarmerOrdersList"
import OrderStatusFilter from "@/components/farmer/OrderStatusFilter"

export default async function FarmerOrdersPage() {
  const orders = (await getData("orders")) || []

  // In a real app, filter by current farmer's orders
  const farmerOrders = orders.slice(0, 20)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Orders</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage customer orders</p>
        </div>
      </div>

      <OrderStatusFilter />
      <FarmerOrdersList orders={farmerOrders} />
    </div>
  )
}
