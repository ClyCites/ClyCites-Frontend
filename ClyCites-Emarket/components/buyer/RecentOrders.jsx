import Link from "next/link"
import { Eye, Package } from "lucide-react"

export default function RecentOrders({ orders = [] }) {
  const recentOrders = orders.slice(0, 5)

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Orders</h3>
        <Link href="/buyer-dashboard/orders" className="text-lime-600 hover:text-lime-700 text-sm font-medium">
          View All
        </Link>
      </div>

      <div className="space-y-4">
        {recentOrders.length > 0 ? (
          recentOrders.map((order, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-lime-100 dark:bg-lime-900 p-2 rounded-lg">
                  <Package className="w-5 h-5 text-lime-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Order #{order.id || `ORD-${index + 1}`}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "Today"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status || "pending")}`}
                >
                  {order.status || "Pending"}
                </span>
                <p className="font-semibold text-gray-900 dark:text-white">
                  UGX {(order.total || Math.floor(Math.random() * 100000)).toLocaleString()}
                </p>
                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No orders yet</p>
            <Link href="/" className="text-lime-600 hover:text-lime-700 text-sm font-medium">
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
