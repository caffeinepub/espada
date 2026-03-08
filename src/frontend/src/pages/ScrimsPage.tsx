import type { ScrimView } from "@/backend.d";
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
  useCreateScrim,
  useSignUpForScrim,
  useUpcomingScrims,
} from "@/hooks/useQueries";
import {
  Calendar,
  Loader2,
  Monitor,
  Plus,
  Search,
  Swords,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const SKILL_LEVELS = ["All", "Bronze", "Silver", "Gold", "Diamond", "Pro"];
const PLATFORMS = ["PC", "Console", "Mobile", "Cross-Platform"];

const SAMPLE_SCRIMS: ScrimView[] = [
  {
    scrimId: BigInt(1),
    title: "Valorant Diamond Showdown",
    game: "Valorant",
    scheduledAt: BigInt(Date.now() + 3600000),
    teamSize: BigInt(5),
    skillLevel: "Diamond",
    platform: "PC",
    description:
      "Competitive Valorant scrim for Diamond+ players. Best of 3 maps.",
    participants: [],
    createdBy: { toText: () => "anon" } as never,
  },
  {
    scrimId: BigInt(2),
    title: "CS2 Pro-Am Practice",
    game: "CS2",
    scheduledAt: BigInt(Date.now() + 7200000),
    teamSize: BigInt(5),
    skillLevel: "Pro",
    platform: "PC",
    description: "Professional CS2 scrimmage. FACEIT level 9+ required.",
    participants: new Array(4).fill({ toText: () => "anon" } as never),
    createdBy: { toText: () => "anon" } as never,
  },
  {
    scrimId: BigInt(3),
    title: "Apex Legends Ranked Grind",
    game: "Apex Legends",
    scheduledAt: BigInt(Date.now() + 10800000),
    teamSize: BigInt(3),
    skillLevel: "Gold",
    platform: "PC",
    description: "Gold-ranked Apex scrims. Focus on movement and positioning.",
    participants: new Array(3).fill({ toText: () => "anon" } as never),
    createdBy: { toText: () => "anon" } as never,
  },
  {
    scrimId: BigInt(4),
    title: "Fortnite Build Battle",
    game: "Fortnite",
    scheduledAt: BigInt(Date.now() + 14400000),
    teamSize: BigInt(4),
    skillLevel: "Silver",
    platform: "Cross-Platform",
    description: "Friendly Fortnite duos/squads scrim. All platforms welcome.",
    participants: new Array(6).fill({ toText: () => "anon" } as never),
    createdBy: { toText: () => "anon" } as never,
  },
  {
    scrimId: BigInt(5),
    title: "League of Legends Clash",
    game: "League of Legends",
    scheduledAt: BigInt(Date.now() + 18000000),
    teamSize: BigInt(5),
    skillLevel: "Bronze",
    platform: "PC",
    description:
      "Beginner-friendly LoL scrim. Focus on macro play and rotations.",
    participants: new Array(2).fill({ toText: () => "anon" } as never),
    createdBy: { toText: () => "anon" } as never,
  },
  {
    scrimId: BigInt(6),
    title: "PUBG Squad Tactics",
    game: "PUBG",
    scheduledAt: BigInt(Date.now() + 21600000),
    teamSize: BigInt(4),
    skillLevel: "Gold",
    platform: "PC",
    description:
      "PUBG squad scrims focused on communication and zone strategy.",
    participants: new Array(8).fill({ toText: () => "anon" } as never),
    createdBy: { toText: () => "anon" } as never,
  },
];

const SKILL_COLORS: Record<string, string> = {
  Bronze:
    "text-[oklch(0.65_0.15_50)] bg-[oklch(0.65_0.15_50/0.1)] border-[oklch(0.65_0.15_50/0.3)]",
  Silver:
    "text-[oklch(0.75_0.05_265)] bg-[oklch(0.75_0.05_265/0.1)] border-[oklch(0.75_0.05_265/0.3)]",
  Gold: "text-[oklch(0.78_0.18_65)] bg-[oklch(0.78_0.18_65/0.1)] border-[oklch(0.78_0.18_65/0.3)]",
  Diamond:
    "text-[oklch(0.7_0.22_255)] bg-[oklch(0.7_0.22_255/0.1)] border-[oklch(0.7_0.22_255/0.3)]",
  Pro: "text-[oklch(0.65_0.22_300)] bg-[oklch(0.65_0.22_300/0.1)] border-[oklch(0.65_0.22_300/0.3)]",
};

function ScrimCard({
  scrim,
  index,
  isLoggedIn,
}: { scrim: ScrimView; index: number; isLoggedIn: boolean }) {
  const signUp = useSignUpForScrim();
  const date = new Date(Number(scrim.scheduledAt));
  const dateStr = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const skillColor =
    SKILL_COLORS[scrim.skillLevel] ??
    "text-muted-foreground bg-muted border-border";
  const isFull = scrim.participants.length >= Number(scrim.teamSize) * 2;

  const handleSignUp = async () => {
    try {
      await signUp.mutateAsync(scrim.scrimId);
      toast.success("Signed up for scrim!");
    } catch {
      toast.error("Failed to sign up. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index }}
      data-ocid={`scrims.item.${index + 1}`}
      className="glass-card rounded-xl p-5 border border-[oklch(0.3_0.06_265/0.3)] hover:border-primary/40 hover:neon-glow-blue transition-all duration-300 flex flex-col gap-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-foreground text-lg leading-tight truncate">
            {scrim.title}
          </h3>
          <span className="text-sm text-primary font-mono">{scrim.game}</span>
        </div>
        <span
          className={`text-xs px-2.5 py-1 rounded-full border font-display font-semibold shrink-0 ${skillColor}`}
        >
          {scrim.skillLevel}
        </span>
      </div>

      <p className="text-sm text-muted-foreground line-clamp-2">
        {scrim.description}
      </p>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Calendar className="w-3.5 h-3.5 text-primary/60" />
          <div>
            <div className="text-foreground/80">{dateStr}</div>
            <div>{timeStr}</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Users className="w-3.5 h-3.5 text-primary/60" />
          <div>
            <div className="text-foreground/80">
              {scrim.participants.length}/{Number(scrim.teamSize) * 2}
            </div>
            <div>Players</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Monitor className="w-3.5 h-3.5 text-primary/60" />
          <span>{scrim.platform}</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Users className="w-3.5 h-3.5 text-primary/60" />
          <span>
            {Number(scrim.teamSize)}v{Number(scrim.teamSize)}
          </span>
        </div>
      </div>

      {isLoggedIn && (
        <Button
          size="sm"
          onClick={handleSignUp}
          disabled={signUp.isPending || isFull}
          data-ocid={`scrims.signup.button.${index + 1}`}
          className={`w-full font-display font-semibold ${
            isFull
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "bg-primary/10 text-primary border border-primary/30 hover:bg-primary hover:text-primary-foreground neon-glow-blue"
          }`}
          variant="ghost"
        >
          {signUp.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
              Joining...
            </>
          ) : isFull ? (
            "Full"
          ) : (
            <>
              <Swords className="w-4 h-4 mr-1.5" />
              Sign Up
            </>
          )}
        </Button>
      )}
    </motion.div>
  );
}

function CreateScrimModal() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    game: "",
    scheduledAt: "",
    teamSize: "5",
    skillLevel: "Gold",
    platform: "PC",
    description: "",
  });
  const createScrim = useCreateScrim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const scheduledMs = new Date(form.scheduledAt).getTime();
      await createScrim.mutateAsync({
        title: form.title,
        game: form.game,
        scheduledAt: BigInt(scheduledMs),
        teamSize: BigInt(form.teamSize),
        skillLevel: form.skillLevel,
        platform: form.platform,
        description: form.description,
      });
      toast.success("Scrim created successfully!");
      setOpen(false);
      setForm({
        title: "",
        game: "",
        scheduledAt: "",
        teamSize: "5",
        skillLevel: "Gold",
        platform: "PC",
        description: "",
      });
    } catch {
      toast.error("Failed to create scrim. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          data-ocid="scrims.create.open_modal_button"
          className="bg-primary text-primary-foreground neon-glow-blue font-display font-bold"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Scrim
        </Button>
      </DialogTrigger>
      <DialogContent
        data-ocid="scrims.create.dialog"
        className="glass-card border-[oklch(0.4_0.1_265/0.4)] max-w-lg"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-xl gradient-text">
            Create New Scrim
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="scrim-title">Title</Label>
            <Input
              id="scrim-title"
              data-ocid="scrims.create.title.input"
              placeholder="e.g. Diamond Valorant Scrim"
              value={form.title}
              onChange={(e) =>
                setForm((p) => ({ ...p, title: e.target.value }))
              }
              required
              className="bg-[oklch(0.12_0.02_265)] border-[oklch(0.3_0.06_265/0.5)]"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="scrim-game">Game</Label>
            <Input
              id="scrim-game"
              data-ocid="scrims.create.game.input"
              placeholder="e.g. Valorant, CS2, Apex Legends"
              value={form.game}
              onChange={(e) => setForm((p) => ({ ...p, game: e.target.value }))}
              required
              className="bg-[oklch(0.12_0.02_265)] border-[oklch(0.3_0.06_265/0.5)]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="scrim-datetime">Date & Time</Label>
              <Input
                id="scrim-datetime"
                type="datetime-local"
                data-ocid="scrims.create.datetime.input"
                value={form.scheduledAt}
                onChange={(e) =>
                  setForm((p) => ({ ...p, scheduledAt: e.target.value }))
                }
                required
                className="bg-[oklch(0.12_0.02_265)] border-[oklch(0.3_0.06_265/0.5)]"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="scrim-teamsize">Team Size</Label>
              <Input
                id="scrim-teamsize"
                type="number"
                min="1"
                max="10"
                data-ocid="scrims.create.teamsize.input"
                value={form.teamSize}
                onChange={(e) =>
                  setForm((p) => ({ ...p, teamSize: e.target.value }))
                }
                required
                className="bg-[oklch(0.12_0.02_265)] border-[oklch(0.3_0.06_265/0.5)]"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Skill Level</Label>
              <Select
                value={form.skillLevel}
                onValueChange={(v) => setForm((p) => ({ ...p, skillLevel: v }))}
              >
                <SelectTrigger
                  data-ocid="scrims.create.skill.select"
                  className="bg-[oklch(0.12_0.02_265)] border-[oklch(0.3_0.06_265/0.5)]"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SKILL_LEVELS.filter((s) => s !== "All").map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Platform</Label>
              <Select
                value={form.platform}
                onValueChange={(v) => setForm((p) => ({ ...p, platform: v }))}
              >
                <SelectTrigger
                  data-ocid="scrims.create.platform.select"
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
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="scrim-desc">Description</Label>
            <Textarea
              id="scrim-desc"
              data-ocid="scrims.create.description.textarea"
              placeholder="Describe requirements, rules, or goals for this scrim..."
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
              data-ocid="scrims.create.cancel.button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createScrim.isPending}
              data-ocid="scrims.create.submit.button"
              className="bg-primary text-primary-foreground neon-glow-blue font-display font-bold"
            >
              {createScrim.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Scrim"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function ScrimsPage() {
  const { identity } = useInternetIdentity();
  const { data: scrims, isLoading } = useUpcomingScrims();
  const [gameFilter, setGameFilter] = useState("");
  const [skillFilter, setSkillFilter] = useState("All");

  const isLoggedIn = !!identity;
  const displayScrims = scrims?.length ? scrims : SAMPLE_SCRIMS;

  const filtered = displayScrims.filter((s) => {
    const matchGame =
      gameFilter === "" ||
      s.game.toLowerCase().includes(gameFilter.toLowerCase());
    const matchSkill = skillFilter === "All" || s.skillLevel === skillFilter;
    return matchGame && matchSkill;
  });

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="font-display font-bold text-4xl gradient-text mb-2">
            Daily Scrims
          </h1>
          <p className="text-muted-foreground">
            Find your next competitive match
          </p>
        </div>
        {isLoggedIn && <CreateScrimModal />}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 glass-card rounded-xl border border-[oklch(0.3_0.06_265/0.3)]">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            data-ocid="scrims.game.search_input"
            placeholder="Filter by game..."
            value={gameFilter}
            onChange={(e) => setGameFilter(e.target.value)}
            className="pl-9 bg-[oklch(0.12_0.02_265)] border-[oklch(0.3_0.06_265/0.5)]"
          />
        </div>
        <Select value={skillFilter} onValueChange={setSkillFilter}>
          <SelectTrigger
            data-ocid="scrims.skill.select"
            className="w-full sm:w-44 bg-[oklch(0.12_0.02_265)] border-[oklch(0.3_0.06_265/0.5)]"
          >
            <SelectValue placeholder="Skill Level" />
          </SelectTrigger>
          <SelectContent>
            {SKILL_LEVELS.map((s) => (
              <SelectItem key={s} value={s}>
                {s === "All" ? "All Skill Levels" : s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          data-ocid="scrims.loading_state"
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div data-ocid="scrims.empty_state" className="text-center py-20">
          <Swords className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
          <h3 className="font-display font-bold text-xl text-muted-foreground mb-2">
            No Scrims Found
          </h3>
          <p className="text-muted-foreground/60">
            Try adjusting your filters or create a new scrim.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((scrim, i) => (
            <ScrimCard
              key={String(scrim.scrimId)}
              scrim={scrim}
              index={i}
              isLoggedIn={isLoggedIn}
            />
          ))}
        </div>
      )}
    </div>
  );
}
