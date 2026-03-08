import Map "mo:core/Map";
import Array "mo:core/Array";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Compare modules
  module Scrim {
    public func compare(s1 : Scrim, s2 : Scrim) : Order.Order {
      Nat.compare(s1.scrimId, s2.scrimId);
    };
  };

  module Stream {
    public func compare(s1 : Stream, s2 : Stream) : Order.Order {
      Nat.compare(s1.streamId, s2.streamId);
    };
  };

  type TeamId = Nat;
  type ScrimId = Nat;
  type StreamId = Nat;

  public type UserProfile = {
    username : Text;
    mainGame : Text;
    rank : Text;
    role : Text;
  };

  type Team = {
    teamId : TeamId;
    name : Text;
    game : Text;
    members : List.List<Principal>;
    createdBy : Principal;
  };

  type TeamView = {
    teamId : TeamId;
    name : Text;
    game : Text;
    members : [Principal];
    createdBy : Principal;
  };

  type Scrim = {
    title : Text;
    game : Text;
    scheduledAt : Int;
    teamSize : Nat;
    skillLevel : Text;
    platform : Text;
    description : Text;
    scrimId : ScrimId;
    participants : List.List<Principal>;
    createdBy : Principal;
  };

  type ScrimView = {
    title : Text;
    game : Text;
    scheduledAt : Int;
    teamSize : Nat;
    skillLevel : Text;
    platform : Text;
    description : Text;
    scrimId : ScrimId;
    participants : [Principal];
    createdBy : Principal;
  };

  type Stream = {
    title : Text;
    streamerName : Text;
    game : Text;
    platform : Text;
    streamUrl : Text;
    description : Text;
    viewerCount : Nat;
    streamId : StreamId;
    createdBy : Principal;
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let userProfiles = Map.empty<Principal, UserProfile>();
  let teams = Map.empty<TeamId, Team>();
  let scrims = Map.empty<ScrimId, Scrim>();
  let streams = Map.empty<StreamId, Stream>();

  var nextTeamId : TeamId = 1;
  var nextScrimId : ScrimId = 1;
  var nextStreamId : StreamId = 1;

  // Required User Profile Functions for Frontend
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Legacy Player Profile Functions (for backward compatibility)
  public shared ({ caller }) func createOrUpdateProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only players can create profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile or must be admin");
    };
    userProfiles.get(user);
  };

  // Teams
  public shared ({ caller }) func createTeam(name : Text, game : Text) : async TeamId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only players can create teams");
    };

    let team : Team = {
      teamId = nextTeamId;
      name;
      game;
      members = List.empty<Principal>();
      createdBy = caller;
    };
    teams.add(nextTeamId, team);
    nextTeamId += 1;
    team.teamId;
  };

  public shared ({ caller }) func joinTeam(teamId : TeamId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only players can join teams");
    };

    let team = switch (teams.get(teamId)) {
      case (null) { Runtime.trap("Team does not exist") };
      case (?team) { team };
    };

    team.members.add(caller);
  };

  public shared ({ caller }) func leaveTeam(teamId : TeamId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only players can leave teams");
    };

    let team = switch (teams.get(teamId)) {
      case (null) { Runtime.trap("Team does not exist") };
      case (?team) { team };
    };

    let updatedMembers = team.members.filter(func(member) { member != caller });
    let updatedTeam = { team with members = updatedMembers };
    teams.add(teamId, updatedTeam);
  };

  public shared ({ caller }) func getAllTeams() : async [TeamView] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only players can view teams");
    };

    let teamsArray = teams.values().toArray();
    teamsArray.map(func(team) { toTeamView(team) });
  };

  // SCRIM (MATCH) MAKING
  public shared ({ caller }) func createScrim(
    title : Text,
    game : Text,
    scheduledAt : Int,
    teamSize : Nat,
    skillLevel : Text,
    platform : Text,
    description : Text,
  ) : async ScrimId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only players can create scrims");
    };

    let scrim : Scrim = {
      title;
      game;
      scheduledAt;
      teamSize;
      skillLevel;
      platform;
      description;
      scrimId = nextScrimId;
      participants = List.empty<Principal>();
      createdBy = caller;
    };
    scrims.add(nextScrimId, scrim);
    nextScrimId += 1;
    scrim.scrimId;
  };

  public shared ({ caller }) func signUpForScrim(scrimId : ScrimId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only players can sign up for scrims");
    };

    let scrim = switch (scrims.get(scrimId)) {
      case (null) { Runtime.trap("Scrim does not exist") };
      case (?scrim) { scrim };
    };

    scrim.participants.add(caller);
  };

  public query ({ caller }) func getUpcomingScrims() : async [ScrimView] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only players can view scrims");
    };

    let now = Time.now();
    scrims.values().toArray().sort().filter(
      func(scrim) {
        scrim.scheduledAt > now;
      }
    ).map(func(scrim) { toScrimView(scrim) });
  };

  // Live Stream Listings
  public shared ({ caller }) func postStream(
    title : Text,
    streamerName : Text,
    game : Text,
    platform : Text,
    streamUrl : Text,
    description : Text,
    viewerCount : Nat,
  ) : async StreamId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only players can post streams");
    };

    let stream : Stream = {
      title;
      streamerName;
      game;
      platform;
      streamUrl;
      description;
      viewerCount;
      streamId = nextStreamId;
      createdBy = caller;
    };
    streams.add(nextStreamId, stream);
    nextStreamId += 1;
    stream.streamId;
  };

  public shared ({ caller }) func removeStream(streamId : StreamId) : async () {
    let stream = switch (streams.get(streamId)) {
      case (null) { Runtime.trap("Stream does not exist") };
      case (?stream) { stream };
    };

    if (stream.createdBy != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only the creator or an admin can remove this stream");
    };

    streams.remove(streamId);
  };

  public query ({ caller }) func getAllStreams() : async [Stream] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only players can view streams");
    };

    streams.values().toArray();
  };

  func toTeamView(team : Team) : TeamView {
    {
      team with members = team.members.toArray();
    };
  };

  func toScrimView(scrim : Scrim) : ScrimView {
    {
      scrim with participants = scrim.participants.toArray();
    };
  };
};
