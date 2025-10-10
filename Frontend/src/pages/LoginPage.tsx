import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react"
import { FcGoogle } from "react-icons/fc" // for Google icon
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/firebaseConfig";

interface LoginPageProps {
  onLogin: () => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [loading, setLoading] = useState(false)

  async function handleGoogleLogin() {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Logged in user:", user);
      onLogin(); // or navigate to dashboard, etc.
    } catch (error) {
      console.error("Google Sign-In failed:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#6fa4e6]">
      {/* Top left logo and title */}
      <div className="absolute top-6 left-6 flex items-center space-x-4">
        <img
          src="/resources/University-of-Melbourne-logo-1.png"
          alt="University of Melbourne logo"
          className="h-24"
        />
        <span className="text-white text-2xl font-semibold tracking-wide">
          Research Costing and Pricing Tool
        </span>
      </div>

      {/* Login box */}
      <Card className="bg-gray-100 w-full max-w-md p-10 rounded-2xl shadow-lg">
        <CardContent className="flex flex-col items-center space-y-8">
          <h2 className="text-2xl font-semibold text-gray-700">Log in</h2>
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-4 bg-white hover:bg-gray-50 border border-gray-300 shadow-sm py-3 text-lg"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <FcGoogle size={26} />
            {loading ? "Signing in..." : "Sign in with Google"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
