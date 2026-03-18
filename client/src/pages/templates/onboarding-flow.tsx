import { Layers3 } from "lucide-react";
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
  { label: "Step Completion", value: "82%", detail: "Users completing first 3 steps" },
  { label: "Time to Value", value: "11m", detail: "Median first success moment" },
  { label: "Drop-off", value: "9%", detail: "Largest drop at integration step" },
];

const features: TemplateFeature[] = [
  {
    title: "Progress Header",
    description: "Clear step progress and confidence messaging to reduce abandonment.",
  },
  {
    title: "Guided Checklist",
    description: "Actionable setup tasks with instant validation and completion feedback.",
  },
  {
    title: "Contextual Help",
    description: "Inline tips and examples that appear exactly when users need support.",
  },
  {
    title: "Activation Trigger",
    description: "High-clarity CTA that leads users into their first real workflow moment.",
  },
];

const journey = [
  "Map first-run experience to one primary activation goal.",
  "Design concise steps with one action per screen zone.",
  "Add inline guidance and contextual error states.",
  "Instrument completion and drop-off analytics for iteration.",
];

export default function OnboardingFlowTemplatePage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-16 pt-6 md:px-6 md:pt-10">
      <TemplateHero
        badge="Template / Product"
        title="Onboarding Flow Template"
        description="A modern activation-first onboarding structure that teams commonly use in Figma for SaaS and platform products."
      />

      <TemplateStatGrid stats={stats} />

      <TemplateFeatureGrid title="Onboarding Blocks" icon={Layers3} features={features} />

      <TemplateJourney title="Implementation Flow" steps={journey} />

      <TemplateCta
        title="Increase activation without adding complexity"
        description="Use this template to reduce friction and make the first product value moment predictable."
      />
    </div>
  );
}
