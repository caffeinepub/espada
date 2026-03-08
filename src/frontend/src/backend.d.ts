import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TeamView {
    members: Array<Principal>;
    game: string;
    name: string;
    createdBy: Principal;
    teamId: TeamId;
}
export interface ScrimView {
    title: string;
    participants: Array<Principal>;
    teamSize: bigint;
    scrimId: ScrimId;
    game: string;
    createdBy: Principal;
    description: string;
    platform: string;
    skillLevel: string;
    scheduledAt: bigint;
}
export type ScrimId = bigint;
export type StreamId = bigint;
export interface Stream {
    title: string;
    game: string;
    createdBy: Principal;
    description: string;
    streamerName: string;
    platform: string;
    streamId: StreamId;
    streamUrl: string;
    viewerCount: bigint;
}
export interface UserProfile {
    username: string;
    rank: string;
    role: string;
    mainGame: string;
}
export type TeamId = bigint;
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createOrUpdateProfile(profile: UserProfile): Promise<void>;
    createScrim(title: string, game: string, scheduledAt: bigint, teamSize: bigint, skillLevel: string, platform: string, description: string): Promise<ScrimId>;
    createTeam(name: string, game: string): Promise<TeamId>;
    getAllStreams(): Promise<Array<Stream>>;
    getAllTeams(): Promise<Array<TeamView>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getProfile(user: Principal): Promise<UserProfile | null>;
    getUpcomingScrims(): Promise<Array<ScrimView>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    joinTeam(teamId: TeamId): Promise<void>;
    leaveTeam(teamId: TeamId): Promise<void>;
    postStream(title: string, streamerName: string, game: string, platform: string, streamUrl: string, description: string, viewerCount: bigint): Promise<StreamId>;
    removeStream(streamId: StreamId): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    signUpForScrim(scrimId: ScrimId): Promise<void>;
}
