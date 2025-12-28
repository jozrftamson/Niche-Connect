import { useStore } from "@/lib/store";
import { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Heart, X, Copy, Send, RefreshCw, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Feed() {
  const { posts, currentIndex, nextPost, templates, addPoints, user } = useStore();
  const [commentMode, setCommentMode] = useState(false);
  const [currentDraft, setCurrentDraft] = useState("");
  const { toast } = useToast();

  const currentPost = posts[currentIndex];

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      // Like logic
      toast({ description: "Post saved to liked!" });
      setCommentMode(true); // Open comment mode immediately on like
    } else {
      nextPost();
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
    nextPost();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentDraft);
    toast({ description: "Copied to clipboard!" });
    addPoints(2); // Small reward for copying
  };

  if (!currentPost) return <div className="text-center mt-20">No more posts!</div>;

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col max-w-md mx-auto relative">
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
                      <p className="text-sm text-muted-foreground">{currentPost.creatorHandle} • {currentPost.timestamp}</p>
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
