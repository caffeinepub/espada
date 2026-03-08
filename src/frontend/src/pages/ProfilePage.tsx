import type { UserProfile } from "@/backend.d";
import { EspadaBadge } from "@/components/EspadaBadge";
import { Button } from "@/components/ui/button";
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
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  useAllStreams,
  useCallerProfile,
  useIsAdmin,
  useSaveProfile,
  useUpcomingScrims,
} from "@/hooks/useQueries";
import { Edit3, Loader2, LogIn, Save, Swords, User } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const RANKS = [
  "Bronze",
  "Silver",
  "Gold",
  "Platinum",
  "Diamond",
  "Master",
  "Grand Master",
  "Challenger",
  "Radiant",
  "Immortal",
  "Unranked",
];
const ROLES = ["Fragger", "Support", "IGL", "Entry", "Sniper", "Flex"];

export function ProfilePage() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const { data: profile, isLoading: profileLoading } = useCallerProfile();
  const { data: isAdmin } = useIsAdmin();
  const { data: scrims } = useUpcomingScrims();
  const { data: streams } = useAllStreams();
  const saveProfile = useSaveProfile();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<UserProfile>({
    username: "",
    mainGame: "",
    rank: "Gold",
    role: "Fragger",
  });

  const principalStr = identity?.getPrincipal().toString();
  const isLoggedIn = !!identity;

  // Check if user has posted any streams
  const hasStreams =
    streams?.some((s) => s.createdBy.toText() === principalStr) ?? false;

  // Find scrims user is signed up for
  const myScrimList =
    scrims?.filter((s) =>
      s.participants.some((p) => p.toText() === principalStr),
    ) ?? [];

  useEffect(() => {
    if (profile) {
      setForm({
        username: profile.username,
        mainGame: profile.mainGame,
        rank: profile.rank,
        role: profile.role,
      });
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      await saveProfile.mutateAsync(form);
      toast.success("Profile saved!");
      setEditing(false);
    } catch {
      toast.error("Failed to save profile.");
    }
  };

  if (!isLoggedIn) {
    return (
      <div
        className="container mx-auto px-4 py-24 text-center"
        data-ocid="profile.page"
      >
        <User className="w-16 h-16 text-muted-foreground/30 mx-auto mb-6" />
        <h1 className="font-display font-bold text-3xl gradient-text mb-3">
          My Profile
        </h1>
        <p className="text-muted-foreground mb-8">
          Log in to access your ESPADA profile, badges, and stats.
        </p>
        <Button
          size="lg"
          onClick={() => login()}
          disabled={isLoggingIn}
          data-ocid="profile.login.button"
          className="bg-primary text-primary-foreground neon-glow-blue font-display font-bold px-8"
        >
          <LogIn className="w-5 h-5 mr-2" />
          {isLoggingIn ? "Connecting..." : "Login to Continue"}
        </Button>
      </div>
    );
  }

  return (
    <div
      className="container mx-auto px-4 py-12 max-w-3xl"
      data-ocid="profile.page"
    >
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-display font-bold text-4xl gradient-text mb-2">
            My Profile
          </h1>
          <p className="text-muted-foreground font-mono text-xs truncate max-w-xs">
            {principalStr}
          </p>
        </div>
        {!editing ? (
          <Button
            variant="outline"
            onClick={() => setEditing(true)}
            data-ocid="profile.edit.button"
            className="border-primary/40 text-primary hover:bg-primary/10 font-display font-semibold"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                setEditing(false);
                if (profile)
                  setForm({
                    username: profile.username,
                    mainGame: profile.mainGame,
                    rank: profile.rank,
                    role: profile.role,
                  });
              }}
              data-ocid="profile.edit.cancel.button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saveProfile.isPending}
              data-ocid="profile.save.button"
              className="bg-primary text-primary-foreground neon-glow-blue font-display font-bold"
            >
              {saveProfile.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-1.5" />
                  Save
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* ── Badges Section ──────────────────────────────────────── */}
      {(isAdmin || hasStreams) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 glass-card rounded-xl p-6 border border-[oklch(0.3_0.06_265/0.3)]"
        >
          <h2 className="font-display font-bold text-lg gradient-text mb-4">
            My Badges
          </h2>
          <div className="flex flex-wrap gap-6">
            {isAdmin && (
              <div
                data-ocid="profile.admin.badge"
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[oklch(0.65_0.22_255/0.05)] border border-[oklch(0.65_0.22_255/0.2)] neon-glow-blue"
              >
                <img
                  src="/assets/generated/badge-admin-transparent.dim_120x120.png"
                  alt="ESPADA Admin Badge"
                  width={60}
                  height={60}
                  className="object-contain drop-shadow-lg"
                  style={{
                    filter: "drop-shadow(0 0 12px oklch(0.65 0.22 255 / 0.5))",
                  }}
                />
                <span className="text-xs font-display font-bold text-[oklch(0.75_0.22_255)] tracking-widest">
                  ESPADA Admin
                </span>
              </div>
            )}
            {hasStreams && (
              <div
                data-ocid="profile.pro_creator.badge"
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[oklch(0.63_0.26_25/0.05)] border border-[oklch(0.63_0.26_25/0.2)]"
                style={{ boxShadow: "0 0 8px oklch(0.63 0.26 25 / 0.3)" }}
              >
                <img
                  src="/assets/generated/badge-pro-youtuber-transparent.dim_120x120.png"
                  alt="Pro Creator Badge"
                  width={60}
                  height={60}
                  className="object-contain drop-shadow-lg"
                  style={{
                    filter: "drop-shadow(0 0 12px oklch(0.63 0.26 25 / 0.5))",
                  }}
                />
                <span className="text-xs font-display font-bold text-[oklch(0.78_0.22_25)] tracking-widest">
                  Pro Creator
                </span>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* ── Profile Card ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-xl p-6 border border-[oklch(0.3_0.06_265/0.3)] mb-8"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 border-2 border-primary/30 flex items-center justify-center neon-glow-blue">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-2xl">
                {profileLoading ? (
                  <Skeleton className="w-32 h-6" />
                ) : (
                  form.username || "Unnamed Player"
                )}
              </h2>
              {isAdmin && <EspadaBadge type="admin" size={22} />}
              {hasStreams && <EspadaBadge type="pro-creator" size={22} />}
            </div>
            <p className="text-muted-foreground text-sm">
              {form.mainGame || "No main game set"}
            </p>
          </div>
        </div>

        {profileLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : editing ? (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Username</Label>
              <Input
                data-ocid="profile.username.input"
                placeholder="Enter your username"
                value={form.username}
                onChange={(e) =>
                  setForm((p) => ({ ...p, username: e.target.value }))
                }
                className="bg-[oklch(0.12_0.02_265)] border-[oklch(0.3_0.06_265/0.5)]"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Main Game</Label>
              <Input
                data-ocid="profile.game.input"
                placeholder="e.g. Valorant"
                value={form.mainGame}
                onChange={(e) =>
                  setForm((p) => ({ ...p, mainGame: e.target.value }))
                }
                className="bg-[oklch(0.12_0.02_265)] border-[oklch(0.3_0.06_265/0.5)]"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Rank</Label>
              <Select
                value={form.rank}
                onValueChange={(v) => setForm((p) => ({ ...p, rank: v }))}
              >
                <SelectTrigger
                  data-ocid="profile.rank.select"
                  className="bg-[oklch(0.12_0.02_265)] border-[oklch(0.3_0.06_265/0.5)]"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RANKS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select
                value={form.role}
                onValueChange={(v) => setForm((p) => ({ ...p, role: v }))}
              >
                <SelectTrigger
                  data-ocid="profile.role.select"
                  className="bg-[oklch(0.12_0.02_265)] border-[oklch(0.3_0.06_265/0.5)]"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Username", value: form.username || "—" },
              { label: "Main Game", value: form.mainGame || "—" },
              { label: "Rank", value: form.rank || "—" },
              { label: "Role", value: form.role || "—" },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="bg-[oklch(0.12_0.02_265)] rounded-lg p-3 border border-[oklch(0.25_0.04_265/0.4)]"
              >
                <p className="text-xs text-muted-foreground mb-1">{label}</p>
                <p className="font-display font-semibold text-foreground">
                  {value}
                </p>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* ── My Scrims ───────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-xl p-6 border border-[oklch(0.3_0.06_265/0.3)]"
      >
        <h2 className="font-display font-bold text-xl gradient-text mb-4">
          My Scrims
        </h2>
        {myScrimList.length === 0 ? (
          <div
            data-ocid="profile.scrims.empty_state"
            className="text-center py-8"
          >
            <Swords className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-muted-foreground/60 text-sm">
              No scrims signed up yet.
            </p>
          </div>
        ) : (
          <div className="space-y-3" data-ocid="profile.scrims.list">
            {myScrimList.map((scrim, i) => {
              const date = new Date(Number(scrim.scheduledAt));
              return (
                <div
                  key={String(scrim.scrimId)}
                  data-ocid={`profile.scrim.item.${i + 1}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-[oklch(0.12_0.02_265)] border border-[oklch(0.25_0.04_265/0.4)]"
                >
                  <div>
                    <p className="font-display font-semibold text-sm">
                      {scrim.title}
                    </p>
                    <p className="text-xs text-primary font-mono">
                      {scrim.game}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-xs text-muted-foreground/60">
                      {scrim.skillLevel}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
