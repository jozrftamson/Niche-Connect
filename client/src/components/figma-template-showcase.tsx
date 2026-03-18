import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { BarChart3, Briefcase, KanbanSquare, Layers3, Sparkles, Users } from "lucide-react";

const templates = [
  {
    id: "saas-dashboard",
    route: "/templates/saas-dashboard",
    name: "SaaS Dashboard",
    category: "Analytics",
    description: "Metric-heavy command center with KPI ribbons, trend cards, and conversion funnels.",
    chips: ["B2B", "Growth", "Executive"],
    icon: BarChart3,
    accent: "bg-primary/12 text-primary",
  },
  {
    id: "crm-pipeline",
    route: "/templates/crm-pipeline",
    name: "CRM Pipeline",
    category: "Sales",
    description: "Lead stages, owner handoff, and deal velocity widgets optimized for CRM workflows.",
    chips: ["Pipeline", "Sales Ops", "Revenue"],
    icon: Briefcase,
    accent: "bg-accent/15 text-accent",
  },
  {
    id: "onboarding-flow",
    route: "/templates/onboarding-flow",
    name: "Onboarding Flow",
    category: "Product",
    description: "Modern activation journey with step progress, checklist states, and guided actions.",
    chips: ["Activation", "Product-led", "SaaS"],
    icon: Layers3,
    accent: "bg-primary/12 text-primary",
  },
  {
    id: "team-workspace",
    route: "",
    name: "Team Workspace",
    category: "Collaboration",
    description: "Shared boards, ownership context, and async status signals for distributed teams.",
    chips: ["Team", "Workspace", "Hybrid"],
    icon: Users,
    accent: "bg-accent/15 text-accent",
  },
  {
    id: "kanban-ops",
    route: "",
    name: "Kanban Ops",
    category: "Operations",
    description: "High-clarity board layout with SLA flags, blocked states, and workload balance cues.",
    chips: ["Kanban", "Ops", "Delivery"],
    icon: KanbanSquare,
    accent: "bg-primary/12 text-primary",
  },
  {
    id: "creator-growth",
    route: "",
    name: "Creator Growth",
    category: "Community",
    description: "Engagement snapshots, audience clusters, and weekly momentum modules for creators.",
    chips: ["Creator", "Community", "Social"],
    icon: Sparkles,
    accent: "bg-accent/15 text-accent",
  },
] as const;

export function FigmaTemplateShowcase() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 pb-20">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Template Library</p>
          <h2 className="mt-3 text-3xl font-heading font-semibold md:text-4xl">
            Moderne Figma-Templates direkt im Projekt
          </h2>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            Basierend auf den am häufigsten genutzten Mustern für CRM, SaaS und Growth-Apps.
            Diese Blöcke sind sofort für neue Seiten und Flows wiederverwendbar.
          </p>
        </div>

        <Link href="/auth">
          <Button variant="outline" className="rounded-full">
            Als Basis verwenden
          </Button>
        </Link>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {templates.map((template) => {
          const Icon = template.icon;

          return (
            <article
              key={template.id}
              className="group rounded-2xl border border-border/70 bg-card/85 p-5 shadow-[var(--shadow-subtle)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-card)]"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{template.category}</p>
                  <h3 className="text-lg font-heading font-semibold">{template.name}</h3>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${template.accent}`}>
                  <Icon size={18} />
                </div>
              </div>

              <p className="text-sm leading-relaxed text-muted-foreground">{template.description}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {template.chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-border/70 bg-background px-2.5 py-1 text-xs text-foreground/80"
                  >
                    {chip}
                  </span>
                ))}
              </div>

              <div className="mt-5">
                {template.route ? (
                  <Link href={template.route}>
                    <Button variant="outline" className="h-9 rounded-full text-xs">
                      Open template page
                    </Button>
                  </Link>
                ) : (
                  <Button variant="secondary" disabled className="h-9 rounded-full text-xs opacity-70">
                    Coming soon
                  </Button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
