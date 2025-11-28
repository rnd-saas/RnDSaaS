import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "@/components/backButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { socialService } from "@/lib/api";
import { toast } from "sonner";
import { Send, Loader2, Sparkles, TrendingUp } from "lucide-react";

const MAX_LENGTH = 280;

export default function SocialCreatePostPage() {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Auto-focus textarea on mount
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = async () => {
    const trimmed = content.trim();
    
    if (!trimmed) {
      toast.error("Post cannot be empty", {
        description: "Please write something before posting.",
      });
      return;
    }

    if (trimmed.length > MAX_LENGTH) {
      toast.error("Post too long", {
        description: `Keep your post under ${MAX_LENGTH} characters.`,
      });
      return;
    }

    setIsPosting(true);
    try {
      await socialService.createPost(trimmed);
      toast.success("Post published!", {
        description: "Your post has been shared with your friends.",
      });
      navigate("/social", { replace: true });
    } catch (error: any) {
      console.error("Failed to create post:", error);
      toast.error("Failed to publish post", {
        description: error?.message || "Please try again later.",
      });
    } finally {
      setIsPosting(false);
    }
  };

  const remainingChars = MAX_LENGTH - content.length;
  const isOverLimit = content.length > MAX_LENGTH;
  const isNearLimit = remainingChars < 20 && !isOverLimit;
  const hasContent = content.trim().length > 0;

  return (
    <div className="w-full max-w-md min-h-[75vh] flex flex-col mx-auto px-4 py-3 space-y-4 pb-20">
      {/* Header */}
      <header className="flex items-start gap-3">
        <BackButton />
        <div className="flex-1 min-w-0">
          <h1 className="!text-[20px] font-semibold tracking-tight">Create Post</h1>
          <p className="text-xs text-muted-foreground mt-2">
            Share your workout progress with friends
          </p>
        </div>
      </header>

      <Separator className="my-2" />

      {/* Post Composer */}
      <Card className="bg-gradient-to-br from-background to-muted/20 shadow-lg border-2 border-border/50 !py-3">
        <CardHeader className="pb-0.5 !px-4">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-amber-400/20 to-amber-600/20 shrink-0">
              <Sparkles className="h-4 w-4 text-amber-600" />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-base">What's on your mind?</CardTitle>
              <p className="text-xs text-muted-foreground mt-2">
                Share your achievements, progress, or motivation
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 !px-4">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="How was your workout today? Share your progress, achievements, or motivation..."
              className={`min-h-[140px] w-full resize-none rounded-xl border-2 bg-background/50 px-3 py-2.5 text-sm transition-all duration-200 ${
                isOverLimit
                  ? "border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                  : isNearLimit
                  ? "border-amber-500/50 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  : "border-border/50 focus:border-foreground/30 focus:ring-2 focus:ring-foreground/10"
              } focus:outline-none placeholder:text-muted-foreground/60`}
              maxLength={MAX_LENGTH + 50}
              disabled={isPosting}
            />
            {hasContent && !isOverLimit && (
              <div className="absolute bottom-3 right-3 flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3" />
                <span>Ready to share</span>
              </div>
            )}
          </div>

          {/* Character counter with progress bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Character count</span>
              <span
                className={`font-medium transition-colors ${
                  isOverLimit
                    ? "text-red-500"
                    : isNearLimit
                    ? "text-amber-600"
                    : "text-muted-foreground"
                }`}
              >
                {content.length}/{MAX_LENGTH}
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  isOverLimit
                    ? "bg-red-500"
                    : isNearLimit
                    ? "bg-amber-500"
                    : "bg-gradient-to-r from-amber-400 to-amber-600"
                }`}
                style={{
                  width: `${Math.min((content.length / MAX_LENGTH) * 100, 100)}%`,
                }}
              />
            </div>
            {isOverLimit && (
              <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                <span>⚠️</span>
                <span>Please reduce by {content.length - MAX_LENGTH} characters</span>
              </p>
            )}
            {isNearLimit && !isOverLimit && (
              <p className="text-xs text-amber-600">
                {remainingChars} characters remaining
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/social")}
              disabled={isPosting}
              className="flex-1 rounded-xl text-sm"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isPosting || !hasContent || isOverLimit}
              className="flex-1 rounded-xl gap-2 text-sm"
            >
              {isPosting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Publish
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tips card */}
      <Card className="bg-muted/40 border-dashed !py-3">
        <CardContent className="pt-3 text-left !px-4">
          <div className="space-y-2 text-sm text-muted-foreground text-left">
            <p className="font-medium text-foreground mb-2 text-left">💡 Post ideas:</p>
            <ul className="list-disc list-inside space-y-1 text-left">
              <li className="text-left">Share your workout achievements</li>
              <li className="text-left">Motivate your friends</li>
              <li className="text-left">Ask for workout tips</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

