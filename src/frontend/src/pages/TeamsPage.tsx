import type { TeamView } from "@/backend.d";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  useAllTeams,
  useCreateTeam,
  useJoinTeam,
  useLeaveTeam,
} from "@/hooks/useQueries";
import {
  Loader2,
  Plus,
  Trophy,
  UserMinus,
  UserPlus,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const SAMPLE_TEAMS: TeamView[] = [
  {
    teamId: BigInt(1),
    name: "Neon Blades",
    game: "Valorant",
    members: new Array(5).fill({ toText: () => "anon" } as never),
    createdBy: { toText: () => "anon" } as never,
  },
  {
    teamId: BigInt(2),
    name: "Shadow Protocol",
    game: "CS2",
    members: new Array(4).fill({ toText: () => "anon" } as never),
    createdBy: { toText: () => "anon" } as never,
  },
  {
    teamId: BigInt(3),
    name: "Apex Predators",
    game: "Apex Legends",
    members: new Array(3).fill({ toText: () => "anon" } as never),
    createdBy: { toText: () => "anon" } as never,
  },
  {
    teamId: BigInt(4),
    name: "Mid Lane Gods",
    game: "League of Legends",
    members: new Array(5).fill({ toText: () => "anon" } as never),
    createdBy: { toText: () => "anon" } as never,
  },
  {
    teamId: BigInt(5),
    name: "Storm Riders",
    game: "Fortnite",
    members: new Array(2).fill({ toText: () => "anon" } as never),
    createdBy: { toText: () => "anon" } as never,
  },
  {
    teamId: BigInt(6),
    name: "Zone Masters",
    game: "PUBG",
    members: new Array(4).fill({ toText: () => "anon" } as never),
    createdBy: { toText: () => "anon" } as never,
  },
];

const GAME_GRADIENT: Record<string, string> = {
  Valorant: "from-[oklch(0.6_0.22_25/0.15)] to-transparent",
  CS2: "from-[oklch(0.65_0.18_50/0.15)] to-transparent",
  "Apex Legends": "from-[oklch(0.65_0.22_25/0.15)] to-transparent",
  "League of Legends": "from-[oklch(0.65_0.18_65/0.15)] to-transparent",
  Fortnite: "from-[oklch(0.65_0.22_255/0.15)] to-transparent",
  PUBG: "from-[oklch(0.65_0.18_160/0.15)] to-transparent",
};

function TeamCard({
  team,
  index,
  isLoggedIn,
  principalStr,
}: {
  team: TeamView;
  index: number;
  isLoggedIn: boolean;
  principalStr?: string;
}) {
  const joinTeam = useJoinTeam();
  const leaveTeam = useLeaveTeam();

  const isMember = principalStr
    ? team.members.some((m) => m.toText() === principalStr)
    : false;

  const gradient =
    GAME_GRADIENT[team.game] ??
    "from-[oklch(0.65_0.22_265/0.1)] to-transparent";

  const handleJoin = async () => {
    try {
      await joinTeam.mutateAsync(team.teamId);
      toast.success(`Joined ${team.name}!`);
    } catch {
      toast.error("Failed to join team.");
    }
  };

  const handleLeave = async () => {
    try {
      await leaveTeam.mutateAsync(team.teamId);
      toast.success(`Left ${team.name}.`);
    } catch {
      toast.error("Failed to leave team.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index }}
      data-ocid={`teams.item.${index + 1}`}
      className="glass-card rounded-xl overflow-hidden border border-[oklch(0.3_0.06_265/0.3)] hover:border-primary/40 hover:neon-glow-blue transition-all duration-300"
    >
      {/* Top gradient accent */}
      <div
        className={`h-1 bg-gradient-to-r ${gradient} from-primary/40 to-accent/20`}
      />

      <div className="p-5 flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-display font-bold text-foreground text-lg">
              {team.name}
            </h3>
            <span className="text-sm text-primary font-mono">{team.game}</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-primary/70" />
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4 text-primary/50" />
          <span>
            <span className="text-foreground font-medium">
              {team.members.length}
            </span>{" "}
            member{team.members.length !== 1 ? "s" : ""}
          </span>
          {isMember && (
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-display font-semibold">
              Joined
            </span>
          )}
        </div>

        {/* Member avatars */}
        <div className="flex items-center gap-1">
          {team.members.slice(0, 6).map((member) => (
            <div
              key={member.toText()}
              className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 border border-primary/20 flex items-center justify-center text-xs font-mono text-primary"
            >
              {team.members.indexOf(member) + 1}
            </div>
          ))}
          {team.members.length > 6 && (
            <div className="w-7 h-7 rounded-full bg-muted border border-border flex items-center justify-center text-xs text-muted-foreground">
              +{team.members.length - 6}
            </div>
          )}
        </div>

        {isLoggedIn &&
          (isMember ? (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleLeave}
              disabled={leaveTeam.isPending}
              data-ocid={`teams.leave.button.${index + 1}`}
              className="w-full text-destructive hover:bg-destructive/10 border border-destructive/30 font-display font-semibold"
            >
              {leaveTeam.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                  Leaving...
                </>
              ) : (
                <>
                  <UserMinus className="w-4 h-4 mr-1.5" />
                  Leave Team
                </>
              )}
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleJoin}
              disabled={joinTeam.isPending}
              data-ocid={`teams.join.button.${index + 1}`}
              className="w-full bg-primary/10 text-primary border border-primary/30 hover:bg-primary hover:text-primary-foreground neon-glow-blue font-display font-semibold"
              variant="ghost"
            >
              {joinTeam.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                  Joining...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-1.5" />
                  Join Team
                </>
              )}
            </Button>
          ))}
      </div>
    </motion.div>
  );
}

