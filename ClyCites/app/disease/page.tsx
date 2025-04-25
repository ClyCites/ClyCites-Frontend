import Image from "next/image"
import { Leaf, Shield, Microscope, BarChart } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DiseasePage() {
  return (
    <>
      <section className="py-16 sm:py-24 bg-emerald-50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">Disease Control</h1>
            <p className="mt-6 text-lg text-gray-600">
              Proactively protect crops with our advanced disease detection and management system.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-1">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">CropX System Disease Control</h2>
              <p className="mt-6 text-lg text-gray-600">
                Know exactly when, where, and what to apply, even the best time of day to spray. Save costs while you
                maximize protection with the most tested and reliable digital fungal disease management advisor in the
                market.
              </p>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="border-0 shadow-md overflow-hidden">
                  <div className="aspect-video relative">
                    <Image src="/images/agri.jpg" alt={`Disease Control ${i}`} fill className="object-cover" />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-base">Disease Detection System</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Early detection and treatment recommendations for common crop diseases.
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
            <div className="lg:col-span-1">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Optimize Spray Timing</h2>
              <p className="mt-6 text-lg text-gray-600">
                The most effective way to manage plant disease is by prevention. Know exactly where, what and when to
                spray, even down to the best time of day. Save costs on chemicals and spraying while you maximize
                protection.
              </p>
            </div>

            <div className="lg:col-span-2 relative">
              <div className="aspect-video relative rounded-xl overflow-hidden shadow-lg">
                <Image src="/images/agri.jpg" alt="Optimize Spray Timing" fill className="object-cover" />
              </div>
              <div className="absolute -bottom-8 -right-8 w-2/3 aspect-video bg-white rounded-xl shadow-lg p-6">
                <Image src="/images/agr.avif" alt="Spray Timing Detail" fill className="object-cover rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
            <div className="lg:col-span-2 relative order-2 lg:order-1">
              <div className="aspect-video relative rounded-xl overflow-hidden shadow-lg">
                <Image src="/images/agri.jpg" alt="Reduce Chemical Use" fill className="object-cover" />
              </div>
              <div className="absolute -bottom-8 -left-8 w-2/3 aspect-video bg-white rounded-xl shadow-lg p-6">
                <Image src="/images/agr.avif" alt="Chemical Use Detail" fill className="object-cover rounded-lg" />
              </div>
            </div>

            <div className="lg:col-span-1 order-1 lg:order-2">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Reduce Chemical Use</h2>
              <p className="mt-6 text-lg text-gray-600">
                The system calculates a dynamic, daily infection risk that takes into account conditions for fungal
                growth, plant growth, crop type, and previous crop protection applications. The system also recommends
                the day and time to minimize environmental loss.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-emerald-900 text-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold">Key Benefits</h2>
            <p className="mt-6 text-lg text-emerald-100">
              Our disease control system offers multiple benefits to farmers and agricultural businesses.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-emerald-800 rounded-xl p-8">
              <Leaf className="h-12 w-12 text-emerald-300 mb-6" />
              <h3 className="text-xl font-semibold text-white mb-4">Early Detection</h3>
              <p className="text-emerald-100">
                Identify diseases before they become visible to the naked eye, allowing for early intervention.
              </p>
            </div>

            <div className="bg-emerald-800 rounded-xl p-8">
              <Shield className="h-12 w-12 text-emerald-300 mb-6" />
              <h3 className="text-xl font-semibold text-white mb-4">Preventive Measures</h3>
              <p className="text-emerald-100">
                Get recommendations for preventive measures based on weather conditions and crop vulnerability.
              </p>
            </div>

            <div className="bg-emerald-800 rounded-xl p-8">
              <Microscope className="h-12 w-12 text-emerald-300 mb-6" />
              <h3 className="text-xl font-semibold text-white mb-4">Disease Identification</h3>
              <p className="text-emerald-100">
                Accurately identify diseases affecting your crops with our AI-powered image recognition system.
              </p>
            </div>

            <div className="bg-emerald-800 rounded-xl p-8">
              <BarChart className="h-12 w-12 text-emerald-300 mb-6" />
              <h3 className="text-xl font-semibold text-white mb-4">Data Analytics</h3>
              <p className="text-emerald-100">
                Track disease patterns over time to improve future prevention strategies.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
