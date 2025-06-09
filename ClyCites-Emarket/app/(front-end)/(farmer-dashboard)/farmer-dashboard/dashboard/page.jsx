import { getData } from "@/lib/getData"
import DashboardHeader from "@/components/farmer/DashboardHeader"
import PackageOverview from "@/components/farmer/PackageOverview"
import QuickStats from "@/components/farmer/QuickStats"
import SalesAnalytics from "@/components/farmer/SalesAnalytics"
import ProductPerformance from "@/components/farmer/ProductPerformance"
import OrderManagement from "@/components/farmer/OrderManagement"
import RevenueTracking from "@/components/farmer/RevenueTracking"
import CustomerInsights from "@/components/farmer/CustomerInsights"
import InventoryAlerts from "@/components/farmer/InventoryAlerts"
import MarketingTools from "@/components/farmer/MarketingTools"
import SupportWidget from "@/components/farmer/SupportWidget"
import AdvancedAnalytics from "@/components/farmer/AdvancedAnalytics"
import TransactionFeeTracker from "@/components/farmer/TransactionFeeTracker"

export default async function FarmerDashboard({ searchParams }) {
  const farmerId = searchParams?.farmerId || "farmer-1" // In real app, get from auth

  // Fetch all necessary data
  const [products, orders, farmers, subscription] = await Promise.all([
    getData("products") || [],
    getData("orders") || [],
    getData("farmers") || [],
    // In real app: fetch subscription data for current farmer
    Promise.resolve({
      packageId: "pro", // This would come from database
      packageLimits: {
        products: 500,
        images_per_product: 20,
        categories: "unlimited",
        monthly_orders: 2000,
        support: "24/7",
        analytics: "professional",
        transaction_fee: 0.02,
      },
      status: "active",
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    }),
  ])

  const currentFarmer = farmers[0] || { name: "John Farmer", email: "john@farm.com" }
  const farmerProducts = products.slice(0, 15)
  const farmerOrders = orders.slice(0, 20)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="space-y-6 p-6">
        {/* Dashboard Header */}
        <DashboardHeader farmer={currentFarmer} subscription={subscription} />

        {/* Package Overview */}
        <PackageOverview
          subscription={subscription}
          currentUsage={{
            products: farmerProducts.length,
            orders: farmerOrders.length,
            revenue: farmerOrders.reduce((sum, order) => sum + (order.total || 0), 0),
          }}
        />

        {/* Quick Stats Grid */}
        <QuickStats products={farmerProducts} orders={farmerOrders} subscription={subscription} />

        {/* Main Dashboard Grid - Adapts based on subscription level */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Analytics */}
          <div className="lg:col-span-8 space-y-6">
            <SalesAnalytics orders={farmerOrders} subscription={subscription} />

            {subscription.packageLimits.analytics !== "basic" && (
              <AdvancedAnalytics orders={farmerOrders} products={farmerProducts} />
            )}

            <ProductPerformance products={farmerProducts} orders={farmerOrders} />

            {subscription.packageId !== "free" && (
              <CustomerInsights orders={farmerOrders} subscription={subscription} />
            )}

            <RevenueTracking orders={farmerOrders} subscription={subscription} />
          </div>

          {/* Right Column - Management Tools */}
          <div className="lg:col-span-4 space-y-6">
            <OrderManagement orders={farmerOrders.slice(0, 5)} subscription={subscription} />

            <InventoryAlerts products={farmerProducts} subscription={subscription} />

            {subscription.packageId !== "free" && <MarketingTools subscription={subscription} />}

            <TransactionFeeTracker orders={farmerOrders} subscription={subscription} />

            <SupportWidget subscription={subscription} />
          </div>
        </div>
      </div>
    </div>
  )
}
