import Image from "next/image"
import { Twitter, Linkedin, Github } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const team = [
  {
    name: "Vanessa Furaha",
    role: "TEAM LEAD, RESEARCHER",
    image: "/images/team/image.png",
    social: {
      twitter: "https://twitter.com/vanessafuraha",
      linkedin: "https://linkedin.com/in/vanessafuraha",
      github: "https://github.com/vanessafuraha",
    },
  },
  {
    name: "Troy Moses Mugabi",
    role: "DEVELOPER, ML",
    image: "/images/team/mos.jpg",
    social: {
      twitter: "https://twitter.com/troymoses",
      linkedin: "https://linkedin.com/in/troymoses",
      github: "https://github.com/troymoses",
    },
  },
  {
    name: "Dhieu David",
    role: "DEVELOPER",
    image: "/images/team/do.jpg",
    social: {
      twitter: "https://twitter.com/dhieudavid",
      linkedin: "https://linkedin.com/in/dhieudavid",
      github: "https://github.com/dhieudavid",
    },
  },
  {
    name: "Ishimwe Tresor Bertrand",
    role: "DEVELOPER",
    image: "/images/team/trs.jpg",
    social: {
      twitter: "https://twitter.com/ishimwetresor",
      linkedin: "https://linkedin.com/in/ishimwetresor",
      github: "https://github.com/ishimwetresor",
    },
  },
]

export function Team() {
  return (
    <section className="py-16 sm:py-24 bg-white flex justify-center">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Meet Our Team</h2>
          <p className="mt-4 text-lg text-gray-600">
            We are ClyCites, a team of passionate innovators dedicated to using AI to drive economic intelligence.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4 md:px-8">
          {team.map((member) => (
            <Card key={member.name} className="border-0 shadow-md overflow-hidden">
              <CardHeader className="p-0">
                <div className="aspect-square relative">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg text-gray-900">{member.name}</h3>
                <p className="text-sm text-gray-600">{member.role}</p>
              </CardContent>
              <CardFooter className="flex justify-start gap-4 pt-0">
                {member.social.twitter && (
                  <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                    <a href={member.social.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                      <Twitter className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {member.social.linkedin && (
                  <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                    <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                      <Linkedin className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {member.social.github && (
                  <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                    <a href={member.social.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                      <Github className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
