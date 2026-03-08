import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ScrimView, Stream, TeamView, UserProfile } from "../backend.d";
import { UserRole } from "../backend.d";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

// ─── Auth / Role ──────────────────────────────────────────────────────────────

export function useCallerRole() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery<UserRole>({
    queryKey: ["callerRole", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return UserRole.guest;
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery<boolean>({
    queryKey: ["isAdmin", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

// ─── Profile ──────────────────────────────────────────────────────────────────

export function useCallerProfile() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery<UserProfile | null>({
    queryKey: ["callerProfile", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching && !!identity,
    staleTime: 30_000,
  });
}

export function useSaveProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["callerProfile", identity?.getPrincipal().toString()],
      });
    },
  });
}

// ─── Scrims ───────────────────────────────────────────────────────────────────

export function useUpcomingScrims() {
  const { actor, isFetching } = useActor();
  return useQuery<ScrimView[]>({
    queryKey: ["upcomingScrims"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUpcomingScrims();
    },
    enabled: !!actor && !isFetching,
    staleTime: 10_000,
  });
}

export function useCreateScrim() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      game: string;
      scheduledAt: bigint;
      teamSize: bigint;
      skillLevel: string;
      platform: string;
      description: string;
    }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.createScrim(
        data.title,
        data.game,
        data.scheduledAt,
        data.teamSize,
        data.skillLevel,
        data.platform,
        data.description,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["upcomingScrims"] });
    },
  });
}

export function useSignUpForScrim() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (scrimId: bigint) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.signUpForScrim(scrimId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["upcomingScrims"] });
    },
  });
}

// ─── Streams ──────────────────────────────────────────────────────────────────

export function useAllStreams() {
  const { actor, isFetching } = useActor();
  return useQuery<Stream[]>({
    queryKey: ["allStreams"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllStreams();
    },
    enabled: !!actor && !isFetching,
    staleTime: 10_000,
  });
}

export function usePostStream() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      streamerName: string;
      game: string;
      platform: string;
      streamUrl: string;
      description: string;
      viewerCount: bigint;
    }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.postStream(
        data.title,
        data.streamerName,
        data.game,
        data.platform,
        data.streamUrl,
        data.description,
        data.viewerCount,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allStreams"] });
    },
  });
}

export function useRemoveStream() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (streamId: bigint) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.removeStream(streamId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allStreams"] });
    },
  });
}

// ─── Teams ────────────────────────────────────────────────────────────────────

export function useAllTeams() {
  const { actor, isFetching } = useActor();
  return useQuery<TeamView[]>({
    queryKey: ["allTeams"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTeams();
    },
    enabled: !!actor && !isFetching,
    staleTime: 10_000,
  });
}

export function useCreateTeam() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; game: string }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.createTeam(data.name, data.game);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allTeams"] });
    },
  });
}

export function useJoinTeam() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (teamId: bigint) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.joinTeam(teamId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allTeams"] });
    },
  });
}

export function useLeaveTeam() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (teamId: bigint) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.leaveTeam(teamId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allTeams"] });
    },
  });
}
