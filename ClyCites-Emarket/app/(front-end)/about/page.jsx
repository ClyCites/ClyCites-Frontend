import Image from "next/image"
import { Users, Leaf, Award, Globe } from "lucide-react"

export default function AboutPage() {
  const stats = [
    { icon: Users, label: "Active Farmers", value: "5,000+" },
    { icon: Leaf, label: "Products Listed", value: "50,000+" },
    { icon: Award, label: "Years Experience", value: "8+" },
    { icon: Globe, label: "Districts Covered", value: "45+" },
  ]

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">
          About <span className="text-orange-600">ClyCites</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Connecting Uganda's farmers with consumers through technology, promoting sustainable agriculture and ensuring
          food security for all.
        </p>
      </section>

      {/* Mission Section */}
      <section className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Our Mission</h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            ClyCites was founded with a simple yet powerful mission: to revolutionize Uganda's agricultural sector by
            creating a direct connection between farmers and consumers. We believe that technology can bridge the gap
            between rural producers and urban markets, ensuring fair prices for farmers and fresh products for
            consumers.
          </p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Since our inception in 2016, we have grown from a small startup to Uganda's leading agricultural
            marketplace, serving thousands of farmers and millions of consumers across the country.
          </p>
        </div>
        <div className="relative h-96 rounded-lg overflow-hidden">
          <Image
            src="/placeholder.svg?height=400&width=600"
            alt="Farmers working in field"
            fill
            className="object-cover"
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-green-50 dark:bg-gray-800 rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Our Impact in Numbers</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center space-y-4">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto">
                <stat.icon className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-gray-600 dark:text-gray-300">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Values Section */}
      <section className="space-y-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Our Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
              <Leaf className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Sustainability</h3>
            <p className="text-gray-600 dark:text-gray-300">
              We promote sustainable farming practices that protect our environment for future generations.
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
              <Users className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Community</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Building strong relationships between farmers, consumers, and local communities.
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto">
              <Award className="w-10 h-10 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Quality</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Ensuring the highest quality products reach our customers through verified farmers.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
