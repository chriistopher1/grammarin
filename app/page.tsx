import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, CheckCircle2, Zap, Trophy, ArrowRight, GraduationCap } from "lucide-react"

const FEATURES = [
  {
    icon: BookOpen,
    title: "30 HSK 2 Grammar Points",
    desc: "Structured lessons covering every essential grammar pattern for HSK 2 proficiency.",
  },
  {
    icon: Zap,
    title: "Interactive Drag & Drop Quizzes",
    desc: "Arrange Mandarin words by dragging them into the correct order. Learn by doing.",
  },
  {
    icon: CheckCircle2,
    title: "Progress Tracking",
    desc: "Your progress is saved automatically. Pick up right where you left off.",
  },
  {
    icon: Trophy,
    title: "Clear Explanations",
    desc: "Each grammar point explained in English with examples, structure breakdowns, and tips.",
  },
]

const EXAMPLE_GRAMMARS = [
  { title: "是…的", pinyin: "shì…de", category: "Emphasis" },
  { title: "已经…了", pinyin: "yǐjīng…le", category: "Time" },
  { title: "虽然…但是", pinyin: "suīrán…dànshì", category: "Contrast" },
  { title: "因为…所以", pinyin: "yīnwèi…suǒyǐ", category: "Reason" },
  { title: "如果…就", pinyin: "rúguǒ…jiù", category: "Condition" },
  { title: "越来越", pinyin: "yuè lái yuè", category: "Degree" },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-chinese font-bold text-sm">文</span>
            </div>
            <span className="font-bold text-lg text-foreground">Grammarin</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="gradient-primary text-primary-foreground border-0">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden gradient-hero text-black">
        <div className="absolute inset-0 opacity-5">
          {["学", "文", "语", "汉", "中", "语", "法", "练"].map((char, i) => (
            <span
              key={i}
              className="absolute font-chinese text-6xl sm:text-8xl font-bold"
              style={{
                top: `${[10, 20, 60, 75, 15, 55, 35, 80][i]}%`,
                left: `${[5, 25, 10, 40, 70, 80, 90, 60][i]}%`,
                opacity: 0.6,
              }}
            >
              {char}
            </span>
          ))}
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-32 text-center">
          <Badge className="mb-6 bg-primary/20 text-primary border-primary/30 hover:bg-primary/20">
            HSK 2 Focus
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-bold mb-6 leading-tight">
            Master Mandarin
            <br />
            <span className="text-gradient">Grammar</span>
            <br />
            <span className="font-chinese text-3xl sm:text-5xl font-normal text-black/80">一步一步学中文语法</span>
          </h1>
          <p className="text-lg sm:text-xl text-black max-w-2xl mx-auto mb-10 leading-relaxed">
            30 essential HSK 2 grammar patterns, interactive quizzes, and clear English explanations.
            Built for Indonesian learners who want to speak Mandarin with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="gradient-primary text-primary-foreground border-0 gap-2 h-12 px-8 w-full sm:w-auto">
                Start Learning Free <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className=" text-black bg-white/10 hover:bg-white/20 h-12 px-8 w-full sm:w-auto">
                I have an account
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm text-black/40">Free to use. No credit card required.</p>
        </div>
      </section>

      {/* Grammar preview */}
      <section className="py-16 sm:py-24 bg-secondary/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">Grammar You'll Master</h2>
            <p className="text-muted-foreground">A preview of the patterns waiting for you</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {EXAMPLE_GRAMMARS.map((g, i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-xl p-4 sm:p-5 card-hover"
              >
                <Badge variant="secondary" className="text-xs mb-3">{g.category}</Badge>
                <p className="font-chinese text-2xl font-bold text-foreground mb-1">{g.title}</p>
                <p className="text-xs text-muted-foreground">{g.pinyin}</p>
              </div>
            ))}
          </div>
          <p className="text-center mt-6 text-muted-foreground text-sm">+ 24 more grammar patterns</p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">How Grammarin Works</h2>
            <p className="text-muted-foreground">Simple, effective, and designed for real learning</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-card border border-border rounded-xl p-6 card-hover">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works steps */}
      <section className="py-16 sm:py-24 bg-secondary/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-12">Learn in 3 Simple Steps</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Pick a Grammar", desc: "Browse 30 HSK 2 patterns and choose one to study." },
              { step: "2", title: "Study the Lesson", desc: "Read clear explanations with examples and usage tips." },
              { step: "3", title: "Take the Quiz", desc: "Drag and drop Mandarin words to form correct sentences." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-xl mb-4">
                  {step}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <GraduationCap className="w-12 h-12 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to start?</h2>
          <p className="text-muted-foreground mb-8">Join learners mastering Mandarin grammar one pattern at a time.</p>
          <Link href="/register">
            <Button size="lg" className="gradient-primary text-primary-foreground border-0 gap-2 h-12 px-10">
              Create Free Account <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-chinese font-bold text-xs">文</span>
            </div>
            <span className="font-bold text-foreground">Grammarin</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2024 Grammarin. Learn Mandarin Grammar the smart way.</p>
        </div>
      </footer>
    </div>
  )
}