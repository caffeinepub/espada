import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAllStreams, useUpcomingScrims } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Calendar,
  Eye,
  Radio,
  Swords,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

const STATS = [
  { icon: Users, label: "Active Players", value: "12,847" },
  { icon: Swords, label: "Daily Scrims", value: "340+" },
  { icon: Radio, label: "Live Streams", value: "89" },
  { icon: Trophy, label: "Tournaments", value: "24" },
];

const GAMES_SAMPLE = [
  "Valorant",
  "CS2",
  "League of Legends",
  "Apex Legends",
  "Fortnite",
  "PUBG",
];

function ScrimCard({
  scrim,
  index,
}: {
  scrim: {
    title: string;
    game: string;
    scheduledAt: bigint;
    skillLevel: string;
    participants: unknown[];
  };
  index: number;
}) {
  const date = new Date(Number(scrim.scheduledAt));
  const dateStr = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      className="glass-card rounded-lg p-4 hover:neon-glow-blue transition-all duration-300 border border-[oklch(0.3_0.06_265/0.3)] hover:border-primary/40"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-display font-semibold text-foreground line-clamp-1">
            {scrim.title}
          </h3>
          <span className="text-xs text-primary font-mono">{scrim.game}</span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
          {scrim.skillLevel}
        </span>
      </div>
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {dateStr}
        </span>
        <span className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          {scrim.participants.length} joined
        </span>
      </div>
    </motion.div>
  );
}

