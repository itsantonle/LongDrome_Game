'use client'
import { Github, Info, Home } from 'lucide-react'
import { ModeToggle } from './mode-toggle'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export function MainHeader() {
  const pathname = usePathname()
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex items-center justify-between h-14">
        <div className="flex items-center">
          <h1 className="text-lg font-bold">
            <a href="/">
              <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                <Image
                  src="/ld_logo.png"
                  alt="logo"
                  width={150}
                  height={100}
                  className="hidden sm:block"
                />
              </span>
            </a>
          </h1>
        </div>
        <nav className="flex items-center gap-4">
          {pathname === '/about' ? (
            <a
              href="/"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </a>
          ) : (
            <a
              href="/about"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <Info className="h-4 w-4" />
              <span>About</span>
            </a>
          )}
          <a
            href="https://github.com/yourusername/palindrome-guardian"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <Github className="h-4 w-4" />
            <span>GitHub</span>
          </a>
          <ModeToggle />
        </nav>
      </div>
    </header>
  )
}
