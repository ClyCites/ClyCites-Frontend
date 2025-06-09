import { ShoppingBag, Package, Clock, CheckCircle } from "lucide-react"

export default function BuyerStats({ orders = [] }) {
  const totalOrders = orders.length
  const pendingOrders = orders.filter((order) => order.status === "pending").length
  const completedOrders = orders.filter((order) => order.status === "completed").length
  const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0)

  const stats = [
    {
      title: "Total Orders",
      value: totalOrders,
      icon: ShoppingBag,
      color: "bg-blue-500",
      change: "+12%",
    },
    {
      title: "Pending Orders",
      value: pendingOrders,
      icon: Clock,
      color: "bg-yellow-500",
      change: "+5%",
    },
    {
      title: "Completed Orders",
      value: completedOrders,
      icon: CheckCircle,
      color: "bg-green-500",
      change: "+8%",
    },
    {
      title: "Total Spent",
      value: `UGX ${totalSpent.toLocaleString()}`,
      icon: Package,
      color: "bg-purple-500",
      change: "+15%",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
