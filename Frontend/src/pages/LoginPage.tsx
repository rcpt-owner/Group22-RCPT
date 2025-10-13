import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface LoginPageProps {
  onLogin: () => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    // OPTIMISATION:
    // - Replace with real AuthService.login returning session token.
    // - Add form-level error + loading skeleton + password manager hints.
    await new Promise(r => setTimeout(r, 400))
    onLogin()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-lg">Sign in</CardTitle>
        </CardHeader>
        {/* Simple form, no actual auth logic, and would use an FormInput from components/forms to make backenc easier */}
        <form onSubmit={submit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required placeholder="user@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pw">Password</Label>
              <Input id="pw" type="password" required />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Login"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
