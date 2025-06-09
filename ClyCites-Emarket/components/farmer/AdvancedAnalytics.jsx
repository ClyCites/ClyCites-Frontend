"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { Brain, Target, Users, Zap } from "lucide-react"

export default function AdvancedAnalytics({ orders, products }) {
  // Customer behavior analysis
  const customerBehavior = [
    { metric: "Repeat Purchase Rate", value: 68, benchmark: 45 },
    { metric: "Customer Lifetime Value", value: 85, benchmark: 60 },
    { metric: "Cart Abandonment Rate", value: 25, benchmark: 35 },
    { metric: "Average Session Duration", value: 78, benchmark: 55 },
    { metric: "Product Page Views", value: 92, benchmark: 70 },
    { metric: "Conversion Rate", value: 73, benchmark: 50 },
  ]

  // Market insights
  const marketData = [
    { month: "Jan", organic: 4000, paid: 2400, social: 1800 },
    { month: "Feb", organic: 3000, paid: 1398, social: 2200 },
    { month: "Mar", organic: 2000, paid: 9800, social: 2800 },
    { month: "Apr", organic: 2780, paid: 3908, social: 3200 },
    { month: "May", organic: 1890, paid: 4800, social: 2600 },
    { month: "Jun", organic: 2390, paid: 3800, social: 3400 },
  ]

  // Predictive insights
  const predictions = [
    {
      title: "Revenue Forecast",
      prediction: "UGX 2.4M next month",
      confidence: 87,
      trend: "up",
      insight: "Based on seasonal trends and current growth rate",
    },
    {
      title: "Best Selling Product",
      prediction: "Organic Tomatoes",
      confidence: 92,
      trend: "up",
      insight: "High demand expected due to seasonal factors",
    },
    {
      title: "Optimal Pricing",
      prediction: "15% price increase recommended",
      confidence: 78,
      trend: "up",
      insight: "Market analysis suggests room for price optimization",
    },
    {
      title: "Inventory Alert",
      prediction: "Restock in 5 days",
      confidence: 95,
      trend: "neutral",
      insight: "Based on current sales velocity and stock levels",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-5 w-5" />
          <span>Advanced Analytics</span>
          <Badge className="bg-purple-100 text-purple-800">AI-Powered</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="behavior" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="behavior">Customer Behavior</TabsTrigger>
            <TabsTrigger value="market">Market Insights</TabsTrigger>
            <TabsTrigger value="predictions">AI Predictions</TabsTrigger>
            <TabsTrigger value="optimization">Optimization</TabsTrigger>
          </TabsList>

          <TabsContent value="behavior" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Behavior Metrics */}
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Customer Behavior Metrics</span>
                </h4>
                {customerBehavior.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{item.metric}</span>
                      <span className="font-semibold">{item.value}%</span>
                    </div>
                    <Progress value={item.value} className="h-2" />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Industry Avg: {item.benchmark}%</span>
                      <Badge variant={item.value > item.benchmark ? "success" : "secondary"} className="text-xs">
                        {item.value > item.benchmark ? "Above Average" : "Below Average"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              {/* Radar Chart */}
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={customerBehavior}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar name="Your Performance" dataKey="value" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                    <Radar
                      name="Industry Benchmark"
                      dataKey="benchmark"
                      stroke="#6B7280"
                      fill="#6B7280"
                      fillOpacity={0.1}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="market" className="space-y-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={marketData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="organic" stackId="1" stroke="#10B981" fill="#10B981" />
                  <Area type="monotone" dataKey="paid" stackId="1" stroke="#3B82F6" fill="#3B82F6" />
                  <Area type="monotone" dataKey="social" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800">Organic Traffic</h4>
                <p className="text-2xl font-bold text-green-600">68%</p>
                <p className="text-sm text-green-600">+12% from last month</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800">Paid Campaigns</h4>
                <p className="text-2xl font-bold text-blue-600">24%</p>
                <p className="text-sm text-blue-600">+5% from last month</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-800">Social Media</h4>
                <p className="text-2xl font-bold text-purple-600">8%</p>
                <p className="text-sm text-purple-600">+3% from last month</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="predictions" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {predictions.map((prediction, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">{prediction.title}</h4>
                    <Badge variant="outline" className="bg-white">
                      {prediction.confidence}% confidence
                    </Badge>
                  </div>

                  <p className="text-lg font-bold text-purple-600 mb-2">{prediction.prediction}</p>

                  <p className="text-sm text-gray-600 mb-3">{prediction.insight}</p>

                  <div className="flex items-center space-x-2">
                    <Progress value={prediction.confidence} className="flex-1 h-2" />
                    <span className="text-xs text-gray-500">{prediction.confidence}%</span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="optimization" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center space-x-2">
                  <Target className="h-4 w-4" />
                  <span>Optimization Recommendations</span>
                </h4>

                <div className="space-y-3">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Zap className="h-4 w-4 text-green-600" />
                      <span className="font-semibold text-green-800">High Impact</span>
                    </div>
                    <p className="text-sm text-green-700">Optimize product images - could increase conversion by 23%</p>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="h-4 w-4 text-blue-600" />
                      <span className="font-semibold text-blue-800">Medium Impact</span>
                    </div>
                    <p className="text-sm text-blue-700">Adjust pricing strategy - potential 15% revenue increase</p>
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="h-4 w-4 text-yellow-600" />
                      <span className="font-semibold text-yellow-800">Customer Focus</span>
                    </div>
                    <p className="text-sm text-yellow-700">Improve product descriptions - better customer engagement</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Performance Score</h4>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">87/100</div>
                  <p className="text-gray-600">Overall Performance Score</p>
                  <Progress value={87} className="mt-4" />
                </div>

                <div className="space-y-2 mt-6">
                  <div className="flex justify-between">
                    <span className="text-sm">Product Quality</span>
                    <span className="text-sm font-semibold">92/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Customer Service</span>
                    <span className="text-sm font-semibold">85/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Marketing Efficiency</span>
                    <span className="text-sm font-semibold">78/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Operational Excellence</span>
                    <span className="text-sm font-semibold">89/100</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
