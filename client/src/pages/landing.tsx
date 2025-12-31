import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, CheckCircle, Shield } from "lucide-react";

export default function Landing() {
  const miniAppUrl = import.meta.env.VITE_MINIAPP_URL as string | undefined;

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 py-4 flex items-center justify-between">
        <div className="font-bold text-xl tracking-tight">EngageFlow</div>
        <Link href="/auth">
          <Button variant="outline" className="rounded-full">Log In</Button>
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12 md:py-24 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
          <Shield size={14} />
          100% Compliant & Safe
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
          Authentic Growth,<br />
          Zero Spam.
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
          Discover creators in your niche and engage with meaningful comments. 
          Use our "1-Tap" manual workflow to build real relationships without bots.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link href="/auth">
            <Button size="lg" className="rounded-full text-lg h-14 px-8 w-full sm:w-auto">
              Get Started
              <ArrowRight className="ml-2" size={18} />
            </Button>
          </Link>
          {miniAppUrl ? (
            <a href={miniAppUrl} target="_blank" rel="noreferrer">
              <Button variant="secondary" size="lg" className="rounded-full text-lg h-14 px-8 w-full sm:w-auto">
                Open Mini App
              </Button>
            </a>
          ) : (
            <Button
              variant="secondary"
              size="lg"
              className="rounded-full text-lg h-14 px-8 w-full sm:w-auto"
              disabled
            >
              Mini App (set VITE_MINIAPP_URL)
            </Button>
          )}
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <Feature 
            title="Niche Discovery" 
            desc="Select your topics and get a curated feed of relevant posts to engage with."
          />
          <Feature 
            title="Smart Templates" 
            desc="Import your own comment templates and let us fill in the variables for you."
          />
          <Feature 
            title="Gamified Rewards" 
            desc="Earn tokens for every manual interaction and boost your own profile visibility."
          />
        </div>
      </main>
    </div>
  );
}

function Feature({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="p-6 rounded-2xl bg-secondary/50 border border-border/50">
      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
        <CheckCircle size={20} />
      </div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground">{desc}</p>
    </div>
  );
}
