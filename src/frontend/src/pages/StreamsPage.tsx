import type { Stream } from "@/backend.d";
import { EspadaBadge } from "@/components/EspadaBadge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  useAllStreams,
  usePostStream,
  useRemoveStream,
} from "@/hooks/useQueries";
import {
  ExternalLink,
  Eye,
  Loader2,
  Plus,
  Radio,
  Search,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const PLATFORMS = ["Twitch", "YouTube", "Kick", "Facebook Gaming", "Other"];

const SAMPLE_STREAMS: Stream[] = [
  {
    streamId: BigInt(1),
    title: "Late Night Valorant Ranked — Immortal Grind",
    streamerName: "ProFragger_X",
    game: "Valorant",
    platform: "Twitch",
    streamUrl: "https://twitch.tv",
    description: "Grinding to Radiant. Come watch and learn Sage setups!",
    viewerCount: BigInt(2847),
    createdBy: { toText: () => "anon" } as never,
  },
  {
    streamId: BigInt(2),
    title: "CS2 Major Qualifier Analysis",
    streamerName: "TacticalPro_GG",
    game: "CS2",
    platform: "YouTube",
    streamUrl: "https://youtube.com",
    description:
      "Breaking down pro matches and discussing meta strategies for CS2.",
    viewerCount: BigInt(1204),
    createdBy: { toText: () => "anon" } as never,
  },
  {
    streamId: BigInt(3),
    title: "Apex Legends Predator — 20 Kill Attempts",
    streamerName: "BarrelRoll99",
    game: "Apex Legends",
    platform: "Twitch",
    streamUrl: "https://twitch.tv",
    description:
      "Pushing for 20 bomb badge on Wraith. High IQ movement content.",
    viewerCount: BigInt(567),
    createdBy: { toText: () => "anon" } as never,
  },
  {
    streamId: BigInt(4),
    title: "League of Legends Challenger Road",
    streamerName: "MidLane_Master",
    game: "League of Legends",
    platform: "Kick",
    streamUrl: "https://kick.com",
    description: "Challenger support main teaching macro and vision control.",
    viewerCount: BigInt(432),
    createdBy: { toText: () => "anon" } as never,
  },
  {
    streamId: BigInt(5),
    title: "Fortnite Zero Build Champions",
    streamerName: "StormChasePro",
    game: "Fortnite",
    platform: "YouTube",
    streamUrl: "https://youtube.com",
    description: "Zero build competitive gameplay with pro tips.",
    viewerCount: BigInt(891),
    createdBy: { toText: () => "anon" } as never,
  },
  {
    streamId: BigInt(6),
    title: "PUBG Conqueror Squad Games",
    streamerName: "ZoneControl",
    game: "PUBG",
    platform: "Facebook Gaming",
    streamUrl: "https://facebook.com/gaming",
    description: "Conqueror-tier PUBG with full squad comms.",
    viewerCount: BigInt(223),
    createdBy: { toText: () => "anon" } as never,
  },
];

const PLATFORM_COLORS: Record<string, string> = {
  Twitch: "text-[oklch(0.65_0.22_300)] bg-[oklch(0.65_0.22_300/0.1)]",
  YouTube: "text-[oklch(0.63_0.26_25)] bg-[oklch(0.63_0.26_25/0.1)]",
  Kick: "text-[oklch(0.7_0.2_160)] bg-[oklch(0.7_0.2_160/0.1)]",
  "Facebook Gaming":
    "text-[oklch(0.65_0.18_255)] bg-[oklch(0.65_0.18_255/0.1)]",
  Other: "text-muted-foreground bg-muted/30",
};

function StreamCard({
  stream,
  index,
  isOwner,
}: {
  stream: Stream;
  index: number;
  isOwner: boolean;
}) {
  const remove = useRemoveStream();
  const platformColor =
    PLATFORM_COLORS[stream.platform] ?? "text-muted-foreground bg-muted/30";

  const handleRemove = async () => {
    try {
      await remove.mutateAsync(stream.streamId);
      toast.success("Stream removed.");
    } catch {
      toast.error("Failed to remove stream.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index }}
      data-ocid={`streams.item.${index + 1}`}
      className="glass-card rounded-xl p-5 border border-[oklch(0.3_0.06_265/0.3)] hover:border-accent/40 hover:neon-glow-purple transition-all duration-300 flex flex-col gap-4"
    >
      {/* Live indicator */}
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 text-xs font-mono font-semibold text-[oklch(0.7_0.22_25)]">
          <span className="w-2 h-2 rounded-full bg-[oklch(0.7_0.22_25)] animate-pulse-glow" />
          LIVE
        </span>
        <span
          className={`ml-auto text-xs px-2 py-0.5 rounded-full font-display font-medium ${platformColor}`}
        >
          {stream.platform}
        </span>
      </div>

      <div>
        <h3 className="font-display font-bold text-foreground text-base leading-tight line-clamp-2 mb-1">
          {stream.title}
        </h3>
        <div className="flex items-center gap-1.5">
          <p className="text-sm text-muted-foreground">{stream.streamerName}</p>
          {/* All streamers get the pro creator badge — they are content creators */}
          <EspadaBadge type="pro-creator" size={18} />
        </div>
      </div>

      <p className="text-xs text-muted-foreground line-clamp-2 flex-1">
        {stream.description}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs text-accent font-mono">{stream.game}</span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Eye className="w-3 h-3" />
            {Number(stream.viewerCount).toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isOwner && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  data-ocid={`streams.delete.button.${index + 1}`}
                  className="text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent
                data-ocid="streams.delete.dialog"
                className="glass-card border-destructive/30"
              >
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-display">
                    Remove Stream?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove &quot;{stream.title}&quot; from the live
                    streams list.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel data-ocid="streams.delete.cancel.button">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleRemove}
                    data-ocid="streams.delete.confirm.button"
                    className="bg-destructive text-destructive-foreground"
                  >
                    {remove.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Remove"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <a
            href={stream.streamUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-ocid={`streams.watch.link.${index + 1}`}
          >
            <Button
              size="sm"
              variant="ghost"
              className="text-accent hover:bg-accent/10 h-8 px-3 text-xs font-display font-semibold"
            >
              Watch <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          </a>
        </div>
      </div>
    </motion.div>
  );
}

function PostStreamModal() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    streamerName: "",
    game: "",
    platform: "Twitch",
    streamUrl: "",
    description: "",
    viewerCount: "0",
  });
  const postStream = usePostStream();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await postStream.mutateAsync({
        title: form.title,
        streamerName: form.streamerName,
        game: form.game,
        platform: form.platform,
        streamUrl: form.streamUrl,
        description: form.description,
        viewerCount: BigInt(form.viewerCount || "0"),
      });
      toast.success("Stream posted successfully!");
      setOpen(false);
      setForm({
        title: "",
        streamerName: "",
        game: "",
        platform: "Twitch",
        streamUrl: "",
        description: "",
        viewerCount: "0",
      });
    } catch {
      toast.error("Failed to post stream. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          data-ocid="streams.post.open_modal_button"
          className="bg-accent text-accent-foreground neon-glow-purple font-display font-bold"
        >
          <Plus className="w-4 h-4 mr-2" />
          Post a Stream
        </Button>
      </DialogTrigger>
      <DialogContent
        data-ocid="streams.post.dialog"
        className="glass-card border-[oklch(0.4_0.1_265/0.4)] max-w-lg"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-xl gradient-text">
            Post Your Stream
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Stream Title</Label>
            <Input
              data-ocid="streams.post.title.input"
              placeholder="e.g. Valorant Ranked Grind — Immortal Push"
              value={form.title}
              onChange={(e) =>
                setForm((p) => ({ ...p, title: e.target.value }))
              }
              required
              className="bg-[oklch(0.12_0.02_265)] border-[oklch(0.3_0.06_265/0.5)]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Your Name / Channel</Label>
              <Input
                data-ocid="streams.post.streamer.input"
                placeholder="e.g. ProFragger_X"
                value={form.streamerName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, streamerName: e.target.value }))
                }
                required
                className="bg-[oklch(0.12_0.02_265)] border-[oklch(0.3_0.06_265/0.5)]"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Game</Label>
              <Input
                data-ocid="streams.post.game.input"
                placeholder="e.g. Valorant"
                value={form.game}
                onChange={(e) =>
                  setForm((p) => ({ ...p, game: e.target.value }))
                }
                required
                className="bg-[oklch(0.12_0.02_265)] border-[oklch(0.3_0.06_265/0.5)]"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Platform</Label>
              <Select
                value={form.platform}
                onValueChange={(v) => setForm((p) => ({ ...p, platform: v }))}
              >
                <SelectTrigger
                  data-ocid="streams.post.platform.select"
                  className="bg-[oklch(0.12_0.02_265)] border-[oklch(0.3_0.06_265/0.5)]"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORMS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Viewer Count</Label>
              <Input
                type="number"
                min="0"
                data-ocid="streams.post.viewers.input"
                value={form.viewerCount}
                onChange={(e) =>
                  setForm((p) => ({ ...p, viewerCount: e.target.value }))
                }
                className="bg-[oklch(0.12_0.02_265)] border-[oklch(0.3_0.06_265/0.5)]"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Stream URL</Label>
            <Input
              type="url"
              data-ocid="streams.post.url.input"
              placeholder="https://twitch.tv/yourchannel"
              value={form.streamUrl}
              onChange={(e) =>
                setForm((p) => ({ ...p, streamUrl: e.target.value }))
              }
              required
              className="bg-[oklch(0.12_0.02_265)] border-[oklch(0.3_0.06_265/0.5)]"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea
              data-ocid="streams.post.description.textarea"
              placeholder="What are you streaming? Any special content today?"
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              rows={3}
              className="bg-[oklch(0.12_0.02_265)] border-[oklch(0.3_0.06_265/0.5)] resize-none"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              data-ocid="streams.post.cancel.button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={postStream.isPending}
              data-ocid="streams.post.submit.button"
              className="bg-accent text-accent-foreground neon-glow-purple font-display font-bold"
            >
              {postStream.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                  Posting...
                </>
              ) : (
                "Post Stream"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function StreamsPage() {
  const { identity } = useInternetIdentity();
  const { data: streams, isLoading } = useAllStreams();
  const [gameFilter, setGameFilter] = useState("");

  const isLoggedIn = !!identity;
  const principalStr = identity?.getPrincipal().toString();
  const displayStreams = streams?.length ? streams : SAMPLE_STREAMS;

  const filtered = displayStreams.filter(
    (s) =>
      gameFilter === "" ||
      s.game.toLowerCase().includes(gameFilter.toLowerCase()),
  );

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="font-display font-bold text-4xl gradient-text mb-2">
            Live Streams
          </h1>
          <p className="text-muted-foreground">
            Watch the best eSports content creators
          </p>
        </div>
        {isLoggedIn && <PostStreamModal />}
      </div>

      {/* Filter */}
      <div className="mb-8 p-4 glass-card rounded-xl border border-[oklch(0.3_0.06_265/0.3)]">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            data-ocid="streams.game.search_input"
            placeholder="Filter by game..."
            value={gameFilter}
            onChange={(e) => setGameFilter(e.target.value)}
            className="pl-9 bg-[oklch(0.12_0.02_265)] border-[oklch(0.3_0.06_265/0.5)]"
          />
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          data-ocid="streams.loading_state"
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-56 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div data-ocid="streams.empty_state" className="text-center py-20">
          <Radio className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
          <h3 className="font-display font-bold text-xl text-muted-foreground mb-2">
            No Streams Found
          </h3>
          <p className="text-muted-foreground/60">
            No streams match your filter. Be the first to go live!
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((stream, i) => (
            <StreamCard
              key={String(stream.streamId)}
              stream={stream}
              index={i}
              isOwner={
                !!principalStr && stream.createdBy.toText() === principalStr
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
