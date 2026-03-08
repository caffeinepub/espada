# eSports Scrim & Stream Hub

## Current State
New project. No existing backend or frontend code.

## Requested Changes (Diff)

### Add
- **Scrim Scheduling System**: Teams/players can create, browse, and sign up for daily scrim sessions. Each scrim has a game title, date/time, team size, skill level (Bronze/Silver/Gold/Diamond/Pro), platform (PC/Console/Mobile), and description.
- **Live Stream Directory**: Streamers can post their live stream links (Twitch, YouTube, etc.) with game, description, and viewer count. Other users can browse and click through to streams.
- **Team/Player Profiles**: Players can register with a username, main game, rank, and role. Teams can be created and players can join teams.
- **Scrim Requests & Matchmaking**: Teams can send scrim requests to other teams. Accept/decline functionality. Status tracking (pending, accepted, completed).
- **Admin Dashboard**: Admins can manage scrims, streams, and users.

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. Backend (Motoko):
   - Player/User profiles (username, game, rank, role)
   - Team management (create team, join team, list teams)
   - Scrim sessions (create, list, filter by game/date/skill, sign up, cancel)
   - Scrim requests (send, accept, decline, list)
   - Live stream listings (add, update, remove, list, filter by game)
   - Authorization with roles (admin, player, streamer)

2. Frontend:
   - Home/Landing page with featured scrims and live streams
   - Scrim Browser page (filter by game, skill, date)
   - Scrim Detail page (join, send request)
   - Create Scrim form
   - Live Streams page (browse, filter by game)
   - Add Stream form
   - Team page (create team, view members)
   - Player Profile page
   - My Scrims / Dashboard page
   - Admin panel for managing all content
