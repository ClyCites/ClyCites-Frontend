import Image from "next/image"
import { CheckCircle } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Team } from "@/components/team"

export default function AboutPage() {
  return (
    <>
      <section className="py-16 sm:py-24 bg-emerald-50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">About Us</h1>
            <p className="mt-6 text-lg text-gray-600">
              At ClyCites, we empower communities across Africa with accurate, hyperlocal, and timely agricultural data
              to drive economic growth and food security.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Our Story</h2>
              <p className="mt-6 text-lg text-gray-600">
                We are on a mission to empower communities across Africa with information about agricultural markets and
                prices. ClyCites was founded to close the gaps in agricultural market monitoring across Africa.
              </p>
              <p className="mt-4 text-lg text-gray-600">
                Our low-cost monitoring systems are designed to suit the African infrastructure, providing locally-led
                solutions to African agricultural challenges.
              </p>
              <p className="mt-4 text-lg text-gray-600">
                We provide accurate, hyperlocal, and timely data providing evidence of the magnitude and scale of price
                fluctuations across the continent.
              </p>
              <p className="mt-4 text-lg text-gray-600">
                By empowering citizens with market information, we hope to inspire change and action among African
                citizens to take effective action to reduce food insecurity.
              </p>
            </div>
            <div className="relative">
              <Image src="/images/agri.jpg" alt="Our Story" width={600} height={600} className="rounded-xl shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-emarald-50">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <Image
                src="/images/agri.jpg"
                alt="Our Mission"
                width={600}
                height={600}
                className="rounded-xl shadow-lg"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Our Mission</h2>
              <p className="mt-6 text-lg text-gray-600">
                We are on a mission to empower communities across Africa with information about the quality of the
                agricultural products they consume and the fairness of the prices they pay.
              </p>
              <div className="mt-8 space-y-4">
                <div className="flex gap-3">
                  <CheckCircle className="h-6 w-6 text-emerald-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Transparency</h3>
                    <p className="text-gray-600">
                      We believe in complete transparency in agricultural markets to ensure fair prices for both farmers
                      and consumers.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="h-6 w-6 text-emerald-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Innovation</h3>
                    <p className="text-gray-600">
                      We leverage cutting-edge technology to provide innovative solutions to agricultural challenges.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="h-6 w-6 text-emerald-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Community</h3>
                    <p className="text-gray-600">
                      We build and support communities of farmers and consumers to create a sustainable agricultural
                      ecosystem.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Our Values</h2>
            <p className="mt-6 text-lg text-gray-600">
              Our values guide everything we do at ClyCites, from product development to community engagement.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Integrity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We maintain the highest standards of integrity in all our actions, ensuring that our data is accurate
                  and our practices are ethical.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Innovation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We constantly innovate to provide the best possible solutions to the challenges faced by farmers and
                  consumers in Africa.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We measure our success by the positive impact we have on the lives of farmers and consumers across
                  Africa.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Team />
    </>
  )
}
