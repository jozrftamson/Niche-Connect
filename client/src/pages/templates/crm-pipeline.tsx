import { Briefcase } from "lucide-react";
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
  { label: "Open Deals", value: "126", detail: "Across all active owners" },
  { label: "Win Rate", value: "31%", detail: "Current quarter close ratio" },
  { label: "Cycle Time", value: "19d", detail: "Median lead-to-close duration" },
];

const features: TemplateFeature[] = [
  {
    title: "Stage Board",
    description: "Visual pipeline stages with deal count, weighted value, and urgency markers.",
  },
  {
    title: "Owner Capacity",
    description: "Rep workload snapshots with SLA pressure and follow-up debt visibility.",
  },
  {
    title: "Deal Risk Signals",
    description: "Highlight stale opportunities, missing next steps, and confidence drops.",
  },
  {
    title: "Revenue Forecast",
    description: "Forecast strip by close window and probability for finance-ready planning.",
  },
];

const journey = [
  "Define pipeline stages and probability model.",
  "Map ownership fields and SLA triggers.",
  "Add risk flags for stale and blocked deals.",
  "Create weekly forecast board for leadership review.",
];

export default function CrmPipelineTemplatePage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-16 pt-6 md:px-6 md:pt-10">
      <TemplateHero
        badge="Template / CRM"
        title="CRM Pipeline Template"
        description="A frequently used Figma-style CRM layout optimized for sales velocity, ownership clarity, and predictable forecasting."
      />

      <TemplateStatGrid stats={stats} />

      <TemplateFeatureGrid title="Pipeline Modules" icon={Briefcase} features={features} />

      <TemplateJourney title="Implementation Flow" steps={journey} />

      <TemplateCta
        title="Standardize your sales rhythm"
        description="Use this as your base screen for pipeline reviews, handoffs, and forecasting rituals."
      />
    </div>
  );
}
