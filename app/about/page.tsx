'use client'

import type React from 'react'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Github, Sword, MessageSquare, CogIcon } from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null)

  // Sections for our parallax cards
  const sections = [
    {
      id: 'intro',
      title: 'About',
      description: 'Final Project For Algorithms - SE2231',
      icon: (
        <Button
          variant="outline"
          size="lg"
          className="flex h-16 w-16 flex-col items-center justify-center gap-1 border-2 border-primary/30 p-0 md:h-20 md:w-20"
        >
          <Sword className="h-6 w-6 text-red-500" />
          <span className="text-xs">Fight</span>
        </Button>
      ),
      content: (
        <>
          <p className="mb-4 mt-4">
            You're facing against an immortal entity that cannot be killed, it
            has secrets and you need to understand them. Go through color blocks
            and defend yourself against a foe who can hit YOU, but you CANNOT
            hit it. A turn based combat that focuses on 'talking' and pattern
            identification. Can you prove how good you are at the patterns?
          </p>
          <div className="mt-6 grid grid-cols-3 gap-4">
            {/* <div className="flex flex-col items-center rounded-lg bg-muted p-3">
              <span className="text-xl font-bold text-primary">2023</span>
              <span className="text-xs text-muted-foreground">Founded</span>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-muted p-3">
              <span className="text-xl font-bold text-primary">3</span>
              <span className="text-xs text-muted-foreground">
                Games Released
              </span>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-muted p-3">
              <span className="text-xl font-bold text-primary">10K+</span>
              <span className="text-xs text-muted-foreground">
                Players Worldwide
              </span>
            </div> */}
          </div>
        </>
      ),
      image: '/about_aboutimg.png',
    },
    {
      id: 'team',
      title: 'The Developer',
      description: 'Thoughts behind the creation of LongDrome.',
      icon: (
        <Button
          variant="outline"
          size="lg"
          className="flex h-16 w-16 flex-col items-center justify-center gap-1 border-2 border-primary/30 p-0 md:h-20 md:w-20"
        >
          <MessageSquare className="h-6 w-6 text-green-500" />
          <span className="text-xs">Think</span>
        </Button>
      ),
      content: (
        <>
          <p className="mb-4 mt-4">
            Longdrome, originally named as Palindrome Guardian is created as a
            requirement for Algorihtms class. Originally, the colors were
            strings of text but I later on diverted to using a more color themed
            approach by mapping color blocks together. The project utilizes
            Manacher's Algo which finds the lognest palindromic strings - in the
            game's case color blocks in linear time. The challenge was to find
            an application for the algorithm. Since Manacher is usually utilized
            in competitive programming, I had to find a way to implement it,
            then I got inspired by DNA patterns and how Manacher's can help in
            finding patterns.
          </p>
          <div className="mt-6 flex justify-center">
            <div className="flex flex-col items-center">
              <div className="mb-2 overflow-hidden rounded-full border-2 border-primary h-20 w-20">
                <Image
                  src="/Anton_profile.jpg"
                  alt="Developer"
                  width={96}
                  height={96}
                  className="object-cover"
                />
              </div>
              <span className="text-sm font-medium">A. Legayada</span>
              <span className="text-xs text-muted-foreground">
                Developer & Designer
              </span>
              <div className="mt-2 flex gap-2">
                <Link href={'https://github.com/itsantonle'}>
                  <Button variant="outline" size="sm">
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </Button>
                </Link>

                <Button
                  onClick={() => {
                    window.alert('Coming Soon')
                  }}
                  variant="outline"
                  size="sm"
                >
                  Portfolio
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
      image: '/ldrome_guardian.jpg',
    },
    {
      id: 'technology',
      title: 'The techstack used',
      description: 'Tools for stuff the do the work',
      icon: (
        <Button
          variant="outline"
          size="lg"
          className="flex h-16 w-16 flex-col items-center justify-center gap-1 border-2 border-primary/30 p-0 md:h-20 md:w-20"
        >
          <CogIcon className="h-12 w-12 text-blue-500" />
          <span className="text-xs">Tech</span>
        </Button>
      ),
      content: (
        <>
          <p className="mb-4 mt-4">
            I originally wanted to use a web engine like PhaserJS but since the
            algorithm relies heavily on text and stuff for the initial test of
            Palindrome guardian, I moved on to NextJS and React, later on i
            decided to change up the whole project again somewhere along the
            month of April and thus Longdrome was born
          </p>
          <div className="mt-4 space-y-2">
            <div className="rounded-lg bg-muted p-3">
              <h4 className="font-medium">Next.js & React</h4>
              <p className="text-sm text-muted-foreground">
                Modern web technologies for responsive interfaces.
              </p>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <h4 className="font-medium">Algorithm Optimization</h4>
              <p className="text-sm text-muted-foreground">
                Efficient palindrome detection using Manacher's algorithm.
              </p>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <h4 className="font-medium">Tailwind CSS</h4>
              <p className="text-sm text-muted-foreground">
                Utility-first CSS for beautiful, responsive designs.
              </p>
            </div>
          </div>
        </>
      ),
      image: '/about_techimg.png',
    },
  ]

  return (
    <div ref={containerRef} className="relative">
      <div className="relative h-[50vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/ldrome_bg_temple.jpg')",
            transform: 'translateY(var(--scroll-offset, 0))',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 to-background" />
        <div className="container relative z-10 flex h-full flex-col items-center justify-center text-center">
          <div className="relative w-auto h-auto max-w-full max-h-100">
            <Image src="/ld_logo.png" alt="logo" width={500} height={100} />

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center translate-y-20">
              <p className="max-w-2xl text-xs text-white bg-black/20 px-4 py-2 rounded-md">
                Face upon an immortal foe and defend yourself with the language
                of colors!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Parallax card sections */}
      <div className="container py-20">
        <div className="space-y-40 md:space-y-64 text-xs sm:text-sm font-thin">
          {sections.map((section, index) => (
            <ParallaxCard
              key={section.id}
              section={section}
              index={index}
              isEven={index % 2 === 0}
            />
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
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  const scale = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0.8, 1, 1, 0.8]
  )

  const imageY = useTransform(scrollYProgress, [0, 1], [50, -50])

  return (
    <div ref={cardRef} className="relative py-10">
      <motion.div style={{ opacity, scale }} className="relative z-10">
        <div
          className={`grid gap-8 md:grid-cols-2 md:gap-12 ${
            isEven ? '' : 'md:grid-flow-dense'
          }`}
        >
          <Card className="border-2 border-primary/20 shadow-lg">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <span className="hidden sm:block">{section.icon}</span>
              <div>
                <CardTitle className="text-2xl">{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>{section.content}</CardContent>
          </Card>

          <motion.div
            style={{ y: imageY }}
            className={`relative flex items-center justify-center overflow-hidden rounded-lg ${
              isEven ? 'md:order-last' : ''
            }`}
          >
            <Image
              src={section.image || '/placeholder.svg'}
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
