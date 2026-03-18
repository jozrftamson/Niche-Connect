import { Button } from "@/components/ui/button";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { Link } from "wouter";

export interface TemplateStat {
  label: string;
  value: string;
  detail: string;
}

export interface TemplateFeature {
  title: string;
  description: string;
}

export function TemplateHero({
  badge,
  title,
  description,
}: {
  badge: string;
  title: string;
  description: string;
}) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-surface p-8 shadow-[var(--shadow-card)] md:p-10">
      <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -left-20 top-28 h-52 w-52 rounded-full bg-accent/15 blur-3xl" />

      <div className="relative z-10">
        <p className="inline-flex rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-primary">
          {badge}
        </p>
        <h1 className="mt-5 max-w-3xl text-4xl font-heading font-semibold tracking-tight md:text-5xl">{title}</h1>
        <p className="mt-4 max-w-3xl text-muted-foreground md:text-lg">{description}</p>
      </div>
    </section>
  );
}

export function TemplateStatGrid({ stats }: { stats: TemplateStat[] }) {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <article key={stat.label} className="rounded-2xl border border-border/70 bg-card p-5 shadow-[var(--shadow-subtle)]">
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{stat.label}</p>
          <p className="mt-2 text-3xl font-heading font-semibold">{stat.value}</p>
          <p className="mt-1 text-sm text-muted-foreground">{stat.detail}</p>
        </article>
      ))}
    </section>
  );
}

export function TemplateFeatureGrid({
  title,
  icon: Icon,
  features,
}: {
  title: string;
  icon: LucideIcon;
  features: TemplateFeature[];
}) {
  return (
    <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-[var(--shadow-subtle)] md:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon size={18} />
        </div>
        <h2 className="text-2xl font-heading font-semibold">{title}</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {features.map((feature) => (
          <article key={feature.title} className="rounded-2xl border border-border/60 bg-background p-5">
            <h3 className="text-base font-semibold">{feature.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function TemplateJourney({
  title,
  steps,
}: {
  title: string;
  steps: string[];
}) {
  return (
    <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-[var(--shadow-subtle)] md:p-8">
      <h2 className="text-2xl font-heading font-semibold">{title}</h2>
      <ol className="mt-5 grid gap-3 md:grid-cols-2">
        {steps.map((step, index) => (
          <li key={step} className="flex items-start gap-3 rounded-xl border border-border/60 bg-background p-4">
            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/12 text-sm font-semibold text-primary">
              {index + 1}
            </span>
            <span className="text-sm text-foreground/90">{step}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function TemplateCta({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="rounded-3xl border border-border/70 bg-surface p-7 shadow-[var(--shadow-subtle)] md:flex md:items-center md:justify-between md:gap-8">
      <div>
        <h2 className="text-2xl font-heading font-semibold">{title}</h2>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">{description}</p>
      </div>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row md:mt-0">
        <Link href="/auth">
          <Button className="rounded-full">
            Use this template
            <ArrowRight className="ml-2" size={16} />
          </Button>
        </Link>
        <Link href="/">
          <Button variant="outline" className="rounded-full">
            Back to library
          </Button>
        </Link>
      </div>
    </section>
  );
}
