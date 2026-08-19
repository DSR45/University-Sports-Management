🏐 Backend & Database Restructuring Plan for Public Pages
📊 Summary of What Changed
Your original backend supports 4 tables: users, players, evaluations, announcements — all for the internal trial management system (admin + player portals).

Your new frontend adds 11 public-facing pages that consume 7 new data entities that currently run on mock/hardcoded data:

Public Page	Data Source (currently mock)	Exists in DB?
Landing Page	players, news, matches, team, achievements, gallery	❌
Team Page	public roster players (with jerseyNumber, designation, bio, photo)	❌ (partial — players table exists but lacks these fields)
Matches Page	matches	❌
News Page	news articles	❌
Gallery Page	gallery images	❌
About Page	team info (history, vision, philosophy)	❌
Achievements Page	achievements	❌
Events Page	events	❌
Videos Page	videos	❌
Join Page	just links to /register	✅ (no backend change)
Contact Page	static + disabled form	✅ (no backend change for now)
🗄️ DATABASE RESTRUCTURING
Existing Tables — Modifications Needed
Table: players — ADD COLUMNS
Your TeamPage and LandingPage show jerseyNumber, designation, bio, photo, and academicYear for selected/active players on the public roster. These fields don't exist in the current players table.


Apply
ADD COLUMNS:
┌──────────────────────┬───────────────┬─────────────────────────────────────────────────┐
│ Column               │ Type          │ Constraints                                     │
├──────────────────────┼───────────────┼─────────────────────────────────────────────────┤
│ jersey_number        │ INT           │ NULLABLE (only set for SELECTED players)         │
│ designation          │ VARCHAR(50)   │ NULLABLE (Captain, Vice Captain, Main Team etc.) │
│ bio                  │ TEXT          │ NULLABLE                                        │
│ photo_url            │ VARCHAR(500)  │ NULLABLE                                        │
│ show_on_public_roster│ BOOLEAN       │ NOT NULL, DEFAULT FALSE, INDEX                  │
└──────────────────────┴───────────────┴─────────────────────────────────────────────────┘
Rationale: The TeamPage displays only selected team members publicly. Adding show_on_public_roster lets admins control who appears. academicYear is already derivable from the existing year column (e.g., 1 → "1st Year").

NEW Tables to Create
Table: matches

Apply
┌───────────────┬───────────────┬──────────────────────────────────────────────────┐
│ Column        │ Type          │ Constraints                                      │
├───────────────┼───────────────┼──────────────────────────────────────────────────┤
│ id            │ BIGINT        │ PK, AUTO_INCREMENT                               │
│ opponent      │ VARCHAR(150)  │ NOT NULL                                         │
│ opponent_logo │ VARCHAR(500)  │ NULLABLE                                         │
│ date          │ DATE          │ NOT NULL, INDEX                                  │
│ time          │ VARCHAR(10)   │ NOT NULL                                         │
│ venue         │ VARCHAR(200)  │ NOT NULL                                         │
│ competition   │ VARCHAR(150)  │ NOT NULL                                         │
│ status        │ VARCHAR(20)   │ NOT NULL, INDEX (UPCOMING, COMPLETED, CANCELLED) │
│ result        │ VARCHAR(10)   │ NULLABLE (e.g., "3-1")                           │
│ sets          │ VARCHAR(100)  │ NULLABLE (e.g., "25-20, 25-18, 22-25, 25-21")   │
│ created_by    │ BIGINT        │ NOT NULL, FK → users(id)                         │
│ created_at    │ TIMESTAMP     │ NOT NULL, DEFAULT CURRENT_TIMESTAMP              │
│ updated_at    │ TIMESTAMP     │ NULLABLE, ON UPDATE CURRENT_TIMESTAMP            │
└───────────────┴───────────────┴──────────────────────────────────────────────────┘
Table: news

