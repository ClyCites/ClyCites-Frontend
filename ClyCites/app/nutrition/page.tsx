import Image from "next/image"
import { Sprout, Droplet, LineChart, BarChart } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function NutritionPage() {
  return (
    <>
      <section className="py-16 sm:py-24 bg-emerald-50 flex justify-center">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">Crop Nutrition Monitoring</h1>
            <p className="mt-6 text-lg text-gray-600">
              Ensure soil supports optimal growth with our advanced nutrition monitoring system.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-white flex justify-center">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-1">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">CropX System Nutrition Monitoring</h2>
              <p className="mt-6 text-lg text-gray-600">
                Monitor plant uptake and utilization of crop nutrients throughout the season. Know what your crop is
                absorbing, what's available for future uptake, and if nutrients are being lost.
              </p>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="border-0 shadow-md overflow-hidden">
                  <div className="aspect-video relative">
                    <Image src="/images/agri.jpg" alt={`Nutrition Monitoring ${i}`} fill className="object-cover" />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-base">Soil Analysis System</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Comprehensive soil analysis and nutrient recommendations for optimal crop growth.
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-white flex justify-center">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
            <div className="lg:col-span-1">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Continuously Monitor Nitrogen</h2>
              <p className="mt-6 text-lg text-gray-600">
                Monitor plant uptake and utilization of crop nutrients throughout the season. Know what your crop is
                absorbing, what's of crop nutrients throughout the season. Know what your crop is absorbing, what's
                available for future uptake, and if nutrients are being lost.
              </p>
            </div>

            <div className="lg:col-span-2 relative">
              <div className="aspect-video relative rounded-xl overflow-hidden shadow-lg">
                <Image src="/images/agri.jpg" alt="Monitor Nitrogen" fill className="object-cover" />
              </div>
              <div className="absolute -bottom-8 -right-8 w-2/3 aspect-video bg-white rounded-xl shadow-lg p-6">
                <Image
                  src="/images/agr.avif"
                  alt="Nitrogen Monitoring Detail"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-white flex justify-center">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
            <div className="lg:col-span-2 relative order-2 lg:order-1">
              <div className="aspect-video relative rounded-xl overflow-hidden shadow-lg">
                <Image src="/images/agri.jpg" alt="Reduce Impact of Leaching Events" fill className="object-cover" />
              </div>
              <div className="absolute -bottom-8 -left-8 w-2/3 aspect-video bg-white rounded-xl shadow-lg p-6">
                <Image src="/images/agr.avif" alt="Leaching Events Detail" fill className="object-cover rounded-lg" />
              </div>
            </div>

            <div className="lg:col-span-1 order-1 lg:order-2">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Reduce Impact of Leaching Events</h2>
              <p className="mt-6 text-lg text-gray-600">
                Users can track and report a season-long view of nitrogen leaching events to demonstrate responsible
                nitrogen management, or establish the conditions that lead to leaching events then make adjustments to
                prevent future occurrences.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-white flex justify-center">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
            <div className="lg:col-span-1">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Manage Soil Salinity Levels</h2>
              <p className="mt-6 text-lg text-gray-600">
                This solution for salinity monitoring is easier, less time-consuming and able to supply immediate
                results compared to conventional lab soil sample method of measuring the saturated paste EC (electric
                conductivity).
              </p>
            </div>

            <div className="lg:col-span-2 relative">
              <div className="aspect-video relative rounded-xl overflow-hidden shadow-lg">
                <Image src="/images/agri.jpg" alt="Manage Soil Salinity" fill className="object-cover" />
              </div>
              <div className="absolute -bottom-8 -right-8 w-2/3 aspect-video bg-white rounded-xl shadow-lg p-6">
                <Image src="/images/agr.avif" alt="Soil Salinity Detail" fill className="object-cover rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-emerald-900 text-white flex justify-center">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold">Key Benefits</h2>
            <p className="mt-6 text-lg text-emerald-100">
              Our nutrition monitoring system offers multiple benefits to farmers and agricultural businesses.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-emerald-800 rounded-xl p-8">
              <Sprout className="h-12 w-12 text-emerald-300 mb-6" />
              <h3 className="text-xl font-semibold text-white mb-4">Optimal Growth</h3>
              <p className="text-emerald-100">
                Ensure your crops receive the perfect balance of nutrients for optimal growth and yield.
              </p>
            </div>

            <div className="bg-emerald-800 rounded-xl p-8">
              <Droplet className="h-12 w-12 text-emerald-300 mb-6" />
              <h3 className="text-xl font-semibold text-white mb-4">Water Efficiency</h3>
              <p className="text-emerald-100">
                Improve water usage efficiency by understanding soil moisture and nutrient interactions.
              </p>
            </div>

            <div className="bg-emerald-800 rounded-xl p-8">
              <LineChart className="h-12 w-12 text-emerald-300 mb-6" />
              <h3 className="text-xl font-semibold text-white mb-4">Trend Analysis</h3>
              <p className="text-emerald-100">
                Track nutrient levels over time to identify patterns and optimize fertilizer application.
              </p>
            </div>

            <div className="bg-emerald-800 rounded-xl p-8">
              <BarChart className="h-12 w-12 text-emerald-300 mb-6" />
              <h3 className="text-xl font-semibold text-white mb-4">Cost Reduction</h3>
              <p className="text-emerald-100">
                Reduce fertilizer costs by applying only what your crops need, when they need it.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
