import { AuthForm } from "@/components/app/auth/AuthForm"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="border-b border-border/50 h-16 flex items-center px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <span className="text-primary-foreground font-chinese font-bold text-sm">文</span>
          </div>
          <span className="font-bold text-lg text-foreground">Grammarin</span>
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-1">Create your account</h1>
            <p className="text-muted-foreground text-sm">Start mastering Mandarin grammar today</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
            <AuthForm mode="register" />
          </div>
        </div>
      </div>
    </div>
  )
}