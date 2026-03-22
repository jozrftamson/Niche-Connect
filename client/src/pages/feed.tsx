import { type Post, useStore } from "@/lib/store";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Heart, X, Copy, Send, Wand2 } from "lucide-react";
import { toast, useToast } from "@/hooks/use-toast";
import { text } from "express";
import { string } from "zod";

type SortOption = "newest" | "most-engagement";
type TimeRange = "all" | "24h" | "7d" | "30d";

interface FeedFilters {
  niche: string;
  sort: SortOption;
  range: TimeRange;
  account: string;
  hashtag: string;
}

 {
      interface AgentSearchItem {
        id: string;
        label: string;
      }

      interface CommentEditorProps {
        post: Post;
        onCancel: () => void;
        onPost: () => void;
        templates: AgentSearchItem[];
        currentDraft: string;
        setDraft: (draft: string) => void;
        onGenerate: (templateId: string) => void;
        onCopy: () => void;
      }
      {
        id: string;
        label: string;
      }
      interface AgentSearchItem {
        id: string;
        label: string;
      }

      interface CommentEditorProps {
        post: Post;
        onCancel: () => void;
        onPost: () => void;
        templates: AgentSearchItem[];
        currentDraft: string;
        setDraft: (draft: string) => void;
        onGenerate: (templateId: string) => void;
        onCopy: () => void;
      }
      return (
        <>
          <div className="max-w-md mx-auto mt-10 space-y-4">
            {/* ...existing code... */}
          </div>
          <RoadmapSection />
        </>
      );
    }

    return (
      <>
        <div className="h-[calc(100vh-140px)] flex flex-col max-w-md mx-auto relative space-y-3">
          {/* ...existing Feed layout... */}
        </div>
        <RoadmapSection />
      </>
    );
  }
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
