import { useStore } from "@/lib/store";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const NICHES = [
  { id: 'tech', label: 'Technology', emoji: '💻', color: 'bg-blue-100 text-blue-700' },
  { id: 'design', label: 'Design', emoji: '🎨', color: 'bg-purple-100 text-purple-700' },
  { id: 'marketing', label: 'Marketing', emoji: '📈', color: 'bg-green-100 text-green-700' },
  { id: 'writing', label: 'Writing', emoji: '✍️', color: 'bg-amber-100 text-amber-700' },
  { id: 'crypto', label: 'Web3 / Crypto', emoji: '🔗', color: 'bg-indigo-100 text-indigo-700' },
  { id: 'fitness', label: 'Fitness', emoji: '💪', color: 'bg-rose-100 text-rose-700' },
];

export default function NicheSelect() {
  const { selectNiche, user } = useStore();
  const [, setLocation] = useLocation();

  const handleSelect = (nicheId: string) => {
    selectNiche(nicheId);
    setTimeout(() => setLocation("/feed"), 400); // Small delay for animation
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-3">Choose your Niche</h1>
        <p className="text-muted-foreground text-lg">
          We'll curate posts and creators based on your selection.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {NICHES.map((niche, i) => (
          <motion.button
            key={niche.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => handleSelect(niche.id)}
            className={cn(
              "h-48 rounded-2xl border-2 border-transparent flex flex-col items-center justify-center gap-4 transition-all hover:scale-[1.02] active:scale-[0.98]",
              "bg-card shadow-sm hover:shadow-md hover:border-primary/20",
              user?.selectedNiche === niche.id && "ring-2 ring-primary border-primary"
            )}
          >
            <div className={cn("h-16 w-16 rounded-full flex items-center justify-center text-3xl", niche.color)}>
              {niche.emoji}
            </div>
            <span className="font-semibold text-lg">{niche.label}</span>
          </motion.button>
        ))}
      </div>

      {user?.selectedNiche && (
        <div className="fixed bottom-8 left-0 right-0 p-4 flex justify-center">
          <Button onClick={() => setLocation("/feed")} size="lg" className="rounded-full shadow-lg px-8">
            Continue to Feed
          </Button>
        </div>
      )}
    </div>
  );
}
