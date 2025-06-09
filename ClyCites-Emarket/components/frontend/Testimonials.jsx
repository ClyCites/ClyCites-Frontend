import Image from "next/image"
import { Star } from "lucide-react"

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Local Restaurant Owner",
      image: "/placeholder.svg?height=60&width=60",
      rating: 5,
      text: "The quality of vegetables I get from this platform is exceptional. My customers love the freshness!",
    },
    {
      id: 2,
      name: "Michael Ochieng",
      role: "Home Cook",
      image: "/placeholder.svg?height=60&width=60",
      rating: 5,
      text: "Finally, a platform where I can get fresh produce directly from farmers. The prices are fair and the quality is amazing.",
    },
    {
      id: 3,
      name: "Grace Nakato",
      role: "Grocery Store Owner",
      image: "/placeholder.svg?height=60&width=60",
      rating: 5,
      text: "This marketplace has transformed my business. I can now source directly from multiple farmers easily.",
    },
  ]

  return (
    <section className="py-16 bg-white dark:bg-gray-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">What Our Customers Say</h2>
          <p className="text-gray-600 dark:text-gray-400">Real feedback from our satisfied customers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6 italic">"{testimonial.text}"</p>
              <div className="flex items-center">
                <Image
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  width={60}
                  height={60}
                  className="rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
