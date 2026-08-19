# 📘 Sports Management System – Admin Panel Frontend Specification & Setup Guide

This document contains all the endpoints, DTO formats, enum values, and recommendations needed to build the Admin Panel frontend for managing all public and internal sports management resources.

---

## 🔑 Authentication & Security Configuration

- **Base URL**: `http://localhost:8080` (or deployed API base URL)
- **Authentication Method**: JWT Bearer Token
- **Required Authorization Header**:
  ```http
  Authorization: Bearer <jwt_token_received_on_login>
  Content-Type: application/json
  ```
- **Admin Login Endpoint**: `POST /api/auth/login`
  - **Request Body**:
    ```json
    {
      "email": "admin@muj.edu",
      "password": "youradminpassword"
    }
    ```
  - **Response Body**:
    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiJ9...",
      "type": "Bearer",
      "role": "ADMIN",
      "email": "admin@muj.edu",
      "name": "Admin User"
    }
    ```

---

## 🗂 Enums Reference (Form Select / Dropdown Options)

Use these exact string values in request payloads:

| Enum Name | Allowed Values |
| :--- | :--- |
| **Position** | `SETTER`, `OUTSIDE_HITTER`, `OPPOSITE`, `MIDDLE_BLOCKER`, `LIBERO`, `UNSURE` |
| **PlayerStatus** | `PENDING`, `SHORTLISTED`, `SELECTED`, `REJECTED` |
| **Designation** | `CAPTAIN`, `VICE_CAPTAIN`, `MAIN_TEAM_PLAYER`, `SUBSTITUTE` |
| **MatchStatus** | `UPCOMING`, `COMPLETED`, `CANCELLED` |
| **EventStatus** | `UPCOMING`, `PAST`, `CANCELLED` |
| **GalleryCategory** | `MATCHES`, `TRAINING`, `EVENTS`, `OTHER` |
| **VideoCategory** | `HIGHLIGHTS`, `TRAINING`, `OTHER` |

---

## 📋 Module-by-Module API Endpoints & Request Payloads

---

### 1. 📰 News Management (`/api/admin/news`)

| Action | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **List All** | `GET` | `/api/admin/news` | Get list of all news articles |
| **Create** | `POST` | `/api/admin/news` | Create a new news article |
| **Update** | `PUT` | `/api/admin/news/{id}` | Edit an existing news article |
| **Delete** | `DELETE` | `/api/admin/news/{id}` | Delete a news article |

#### 🟢 **Create Request (`POST /api/admin/news`)**
```json
{
  "title": "MUJ Volleyball Wins Inter-University Trophy",
  "excerpt": "Brief summary of the news article...",
  "content": "Full story content or markdown text...",
  "coverImage": "https://example.com/images/news-cover.jpg",
  "author": "Sports Desk",
  "publishedAt": "2025-02-15T10:30:00"
}
```
> *Required fields*: `title`, `excerpt`, `content`, `author`

#### 🟡 **Update Request (`PUT /api/admin/news/{id}`)**
> *All fields optional in update request.*

---

### 2. 📅 Events Management (`/api/admin/events`)

| Action | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **List All** | `GET` | `/api/admin/events` | Get all scheduled events |
| **Create** | `POST` | `/api/admin/events` | Create a new event |
| **Update** | `PUT` | `/api/admin/events/{id}` | Update an existing event |
| **Delete** | `DELETE` | `/api/admin/events/{id}` | Remove an event |

#### 🟢 **Create Request (`POST /api/admin/events`)**
```json
{
  "title": "Annual Volleyball Trials 2025",
  "description": "Open trials for all undergraduate students.",
  "date": "2025-03-20",
  "time": "04:00 PM - 07:00 PM",
  "venue": "Outdoor Sports Complex Court 1",
  "image": "https://example.com/images/event.jpg",
  "status": "UPCOMING"
}
```
> *Required fields*: `title`, `description`, `date` (`YYYY-MM-DD`), `time`, `venue`, `status` (`UPCOMING`, `PAST`, `CANCELLED`)

---

### 3. 🏐 Matches Management (`/api/admin/matches`)

| Action | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **List All** | `GET` | `/api/admin/matches` | Get all matches |
| **Create** | `POST` | `/api/admin/matches` | Schedule a new match |
| **Update** | `PUT` | `/api/admin/matches/{id}` | Update match details or scores |
| **Delete** | `DELETE` | `/api/admin/matches/{id}` | Delete a match record |

#### 🟢 **Create Request (`POST /api/admin/matches`)**
```json
{
  "opponent": "IIT Delhi",
  "opponentLogo": "https://example.com/logos/iit-delhi.png",
  "date": "2025-04-10",
  "time": "05:00 PM",
  "venue": "Main Arena, MUJ",
  "competition": "State University League",
  "status": "UPCOMING",
  "result": "3 - 1",
  "sets": "25-21, 23-25, 25-18, 25-20"
}
```
> *Required fields*: `opponent`, `date`, `time`, `venue`, `competition`, `status` (`UPCOMING`, `COMPLETED`, `CANCELLED`)

---

### 4. 🏆 Achievements Management (`/api/admin/achievements`)

| Action | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **List All** | `GET` | `/api/admin/achievements` | Get all team achievements |
| **Create** | `POST` | `/api/admin/achievements` | Add new achievement |
| **Update** | `PUT` | `/api/admin/achievements/{id}` | Edit achievement details |
| **Delete** | `DELETE` | `/api/admin/achievements/{id}` | Delete achievement |

#### 🟢 **Create Request (`POST /api/admin/achievements`)**
```json
{
  "year": "2024",
  "title": "Gold Medalists",
  "competition": "North Zone Inter-University Championship",
  "description": "Defeated 16 teams without losing a single set.",
  "image": "https://example.com/images/trophy.jpg"
}
```
> *Required fields*: `year`, `title`, `competition`

---

### 5. 🖼️ Gallery Management (`/api/admin/gallery`)

| Action | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **List All** | `GET` | `/api/admin/gallery` | List gallery images |
| **Create** | `POST` | `/api/admin/gallery` | Add image entry |
| **Delete** | `DELETE` | `/api/admin/gallery/{id}` | Delete image entry |

#### 🟢 **Create Request (`POST /api/admin/gallery`)**
```json
{
  "title": "Final Match Celebration",
  "image": "https://example.com/images/gallery-1.jpg",
  "category": "MATCHES",
  "date": "2025-01-15"
}
```
> *Required fields*: `title`, `image` (`category`: `MATCHES`, `TRAINING`, `EVENTS`, `OTHER`)

---

### 6. 🎥 Video Highlights Management (`/api/admin/videos`)

| Action | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **List All** | `GET` | `/api/admin/videos` | List video entries |
| **Create** | `POST` | `/api/admin/videos` | Add video entry |
| **Update** | `PUT` | `/api/admin/videos/{id}` | Update video entry |
| **Delete** | `DELETE` | `/api/admin/videos/{id}` | Delete video entry |

#### 🟢 **Create Request (`POST /api/admin/videos`)**
```json
{
  "title": "Championship Point & Victory Spike",
  "thumbnail": "https://example.com/images/video-thumb.jpg",
  "videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "category": "HIGHLIGHTS",
  "date": "2025-01-20"
}
```
> *Required fields*: `title`, `videoUrl` (`category`: `HIGHLIGHTS`, `TRAINING`, `OTHER`)

---

### 7. ℹ️ Team Info Management (`/api/admin/team-info`)

| Action | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Get Info** | `GET` | `/api/admin/team-info` | Fetch single team details object |
| **Update Info** | `PUT` | `/api/admin/team-info` | Update team details |

#### 🟡 **Update Request (`PUT /api/admin/team-info`)**
```json
{
  "name": "MUJ Volleyball Club",
  "season": "2024-25",
  "description": "Manipal University Jaipur Official Volleyball Squad.",
  "philosophy": "Discipline • Grit • Excellence",
  "vision": "To be nationwide leaders in collegiate volleyball.",
  "history": "Established in 2011..."
}
```

---

### 8. 📢 Announcements Management (`/api/admin/announcements`)

| Action | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **List Paginated** | `GET` | `/api/announcements?page=0&size=20` | Fetch public/all announcements |
| **Create** | `POST` | `/api/admin/announcements` | Post new announcement |
| **Update** | `PUT` | `/api/admin/announcements/{id}` | Edit announcement |
| **Delete** | `DELETE` | `/api/admin/announcements/{id}` | Delete announcement |

#### 🟢 **Create Request (`POST /api/admin/announcements`)**
```json
{
  "title": "Practice Session Time Change",
  "content": "Evening practice moved to 5:30 PM due to mid-term exams."
}
```

---

### 9. 🏃 Player & Roster Management (`/api/admin/players`)

| Action | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **List Players** | `GET` | `/api/admin/players?search=&position=&year=&status=&page=0&size=20` | Filtered & paginated player list |
| **Get Single** | `GET` | `/api/admin/players/{id}` | Get player profile by ID |
| **Update Status** | `PATCH` | `/api/admin/players/{id}/status` | Change selection status |
| **Update Roster** | `PATCH` | `/api/admin/players/{id}/roster` | Update jersey #, designation, position |
| **Update Profile** | `PUT` | `/api/admin/players/{id}` | Update basic player info |
| **Delete Player** | `DELETE` | `/api/admin/players/{id}` | Delete player profile |

#### 🟡 **Status Update Request (`PATCH /api/admin/players/{id}/status`)**
```json
{
  "status": "SELECTED"
}
```

#### 🟡 **Roster Update Request (`PATCH /api/admin/players/{id}/roster`)**
```json
{
  "jerseyNumber": 7,
  "rosterPosition": "SETTER",
  "designation": "CAPTAIN",
  "yearOfStudy": 3
}
```

---

### 10. 📈 Admin Dashboard Overview (`/api/admin/dashboard`)

| Action | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Get Overview Stats** | `GET` | `/api/admin/dashboard` | Fetch summary count statistics |

#### 🟢 **Response (`GET /api/admin/dashboard`)**
```json
{
  "totalPlayers": 42,
  "selectedPlayers": 14,
  "shortlistedPlayers": 8,
  "pendingPlayers": 20,
  "totalNews": 15,
  "totalEvents": 5,
  "totalMatches": 12,
  "totalAchievements": 6
}
```

---

## 🗺️ Recommended Admin Panel Frontend Structure

```
📱 Admin Panel Dashboard UI
│
├── 📊 Dashboard Home (/admin) ──────── Stats Overview (/api/admin/dashboard)
│
├── 🏐 Public Content Managers:
│   ├── 📰 News (/admin/news) ────────── List, Add Modal, Edit Modal, Delete
│   ├── 📅 Events (/admin/events) ────── List, Add Modal, Edit Modal, Delete
│   ├── 🏆 Matches (/admin/matches) ──── List, Add/Schedule Modal, Score Update Modal, Delete
│   ├── 🥇 Achievements (/admin/achievements) ── List, Add Modal, Edit Modal, Delete
│   ├── 🖼️ Gallery (/admin/gallery) ──── Photo Grid with Add Upload Modal & Delete button
│   ├── 🎥 Videos (/admin/videos) ────── List, Add Modal, Edit Modal, Delete
│   └── ℹ️ Team Info (/admin/team-info) ── Single Settings Form for About Us section
│
└── 👥 Player Management:
    ├── 🏃 Player Database (/admin/players) ── Filterable table with Status update action
    └── 📋 Roster & Roles (/admin/roster) ──── Roster Editor (Jersey #, Position, Designation)
```