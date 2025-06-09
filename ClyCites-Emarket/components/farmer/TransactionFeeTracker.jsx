"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DollarSign, TrendingDown, Calculator } from "lucide-react"

export default function TransactionFeeTracker({ orders, subscription }) {
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0)
  const transactionFeeRate = subscription.packageLimits.transaction_fee
  const totalFees = totalRevenue * transactionFeeRate
  const netRevenue = totalRevenue - totalFees

  const feeComparison = [
    { package: "Free", rate: 0.05, color: "bg-gray-500" },
    { package: "Growth", rate: 0.03, color: "bg-blue-500" },
    { package: "Pro", rate: 0.02, color: "bg-purple-500" },
    { package: "Enterprise", rate: 0.01, color: "bg-gold-500" },
  ]

  const currentPackageIndex = feeComparison.findIndex((pkg) => pkg.package.toLowerCase() === subscription.packageId)

  const potentialSavings =
    currentPackageIndex < feeComparison.length - 1
      ? totalRevenue * (transactionFeeRate - feeComparison[currentPackageIndex + 1].rate)
      : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calculator className="h-5 w-5" />
          <span>Transaction Fees</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current Fee Overview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Current Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {(transactionFeeRate * 100).toFixed(1)}%
              </p>
            </div>
            <Badge className="bg-green-100 text-green-800">
              {subscription.packageId?.charAt(0).toUpperCase() + subscription.packageId?.slice(1)} Plan
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <DollarSign className="h-6 w-6 text-red-600 mx-auto mb-1" />
              <p className="text-sm text-red-600 dark:text-red-400">Total Fees</p>
              <p className="font-bold text-red-700 dark:text-red-300">UGX {totalFees.toLocaleString()}</p>
            </div>

            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <TrendingDown className="h-6 w-6 text-green-600 mx-auto mb-1" />
              <p className="text-sm text-green-600 dark:text-green-400">Net Revenue</p>
              <p className="font-bold text-green-700 dark:text-green-300">UGX {netRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Fee Comparison */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Fee Comparison by Package</h4>
          {feeComparison.map((pkg, index) => {
            const isCurrentPackage = pkg.package.toLowerCase() === subscription.packageId
            const feeAmount = totalRevenue * pkg.rate

            return (
              <div
                key={pkg.package}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  isCurrentPackage
                    ? "border-green-300 bg-green-50 dark:bg-green-900/20"
                    : "border-gray-200 bg-gray-50 dark:bg-gray-800"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${pkg.color}`}></div>
                  <div>
                    <span className="font-medium">{pkg.package}</span>
                    {isCurrentPackage && (
                      <Badge variant="success" className="ml-2 text-xs">
                        Current
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-semibold">{(pkg.rate * 100).toFixed(1)}%</p>
                  <p className="text-xs text-gray-500">UGX {feeAmount.toLocaleString()}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Potential Savings */}
        {potentialSavings > 0 && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">💡 Potential Savings</h4>
            <p className="text-sm text-blue-700 dark:text-blue-400 mb-2">
              Upgrade to the next tier and save up to{" "}
              <span className="font-bold">UGX {potentialSavings.toLocaleString()}</span> in transaction fees this month.
            </p>
            <div className="flex items-center space-x-2">
              <Progress value={75} className="flex-1 h-2" />
              <span className="text-xs text-blue-600">75% savings potential</span>
            </div>
          </div>
        )}

        {/* Monthly Breakdown */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">This Month's Breakdown</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Gross Revenue:</span>
              <span className="font-semibold">UGX {totalRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-red-600">
              <span>Transaction Fees ({(transactionFeeRate * 100).toFixed(1)}%):</span>
              <span className="font-semibold">-UGX {totalFees.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t pt-2 font-semibold">
              <span>Net Revenue:</span>
              <span className="text-green-600">UGX {netRevenue.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
