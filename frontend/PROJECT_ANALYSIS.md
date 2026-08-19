🏐 PROJECT ANALYSIS — Sports Management System Backend
📋 Project Overview
Project Name: Volleyball Trial Management System Backend
Group ID: com.sportsmanagementsystem
Artifact ID: backend
Framework: Spring Boot 4.0.8-SNAPSHOT
Java Version: 21
Database: MySQL (with Flyway migrations)
Authentication: JWT (jjwt 0.12.3)
Security: Spring Security with role-based access (ADMIN, PLAYER)
Build Tool: Maven
ORM: Spring Data JPA / Hibernate
Other Libraries: Lombok, Bean Validation
🗄️ DATABASE MODEL — Tables & Attributes
Table 1: users
Column	Type	Constraints
id	BIGINT	PK, AUTO_INCREMENT
name	VARCHAR(100)	NOT NULL
email	VARCHAR(150)	NOT NULL, UNIQUE, INDEX
password	VARCHAR(255)	NOT NULL
role	VARCHAR(20)	NOT NULL, INDEX (values: PLAYER, ADMIN)
created_at	TIMESTAMP	NOT NULL, DEFAULT CURRENT_TIMESTAMP
Relationships:

One-to-One → players (a user can have one player profile)
One-to-Many → evaluations (as admin who evaluates)
One-to-Many → announcements (as creator)
Table 2: players
Column	Type	Constraints
id	BIGINT	PK, AUTO_INCREMENT
user_id	BIGINT	NOT NULL, UNIQUE, FK → users(id) ON DELETE CASCADE, INDEX
college_registration_no	VARCHAR(50)	NOT NULL, UNIQUE, INDEX
phone	VARCHAR(20)	NOT NULL
year	INT	NOT NULL, INDEX
position	VARCHAR(20)	NOT NULL, INDEX (enum: SETTER, OUTSIDE_HITTER, OPPOSITE, MIDDLE_BLOCKER, LIBERO, UNSURE)
height_cm	DECIMAL(5,1)	NOT NULL
status	VARCHAR(20)	NOT NULL, INDEX (enum: PENDING, SHORTLISTED, SELECTED, REJECTED)
active	BOOLEAN	NOT NULL, DEFAULT TRUE, INDEX
created_at	TIMESTAMP	NOT NULL, DEFAULT CURRENT_TIMESTAMP
updated_at	TIMESTAMP	NULL, ON UPDATE CURRENT_TIMESTAMP
Relationships:

One-to-One → users (FK: user_id)
One-to-One → evaluations (a player can have one evaluation)
Table 3: evaluations
Column	Type	Constraints
id	BIGINT	PK, AUTO_INCREMENT
player_id	BIGINT	NOT NULL, UNIQUE, FK → players(id) ON DELETE CASCADE, INDEX
admin_id	BIGINT	NOT NULL, FK → users(id), INDEX
serving	TINYINT	NOT NULL, CHECK (0-10)
reception	TINYINT	NOT NULL, CHECK (0-10)
attack	TINYINT	NOT NULL, CHECK (0-10)
blocking	TINYINT	NOT NULL, CHECK (0-10)
defence	TINYINT	NOT NULL, CHECK (0-10)
game_sense	TINYINT	NOT NULL, CHECK (0-10)
total_score	TINYINT	NOT NULL, CHECK (0-60), auto-calculated via @PrePersist/@PreUpdate
notes	TEXT	NULLABLE
created_at	TIMESTAMP	NOT NULL, DEFAULT CURRENT_TIMESTAMP
updated_at	TIMESTAMP	NULL, ON UPDATE CURRENT_TIMESTAMP
Relationships:

One-to-One → players (FK: player_id)
Many-to-One → users (FK: admin_id — the admin who evaluated)
Auto-calculation: totalScore = serving + reception + attack + blocking + defence + gameSense

