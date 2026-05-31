# WIREFRAME.md

# Application Wireframe & Component Hierarchy

This wireframe specifies the structural layout, component tree, and visual navigation patterns for the StudyCircle responsive web application.

---

## 1. Global Navigation Layout

StudyCircle uses a **Dashboard-First Sidebar Layout** for authenticated users and a **Clean Minimal Navbar Layout** for guest users.

### 1.1 Unauthenticated (Guest View)
```
┌────────────────────────────────────────────────────────────────────────┐
│  [Logo] StudyCircle                 [Explore Groups]   [Login] [Register]  │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│                      Academic Hero Title Banner                        │
│                "Collaborate. Track. Master Academic Goals."            │
│                         [Get Started / Browse Now]                     │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Authenticated (Student View)
```
┌────────────────────────┬───────────────────────────────────────────────┐
│ [Logo] StudyCircle     │  Top Navigation Header: [Active Notifications]│
├────────────────────────┤  [User Profile avatar dropdown menu]          │
│ 🔘 Dashboard           ├───────────────────────────────────────────────┤
│ 👥 Study Groups        │                                               │
│ 📅 My Sessions         │             Main Content viewport             │
│ 📁 Materials Library   │         (Frosted-glass container grid)         │
│ 📈 Analytics           │                                               │
│ 👤 Profile settings    │                                               │
│                        │                                               │
│ 🚪 Logout              │                                               │
└────────────────────────┴───────────────────────────────────────────────┘
```

---

## 2. Core Dashboard Mockup
```
┌────────────────────────────────────────────────────────────────────────┐
│ Dashboard Overview                                                     │
├────────────────────────────────────────────────────────────────────────┤
│  [ Progress Analytics Snapshot ]                                       │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐        │
│  │ Sessions Joined  │ │ Study Duration   │ │ Current Mastery  │        │
│  │      14          │ │    22.5 Hours    │ │   Advanced       │        │
│  └──────────────────┘ └──────────────────┘ └──────────────────┘        │
├────────────────────────────────────────────────────────────────────────┤
│  [ Upcoming Sessions ]                 [ Joined Study Circles ]        │
│  ┌──────────────────────────────────┐  ┌────────────────────────────┐  │
│  │ Advanced Algorithms - Session #4 │  │ 💻 IF-201 Advanced Web     │  │
│  │ ⏰ Today 18:00 - 20:00 (Pending) │  │ 👥 8 / 10 members (Active) │  │
│  │ [Join Session Now]               │  │ [Open Group Workspace]     │  │
│  └──────────────────────────────────┘  └────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Study Group Workspace Mockup
```
┌────────────────────────────────────────────────────────────────────────┐
│ Study Circle: IF-201 Advanced Web Programming                           │
├────────────────────────────────────────────────────────────────────────┤
│  Subject Code: IF-201 | Capacity: 8/10 members | [Leave Group]          │
├────────────────────────────────────────────────────────────────────────┤
│  Tab Navigation: [📋 General Info] [📅 Sessions] [📁 Materials] [👥 Members]│
├────────────────────────────────────────────────────────────────────────┤
│  [Materials Viewport Tab]                                              │
│  - [Upload New Resource Button (Trigger Upload Dialog)]                │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ 📄 lecture-2-express-middleware.pdf (1.2 MB) | Uploader: Alice    │  │
│  │ 📅 Uploaded: 2026-05-30 | [Download Resource] [Delete (Admin/Own)]│  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │ 📄 react-state-management.pptx (4.5 MB)      | Uploader: Bob      │  │
│  │ 📅 Uploaded: 2026-05-29 | [Download Resource] [Delete (Admin/Own)]│  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Visual Styling Directives
* **Aesthetic Palette:** Deep Charcoal Slate Base (`#0B0F19`), Frosted-Glass Containers with thin Indigo Borders, White clean typography, Accent highlights using Emerald (`#10B981`) for active and complete stats, Amber (`#F59E0B`) for pending triggers.
* **UX Micro-Animations:** Implement smooth, interactive transitional effects on hover, layout changes, active badges, and navigation items.