function StreamCard({
  stream,
  index,
}: {
  stream: {
    title: string;
    streamerName: string;
    game: string;
    platform: string;
    viewerCount: bigint;
    streamUrl: string;
  };
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      className="glass-card rounded-lg p-4 hover:neon-glow-purple transition-all duration-300 border border-[oklch(0.3_0.06_265/0.3)] hover:border-accent/40"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-display font-semibold text-foreground line-clamp-1">
          {stream.title}
        </h3>
        <span className="flex items-center gap-1 text-xs text-[oklch(0.72_0.22_300)]">
          <Eye className="w-3 h-3" />
          {stream.viewerCount.toString()}
        </span>
      </div>
      <p className="text-xs text-muted-foreground mb-1">
        {stream.streamerName}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-accent font-mono">{stream.game}</span>
        <a
          href={stream.streamUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
        >
          Watch <ArrowRight className="w-3 h-3" />
        </a>
      </div>
    </motion.div>
  );
}

export function HomePage() {
  const { data: scrims, isLoading: scrimsLoading } = useUpcomingScrims();
  const { data: streams, isLoading: streamsLoading } = useAllStreams();

  const featuredScrims = scrims?.slice(0, 3) ?? [];
  const featuredStreams = streams?.slice(0, 3) ?? [];

  // Sample data for when backend is loading/empty
  const sampleScrims = [
    {
      title: "Valorant Diamond Showdown",
      game: "Valorant",
      scheduledAt: BigInt(Date.now() + 3600000),
      skillLevel: "Diamond",
      participants: new Array(6),
    },
    {
      title: "CS2 Pro-Am Practice",
      game: "CS2",
      scheduledAt: BigInt(Date.now() + 7200000),
      skillLevel: "Pro",
      participants: new Array(10),
    },
    {
      title: "Apex Legends Ranked Grind",
      game: "Apex Legends",
      scheduledAt: BigInt(Date.now() + 10800000),
      skillLevel: "Gold",
      participants: new Array(3),
    },
  ];
  const sampleStreams = [
    {
      title: "Late Night Valorant Ranked",
      streamerName: "ProFragger_X",
      game: "Valorant",
      platform: "Twitch",
      viewerCount: BigInt(2847),
      streamUrl: "#",
    },
    {
      title: "CS2 Pro Match Analysis",
      streamerName: "TacticalPro",
      game: "CS2",
      platform: "YouTube",
      viewerCount: BigInt(1204),
      streamUrl: "#",
    },
    {
      title: "Apex Legends Champion Run",
      streamerName: "BarrelRoll99",
      game: "Apex Legends",
      platform: "Twitch",
      viewerCount: BigInt(567),
      streamUrl: "#",
    },
  ];

  const displayScrims =
    featuredScrims.length > 0 ? featuredScrims : sampleScrims;
  const displayStreams =
    featuredStreams.length > 0 ? featuredStreams : sampleStreams;

  return (
    <div>
      {/* ── Hero Section ──────────────────────────────────────────── */}
      <section className="espada-hero-bg relative overflow-hidden py-24 px-4">
        {/* Background decorative grid */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.65 0.22 255) 1px, transparent 1px), linear-gradient(90deg, oklch(0.65 0.22 255) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-accent/5 blur-3xl" />

        <div className="container mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-8"
          >
            <img
              src="/assets/generated/espada-logo-transparent.dim_400x400.png"
              alt="ESPADA"
              className="w-40 h-40 mx-auto object-contain drop-shadow-2xl"
              style={{
                filter: "drop-shadow(0 0 30px oklch(0.65 0.22 255 / 0.4))",
              }}
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="font-display font-bold text-5xl md:text-7xl mb-4 tracking-tight"
          >
            <span className="gradient-text">ESPADA</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="text-xl md:text-2xl text-muted-foreground font-body mb-2"
          >
            Your Daily eSports Arena
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-muted-foreground/70 mb-10 max-w-lg mx-auto"
          >
            Compete in daily scrims, watch live streams, and build your team —
            all in one battlefield.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/scrims" data-ocid="home.scrims.primary_button">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground neon-glow-blue font-display font-bold tracking-widest text-base px-8 w-full sm:w-auto"
              >
                <Swords className="w-5 h-5 mr-2" />
                Find a Scrim
              </Button>
            </Link>
            <Link to="/streams" data-ocid="home.streams.secondary_button">
              <Button
                size="lg"
                variant="outline"
                className="border-accent/50 text-accent hover:bg-accent/10 neon-glow-purple font-display font-bold tracking-widest text-base px-8 w-full sm:w-auto"
              >
                <Radio className="w-5 h-5 mr-2" />
                Watch Live
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Stats Bar ─────────────────────────────────────────────── */}
      <section className="border-y border-[oklch(0.3_0.06_265/0.3)] py-6 bg-[oklch(0.1_0.015_265/0.8)]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map(({ icon: Icon, label, value }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i + 0.7 }}
                className="flex items-center gap-3 text-center md:text-left justify-center md:justify-start"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-display font-bold text-xl neon-text-blue">
                    {value}
                  </div>
                  <div className="text-xs text-muted-foreground">{label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Games Ticker ──────────────────────────────────────────── */}
      <div className="overflow-hidden py-3 bg-primary/5 border-b border-primary/10">
        <div className="flex gap-8 animate-[marquee_20s_linear_infinite]">
          {["a", "b", "c"].flatMap((prefix) =>
            GAMES_SAMPLE.map((game) => (
              <span
                key={`${prefix}-${game}`}
                className="whitespace-nowrap text-xs font-mono text-primary/60 flex items-center gap-2"
              >
                <Zap className="w-3 h-3" />
                {game}
              </span>
            )),
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 space-y-16">
        {/* ── Featured Scrims ─────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display font-bold text-2xl md:text-3xl gradient-text">
                Upcoming Scrims
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                Hot matches ready for challengers
              </p>
            </div>
            <Link to="/scrims" data-ocid="home.scrims_all.link">
              <Button
                variant="ghost"
                size="sm"
                className="text-primary hover:text-primary/80 font-display"
              >
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          {scrimsLoading ? (
            <div className="grid md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-28 rounded-lg" />
              ))}
            </div>
          ) : (
            <div
              className="grid md:grid-cols-3 gap-4"
              data-ocid="home.scrims.list"
            >
              {displayScrims.map((scrim, i) => (
                <ScrimCard
                  key={String(scrim.scheduledAt) + scrim.title}
                  scrim={scrim}
                  index={i}
                />
              ))}
            </div>
          )}
        </section>

        {/* ── Featured Streams ────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display font-bold text-2xl md:text-3xl gradient-text">
                Live Streams
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                Watch the pros in action
              </p>
            </div>
            <Link to="/streams" data-ocid="home.streams_all.link">
              <Button
                variant="ghost"
                size="sm"
                className="text-accent hover:text-accent/80 font-display"
              >
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          {streamsLoading ? (
            <div className="grid md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-28 rounded-lg" />
              ))}
            </div>
          ) : (
            <div
              className="grid md:grid-cols-3 gap-4"
              data-ocid="home.streams.list"
            >
              {displayStreams.map((stream, i) => (
                <StreamCard
                  key={stream.title + stream.streamerName}
                  stream={stream}
                  index={i}
                />
              ))}
            </div>
          )}
        </section>

        {/* ── CTA Banner ──────────────────────────────────────────── */}
        <section className="relative overflow-hidden rounded-xl glass-card border border-primary/20 p-10 text-center">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5" />
          <div className="relative z-10">
            <h2 className="font-display font-bold text-3xl mb-3 gradient-text">
              Ready to Compete?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Join thousands of players in daily scrims. Prove your rank, build
              your team, and rise to the top.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/teams" data-ocid="home.teams.secondary_button">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-accent/40 text-accent hover:bg-accent/10 font-display font-bold px-8"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Build a Team
                </Button>
              </Link>
              <Link to="/scrims" data-ocid="home.join_scrim.primary_button">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground neon-glow-blue font-display font-bold px-8"
                >
                  <Swords className="w-5 h-5 mr-2" />
                  Join a Scrim
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
