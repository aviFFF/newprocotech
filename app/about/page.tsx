import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Jane Smith",
      role: "CEO & Founder",
      bio: "With over 15 years of experience in software development and leadership.",
      image: "/placeholder.svg?height=300&width=300&text=JS",
    },
    {
      name: "John Doe",
      role: "CTO",
      bio: "Expert in cloud architecture and emerging technologies.",
      image: "/placeholder.svg?height=300&width=300&text=JD",
    },
    {
      name: "Emily Johnson",
      role: "Lead Developer",
      bio: "Full-stack developer with a passion for clean, efficient code.",
      image: "/placeholder.svg?height=300&width=300&text=EJ",
    },
    {
      name: "Michael Chen",
      role: "Education Director",
      bio: "Former university professor with a talent for making complex concepts simple.",
      image: "/placeholder.svg?height=300&width=300&text=MC",
    },
  ]

  return (
    <div className="container py-12 md:py-16">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">About Us</h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Learn more about our company, our mission, and the team behind Proco.
        </p>
      </div>

      {/* Our Story Section */}
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-4">Our Story</h2>
            <p className="text-muted-foreground mb-4">
              Founded in 2019, Proco started with a simple mission: to bridge the gap between theoretical knowledge
              and practical skills in software development.
            </p>
            <p className="text-muted-foreground mb-4">
              What began as a small team of passionate developers offering training to local businesses has grown into a
              comprehensive software development and education company serving clients worldwide.
            </p>
            <p className="text-muted-foreground">
              Today, we continue to innovate in both our development services and educational offerings, staying at the
              forefront of technology to deliver the best solutions and learning experiences.
            </p>
          </div>
          <div className="order-first md:order-last">
            <Image
              src="https://images.pexels.com/photos/9783353/pexels-photo-9783353.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="Our Story"
              width={600}
              height={400}
              className="rounded-lg object-cover"
            />
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="order-last md:order-first">
            <Image
              src="https://plus.unsplash.com/premium_photo-1664201890375-f8fa405cdb7d?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              alt="Our Mission"
              width={600}
              height={400}
              className="rounded-lg object-cover"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground mb-4">
              At Proco, our mission is to empower individuals and organizations through technology and education.
            </p>
            <p className="text-muted-foreground mb-4">
              We believe that great software should be both powerful and accessible, and that learning to code should be
              engaging and relevant to real-world applications.
            </p>
            <p className="text-muted-foreground">
              Every project we undertake and every course we develop is guided by these principles, ensuring that we
              deliver value that extends beyond lines of code.
            </p>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      {/* <section>
        <h2 className="text-2xl font-bold mb-6 text-center">Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <Card key={index}>
              <div className="aspect-square overflow-hidden">
                <Image
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg">{member.name}</h3>
                <p className="text-primary text-sm mb-2">{member.role}</p>
                <p className="text-muted-foreground text-sm">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section> */}
    </div>
  )
}

