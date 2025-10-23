import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"
import { FcGoogle } from "react-icons/fc"
import { Loader2 } from "lucide-react"
import { signInWithPopup } from "firebase/auth"
import { auth, provider } from "../services/firebaseConfig";

interface LoginPageProps {
  onLogin: () => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [loading, setLoading] = useState(false)

  async function handleGoogleLogin() {
    try {
      setLoading(true)
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      onLogin()
    } catch (error) {
      console.error("Google Sign-In failed:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-6">
      {/* Top left logo and title */}
      <div className="absolute top-6 left-6 flex items-center space-x-4">
        <img
          src="/resources/University-of-Melbourne-logo-1.png"
          alt="University of Melbourne logo"
          className="h-16 md:h-20"
        />
        <span className="text-xl md:text-2xl font-semibold tracking-wide">
          Research Costing and Pricing Tool
        </span>
      </div>

      {/* Login card */}
      <Card className="w-full max-w-md shadow-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Welcome</CardTitle>
          <CardDescription>Sign in with your University account through Google to continue.</CardDescription>
        </CardHeader>

        <CardContent>
          <Button
            variant="outline"
            className="w-full h-11 justify-center"
            onClick={handleGoogleLogin}
            disabled={loading}
            aria-busy={loading}
            aria-label="Sign in with Google"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FcGoogle className="mr-2 h-5 w-5" />
            )}
            {loading ? "Signing in..." : "Continue with Google"}
          </Button>

          <Separator className="my-6" />
          <p className="text-sm text-muted-foreground text-center">
            This app uses Google authentication only. No backend is required for sign‑in.
          </p>
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-xs text-muted-foreground">
            By continuing, you agree to the UoM terms of use.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}