Apply
┌───────────────┬───────────────┬──────────────────────────────────────────┐
│ Column        │ Type          │ Constraints                              │
├───────────────┼───────────────┼──────────────────────────────────────────┤
│ id            │ BIGINT        │ PK, AUTO_INCREMENT                       │
│ title         │ VARCHAR(200)  │ NOT NULL                                 │
│ slug          │ VARCHAR(250)  │ NOT NULL, UNIQUE, INDEX                  │
│ excerpt       │ VARCHAR(500)  │ NOT NULL                                 │
│ content       │ TEXT          │ NOT NULL                                 │
│ cover_image   │ VARCHAR(500)  │ NULLABLE                                 │
│ author        │ VARCHAR(100)  │ NOT NULL                                 │
│ published_at  │ TIMESTAMP     │ NOT NULL, INDEX                          │
│ created_by    │ BIGINT        │ NOT NULL, FK → users(id)                 │
│ created_at    │ TIMESTAMP     │ NOT NULL, DEFAULT CURRENT_TIMESTAMP      │
│ updated_at    │ TIMESTAMP     │ NULLABLE, ON UPDATE CURRENT_TIMESTAMP    │
└───────────────┴───────────────┴──────────────────────────────────────────┘
Table: achievements

Apply
┌───────────────┬───────────────┬──────────────────────────────────────────┐
│ Column        │ Type          │ Constraints                              │
├───────────────┼───────────────┼──────────────────────────────────────────┤
│ id            │ BIGINT        │ PK, AUTO_INCREMENT                       │
│ year          │ VARCHAR(10)   │ NOT NULL, INDEX                          │
│ title         │ VARCHAR(200)  │ NOT NULL                                 │
│ competition   │ VARCHAR(200)  │ NOT NULL                                 │
│ description   │ TEXT          │ NULLABLE                                 │
│ image         │ VARCHAR(500)  │ NULLABLE                                 │
│ created_by    │ BIGINT        │ NOT NULL, FK → users(id)                 │
│ created_at    │ TIMESTAMP     │ NOT NULL, DEFAULT CURRENT_TIMESTAMP      │
│ updated_at    │ TIMESTAMP     │ NULLABLE, ON UPDATE CURRENT_TIMESTAMP    │
└───────────────┴───────────────┴──────────────────────────────────────────┘
Table: events

Apply
┌───────────────┬───────────────┬──────────────────────────────────────────────────┐
│ Column        │ Type          │ Constraints                                      │
├───────────────┼───────────────┼──────────────────────────────────────────────────┤
│ id            │ BIGINT        │ PK, AUTO_INCREMENT                               │
│ title         │ VARCHAR(200)  │ NOT NULL                                         │
│ description   │ TEXT          │ NOT NULL                                         │
│ date          │ DATE          │ NOT NULL, INDEX                                  │
│ time          │ VARCHAR(10)   │ NOT NULL                                         │
│ venue         │ VARCHAR(200)  │ NOT NULL                                         │
│ image         │ VARCHAR(500)  │ NULLABLE                                         │
│ status        │ VARCHAR(20)   │ NOT NULL, INDEX (UPCOMING, PAST, CANCELLED)      │
│ created_by    │ BIGINT        │ NOT NULL, FK → users(id)                         │
│ created_at    │ TIMESTAMP     │ NOT NULL, DEFAULT CURRENT_TIMESTAMP              │
│ updated_at    │ TIMESTAMP     │ NULLABLE, ON UPDATE CURRENT_TIMESTAMP            │
└───────────────┴───────────────┴──────────────────────────────────────────────────┘
Table: gallery