Table 4: announcements
Column	Type	Constraints
id	BIGINT	PK, AUTO_INCREMENT
title	VARCHAR(150)	NOT NULL
message	TEXT	NOT NULL
created_by	BIGINT	NOT NULL, FK → users(id), INDEX
created_at	TIMESTAMP	NOT NULL, DEFAULT CURRENT_TIMESTAMP, INDEX
updated_at	TIMESTAMP	NULL, ON UPDATE CURRENT_TIMESTAMP
Relationships:

Many-to-One → users (FK: created_by — the admin who created it)
🔗 ENTITY RELATIONSHIP DIAGRAM (Text)

Apply
┌──────────────┐     1:1      ┌──────────────┐     1:1      ┌──────────────────┐
│    users     │─────────────▶│   players    │─────────────▶│   evaluations    │
│              │              │              │              │                  │
│ id (PK)      │              │ id (PK)      │              │ id (PK)          │
│ name         │              │ user_id (FK) │              │ player_id (FK)   │
│ email        │              │ college_reg  │              │ admin_id (FK)────┐
│ password     │              │ phone        │              │ serving          │
│ role         │              │ year         │              │ reception        │
│ created_at   │              │ position     │              │ attack           │
└──────┬───────┘              │ height_cm    │              │ blocking         │
       │                      │ status       │              │ defence          │
       │                      │ active       │              │ game_sense       │
       │                      │ created_at   │              │ total_score      │
       │                      │ updated_at   │              │ notes            │
       │                      └──────────────┘              │ created_at       │
       │                                                    │ updated_at       │
       │  1:N                                               └──────────────────┘
       │         ┌──────────────────┐                              │
       ├────────▶│  announcements   │                              │
       │         │                  │                              │
       │         │ id (PK)          │                              │
       │         │ title            │                              │
       │         │ message          │         N:1                  │
       │         │ created_by (FK)  │◀─────────────────────────────┘
       │         │ created_at       │   (admin who evaluated)
       │         │ updated_at       │
       │         └──────────────────┘
       │
       └─── (admin creates announcements & evaluations)
