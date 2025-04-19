import { Github, Info } from 'lucide-react'
import { ModeToggle } from './mode-toggle'

export function MainHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex items-center justify-between h-14">
        <div className="flex items-center">
          <h1 className="text-lg font-bold">
            <a href="/">
              <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                Palindrome Guardian
              </span>
            </a>
          </h1>
        </div>
        <nav className="flex items-center gap-4">
          <a
            href="/about"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <Info className="h-4 w-4" />
            <span>About</span>
          </a>
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
