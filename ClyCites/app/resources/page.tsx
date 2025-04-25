import Image from "next/image"
import Link from "next/link"
import { ArrowRight, FileText, Video, Download, BookOpen, Search, Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Resource data
const resources = [
  {
    id: 1,
    title: "Beginner's Guide to Digital Agriculture",
    description: "Learn the basics of digital agriculture and how technology is transforming farming practices.",
    category: "guide",
    image: "/images/agri.jpg",
    type: "PDF",
    size: "2.4 MB",
    date: "March 15, 2023",
    url: "#",
  },
  {
    id: 2,
    title: "Understanding Crop Disease Detection",
    description: "A comprehensive guide to identifying and managing common crop diseases using digital tools.",
    category: "guide",
    image: "/images/agri.jpg",
    type: "PDF",
    size: "3.8 MB",
    date: "April 22, 2023",
    url: "#",
  },
  {
    id: 3,
    title: "Market Price Analysis Techniques",
    description: "Learn how to analyze market price data to make informed decisions about when to sell your produce.",
    category: "article",
    image: "/images/agri.jpg",
    type: "Article",
    date: "May 10, 2023",
    url: "#",
  },
  {
    id: 4,
    title: "ClyCites Mobile App Tutorial",
    description: "A step-by-step video guide to using all features of the ClyCites mobile application.",
    category: "video",
    image: "/images/agri.jpg",
    type: "Video",
    duration: "18:24",
    date: "June 5, 2023",
    url: "#",
  },
  {
    id: 5,
    title: "Soil Health Monitoring Best Practices",
    description: "Expert recommendations for monitoring and maintaining optimal soil health for various crops.",
    category: "article",
    image: "/images/agri.jpg",
    type: "Article",
    date: "July 12, 2023",
    url: "#",
  },
  {
    id: 6,
    title: "Weather Data Interpretation for Farmers",
    description: "How to interpret weather forecasts and historical data to plan your farming activities effectively.",
    category: "guide",
    image: "/images/agri.jpg",
    type: "PDF",
    size: "1.9 MB",
    date: "August 3, 2023",
    url: "#",
  },
  {
    id: 7,
    title: "Digital Marketing for Agricultural Products",
    description: "Strategies for marketing your farm produce online and reaching a wider customer base.",
    category: "video",
    image: "/images/agri.jpg",
    type: "Video",
    duration: "24:15",
    date: "September 18, 2023",
    url: "#",
  },
  {
    id: 8,
    title: "ClyCites API Documentation",
    description: "Technical documentation for developers looking to integrate with the ClyCites platform.",
    category: "technical",
    image: "/images/agri.jpg",
    type: "Documentation",
    date: "October 7, 2023",
    url: "#",
  },
]
export type Resource = {
  id: number
  title: string
  description: string
  category: 'guide' | 'article' | 'video' | 'technical'
  image: string
  type: 'PDF' | 'Article' | 'Video' | 'Documentation'
  size?: string // optional, only for PDFs
  duration?: string // optional, only for Videos
  date: string
  url: string
}

export default function ResourcesPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-16 sm:py-24 bg-emerald-50 dark:bg-emerald-950/30">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">Resources</h1>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
              Access guides, articles, videos, and tools to help you make the most of ClyCites and improve your
              agricultural practices.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-10 bg-white dark:bg-gray-950 border-b dark:border-gray-800">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-1/2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search resources..." className="pl-10 w-full" />
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </Button>
              <select className="border rounded-md px-3 py-2 bg-transparent text-sm">
                <option>Most Recent</option>
                <option>Most Popular</option>
                <option>A-Z</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-16 sm:py-24 bg-white dark:bg-gray-950">
        <div className="container">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-8 flex flex-wrap justify-start">
              <TabsTrigger value="all">All Resources</TabsTrigger>
              <TabsTrigger value="guides">Guides</TabsTrigger>
              <TabsTrigger value="articles">Articles</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="technical">Technical Docs</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {resources.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="guides" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {resources
                  .filter((r) => r.category === "guide")
                  .map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="articles" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {resources
                  .filter((r) => r.category === "article")
                  .map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="videos" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {resources
                  .filter((r) => r.category === "video")
                  .map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="technical" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {resources
                  .filter((r) => r.category === "technical")
                  .map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-12 flex justify-center">
            <Button variant="outline" className="flex items-center gap-2">
              <span>Load More</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-16 sm:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">Featured Resources</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-md overflow-hidden">
              <div className="relative h-48">
                <Image src="/images/agri.jpg" alt="Getting Started Guide" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <Badge className="bg-emerald-500 hover:bg-emerald-600">Guide</Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle>Getting Started with ClyCites</CardTitle>
                <CardDescription>A comprehensive guide for new users</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Everything you need to know to get started with ClyCites, from setting up your account to using
                  advanced features.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href="#" className="flex items-center justify-center gap-2">
                    <Download className="h-4 w-4" />
                    <span>Download PDF</span>
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-0 shadow-md overflow-hidden">
              <div className="relative h-48">
                <Image src="/images/agri.jpg" alt="Webinar Series" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <Badge className="bg-blue-500 hover:bg-blue-600">Webinar</Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle>Digital Agriculture Webinar Series</CardTitle>
                <CardDescription>On-demand webinars with industry experts</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Watch our series of webinars featuring agricultural experts discussing the latest trends and
                  technologies.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href="#" className="flex items-center justify-center gap-2">
                    <Video className="h-4 w-4" />
                    <span>Watch Webinars</span>
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-0 shadow-md overflow-hidden">
              <div className="relative h-48">
                <Image src="/images/agri.jpg" alt="Case Studies" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <Badge className="bg-purple-500 hover:bg-purple-600">Case Studies</Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle>Success Stories</CardTitle>
                <CardDescription>Real-world impact of ClyCites</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Read about how farmers and agricultural businesses have transformed their operations using ClyCites.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href="#" className="flex items-center justify-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>Read Case Studies</span>
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 sm:py-24 bg-emerald-900 dark:bg-emerald-950 text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Stay Updated</h2>
            <p className="text-emerald-100 mb-8">
              Subscribe to our newsletter to receive the latest resources, articles, and updates from ClyCites.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                placeholder="Enter your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
              <Button className="bg-white text-emerald-900 hover:bg-emerald-100">Subscribe</Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}


// Resource Card Component
function ResourceCard({ resource }: { resource: Resource }) {
  const getIcon = (category: string) => {
    switch (category) {
      case "guide":
        return <FileText className="h-5 w-5" />
      case "video":
        return <Video className="h-5 w-5" />
      case "article":
        return <BookOpen className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  const getBadgeColor = (category: "guide" | "article" | "video" | "technical") => {
    switch (category) {
      case "guide":
        return "bg-emerald-500 hover:bg-emerald-600"
      case "video":
        return "bg-red-500 hover:bg-red-600"
      case "article":
        return "bg-blue-500 hover:bg-blue-600"
      case "technical":
        return "bg-purple-500 hover:bg-purple-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  return (
    <Card className="border-0 shadow-md overflow-hidden h-full flex flex-col group">
      <div className="relative h-48">
        <Image
          src={resource.image || "/placeholder.svg"}
          alt={resource.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-4">
          <Badge className={getBadgeColor(resource.category)}>
            {resource.category.charAt(0).toUpperCase() + resource.category.slice(1)}
          </Badge>
        </div>
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-1">{resource.title}</CardTitle>
        <CardDescription className="flex items-center gap-2">
          {getIcon(resource.category)}
          <span>{resource.type}</span>
          {resource.size && <span>• {resource.size}</span>}
          {resource.duration && <span>• {resource.duration}</span>}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-600 dark:text-gray-300 line-clamp-3">{resource.description}</p>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div className="w-full flex items-center justify-between">
          <span className="text-sm text-gray-500">{resource.date}</span>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 p-0"
          >
            <Link href={resource.url} className="flex items-center gap-1">
              <span>View</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
