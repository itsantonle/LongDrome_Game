export function Footer() {
  return (
    <footer className="w-full border-t bg-background/80 backdrop-blur-sm">
      <div className="container py-6">
        <div className="mb-6 rounded-lg bg-muted/50 p-4">
          <h3 className="mb-2 text-sm font-medium">Game Controls:</h3>
          <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
            <div>
              <h4 className="font-medium">Basic Controls:</h4>
              <ul className="mt-1 space-y-1 text-muted-foreground">
                <li>• Click on colors to select them</li>
                <li>• Selected colors must form a continuous sequence</li>
                <li>• The sequence must be a palindrome (same forward and backward)</li>
                <li>• Submit your selection when ready</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium">Actions:</h4>
              <ul className="mt-1 space-y-1 text-muted-foreground">
                <li>
                  • <strong>Fight:</strong> Start a new turn and select palindromes
                </li>
                <li>
                  • <strong>Talk:</strong> Interact with the Guardian to restore HP/MP
                </li>
                <li>
                  • <strong>Magic:</strong> Reveal the longest palindrome (costs 20 MP)
                </li>
                <li>
                  • <strong>Home:</strong> Return home when the Guardian trusts you
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} GameVerse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

