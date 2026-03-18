import { BarChart3 } from "lucide-react";
import {
  TemplateCta,
  TemplateFeatureGrid,
  TemplateHero,
  TemplateJourney,
  TemplateStatGrid,
  type TemplateFeature,
  type TemplateStat,
} from "@/components/template-page-sections";

const stats: TemplateStat[] = [
  { label: "MRR Growth", value: "+18%", detail: "Month-over-month expansion" },
  { label: "Activation", value: "74%", detail: "Users reaching aha moment" },
  { label: "Churn", value: "2.1%", detail: "Rolling 30-day churn rate" },
];

const features: TemplateFeature[] = [
  {
    title: "Executive KPI Ribbon",
    description: "Top-level metrics with target deltas and trend indicators for fast daily review.",
  },
  {
    title: "Acquisition Funnel",
    description: "Traffic-to-paid conversion blocks with drop-off hotspots and campaign attribution.",
  },
  {
    title: "Health Segments",
    description: "Account health matrix grouped by ARR tier, usage frequency, and support risk.",
  },
  {
    title: "Action Queue",
    description: "Prioritized actions that convert insights into owner-assigned execution tasks.",
  },
];

const journey = [
  "Define north-star KPI and map feeder metrics.",
  "Connect acquisition and activation data blocks.",
  "Add retention and churn diagnostics section.",
  "Create action queue linked to ownership and due date.",
];

export default function SaasDashboardTemplatePage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-16 pt-6 md:px-6 md:pt-10">
      <TemplateHero
        badge="Template / SaaS"
        title="SaaS Dashboard Template"
        description="A modern analytics layout for product and revenue teams. Use it when you need fast KPI readability, clean trend storytelling, and clear next actions."
      />

      <TemplateStatGrid stats={stats} />

      <TemplateFeatureGrid title="Core Blocks" icon={BarChart3} features={features} />

      <TemplateJourney title="Implementation Flow" steps={journey} />

      <TemplateCta
        title="Ship your dashboard baseline in one sprint"
        description="Start with this template and adapt metrics, naming, and chart density to your product maturity level."
      />
    </div>
  );
}
