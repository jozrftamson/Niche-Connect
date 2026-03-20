import { CheckCircle, Calendar, Rocket, Users, Shield } from "lucide-react";

const roadmap = [
  {
    title: "Design-Grundlagen",
    description: "Einheitliches Layout mit Tailwind und wiederverwendbaren Komponenten.",
    icon: Shield,
  },
  {
    title: "Landing Page",
    description: "Hero, Template-Showcase, Features-Block.",
    icon: Rocket,
  },
  {
    title: "Feed & Discovery",
    description: "Filterbarer Feed, Grid, Navigation.",
    icon: Users,
  },
  {
    title: "Templates",
    description: "Eigene Seite und Section, Details mit Demo.",
    icon: CheckCircle,
  },
  {
    title: "Testing & CI",
    description: "Smoke-Tests, GitHub Actions.",
    icon: Calendar,
  },
];

export function RoadmapSection() {
  return (
    <section className="w-full max-w-4xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-8 text-center">Roadmap</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roadmap.map((step, idx) => (
          <div key={idx} className="flex items-start gap-4 bg-card p-6 rounded-xl shadow-sm border">
            <step.icon className="h-8 w-8 text-primary" />
            <div>
              <div className="font-semibold text-lg mb-1">{step.title}</div>
              <div className="text-muted-foreground text-sm">{step.description}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
