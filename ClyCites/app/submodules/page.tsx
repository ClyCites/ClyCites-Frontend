import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

type Submodule = {
  title: string
  description: string
  icon: string
  href: string
  color: string
}

const submodules: Submodule[] = [
  {
    title: "🌱 Agriculture E-Market",
    description: "Access the agricultural marketplace for buying and selling farm produce and inputs.",
    icon: "🌱",
    href: "#",
    color: "bg-green-100 hover:bg-green-200"
  },
  {
    title: "📊 Agric-Assistant",
    description: "Get AI-powered assistance for your farming needs, from crop selection to pest control.",
    icon: "📊",
    href: "#",
    color: "bg-blue-100 hover:bg-blue-200"
  },
  {
    title: "🧑‍🔬 Expert Portal",
    description: "Connect with agricultural experts for consultation and advice.",
    icon: "🧑‍🔬",
    href: "#",
    color: "bg-purple-100 hover:bg-purple-200"
  },
  {
    title: "📈 Data & Analytics",
    description: "Access agricultural data, trends, and analytics to make informed decisions.",
    icon: "📈",
    href: "#",
    color: "bg-yellow-100 hover:bg-yellow-200"
  }
]

export default function SubmodulesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Welcome to ClyCites
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Select a module to get started
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {submodules.map((module, index) => (
            <Link href={module.href} key={index} className="block h-full">
              <Card className={`h-full flex flex-col transition-all duration-200 hover:shadow-lg ${module.color} hover:-translate-y-1`}>
                <CardHeader>
                  <div className="text-4xl mb-2">{module.icon}</div>
                  <CardTitle className="text-xl">{module.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription className="text-gray-700">
                    {module.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link href="/login">
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Sign out
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