Apply
┌───────────────┬───────────────┬──────────────────────────────────────────┐
│ Column        │ Type          │ Constraints                              │
├───────────────┼───────────────┼──────────────────────────────────────────┤
│ id            │ BIGINT        │ PK, AUTO_INCREMENT                       │
│ title         │ VARCHAR(200)  │ NOT NULL                                 │
│ image         │ VARCHAR(500)  │ NOT NULL                                 │
│ category      │ VARCHAR(50)   │ NULLABLE, INDEX (Matches, Training, Events) │
│ date          │ DATE          │ NULLABLE                                 │
│ created_by    │ BIGINT        │ NOT NULL, FK → users(id)                 │
│ created_at    │ TIMESTAMP     │ NOT NULL, DEFAULT CURRENT_TIMESTAMP      │
└───────────────┴───────────────┴──────────────────────────────────────────┘
Table: videos

Apply
┌───────────────┬───────────────┬──────────────────────────────────────────┐
│ Column        │ Type          │ Constraints                              │
├───────────────┼───────────────┼──────────────────────────────────────────┤
│ id            │ BIGINT        │ PK, AUTO_INCREMENT                       │
│ title         │ VARCHAR(200)  │ NOT NULL                                 │
│ thumbnail     │ VARCHAR(500)  │ NULLABLE                                 │
│ video_url     │ VARCHAR(500)  │ NOT NULL                                 │
│ category      │ VARCHAR(50)   │ NULLABLE, INDEX (Highlights, Training)   │
│ date          │ DATE          │ NULLABLE                                 │
│ created_by    │ BIGINT        │ NOT NULL, FK → users(id)                 │
│ created_at    │ TIMESTAMP     │ NOT NULL, DEFAULT CURRENT_TIMESTAMP      │
└───────────────┴───────────────┴──────────────────────────────────────────┘
Table: team_info (singleton / settings table)

Apply
┌───────────────┬───────────────┬──────────────────────────────────────────┐
│ Column        │ Type          │ Constraints                              │
├───────────────┼───────────────┼──────────────────────────────────────────┤
│ id            │ BIGINT        │ PK, AUTO_INCREMENT                       │
│ name          │ VARCHAR(150)  │ NOT NULL                                 │
│ season        │ VARCHAR(20)   │ NOT NULL                                 │
│ description   │ TEXT          │ NOT NULL                                 │
│ logo          │ VARCHAR(500)  │ NULLABLE                                 │
│ philosophy    │ VARCHAR(200)  │ NULLABLE                                 │
│ vision        │ TEXT          │ NULLABLE                                 │
│ history       │ TEXT          │ NULLABLE                                 │
│ updated_at    │ TIMESTAMP     │ NULLABLE, ON UPDATE CURRENT_TIMESTAMP    │
└───────────────┴───────────────┴──────────────────────────────────────────┘
This is a singleton row — only one entry. Seeded via DataInitializer and updated by admin.

NEW Enums to Add

Apply
MatchStatus:    UPCOMING, COMPLETED, CANCELLED
EventStatus:    UPCOMING, PAST, CANCELLED
GalleryCategory: MATCHES, TRAINING, EVENTS, OTHER
VideoCategory:   HIGHLIGHTS, TRAINING, OTHER
Designation:     CAPTAIN, VICE_CAPTAIN, MAIN_TEAM_PLAYER, SUBSTITUTE
🔄 UPDATED ENTITY RELATIONSHIP DIAGRAM

Apply
┌──────────────┐  1:1   ┌──────────────┐  1:1   ┌──────────────────┐
│    users     │───────▶│   players    │───────▶│   evaluations    │
│              │        │              │        │                  │
│ id (PK)      │        │ + jersey_no  │        │ (no changes)     │
│ name         │        │ + designation│        └──────────────────┘
│ email        │        │ + bio        │
│ password     │        │ + photo_url  │
│ role         │        │ + show_public│
│ created_at   │        └──────────────┘
└──────┬───────┘
       │
       │  1:N (admin creates all of these)
       │
       ├──────────▶ announcements  (existing, no changes)
       ├──────────▶ matches        (NEW)
       ├──────────▶ news           (NEW)
       ├──────────▶ achievements   (NEW)
       ├──────────▶ events         (NEW)
       ├──────────▶ gallery        (NEW)
       └──────────▶ videos         (NEW)

       team_info (standalone singleton, no FK)
