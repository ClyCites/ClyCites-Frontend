import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Calendar, MapPin, Users, Award, BookOpen, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Program data
const programs = [
  {
    id: 1,
    title: "Farmer Training Program",
    description: "Comprehensive training for farmers on digital agriculture and market access.",
    image: "/images/agri.jpg",
    category: "training",
    location: "Multiple Locations, Uganda",
    duration: "3 months",
    participants: "500+",
    startDate: "February 15, 2024",
    status: "Ongoing",
    link: "/program/farmer-training",
  },
  {
    id: 2,
    title: "Research Collaboration",
    description: "Joint research initiatives with universities and agricultural institutions.",
    image: "/images/agri.jpg",
    category: "research",
    location: "Kampala, Uganda",
    duration: "12 months",
    participants: "50+",
    startDate: "January 10, 2024",
    status: "Ongoing",
    link: "/program/research",
  },
  {
    id: 3,
    title: "Community Champions",
    description: "Empowering local leaders to drive agricultural innovation in their communities.",
    image: "/images/agri.jpg",
    category: "community",
    location: "Various Communities",
    duration: "Ongoing",
    participants: "1,500+",
    startDate: "Year-round",
    status: "Open for Applications",
    link: "/program/champions",
  },
  {
    id: 4,
    title: "Youth in Agriculture",
    description: "Engaging young people in modern agricultural practices and entrepreneurship.",
    image: "/images/agri.jpg",
    category: "youth",
    location: "Multiple Locations",
    duration: "6 months",
    participants: "300+",
    startDate: "March 1, 2024",
    status: "Open for Applications",
    link: "/program/youth",
  },
  {
    id: 5,
    title: "Women Empowerment",
    description: "Supporting women farmers with technology and market access.",
    image: "/images/agri.jpg",
    category: "women",
    location: "Eastern Uganda",
    duration: "9 months",
    participants: "250+",
    startDate: "April 15, 2024",
    status: "Coming Soon",
    link: "/program/women",
  },
  {
    id: 6,
    title: "Data Collection Network",
    description: "Building a network of data collectors for market price information.",
    image: "/images/agri.jpg",
    category: "data",
    location: "Nationwide",
    duration: "Ongoing",
    participants: "100+",
    startDate: "Year-round",
    status: "Open for Applications",
    link: "/program/data-network",
  },
  {
    id: 7,
    title: "Agricultural Innovation Hub",
    description: "A space for testing and developing new agricultural technologies.",
    image: "/images/agri.jpg",
    category: "innovation",
    location: "Kampala, Uganda",
    duration: "Permanent",
    participants: "Varies",
    startDate: "Open Year-round",
    status: "Ongoing",
    link: "/program/innovation-hub",
  },
  {
    id: 8,
    title: "Market Access Initiative",
    description: "Connecting farmers directly with buyers through digital platforms.",
    image: "/images/agri.jpg",
    category: "market",
    location: "Multiple Regions",
    duration: "Ongoing",
    participants: "1,000+",
    startDate: "Year-round",
    status: "Ongoing",
    link: "/program/market-access",
  },
]

// Featured programs
const featuredPrograms = [
  {
    title: "Digital Agriculture Fellowship",
    description:
      "A 6-month intensive program for agricultural professionals to develop digital skills and implement technology solutions in their communities.",
    image: "/images/agri.jpg",
    startDate: "June 1, 2024",
    location: "Kampala, Uganda",
    status: "Applications Open",
  },
  {
    title: "Agricultural Data Science Bootcamp",
    description:
      "Learn how to collect, analyze, and visualize agricultural data to drive better decision-making and improve farm productivity.",
    image: "/images/agri.jpg",
    startDate: "May 15, 2024",
    location: "Online & In-person",
    status: "Coming Soon",
  },
  {
    title: "Rural Connectivity Project",
    description:
      "Bringing internet access and digital tools to remote farming communities to bridge the digital divide in agriculture.",
    image: "/images/agri.jpg",
    startDate: "Ongoing",
    location: "Rural Uganda",
    status: "Active",
  },
]

