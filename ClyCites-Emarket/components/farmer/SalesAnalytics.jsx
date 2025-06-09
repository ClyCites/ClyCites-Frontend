"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Calendar, Download, TrendingUp } from "lucide-react"

export default function SalesAnalytics({ orders, subscription }) {
  const [timeRange, setTimeRange] = useState("7d")

  // Generate sample data based on orders
  const generateSalesData = () => {
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90
    const data = []

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dayOrders = orders.filter((order) => {
        const orderDate = new Date(order.createdAt || Date.now())
        return orderDate.toDateString() === date.toDateString()
      })

      data.push({
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        sales: dayOrders.reduce((sum, order) => sum + (order.total || 0), 0),
        orders: dayOrders.length,
        customers: new Set(dayOrders.map((order) => order.customerId)).size,
      })
    }
    return data
  }

  const generateProductData = () => {
    const productSales = {}
    orders.forEach((order) => {
      order.items?.forEach((item) => {
        if (productSales[item.productName]) {
          productSales[item.productName] += item.quantity * item.price
        } else {
          productSales[item.productName] = item.quantity * item.price
        }
      })
    })

    return Object.entries(productSales)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
  }

  const salesData = generateSalesData()
  const productData = generateProductData()
  const totalSales = salesData.reduce((sum, day) => sum + day.sales, 0)
  const totalOrders = salesData.reduce((sum, day) => sum + day.orders, 0)
  const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0

  const COLORS = ["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B", "#EF4444"]

  // Check if advanced analytics are available
  const hasAdvancedAnalytics = subscription.packageLimits.analytics !== "basic"

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Sales Analytics</span>
            {!hasAdvancedAnalytics && (
              <Badge variant="outline" className="ml-2">
                Basic
              </Badge>
            )}
          </CardTitle>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {["7d", "30d", "90d"].map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange(range)}
                  className="text-xs"
                >
                  {range}
                </Button>
              ))}
            </div>

            {hasAdvancedAnalytics && (
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products" disabled={!hasAdvancedAnalytics}>
              Products {!hasAdvancedAnalytics && "🔒"}
            </TabsTrigger>
            <TabsTrigger value="trends" disabled={!hasAdvancedAnalytics}>
              Trends {!hasAdvancedAnalytics && "🔒"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 dark:text-green-400">Total Sales</p>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                      UGX {totalSales.toLocaleString()}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 dark:text-blue-400">Total Orders</p>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{totalOrders}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600 dark:text-purple-400">Avg Order Value</p>
                    <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                      UGX {Math.round(avgOrderValue).toLocaleString()}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Sales Chart */}
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [
                      name === "sales" ? `UGX ${value.toLocaleString()}` : value,
                      name === "sales" ? "Sales" : "Orders",
                    ]}
                  />
                  <Bar dataKey="sales" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            {hasAdvancedAnalytics ? (
              <>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={productData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {productData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`UGX ${value.toLocaleString()}`, "Sales"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Top Performing Products</h4>
                  {productData.map((product, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <span className="font-medium">{product.name}</span>
                      <span className="text-green-600 font-semibold">UGX {product.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Product Analytics Locked</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Upgrade to Growth or Pro plan to access detailed product performance analytics.
                </p>
                <Button>Upgrade Now</Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            {hasAdvancedAnalytics ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="sales" stroke="#10B981" strokeWidth={2} />
                    <Line type="monotone" dataKey="orders" stroke="#3B82F6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Trend Analysis Locked</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Upgrade to Growth or Pro plan to access trend analysis and forecasting.
                </p>
                <Button>Upgrade Now</Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
