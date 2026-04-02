import { Button } from "@/components/ui/button";
import { FigmaTemplateShowcase } from "@/components/figma-template-showcase";
import { Link } from "wouter";
import {
  ArrowRight,
  BadgeCheck,
  Github,
  MessageCircle,
  Sparkles,
  TrendingUp,
  Twitter,
} from "lucide-react";
import { RoadmapSection } from "@/components/roadmap-section";

export default function Landing() {
  return (
    <>
      <div className="min-h-screen bg-background text-foreground">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(60%_55%_at_50%_0%,black,transparent)]" />
          <div className="absolute -top-32 right-[-6rem] h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
          <div className="absolute top-24 -left-20 h-72 w-72 rounded-full bg-accent/25 blur-3xl" />
        </div>

        <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
              <span className="font-heading text-sm tracking-[0.2em]">NC</span>
            </div>
            <div className="leading-tight">
              <div className="font-heading text-lg">Niche-Connect</div>
              <div className="text-xs text-muted-foreground">Signal-first engagement</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth">
              <Button variant="ghost" className="rounded-full text-sm">Join beta</Button>
            </Link>
            <Link href="/auth">
              <Button variant="outline" className="rounded-full">Log In</Button>
            </Link>
          </div>
        </header>

        <main className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-6 pb-20 pt-6 lg:grid-cols-[1.1fr_0.9fr] lg:pt-14">
          <div className="flex flex-col justify-center">
            <div className="fade-up inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles size={14} />
              Manual-first, 100% compliant
            </div>

            <h1 className="fade-up mt-6 text-5xl font-semibold tracking-tight md:text-7xl">
              Build trust in
              <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent"> every comment</span>.
            </h1>

            <p className="fade-up mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Find creators in your exact niche, craft authentic replies, and grow without spammy bots.
              Niche-Connect keeps engagement human while scaling your momentum.
            </p>

            <div className="fade-up mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/auth">
                <Button size="lg" className="h-12 rounded-full px-6 text-base">
                  Start free
                  <ArrowRight className="ml-2" size={18} />
                </Button>
              </Link>
              <Button variant="secondary" size="lg" className="h-12 rounded-full px-6 text-base">
                Watch demo
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Manual engagement workflow
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-accent" />
                Real-time niche discovery
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-foreground/40" />
                Ready for Base mini app
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="glass-card fade-up rounded-3xl p-6 md:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Live Pulse</p>
                  <h3 className="mt-2 text-2xl font-heading font-semibold">Niche Signal Map</h3>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <TrendingUp size={18} />
                </div>
              </div>

              <div className="mt-6 grid gap-4">
                <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Creator match rate</span>
                    <span className="font-medium text-foreground">92%</span>
                  </div>
                  <div className="mt-3 h-2 w-full rounded-full bg-muted">
                    <div className="h-2 w-[92%] rounded-full bg-primary" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Stat title="Replies today" value="148" sub="Across 5 niches" />
                  <Stat title="Spam risk" value="Low" sub="Manual verified" />
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute -bottom-10 -left-6 hidden lg:block">
              <div className="glass-card float-slow rounded-2xl p-4">
                <p className="text-xs text-muted-foreground">Top niche right now</p>
                <div className="mt-2 text-lg font-heading font-semibold">Creator Growth</div>
                <div className="mt-3 inline-flex items-center gap-2 text-sm text-primary">
                  <TrendingUp size={14} />
                  +22% engagement
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <section className="mx-auto w-full max-w-6xl px-6 pb-16">
        <div className="grid gap-6 md:grid-cols-3">
          <Feature
            title="Niche Discovery"
            desc="Curated feeds surface the creators who matter most to your current focus."
            icon={Sparkles}
          />
          <Feature
            title="Smart Templates"
            desc="Import your voice once, personalize every reply with zero robotic output."
            icon={BadgeCheck}
          />
          <Feature
            title="Gamified Momentum"
            desc="Earn points for real interactions and unlock visibility boosts over time."
            icon={TrendingUp}
          />
        </div>
      </section>

      <FigmaTemplateShowcase />

      <section className="mx-auto w-full max-w-6xl px-6 pb-24">
        <div className="rounded-3xl border border-border/70 bg-surface px-8 py-10 shadow-[var(--shadow-card)] md:flex md:items-center md:justify-between md:gap-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-3 py-1 text-xs font-medium text-accent">
              <BadgeCheck size={14} />
              Built for compliant growth
            </div>
            <h2 className="mt-4 text-3xl font-heading font-semibold">Start with a niche, not a megaphone.</h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Align your outreach with the right communities and let the mini app carry the momentum everywhere you post.
            </p>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row md:mt-0">
            <Link href="/auth">
              <Button size="lg" className="h-12 rounded-full px-6 text-base">
                Launch now
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="h-12 rounded-full px-6 text-base">
              Talk to us
            </Button>
          </div>
        </div>
      </section>

      <footer className="mx-auto w-full max-w-6xl px-6 pb-12">
        <div className="rounded-2xl border border-border/70 bg-card/60 p-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-muted-foreground">
              Follow Niche-Connect and visit our channels.
            </p>
            <p className="text-xs text-muted-foreground">
              Icons are from lucide-react (ISC License).
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="https://discord.com"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm transition-colors hover:bg-muted"
            >
              <MessageCircle size={16} />
              Discord
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm transition-colors hover:bg-muted"
            >
              <Twitter size={16} />
              X
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm transition-colors hover:bg-muted"
            >
              <Github size={16} />
              GitHub
            </a>
            <a
              href="https://bsky.app"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm transition-colors hover:bg-muted"
            >
              <span className="inline-flex h-4 min-w-4 items-center justify-center rounded bg-primary/15 px-1 text-[10px] font-semibold text-primary">
                BS
              </span>
              Bluesky
            </a>
            <a
              href="https://www.base.org"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm transition-colors hover:bg-muted"
            >
              <span className="inline-flex h-4 min-w-4 items-center justify-center rounded bg-accent/20 px-1 text-[10px] font-semibold text-accent">
                BA
              </span>
              Base App
            </a>
          </div>
        </div>
      </footer>
      </div>

      <RoadmapSection />
    </>
  );
}

function Feature({
  title,
  desc,
  icon: Icon,
}: {
  title: string;
  desc: string;
  icon: typeof BadgeCheck;
}) {
  return (
    <div className="group rounded-2xl border border-border/70 bg-card/80 p-6 shadow-[var(--shadow-subtle)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-card)]">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon size={18} />
      </div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground">{desc}</p>
    </div>
  );
}

function Stat({ title, value, sub }: { title: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
      <p className="text-xs text-muted-foreground">{title}</p>
      <div className="mt-2 text-xl font-heading font-semibold">{value}</div>
      <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}