function CreateTeamModal() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", game: "" });
  const createTeam = useCreateTeam();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTeam.mutateAsync({ name: form.name, game: form.game });
      toast.success(`Team "${form.name}" created!`);
      setOpen(false);
      setForm({ name: "", game: "" });
    } catch {
      toast.error("Failed to create team.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          data-ocid="teams.create.open_modal_button"
          className="bg-primary text-primary-foreground neon-glow-blue font-display font-bold"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Team
        </Button>
      </DialogTrigger>
      <DialogContent
        data-ocid="teams.create.dialog"
        className="glass-card border-[oklch(0.4_0.1_265/0.4)] max-w-md"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-xl gradient-text">
            Create a New Team
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Team Name</Label>
            <Input
              data-ocid="teams.create.name.input"
              placeholder="e.g. Neon Blades"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              required
              className="bg-[oklch(0.12_0.02_265)] border-[oklch(0.3_0.06_265/0.5)]"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Game</Label>
            <Input
              data-ocid="teams.create.game.input"
              placeholder="e.g. Valorant, CS2, Apex Legends"
              value={form.game}
              onChange={(e) => setForm((p) => ({ ...p, game: e.target.value }))}
              required
              className="bg-[oklch(0.12_0.02_265)] border-[oklch(0.3_0.06_265/0.5)]"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              data-ocid="teams.create.cancel.button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createTeam.isPending}
              data-ocid="teams.create.submit.button"
              className="bg-primary text-primary-foreground neon-glow-blue font-display font-bold"
            >
              {createTeam.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Team"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function TeamsPage() {
  const { identity } = useInternetIdentity();
  const { data: teams, isLoading } = useAllTeams();

  const isLoggedIn = !!identity;
  const principalStr = identity?.getPrincipal().toString();
  const displayTeams = teams?.length ? teams : SAMPLE_TEAMS;

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="font-display font-bold text-4xl gradient-text mb-2">
            Teams
          </h1>
          <p className="text-muted-foreground">
            Find your squad or forge your own legacy
          </p>
        </div>
        {isLoggedIn && <CreateTeamModal />}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          data-ocid="teams.loading_state"
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-52 rounded-xl" />
          ))}
        </div>
      ) : displayTeams.length === 0 ? (
        <div data-ocid="teams.empty_state" className="text-center py-20">
          <Users className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
          <h3 className="font-display font-bold text-xl text-muted-foreground mb-2">
            No Teams Yet
          </h3>
          <p className="text-muted-foreground/60">
            Be the first to create a team and recruit your squad.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayTeams.map((team, i) => (
            <TeamCard
              key={String(team.teamId)}
              team={team}
              index={i}
              isLoggedIn={isLoggedIn}
              principalStr={principalStr}
            />
          ))}
        </div>
      )}
    </div>
  );
}
