"use client"

import type React from "react"

import { useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { Gamepad2, Users, Code, Github } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null)

  // Sections for our parallax cards
  const sections = [
    {
      id: "intro",
      title: "About",
      description: "A passion project focused on creating engaging puzzle experiences.",
      icon: <Gamepad2 className="h-12 w-12 text-primary" />,
      content: (
        <>
          <p className="mb-4">
            Palindrome Guardian is a unique puzzle game that challenges players to find palindromic sequences in a
            colorful world. The game combines strategy, pattern recognition, and a touch of narrative to create an
            engaging experience for players of all skill levels.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center rounded-lg bg-muted p-3">
              <span className="text-xl font-bold text-primary">2023</span>
              <span className="text-xs text-muted-foreground">Founded</span>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-muted p-3">
              <span className="text-xl font-bold text-primary">3</span>
              <span className="text-xs text-muted-foreground">Games Released</span>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-muted p-3">
              <span className="text-xl font-bold text-primary">10K+</span>
              <span className="text-xs text-muted-foreground">Players Worldwide</span>
            </div>
          </div>
        </>
      ),
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      id: "team",
      title: "The Developer",
      description: "Meet the mind behind Palindrome Guardian.",
      icon: <Users className="h-12 w-12 text-primary" />,
      content: (
        <>
          <p className="mb-4">
            Palindrome Guardian was created by a solo developer with a passion for puzzle games and algorithmic
            challenges. With a background in computer science and game design, the developer aims to create experiences
            that are both entertaining and intellectually stimulating.
          </p>
          <div className="mt-6 flex justify-center">
            <div className="flex flex-col items-center">
              <div className="mb-2 overflow-hidden rounded-full border-2 border-primary h-24 w-24">
                <Image
                  src="/placeholder.svg?text=Dev&height=96&width=96"
                  alt="Developer"
                  width={96}
                  height={96}
                  className="object-cover"
                />
              </div>
              <span className="text-sm font-medium">Alex Morgan</span>
              <span className="text-xs text-muted-foreground">Lead Developer & Designer</span>
              <div className="mt-2 flex gap-2">
                <Button variant="outline" size="sm">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Button>
                <Button variant="outline" size="sm">
                  Portfolio
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      id: "technology",
      title: "Our Technology",
      description: "Cutting-edge tools powering immersive experiences.",
      icon: <Code className="h-12 w-12 text-primary" />,
      content: (
        <>
          <p className="mb-4">
            We leverage the latest game development technologies to create stunning visuals, responsive gameplay, and
            seamless experiences across all platforms.
          </p>
          <div className="mt-4 space-y-2">
            <div className="rounded-lg bg-muted p-3">
              <h4 className="font-medium">Next.js & React</h4>
              <p className="text-sm text-muted-foreground">Modern web technologies for responsive interfaces.</p>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <h4 className="font-medium">Algorithm Optimization</h4>
              <p className="text-sm text-muted-foreground">
                Efficient palindrome detection using Manacher's algorithm.
              </p>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <h4 className="font-medium">Tailwind CSS</h4>
              <p className="text-sm text-muted-foreground">Utility-first CSS for beautiful, responsive designs.</p>
            </div>
          </div>
        </>
      ),
      image: "/placeholder.svg?height=400&width=600",
    },
  ]

  return (
    <div ref={containerRef} className="relative">
      {/* Hero section with parallax background */}
      <div className="relative h-[50vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/placeholder.svg?height=1080&width=1920')",
            transform: "translateY(var(--scroll-offset, 0))",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 to-background" />
        <div className="container relative z-10 flex h-full flex-col items-center justify-center text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">About GameVerse</h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            We're on a mission to create immersive gaming experiences that bring people together.
          </p>
        </div>
      </div>

      {/* Parallax card sections */}
      <div className="container py-20">
        <div className="space-y-40 md:space-y-64">
          {sections.map((section, index) => (
            <ParallaxCard key={section.id} section={section} index={index} isEven={index % 2 === 0} />
          ))}
        </div>
      </div>

      {/* Simple footer with just copyright */}
      <footer className="w-full border-t bg-background/80 backdrop-blur-sm">
        <div className="container py-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} GameVerse. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

interface ParallaxCardProps {
  section: {
    id: string
    title: string
    description: string
    icon: React.ReactNode
    content: React.ReactNode
    image: string
  }
  index: number
  isEven: boolean
}

function ParallaxCard({ section, index, isEven }: ParallaxCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8])

  const imageY = useTransform(scrollYProgress, [0, 1], [50, -50])

  return (
    <div ref={cardRef} className="relative py-10">
      <motion.div style={{ opacity, scale }} className="relative z-10">
        <div className={`grid gap-8 md:grid-cols-2 md:gap-12 ${isEven ? "" : "md:grid-flow-dense"}`}>
          <Card className="border-2 border-primary/20 shadow-lg">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              {section.icon}
              <div>
                <CardTitle className="text-2xl">{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>{section.content}</CardContent>
          </Card>

          <motion.div
            style={{ y: imageY }}
            className={`relative flex items-center justify-center overflow-hidden rounded-lg ${isEven ? "md:order-last" : ""}`}
          >
            <Image
              src={section.image || "/placeholder.svg"}
              alt={section.title}
              width={600}
              height={400}
              className="rounded-lg object-cover shadow-lg"
            />
            <div className="absolute inset-0 rounded-lg bg-primary/10" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

