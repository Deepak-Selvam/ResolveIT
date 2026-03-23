# 🏛️ Resolve IT — Frontend

Smart Civic Grievance & Feedback Management System

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173

---

## 🔐 Demo Login Credentials

| Role         | Email                      | Password     |
|-------------|----------------------------|--------------|
| 👤 Citizen   | citizen@resolveit.com      | citizen123   |
| 🛠️ Officer   | officer@resolveit.com      | officer123   |
| 🧑‍💼 Admin    | admin@resolveit.com        | admin123     |

> Click any credential tile on the Login page to auto-fill.

---

## 📁 Project Structure

```
src/
│
├── main.jsx                    # React entry point
├── App.jsx                     # Root router + auth gate
│
├── styles/
│   └── globals.css             # CSS variables, base styles, shared classes
│
├── data/
│   └── mockData.js             # All dummy data & credentials (single source of truth)
│
├── hooks/
│   └── useAuth.js              # Login/logout state management
│
├── utils/
│   └── helpers.js              # getStatusStyle, getGreeting, etc.
│
├── components/
│   ├── common/                 # Reusable UI atoms
│   │   ├── Logo.jsx            # Brand mark
│   │   ├── StatCard.jsx        # Metric display card (normal + compact)
│   │   ├── StatusBadge.jsx     # Colored pill badge for complaint status
│   │   └── ComplaintsTable.jsx # Shared complaints table (officer + admin)
│   │
│   └── layout/                 # Page-level shell components
│       ├── PublicNavbar.jsx    # Top nav for landing/auth pages
│       ├── DashboardTopbar.jsx # Sticky header inside dashboards
│       └── CityscapeBanner.jsx # Decorative city skyline strip
│
└── pages/
    ├── LandingPage.jsx         # Public home (hero, how-it-works, stats, footer)
    │
    ├── auth/
    │   ├── LoginPage.jsx       # Login form + demo credential hints
    │   └── RegisterPage.jsx    # New account registration form
    │
    ├── citizen/
    │   ├── CitizenDashboard.jsx  # Sidebar shell + tab routing
    │   ├── CitizenHome.jsx       # Overview stats + recent complaints
    │   ├── MyComplaints.jsx      # Full complaints list
    │   ├── SubmitComplaint.jsx   # New complaint form
    │   ├── NotificationsPage.jsx # Notification feed
    │   └── CitizenProfile.jsx    # Profile edit + stats + quick actions
    │
    ├── officer/
    │   ├── OfficerDashboard.jsx  # Sidebar shell + complaints table
    │   └── AreaTrendChart.jsx    # Recharts area chart
    │
    └── admin/
        ├── AdminDashboard.jsx    # Sidebar shell + complaints table + analytics
        └── AdminAnalyticsRow.jsx # Bar chart + AI suggestions side-by-side
```

---

## 🧩 Key Design Decisions

| Concern           | Decision |
|-------------------|----------|
| Auth              | `useAuth` hook — credentials checked against `mockData.js` |
| Routing           | Simple `page` state in `App.jsx` (no router library needed for this scale) |
| Data              | All mock data centralized in `src/data/mockData.js` |
| Shared styles     | CSS custom properties in `globals.css`; shared class names like `.card`, `.nav-item`, `.input-base` |
| Charts            | Recharts library (BarChart for admin, AreaChart for officer) |
| Role gating       | `App.jsx` renders the correct dashboard based on `user.role` |

---

## 🛠️ Tech Stack

- **React 18** + **Vite**
- **Recharts** for analytics charts
- **CSS Custom Properties** for theming
- **Google Fonts** — Nunito (body) + Sora (display headings)
