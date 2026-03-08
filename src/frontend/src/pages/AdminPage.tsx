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
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAllStreams,
  useIsAdmin,
  useRemoveStream,
  useUpcomingScrims,
} from "@/hooks/useQueries";
import { Loader2, Lock, Radio, Shield, Swords, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

export function AdminPage() {
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: streams, isLoading: streamsLoading } = useAllStreams();
  const { data: scrims, isLoading: scrimsLoading } = useUpcomingScrims();
  const removeStream = useRemoveStream();

  const handleRemoveStream = async (streamId: bigint, title: string) => {
    try {
      await removeStream.mutateAsync(streamId);
      toast.success(`Stream "${title}" removed.`);
    } catch {
      toast.error("Failed to remove stream.");
    }
  };

  if (adminLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-12 w-48 mb-8" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div
        className="container mx-auto px-4 py-24 text-center"
        data-ocid="admin.page"
      >
        <Lock className="w-16 h-16 text-muted-foreground/30 mx-auto mb-6" />
        <h1 className="font-display font-bold text-3xl gradient-text mb-3">
          Access Restricted
        </h1>
        <p className="text-muted-foreground">
          You need admin privileges to access this panel.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12" data-ocid="admin.page">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 rounded-xl bg-[oklch(0.65_0.22_255/0.1)] border border-[oklch(0.65_0.22_255/0.3)] flex items-center justify-center">
          <Shield className="w-6 h-6 text-[oklch(0.75_0.22_255)]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display font-bold text-3xl gradient-text">
              Admin Panel
            </h1>
            <EspadaBadge type="admin" size={28} />
          </div>
          <p className="text-muted-foreground text-sm">
            Manage all platform content
          </p>
        </div>
      </div>

      <div className="space-y-10">
        {/* ── Streams Management ──────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-xl border border-[oklch(0.3_0.06_265/0.3)] overflow-hidden"
        >
          <div className="flex items-center gap-3 p-5 border-b border-[oklch(0.3_0.06_265/0.2)]">
            <Radio className="w-5 h-5 text-accent" />
            <h2 className="font-display font-bold text-xl">Live Streams</h2>
            <span className="ml-auto text-sm text-muted-foreground font-mono">
              {streams?.length ?? 0} total
            </span>
          </div>

          {streamsLoading ? (
            <div
              className="p-5 space-y-3"
              data-ocid="admin.streams.loading_state"
            >
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : !streams || streams.length === 0 ? (
            <div
              data-ocid="admin.streams.empty_state"
              className="p-10 text-center"
            >
              <Radio className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-muted-foreground/60 text-sm">
                No streams to manage.
              </p>
            </div>
          ) : (
            <div
              className="divide-y divide-[oklch(0.3_0.06_265/0.2)]"
              data-ocid="admin.streams.table"
            >
              {streams.map((stream, i) => (
                <div
                  key={String(stream.streamId)}
                  data-ocid={`admin.stream.row.${i + 1}`}
                  className="flex items-center justify-between gap-4 p-4 hover:bg-white/2 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-semibold text-sm truncate">
                      {stream.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">
                        {stream.streamerName}
                      </span>
                      <span className="text-xs text-accent font-mono">
                        {stream.game}
                      </span>
                      <span className="text-xs text-muted-foreground/60">
                        {stream.platform}
                      </span>
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        data-ocid={`admin.stream.delete.button.${i + 1}`}
                        className="text-destructive hover:bg-destructive/10 shrink-0 h-8 px-3"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" />
                        Remove
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent
                      data-ocid="admin.stream.delete.dialog"
                      className="glass-card border-destructive/30"
                    >
                      <AlertDialogHeader>
                        <AlertDialogTitle className="font-display">
                          Remove Stream?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Remove &quot;{stream.title}&quot; by{" "}
                          {stream.streamerName}? This cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel data-ocid="admin.stream.delete.cancel.button">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            handleRemoveStream(stream.streamId, stream.title)
                          }
                          data-ocid="admin.stream.delete.confirm.button"
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {removeStream.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            "Remove Stream"
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          )}
        </motion.section>

        {/* ── Scrims Management ──────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-xl border border-[oklch(0.3_0.06_265/0.3)] overflow-hidden"
        >
          <div className="flex items-center gap-3 p-5 border-b border-[oklch(0.3_0.06_265/0.2)]">
            <Swords className="w-5 h-5 text-primary" />
            <h2 className="font-display font-bold text-xl">Upcoming Scrims</h2>
            <span className="ml-auto text-sm text-muted-foreground font-mono">
              {scrims?.length ?? 0} total
            </span>
          </div>

          {scrimsLoading ? (
            <div
              className="p-5 space-y-3"
              data-ocid="admin.scrims.loading_state"
            >
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : !scrims || scrims.length === 0 ? (
            <div
              data-ocid="admin.scrims.empty_state"
              className="p-10 text-center"
            >
              <Swords className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-muted-foreground/60 text-sm">
                No scrims to manage.
              </p>
            </div>
          ) : (
            <div
              className="divide-y divide-[oklch(0.3_0.06_265/0.2)]"
              data-ocid="admin.scrims.table"
            >
              {scrims.map((scrim, i) => {
                const date = new Date(Number(scrim.scheduledAt));
                return (
                  <div
                    key={String(scrim.scrimId)}
                    data-ocid={`admin.scrim.row.${i + 1}`}
                    className="flex items-center justify-between gap-4 p-4 hover:bg-white/2 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-semibold text-sm truncate">
                        {scrim.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-primary font-mono">
                          {scrim.game}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {scrim.skillLevel}
                        </span>
                        <span className="text-xs text-muted-foreground/60">
                          {date.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <span className="text-xs text-muted-foreground/60">
                          {scrim.participants.length} players
                        </span>
                      </div>
                    </div>
                    {/* Note: backend doesn't have removeScrim, so we show info only */}
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-display shrink-0">
                      {Number(scrim.teamSize)}v{Number(scrim.teamSize)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
}
