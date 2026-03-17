import { type Post, useStore } from "@/lib/store";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Heart, X, Copy, Send, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type SortOption = "newest" | "most-engagement";
type TimeRange = "all" | "24h" | "7d" | "30d";

interface FeedFilters {
  niche: string;
  sort: SortOption;
  range: TimeRange;
  account: string;
  hashtag: string;
}

interface AgentSearchItem {
  id: string;
  platform: string;
  text: string;
  niche: string;
  engagementScore: number;
  createdAt: string;
  sourceAccount: string;
  hashtags: string[];
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function mapAgentRecordToPost(item: AgentSearchItem): Post {
  const platformMap: Record<string, Post["platform"]> = {
    twitter: "Twitter",
    linkedin: "LinkedIn",
    instagram: "Instagram",
  };

  const account = item.sourceAccount || "creator";
  const tags = item.hashtags.length ? item.hashtags : [item.niche];

  return {
    id: item.id,
    creatorName: account,
    creatorHandle: `@${account}`,
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(account)}`,
    content: item.text,
    tags,
    platform: platformMap[item.platform.toLowerCase()] ?? "Twitter",
    timestamp: item.createdAt,
    engagementScore: item.engagementScore,
  };
}

function parseFilterParams(): FeedFilters {
  const params = new URLSearchParams(window.location.search);
  const niche = params.get("niche") ?? "all";
  const sort = (params.get("sort") as SortOption) ?? "newest";
  const range = (params.get("range") as TimeRange) ?? "all";
  const account = params.get("account") ?? "";
  const hashtag = (params.get("hashtag") ?? "").replace(/^#/, "");

  return {
    niche,
    sort: sort === "most-engagement" ? "most-engagement" : "newest",
    range: ["all", "24h", "7d", "30d"].includes(range) ? (range as TimeRange) : "all",
    account,
    hashtag,
  };
}

function syncFilterParams(filters: FeedFilters) {
  const params = new URLSearchParams(window.location.search);

  if (filters.niche === "all") params.delete("niche");
  else params.set("niche", filters.niche);

  if (filters.sort === "newest") params.delete("sort");
  else params.set("sort", filters.sort);

  if (filters.range === "all") params.delete("range");
  else params.set("range", filters.range);

  if (!filters.account.trim()) params.delete("account");
  else params.set("account", filters.account.trim());

  if (!filters.hashtag.trim()) params.delete("hashtag");
  else params.set("hashtag", filters.hashtag.trim().replace(/^#/, ""));

  const query = params.toString();
  const target = `${window.location.pathname}${query ? `?${query}` : ""}`;
  window.history.replaceState({}, "", target);
}

function toMillis(timestamp: string) {
  const ms = Date.parse(timestamp);
  return Number.isNaN(ms) ? 0 : ms;
}

function withinRange(timestamp: string, range: TimeRange) {
  if (range === "all") return true;

  const postTime = toMillis(timestamp);
  if (!postTime) return false;

  const now = Date.now();
  const windows: Record<Exclude<TimeRange, "all">, number> = {
    "24h": 24 * 60 * 60 * 1000,
    "7d": 7 * 24 * 60 * 60 * 1000,
    "30d": 30 * 24 * 60 * 60 * 1000,
  };

  return now - postTime <= windows[range as Exclude<TimeRange, "all">];
}

function formatRelative(timestamp: string) {
  const ts = toMillis(timestamp);
  if (!ts) return timestamp;

  const delta = Math.max(Date.now() - ts, 0);
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (delta < hour) return `${Math.max(1, Math.floor(delta / minute))}m ago`;
  if (delta < day) return `${Math.floor(delta / hour)}h ago`;
  return `${Math.floor(delta / day)}d ago`;
}

export default function Feed() {
  const { posts, templates, addPoints } = useStore();
  const [filters, setFilters] = useState<FeedFilters>(parseFilterParams);
  const [agentPosts, setAgentPosts] = useState<Post[] | null>(null);
  const [agentLoading, setAgentLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [commentMode, setCommentMode] = useState(false);
  const [currentDraft, setCurrentDraft] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const needsAgentSearch = Boolean(filters.account.trim() || filters.hashtag.trim());
    if (!needsAgentSearch) {
      setAgentPosts(null);
      return;
    }

    const params = new URLSearchParams();
    if (filters.niche !== "all") params.set("niche", filters.niche);
    if (filters.account.trim()) params.set("account", filters.account.trim());
    if (filters.hashtag.trim()) params.set("hashtag", filters.hashtag.trim());
    params.set("range", filters.range);
    params.set("sort", filters.sort);
    params.set("limit", "100");

    setAgentLoading(true);
    fetch(`/api/agents/search?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load agent search results");
        return res.json();
      })
      .then((payload) => {
        const resultItems: AgentSearchItem[] = Array.isArray(payload?.results) ? payload.results : [];
        setAgentPosts(resultItems.map(mapAgentRecordToPost));
      })
      .catch(() => {
        setAgentPosts([]);
      })
      .finally(() => {
        setAgentLoading(false);
      });
  }, [filters.account, filters.hashtag, filters.niche, filters.range, filters.sort]);

  const sourcePosts = agentPosts ?? posts;

  const availableNiches = useMemo(() => {
    return Array.from(new Set(sourcePosts.flatMap((post) => post.tags))).sort();
  }, [sourcePosts]);

  const filteredPosts = useMemo(() => {
    const withIndex = sourcePosts.map((post, index) => ({ post, index }));

    const filtered = withIndex.filter(({ post }) => {
      const nicheMatch = filters.niche === "all" || post.tags.includes(filters.niche);
      const rangeMatch = withinRange(post.timestamp, filters.range);
      const accountMatch = !filters.account.trim() || normalize(post.creatorHandle).includes(normalize(filters.account));
      const hashtagMatch =
        !filters.hashtag.trim() ||
        post.tags.map(normalize).includes(normalize(filters.hashtag).replace(/^#/, ""));
      return nicheMatch && rangeMatch && accountMatch && hashtagMatch;
    });

    const sorted = filtered.sort((a, b) => {
      if (filters.sort === "most-engagement") {
        const byEngagement = b.post.engagementScore - a.post.engagementScore;
        if (byEngagement !== 0) return byEngagement;
      }

      const byTime = toMillis(b.post.timestamp) - toMillis(a.post.timestamp);
      if (byTime !== 0) return byTime;

      return a.index - b.index;
    });

    return sorted.map((entry) => entry.post);
  }, [sourcePosts, filters]);

  const currentPost = filteredPosts[currentIndex];

  useEffect(() => {
    syncFilterParams(filters);
  }, [filters]);

  useEffect(() => {
    setCommentMode(false);
    setCurrentDraft("");
    setCurrentIndex(0);
  }, [filters]);

  useEffect(() => {
    if (currentIndex >= filteredPosts.length) {
      setCurrentIndex(Math.max(filteredPosts.length - 1, 0));
    }
  }, [currentIndex, filteredPosts.length]);

  const moveToNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, filteredPosts.length));
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      // Like logic
      toast({ description: "Post saved to liked!" });
      setCommentMode(true); // Open comment mode immediately on like
    } else {
      moveToNext();
    }
  };

  const generateDraft = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    let text = template.content;
    text = text.replace('{creatorName}', currentPost.creatorName.split(' ')[0]);
    text = text.replace('{topic}', currentPost.tags[0] || 'content');

    setCurrentDraft(text);
  };

  const handlePostComment = () => {
    toast({
      title: "Comment Posted!",
      description: "You earned +10 Engagement Points.",
      variant: "default",
    });
    addPoints(10);
    setCommentMode(false);
    setCurrentDraft("");
    moveToNext();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentDraft);
    toast({ description: "Copied to clipboard!" });
    addPoints(2); // Small reward for copying
  };

  const hasActiveFilters =
    filters.niche !== "all" ||
    filters.sort !== "newest" ||
    filters.range !== "all" ||
    Boolean(filters.account.trim()) ||
    Boolean(filters.hashtag.trim());

  if (!currentPost) {
    return (
      <div className="max-w-md mx-auto mt-10 space-y-4">
        <Card className="p-5 space-y-4 border-dashed">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Feed Filters</h2>
            <p className="text-sm text-muted-foreground">Passe Nische, Zeitraum und Sortierung an. Die URL bleibt synchron und teilbar.</p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <select
              value={filters.niche}
              onChange={(e) => setFilters((prev) => ({ ...prev, niche: e.target.value }))}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="all">Alle Nischen</option>
              {availableNiches.map((niche) => (
                <option key={niche} value={niche}>{niche}</option>
              ))}
            </select>

            <select
              value={filters.range}
              onChange={(e) => setFilters((prev) => ({ ...prev, range: e.target.value as TimeRange }))}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="all">Alle Zeitraeume</option>
              <option value="24h">Letzte 24h</option>
              <option value="7d">Letzte 7 Tage</option>
              <option value="30d">Letzte 30 Tage</option>
            </select>

            <select
              value={filters.sort}
              onChange={(e) => setFilters((prev) => ({ ...prev, sort: e.target.value as SortOption }))}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="newest">Neueste zuerst</option>
              <option value="most-engagement">Meiste Engagements</option>
            </select>

            <input
              value={filters.account}
              onChange={(e) => setFilters((prev) => ({ ...prev, account: e.target.value }))}
              placeholder="Account (z. B. rauchg)"
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            />

            <input
              value={filters.hashtag}
              onChange={(e) => setFilters((prev) => ({ ...prev, hashtag: e.target.value.replace(/^#/, "") }))}
              placeholder="Hashtag (z. B. react)"
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            />
          </div>

          {agentLoading && <p className="text-xs text-muted-foreground">Agent-Suche laedt Ergebnisse...</p>}

          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={() => setFilters({ niche: "all", sort: "newest", range: "all", account: "", hashtag: "" })}
            >
              Filter zuruecksetzen
            </Button>
          )}
        </Card>

        <Card className="p-6 text-center">
          <p className="font-semibold">Keine Posts fuer diese Auswahl</p>
          <p className="text-sm text-muted-foreground mt-1">Versuche einen groesseren Zeitraum oder setze die Filter zurueck.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col max-w-md mx-auto relative space-y-3">
      <Card className="p-3">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <select
            value={filters.niche}
            onChange={(e) => setFilters((prev) => ({ ...prev, niche: e.target.value }))}
            className="h-9 rounded-md border border-input bg-background px-2 text-sm"
          >
            <option value="all">Alle Nischen</option>
            {availableNiches.map((niche) => (
              <option key={niche} value={niche}>{niche}</option>
            ))}
          </select>

          <select
            value={filters.range}
            onChange={(e) => setFilters((prev) => ({ ...prev, range: e.target.value as TimeRange }))}
            className="h-9 rounded-md border border-input bg-background px-2 text-sm"
          >
            <option value="all">Zeitraum: Alle</option>
            <option value="24h">Zeitraum: 24h</option>
            <option value="7d">Zeitraum: 7 Tage</option>
            <option value="30d">Zeitraum: 30 Tage</option>
          </select>

          <select
            value={filters.sort}
            onChange={(e) => setFilters((prev) => ({ ...prev, sort: e.target.value as SortOption }))}
            className="h-9 rounded-md border border-input bg-background px-2 text-sm"
          >
            <option value="newest">Sort: Neueste</option>
            <option value="most-engagement">Sort: Engagement</option>
          </select>
        </div>

        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <input
            value={filters.account}
            onChange={(e) => setFilters((prev) => ({ ...prev, account: e.target.value }))}
            placeholder="Account"
            className="h-9 rounded-md border border-input bg-background px-2 text-sm"
          />
          <input
            value={filters.hashtag}
            onChange={(e) => setFilters((prev) => ({ ...prev, hashtag: e.target.value.replace(/^#/, "") }))}
            placeholder="Hashtag"
            className="h-9 rounded-md border border-input bg-background px-2 text-sm"
          />
        </div>

        {agentLoading && <p className="mt-2 text-xs text-muted-foreground">Agent-Suche laedt Ergebnisse...</p>}

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-2"
            onClick={() => setFilters({ niche: "all", sort: "newest", range: "all", account: "", hashtag: "" })}
          >
            Reset Filter
          </Button>
        )}
      </Card>

      <div className="flex-1 relative perspective-1000">
        <AnimatePresence mode="wait">
          {!commentMode ? (
            <motion.div
              key={currentPost.id}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ x: -300, opacity: 0, rotate: -20 }}
              className="absolute inset-0 z-10"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => {
                if (info.offset.x > 100) handleSwipe('right');
                else if (info.offset.x < -100) handleSwipe('left');
              }}
            >
              <Card className="h-full flex flex-col overflow-hidden shadow-xl border-t-4 border-t-primary">
                <div className="p-6 flex-1 flex flex-col">
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar className="h-14 w-14 border-2 border-background shadow-sm">
                      <AvatarImage src={currentPost.avatar} />
                      <AvatarFallback>{currentPost.creatorName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-lg">{currentPost.creatorName}</h3>
                      <p className="text-sm text-muted-foreground">{currentPost.creatorHandle} • {formatRelative(currentPost.timestamp)}</p>
                    </div>
                    <Badge variant="outline" className="ml-auto">
                      {currentPost.platform}
                    </Badge>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <p className="text-xl leading-relaxed font-medium text-foreground/90">
                      {currentPost.content}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {currentPost.tags.map(tag => (
                        <span key={tag} className="text-sm text-primary bg-primary/10 px-2 py-1 rounded-md">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-3 text-xs text-muted-foreground">
                      Engagement: {currentPost.engagementScore}
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="p-4 bg-muted/30 grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-14 text-muted-foreground border-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
                    onClick={() => handleSwipe('left')}
                  >
                    <X size={24} />
                    <span className="ml-2">Skip</span>
                  </Button>
                  <Button
                    size="lg"
                    className="h-14 bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90"
                    onClick={() => handleSwipe('right')}
                  >
                    <Heart size={24} className="fill-current" />
                    <span className="ml-2">Engage</span>
                  </Button>
                </div>
              </Card>
            </motion.div>
          ) : (
            <CommentEditor
              post={currentPost}
              onCancel={() => setCommentMode(false)}
              onPost={handlePostComment}
              templates={templates}
              currentDraft={currentDraft}
              setDraft={setCurrentDraft}
              onGenerate={generateDraft}
              onCopy={handleCopy}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function CommentEditor({ post, onCancel, onPost, templates, currentDraft, setDraft, onGenerate, onCopy }: any) {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-full flex flex-col bg-card rounded-xl border shadow-xl overflow-hidden"
    >
      <div className="p-4 border-b flex items-center justify-between bg-muted/20">
        <h3 className="font-semibold flex items-center gap-2">
          <MessageSquare size={16} />
          Draft Reply
        </h3>
        <Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
      </div>

      <div className="p-4 flex-1 flex flex-col overflow-y-auto">
        {/* Template Selector */}
        <div className="mb-6">
          <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Quick Templates</p>
          <div className="flex flex-wrap gap-2">
            {templates.map((t: any) => (
              <button
                key={t.id}
                onClick={() => onGenerate(t.id)}
                className="text-xs border bg-background px-3 py-2 rounded-lg hover:border-primary hover:text-primary transition-colors flex items-center gap-1.5"
              >
                <Wand2 size={12} />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 relative">
          <Textarea
            value={currentDraft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Write a thoughtful comment..."
            className="h-full resize-none text-base p-4 bg-muted/10 border-muted focus:border-primary/50"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t bg-muted/20 space-y-3">
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onCopy}>
            <Copy size={16} className="mr-2" />
            Copy Text
          </Button>
          <Button className="flex-1" onClick={onPost} disabled={!currentDraft}>
            <Send size={16} className="mr-2" />
            Post Now
          </Button>
        </div>
        <p className="text-[10px] text-center text-muted-foreground">
          By posting, you confirm this is a manual action compliant with platform rules.
        </p>
      </div>
    </motion.div>
  );
}