🎯 ENUMS
Role
Value	Description
PLAYER	Registered player
ADMIN	System admin
Position
Value	Description
SETTER	Setter
OUTSIDE_HITTER	Outside Hitter
OPPOSITE	Opposite
MIDDLE_BLOCKER	Middle Blocker
LIBERO	Libero
UNSURE	Unsure
PlayerStatus
Value	Description
PENDING	Awaiting review
SHORTLISTED	Shortlisted
SELECTED	Selected for team
REJECTED	Rejected
🎮 CONTROLLERS & API ENDPOINTS
1. AuthController (/api/auth)
Method	Endpoint	Access	Description
POST	/api/auth/register	Public	Register new player
POST	/api/auth/login	Public	Login (get JWT)
2. PlayerController (/api/players)
Method	Endpoint	Access	Description
GET	/api/players/me	ROLE_PLAYER	Get own profile
PUT	/api/players/me	ROLE_PLAYER	Update own profile
GET	/api/players/me/evaluation	ROLE_PLAYER	Get own evaluation
3. AdminPlayerController (/api/admin/players)
Method	Endpoint	Access	Description
GET	/api/admin/players	ROLE_ADMIN	List all players (paginated, filtered)
GET	/api/admin/players/{id}	ROLE_ADMIN	Get player by ID
PUT	/api/admin/players/{id}	ROLE_ADMIN	Update player
PATCH	/api/admin/players/{id}/status	ROLE_ADMIN	Update player status
DELETE	/api/admin/players/{id}	ROLE_ADMIN	Soft-delete player (active=false)
4. AdminEvaluationController (/api/admin/players)
Method	Endpoint	Access	Description
POST	/api/admin/players/{playerId}/evaluation	ROLE_ADMIN	Create evaluation
PUT	/api/admin/players/{playerId}/evaluation	ROLE_ADMIN	Update evaluation
GET	/api/admin/players/{playerId}/evaluation	ROLE_ADMIN	Get evaluation by player
5. AnnouncementController (/api)
Method	Endpoint	Access	Description
GET	/api/announcements	Authenticated	List all announcements
POST	/api/admin/announcements	ROLE_ADMIN	Create announcement
PUT	/api/admin/announcements/{id}	ROLE_ADMIN	Update announcement
DELETE	/api/admin/announcements/{id}	ROLE_ADMIN	Delete announcement
6. DashboardController (/api/admin)
Method	Endpoint	Access	Description
GET	/api/admin/dashboard	ROLE_ADMIN	Get dashboard stats
📦 DTOs (Data Transfer Objects)
Auth DTOs
DTO	Fields
RegisterRequest	name, email, password, collegeRegistrationNo, phone, year, position, heightCm
LoginRequest	email, password
AuthResponse	token, userId, name, email, role, playerId
Player DTOs
DTO	Fields
PlayerResponse	id, userId, name, email, collegeRegistrationNo, phone, year, position, heightCm, status, active, createdAt, updatedAt
UpdatePlayerRequest	phone, year, position, heightCm
UpdatePlayerStatusRequest	status
Evaluation DTOs
DTO	Fields
CreateEvaluationRequest	serving, reception, attack, blocking, defence, gameSense, notes
UpdateEvaluationRequest	serving, reception, attack, blocking, defence, gameSense, notes
EvaluationResponse	id, playerId, playerName, adminId, adminName, serving, reception, attack, blocking, defence, gameSense, totalScore, notes, createdAt, updatedAt
Announcement DTOs
DTO	Fields
CreateAnnouncementRequest	title, message
UpdateAnnouncementRequest	title, message
AnnouncementResponse	id, title, message, createdBy, createdByName, createdAt, updatedAt
Dashboard DTOs
DTO	Fields
DashboardStatsResponse	totalPlayers, pending, shortlisted, selected, rejected, evaluated
🔐 SECURITY & AUTH
Authentication: JWT Bearer Token
Password Encoding: BCrypt
Token Expiration: 86400000ms (24 hours)
Filter: JwtAuthenticationFilter (extracts JWT from Authorization header)
UserDetailsService: Loads user by email, assigns ROLE_PLAYER or ROLE_ADMIN
Admin Seeding: Auto-created on startup via DataInitializer (CommandLineRunner)
Security Rules
Pattern	Access
/api/auth/**	Public
/api/admin/**	ROLE_ADMIN
/api/players/me/**	ROLE_PLAYER
/api/announcements	Authenticated
Everything else	Authenticated
🏗️ SERVICE LAYER
Service Interface	Implementation	Methods
AuthService	AuthServiceImpl	register(), login()
PlayerService	PlayerServiceImpl	getMyProfile(), updateMyProfile()
AdminPlayerService	AdminPlayerServiceImpl	getAllPlayers(), getPlayerById(), updatePlayer(), updatePlayerStatus(), deletePlayer()
EvaluationService	EvaluationServiceImpl	createEvaluation(), updateEvaluation(), getEvaluationByPlayerId(), getMyEvaluation()
AnnouncementService	AnnouncementServiceImpl	getAllAnnouncements(), createAnnouncement(), updateAnnouncement(), deleteAnnouncement()
DashboardService	DashboardServiceImpl	getDashboardStats()
🏪 REPOSITORIES
Repository	Entity	Custom Methods
UserRepository	User	findByEmail(), existsByEmail()
PlayerRepository	Player	existsByCollegeRegistrationNo(), findByUserId(), findAllActive(), findAllActiveWithSearch(), findAllActiveWithFilters(), countByActiveAndStatus(), countByActive()
EvaluationRepository	Evaluation	findByPlayerId(), existsByPlayerId(), countEvaluatedActivePlayers()
AnnouncementRepository	Announcement	findAllByOrderByCreatedAtDesc()
⚠️ EXCEPTION HANDLING
Exception Class	HTTP Status	Usage
ResourceNotFoundException	404	Entity not found
| DuplicateResourceException