🎮 BACKEND RESTRUCTURING — New API Endpoints
NEW: PublicController (/api/public) — All endpoints are PUBLIC (no auth)
Method	Endpoint	Description
GET	/api/public/team	Get public roster players (show_on_public_roster = true)
GET	/api/public/matches	Get all matches (ordered by date desc)
GET	/api/public/matches/latest-result	Get most recent completed match
GET	/api/public/news	Get all news (ordered by publishedAt desc)
GET	/api/public/news/{slug}	Get single news article by slug
GET	/api/public/achievements	Get all achievements (ordered by year desc)
GET	/api/public/events	Get all events (ordered by date desc)
GET	/api/public/gallery	Get all gallery items (ordered by date desc)
GET	/api/public/videos	Get all videos (ordered by date desc)
GET	/api/public/team-info	Get team info (singleton)
NEW: Admin CRUD Controllers for content management — All require ROLE_ADMIN
AdminMatchController (/api/admin/matches)
Method	Endpoint	Description
GET	/api/admin/matches	List all matches (paginated)
POST	/api/admin/matches	Create match
PUT	/api/admin/matches/{id}	Update match
DELETE	/api/admin/matches/{id}	Delete match
AdminNewsController (/api/admin/news)
Method	Endpoint	Description
GET	/api/admin/news	List all news
POST	/api/admin/news	Create news article
PUT	/api/admin/news/{id}	Update news article
DELETE	/api/admin/news/{id}	Delete news article
AdminAchievementController (`/api/admin/






continue

AdminAchievementController (/api/admin/achievements)
Method	Endpoint	Description
GET	/api/admin/achievements	List all achievements
POST	/api/admin/achievements	Create achievement
PUT	/api/admin/achievements/{id}	Update achievement
DELETE	/api/admin/achievements/{id}	Delete achievement
AdminEventController (/api/admin/events)
Method	Endpoint	Description
GET	/api/admin/events	List all events
POST	/api/admin/events	Create event
PUT	/api/admin/events/{id}	Update event
DELETE	/api/admin/events/{id}	Delete event
AdminGalleryController (/api/admin/gallery)
Method	Endpoint	Description
GET	/api/admin/gallery	List all gallery items
POST	/api/admin/gallery	Create gallery item
DELETE	/api/admin/gallery/{id}	Delete gallery item
AdminVideoController (/api/admin/videos)
Method	Endpoint	Description
GET	/api/admin/videos	List all videos
POST	/api/admin/videos	Create video
PUT	/api/admin/videos/{id}	Update video
DELETE	/api/admin/videos/{id}	Delete video
AdminTeamInfoController (/api/admin/team-info)
Method	Endpoint	Description
GET	/api/admin/team-info	Get current team info
PUT	/api/admin/team-info	Update team info (singleton)
Modify Existing: AdminPlayerController — ADD roster management
Method	Endpoint	Description
PATCH	/api/admin/players/{id}/roster	Update jersey_number, designation, bio, photo_url, show_on_public_roster
📦 NEW DTOs Required
Match DTOs

Apply
CreateMatchRequest:     opponent, opponentLogo, date, time, venue, competition, status
UpdateMatchRequest:     opponent, opponentLogo, date, time, venue, competition, status, result, sets
MatchResponse:          id, opponent, opponentLogo, date, time, venue, competition, status, result, sets, createdAt
News DTOs

Apply
CreateNewsRequest:      title, excerpt, content, coverImage, author
UpdateNewsRequest:      title, excerpt, content, coverImage, author
NewsResponse:           id, title, slug, excerpt, content, coverImage, author, publishedAt, createdAt, updatedAt
Achievement DTOs

Apply
CreateAchievementRequest:   year, title, competition, description, image
UpdateAchievementRequest:   year, title, competition, description, image
AchievementResponse:        id, year, title, competition, description, image, createdAt
Event DTOs

Apply
CreateEventRequest:     title, description, date, time, venue, image, status
UpdateEventRequest:     title, description, date, time, venue, image, status
EventResponse:          id, title, description, date, time, venue, image, status, createdAt
Gallery DTOs

Apply
CreateGalleryRequest:   title, image, category, date
GalleryResponse:        id, title, image, category, date, createdAt
Video DTOs

Apply
CreateVideoRequest:     title, thumbnail, videoUrl, category, date
UpdateVideoRequest:     title, thumbnail, videoUrl, category, date
VideoResponse:          id, title, thumbnail, videoUrl, category, date, createdAt
TeamInfo DTOs

Apply
UpdateTeamInfoRequest:  name, season, description, logo, philosophy, vision, history
TeamInfoResponse:       id, name, season, description, logo, philosophy, vision, history, updatedAt
Player Roster DTO (for admin to manage public roster)

Apply
UpdatePlayerRosterRequest:  jerseyNumber, designation, bio, photoUrl, showOnPublicRoster
PublicPlayerResponse:       id, name, jerseyNumber, position, photo, academicYear, status, designation, bio
🏗️ NEW Service Layer
Service Interface	Implementation	Methods
PublicService	PublicServiceImpl	getPublicRoster(), getMatches(), getLatestResult(), getNews(), getNewsBySlug(), getAchievements(), getEvents(), getGallery(), getVideos(), getTeamInfo()
MatchService	MatchServiceImpl	getAllMatches(), createMatch(), updateMatch(), deleteMatch()
NewsService	NewsServiceImpl	getAllNews(), createNews(), updateNews(), deleteNews()
AchievementService	AchievementServiceImpl	getAll(), create(), update(), delete()
EventService	EventServiceImpl	getAll(), create(), update(), delete()
GalleryService	GalleryServiceImpl	getAll(), create(), delete()
VideoService	VideoServiceImpl	getAll(), create(), update(), delete()
TeamInfoService	TeamInfoServiceImpl	getTeamInfo(), updateTeamInfo()
🏪 NEW Repositories
Repository	Entity	Key Custom Methods
MatchRepository	Match	findAllByOrderByDateDesc(), findFirstByStatusOrderByDateDesc("COMPLETED")
NewsRepository	News	findAllByOrderByPublishedAtDesc(), findBySlug()
AchievementRepository	Achievement	findAllByOrderByYearDesc()
EventRepository	Event	findAllByOrderByDateDesc()
GalleryRepository	Gallery	findAllByOrderByDateDesc()
VideoRepository	Video	findAllByOrderByDateDesc()
TeamInfoRepository	TeamInfo	(standard findById — singleton, always id=1)
Modify existing: | PlayerRepository | Player | ADD: findAllByShowOnPublicRosterTrue() |

🔐 SECURITY RULES UPDATE

Apply
Current Rules:
  /api/auth/**     → Public
  /api/admin/**    → ROLE_ADMIN
  /api/players/**  → ROLE_PLAYER
  /api/announcements → Authenticated

ADD These Rules:
  /api/public/**   → Public (permitAll, no authentication required)
Your SecurityConfig should add:


Apply
.requestMatchers("/api/public/**").permitAll()
right alongside the existing /api/auth/** permitAll rule.

🗃️ FLYWAY MIGRATIONS TO CREATE
You'll need these new migration files:


Apply
V2__add_player_roster_columns.sql         → ALTER TABLE players ADD jersey_number, designation, bio, photo_url, show_on_public_roster
V3__create_matches_table.sql              → CREATE TABLE matches
V4__create_news_table.sql                 → CREATE TABLE news
V5__create_achievements_table.sql         → CREATE TABLE achievements
V6__create_events_table.sql               → CREATE TABLE events
V7__create_gallery_table.sql              → CREATE TABLE gallery
V8__create_videos_table.sql               → CREATE TABLE videos
V9__create_team_info_table.sql            → CREATE TABLE team_info + INSERT default seed row
📋 DataInitializer Update
Your existing DataInitializer (which seeds the admin user) should also seed the default team_info singleton row:


Apply
// Inside DataInitializer.run()
if (teamInfoRepository.count() == 0) {
    TeamInfo info = new TeamInfo();
    info.setName("MUJ Volleyball");
    info.setSeason("2024-25");
    info.setDescription("Manipal University Jaipur Volleyball Team...");
    info.setPhilosophy("Passion • Discipline • Teamwork");
    info.setVision("To be the leading university volleyball program...");
    info.setHistory("Founded in 2011...");
    teamInfoRepository.save(info);
}
🔄 FRONTEND publicService.js — What It Should Become
Once the backend is ready, replace the mock-based service with real API calls:


Apply
import api from './axiosConfig';

export const publicService = {
  getPlayers:       () => api.get('/api/public/team').then(res => res.data),
  getMatches:       () => api.get('/api/public/matches').then(res => res.data),
  getLatestResult:  () => api.get('/api/public/matches/latest-result').then(res => res.data),
  getNews:          () => api.get('/api/public/news').then(res => res.data),
  getNewsBySlug:    (slug) => api.get(`/api/public/news/${slug}`).then(res => res.data),
  getAchievements:  () => api.get('/api/public/achievements').then(res => res.data),
  getEvents:        () => api.get('/api/public/events').then(res => res.data),
  getGallery:       () => api.get('/api/public/gallery').then(res => res.data),
  getVideos:        () => api.get('/api/public/videos').then(res => res.data),
  getTeamInfo:      () => api.get('/api/public/team-info').then(res => res.data),
};
📝 COMPLETE CHECKLIST
Database (7 new tables + 1 table modified)
[ ] ALTER players — add 5 columns (jersey_number, designation, bio, photo_url, show_on_public_roster)
[ ] CREATE matches table
[ ] CREATE news table
[ ] CREATE achievements table
[ ] CREATE events table
[ ] CREATE gallery table
[ ] CREATE videos table
[ ] CREATE team_info table + seed default row
Backend Entities (7 new)
[ ] Match.java, News.java, Achievement.java, Event.java, Gallery.java, Video.java, TeamInfo.java
[ ] Update Player.java — add new fields
Enums (4 new)
[ ] MatchStatus, EventStatus, GalleryCategory, VideoCategory, Designation
Repositories (7 new + 1 modified)
[ ] MatchRepository, NewsRepository, AchievementRepository, EventRepository, GalleryRepository, VideoRepository, TeamInfoRepository
[ ] Update PlayerRepository — add findAllByShowOnPublicRosterTrue()
Services (8 new)
[ ] PublicService, MatchService, NewsService, AchievementService, EventService, GalleryService, VideoService, TeamInfoService
Controllers (9 new + 1 modified)
[ ] PublicController (10 GET endpoints, public access)
[ ] AdminMatchController (CRUD)
[ ] AdminNewsController (CRUD)
[ ] AdminAchievementController (CRUD)
[ ] AdminEventController (CRUD)
[ ] AdminGalleryController (Create + Delete)
[ ] AdminVideoController (CRUD)
[ ] AdminTeamInfoController (GET + PUT)
[ ] Update AdminPlayerController — add PATCH roster endpoint
DTOs (16+ new)
[ ] Request/Response DTOs for all 7 new entities + roster update
Security
[ ] Add /api/public/** → permitAll() in SecurityConfig
Flyway Migrations (8 files)
[ ] V2 through V9
DataInitializer
[ ] Seed default team_info row
Frontend
[ ] Replace publicService.js mock calls with real API calls
[ ] Delete data/mock/ folder once backend is live