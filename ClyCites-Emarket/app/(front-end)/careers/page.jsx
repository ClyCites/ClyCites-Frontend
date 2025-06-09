import { MapPin, Clock, Briefcase } from "lucide-react"

export default function CareersPage() {
  const openings = [
    {
      title: "Senior Software Engineer",
      department: "Engineering",
      location: "Kampala, Uganda",
      type: "Full-time",
      description: "Join our engineering team to build scalable solutions for Uganda's agricultural sector.",
    },
    {
      title: "Agricultural Specialist",
      department: "Operations",
      location: "Multiple Locations",
      type: "Full-time",
      description: "Work directly with farmers to onboard them and ensure quality standards.",
    },
    {
      title: "Digital Marketing Manager",
      department: "Marketing",
      location: "Kampala, Uganda",
      type: "Full-time",
      description: "Lead our digital marketing efforts to reach more farmers and consumers.",
    },
    {
      title: "Customer Success Representative",
      department: "Customer Support",
      location: "Remote",
      type: "Part-time",
      description: "Help our customers have the best experience on our platform.",
    },
  ]

  const benefits = [
    "Competitive salary and equity",
    "Health insurance coverage",
    "Flexible working hours",
    "Professional development budget",
    "Remote work options",
    "Team building activities",
  ]

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">
          Join Our <span className="text-orange-600">Team</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Help us revolutionize Uganda's agricultural sector and make a real impact on farmers' lives.
        </p>
      </section>

      {/* Why Work With Us */}
      <section className="bg-green-50 dark:bg-gray-800 rounded-2xl p-12">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Why Work at ClyCites?</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Our Mission</h3>
            <p className="text-gray-600 dark:text-gray-300">
              We're on a mission to transform agriculture in Uganda by connecting farmers directly with consumers,
              ensuring fair prices and fresh products for everyone.
            </p>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Our Culture</h3>
            <p className="text-gray-600 dark:text-gray-300">
              We believe in innovation, collaboration, and making a positive impact. Our team is passionate about
              technology and agriculture, working together to solve real problems.
            </p>
          </div>
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Benefits & Perks</h3>
            <ul className="space-y-2">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-orange-600 rounded-full"></span>
                  <span className="text-gray-600 dark:text-gray-300">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Open Positions</h2>
        <div className="grid gap-6">
          {openings.map((job, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{job.title}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center space-x-1">
                      <Briefcase className="w-4 h-4" />
                      <span>{job.department}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{job.type}</span>
                    </div>
                  </div>
                </div>
                <button className="mt-4 md:mt-0 bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                  Apply Now
                </button>
              </div>
              <p className="text-gray-600 dark:text-gray-300">{job.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-orange-50 dark:bg-gray-800 rounded-2xl p-12 text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Don't See Your Role?</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          We're always looking for talented individuals who share our passion for agriculture and technology. Send us
          your resume and let's talk!
        </p>
        <button className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold">
          Send Your Resume
        </button>
      </section>
    </div>
  )
}