export default function ProgramPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-16 sm:py-24 bg-emerald-50 dark:bg-emerald-950/30">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">Programs</h1>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
              Opportunities and joint research collaborations to advance digital agriculture in Africa.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Programs Section */}
      <section className="py-16 sm:py-24 bg-white dark:bg-gray-950">
        <div className="container">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">Featured Programs</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredPrograms.map((program, index) => (
              <Card key={index} className="border-0 shadow-md overflow-hidden group">
                <div className="relative h-48">
                  <Image
                    src={program.image || "/placeholder.svg"}
                    alt={program.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-emerald-500 hover:bg-emerald-600">{program.status}</Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>{program.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{program.startDate}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{program.description}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="h-4 w-4" />
                    <span>{program.location}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700">
                    <Link href="#">
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* All Programs Section */}
      <section className="py-16 sm:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">All Programs</h2>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-8 flex flex-wrap justify-center">
              <TabsTrigger value="all">All Programs</TabsTrigger>
              <TabsTrigger value="training">Training</TabsTrigger>
              <TabsTrigger value="research">Research</TabsTrigger>
              <TabsTrigger value="community">Community</TabsTrigger>
              <TabsTrigger value="youth">Youth</TabsTrigger>
              <TabsTrigger value="women">Women</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {programs.map((program) => (
                  <ProgramCard key={program.id} program={program} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="training" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {programs
                  .filter((p) => p.category === "training")
                  .map((program) => (
                    <ProgramCard key={program.id} program={program} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="research" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {programs
                  .filter((p) => p.category === "research")
                  .map((program) => (
                    <ProgramCard key={program.id} program={program} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="community" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {programs
                  .filter((p) => p.category === "community")
                  .map((program) => (
                    <ProgramCard key={program.id} program={program} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="youth" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {programs
                  .filter((p) => p.category === "youth")
                  .map((program) => (
                    <ProgramCard key={program.id} program={program} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="women" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {programs
                  .filter((p) => p.category === "women")
                  .map((program) => (
                    <ProgramCard key={program.id} program={program} />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Join Research Network Section */}
      <section className="py-16 sm:py-24 bg-emerald-900 dark:bg-emerald-950 text-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold">Join Our Research Network</h2>
              <p className="mt-6 text-lg text-emerald-100">
                We're always looking for partners to collaborate on research initiatives that advance digital
                agriculture in Africa. Whether you're a university, research institution, or individual researcher, we'd
                love to hear from you.
              </p>
              <div className="mt-10">
                <Button asChild size="lg" className="bg-white text-emerald-900 hover:bg-emerald-100 rounded-full">
                  <Link href="/contact">
                    Get in Touch
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="bg-emerald-800 rounded-xl p-8 text-center">
                <div className="text-5xl font-bold text-white mb-4">8+</div>
                <p className="text-emerald-100">African Cities</p>
              </div>
              <div className="bg-emerald-800 rounded-xl p-8 text-center">
                <div className="text-5xl font-bold text-white mb-4">1500+</div>
                <p className="text-emerald-100">Community Champions</p>
              </div>
              <div className="bg-emerald-800 rounded-xl p-8 text-center">
                <div className="text-5xl font-bold text-white mb-4">67K+</div>
                <p className="text-emerald-100">Data Records</p>
              </div>
              <div className="bg-emerald-800 rounded-xl p-8 text-center">
                <div className="text-5xl font-bold text-white mb-4">10+</div>
                <p className="text-emerald-100">Research Papers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-16 sm:py-24 bg-white dark:bg-gray-950">
        <div className="container">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">Success Stories</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-md overflow-hidden">
              <div className="relative h-64">
                <Image src="/images/agri.jpg" alt="Success Story 1" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-xl font-bold">Transforming Cassava Farming</h3>
                  <p className="text-sm mt-2">
                    How a community in Eastern Uganda increased cassava yields by 40% using ClyCites technology.
                  </p>
                </div>
              </div>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full overflow-hidden">
                    <Image src="/images/agri.jpg" alt="Farmer" width={40} height={40} className="object-cover" />
                  </div>
                  <div>
                    <p className="font-semibold">Sarah Namukasa</p>
                    <p className="text-sm text-gray-500">Community Leader</p>
                  </div>
                </div>
                <Button asChild variant="outline" className="w-full">
                  <Link href="#">Read Story</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md overflow-hidden">
              <div className="relative h-64">
                <Image src="/images/agri.jpg" alt="Success Story 2" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-xl font-bold">Market Access Revolution</h3>
                  <p className="text-sm mt-2">
                    How small-scale farmers in Kampala gained direct access to international buyers.
                  </p>
                </div>
              </div>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full overflow-hidden">
                    <Image src="/images/agri.jpg" alt="Farmer" width={40} height={40} className="object-cover" />
                  </div>
                  <div>
                    <p className="font-semibold">John Muwanga</p>
                    <p className="text-sm text-gray-500">Farmer Cooperative Leader</p>
                  </div>
                </div>
                <Button asChild variant="outline" className="w-full">
                  <Link href="#">Read Story</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md overflow-hidden">
              <div className="relative h-64">
                <Image src="/images/agri.jpg" alt="Success Story 3" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-xl font-bold">Youth in Agriculture</h3>
                  <p className="text-sm mt-2">
                    How technology is attracting young people back to farming in rural communities.
                  </p>
                </div>
              </div>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full overflow-hidden">
                    <Image src="/images/agri.jpg" alt="Farmer" width={40} height={40} className="object-cover" />
                  </div>
                  <div>
                    <p className="font-semibold">Grace Akello</p>
                    <p className="text-sm text-gray-500">Youth Program Coordinator</p>
                  </div>
                </div>
                <Button asChild variant="outline" className="w-full">
                  <Link href="#">Read Story</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <Button asChild variant="outline" size="lg">
              <Link href="#" className="flex items-center gap-2">
                <span>View All Success Stories</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 sm:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Ready to Join a Program?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Whether you're a farmer, researcher, student, or community leader, we have programs designed to help you
              thrive in digital agriculture.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                <Link href="/contact">Apply Now</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

// Program Card Component
function ProgramCard({ program }: { program: { status: string; /* add other fields here */ } }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ongoing":
        return "bg-emerald-500 hover:bg-emerald-600"
      case "Open for Applications":
        return "bg-blue-500 hover:bg-blue-600"
      case "Coming Soon":
        return "bg-amber-500 hover:bg-amber-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case "training":
        return <BookOpen className="h-4 w-4" />
      case "research":
        return <Sparkles className="h-4 w-4" />
      case "community":
        return <Users className="h-4 w-4" />
      case "youth":
        return <Award className="h-4 w-4" />
      case "women":
        return <Users className="h-4 w-4" />
      case "data":
        return <BookOpen className="h-4 w-4" />
      case "innovation":
        return <Sparkles className="h-4 w-4" />
      case "market":
        return <Users className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  return (
    <Card className="border-0 shadow-md overflow-hidden h-full flex flex-col group">
      <div className="relative h-48">
        <Image
          src={program.image || "/placeholder.svg"}
          alt={program.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute top-4 right-4">
          <Badge className={getStatusColor(program.status)}>{program.status}</Badge>
        </div>
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-1">{program.title}</CardTitle>
        <CardDescription className="flex items-center gap-2">
          {getCategoryIcon(program.category)}
          <span>{program.category.charAt(0).toUpperCase() + program.category.slice(1)}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">{program.description}</p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>{program.startDate}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <MapPin className="h-4 w-4" />
            <span>{program.location}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <Users className="h-4 w-4" />
            <span>{program.participants} Participants</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700">
          <Link href={program.link}>
            Learn More
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
