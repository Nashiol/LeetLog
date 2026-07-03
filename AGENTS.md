# LeetLog — Agent Instructions

> This file is the authoritative reference for AI agents working on the LeetLog codebase. Read this entire file before writing any code, creating any file, or making any architectural decision. Every decision made in this project must align with what is defined here.

---

## What is LeetLog?

LeetLog is a full-stack web application that helps developers track, review, and master coding interview preparation. It is not a simple CRUD app — it is a structured preparation system with five distinct tracking areas and a built-in Spaced Repetition System (SRS) powered by the SM-2 algorithm.

**One-line description:**
> Track your LeetCode problem-solving journey — log problems, difficulty, solutions, and monitor your progress over time.

**Author:** Nashiol
**Version:** 1.0
**Started:** July 2026

---

## Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Frontend + Backend | Next.js 14 (App Router) | Use App Router exclusively. No Pages Router. |
| Database | Supabase (PostgreSQL) | All data lives here. Use Supabase client. |
| Authentication | Supabase Auth | Email + password only for V1. |
| Styling | Tailwind CSS | No other CSS frameworks. No inline styles. |
| Code Editor | Monaco Editor | Used for code snippet fields only. |
| Deployment | Vercel | Target platform. Ensure Vercel compatibility. |

### Rules for the agent
- Always use the **App Router** (`app/` directory). Never create files under `pages/`.
- Always use **TypeScript** (`.tsx`, `.ts`). Never use plain JavaScript files.
- Always use **Tailwind CSS** for styling. Never write custom CSS files unless absolutely necessary.
- Use **Supabase client** (`@supabase/supabase-js`) for all database operations.
- Use **Supabase Auth** for all authentication — never build custom auth logic.

---

## Project Structure

```
leetlog/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/page.tsx
│   │   ├── leetcode/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── dsa/page.tsx
│   │   ├── dsa/new/page.tsx
│   │   ├── interview/page.tsx
│   │   ├── coding/page.tsx
│   │   └── system-design/page.tsx
│   └── api/
│       ├── leetcode/route.ts
│       ├── dsa/route.ts
│       └── review/route.ts
├── components/
│   ├── ui/              ← Reusable primitives (Button, Input, Badge, Modal, etc.)
│   ├── leetcode/        ← Components specific to the LeetCode tab
│   ├── dashboard/       ← Components specific to the Dashboard
│   └── shared/          ← Shared layout components (Sidebar, Navbar, etc.)
├── lib/
│   ├── supabase.ts      ← Supabase client initialisation
│   ├── sm2.ts           ← SM-2 spaced repetition algorithm (critical — do not modify logic)
│   └── utils.ts         ← General utility functions
└── types/
    └── index.ts         ← All TypeScript interfaces and types live here
```

### Rules for the agent
- Never create components outside of the `components/` directory.
- Never write database logic directly in page components — use API routes or server actions.
- Never modify `lib/sm2.ts` logic unless explicitly instructed. The SM-2 algorithm is fixed.
- All TypeScript types must be defined in `types/index.ts`.

---

## Data Models

All models are stored in Supabase (PostgreSQL). Every table has a `user_id` foreign key linking to the authenticated user. The agent must always scope queries to the current user's `user_id`.

### User
Managed entirely by Supabase Auth. Do not create a separate `users` table — use `auth.users`.

| Field | Type | Notes |
|---|---|---|
| email | string | Unique, required |
| name | string | Required |
| password | string | Handled by Supabase Auth, never stored in plain text |

---

### leetcode_problems
The core table. Powers the LeetCode tab and the spaced repetition system.

| Field | Type | Notes |
|---|---|---|
| id | uuid | Primary key, auto-generated |
| user_id | uuid | Foreign key to auth.users |
| problem_number | integer | LeetCode problem number |
| question | string | Problem title |
| link | string | URL to the LeetCode problem |
| difficulty | enum | `easy`, `medium`, `hard` |
| programming_language | string | e.g. JavaScript, Python, TypeScript |
| code_snippet | text | Full solution code — rendered in Monaco Editor |
| notes | text | Personal notes on approach |
| date_solved | date | When the user first solved it |
| next_review_date | date | **Critical** — drives the Due Today feature |
| repetition_count | integer | How many times reviewed. Default: 0 |
| ease_factor | float | SM-2 ease factor. Default: 2.5 |
| status | enum | `in_progress`, `due_for_review`, `mastered` |
| created_at | timestamp | Auto-generated |

---

### dsa_concepts
Tracks Data Structures & Algorithms study sessions.

| Field | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| user_id | uuid | Foreign key to auth.users |
| topic | string | e.g. Binary Search, Dynamic Programming, Graphs |
| resource_used | string | YouTube video, book, article, NeetCode, etc. |
| notes | text | Detailed study notes |
| mastery_level | enum | `not_started`, `learning`, `comfortable`, `mastered` |
| date_studied | date | When the session took place |
| created_at | timestamp | Auto-generated |

---

### interview_questions
Common behavioral and technical interview Q&A.

| Field | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| user_id | uuid | Foreign key to auth.users |
| question | string | The interview question |
| answer | text | Model answer |
| notes | text | Personal notes or alternative answers |
| created_at | timestamp | Auto-generated |

---

### coding_questions
Open-ended coding challenges with linked repository solutions.

| Field | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| user_id | uuid | Foreign key to auth.users |
| question | string | The coding challenge description |
| repository_link | string | GitHub repo URL with the solution |
| notes | text | Approach, lessons learned, improvements |
| date_created | date | When the challenge was completed |
| created_at | timestamp | Auto-generated |

---

### system_design
System design questions tagged by company.

| Field | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| user_id | uuid | Foreign key to auth.users |
| question | string | The system design question |
| company | string | Company that asked the question |
| answer | text | Full answer/approach |
| notes | text | Feedback or improvements |
| created_at | timestamp | Auto-generated |

---

## Spaced Repetition System (SM-2 Algorithm)

> This is the most critical feature in LeetLog. The agent must implement this correctly and must never bypass or simplify this logic.

### How it works

1. User logs a solved LeetCode problem → `next_review_date` is set to **today + 1 day**, `status` is set to `in_progress`
2. When `next_review_date` arrives, the problem appears in the **Due Today** section on the dashboard → `status` becomes `due_for_review`
3. User revisits the problem, attempts it, and rates their confidence
4. The system recalculates `next_review_date`, increments `repetition_count`, adjusts `ease_factor`
5. When `repetition_count >= 4` and the last rating was `easy` or `very_easy`, `status` becomes `mastered`

### Confidence Rating → Interval Mapping

| Rating | Emoji | Next Review | ease_factor change |
|---|---|---|---|
| `hard` | 😰 | +1 day | Decrease by 0.2 (min 1.3) |
| `medium` | 😐 | +3 days | No change |
| `easy` | 😊 | +7 days | Increase by 0.1 |
| `very_easy` | 🚀 | +14 days | Increase by 0.15 |

### Example progression

```
Initial solve      →  next_review_date: +1 day,   repetition_count: 0
Review 1 (easy)    →  next_review_date: +7 days,  repetition_count: 1
Review 2 (easy)    →  next_review_date: +14 days, repetition_count: 2
Review 3 (easy)    →  next_review_date: +30 days, repetition_count: 3
Review 4 (very_easy) → status: MASTERED,          repetition_count: 4
```

### SM-2 implementation location

All SM-2 logic lives exclusively in `lib/sm2.ts`. The function signature must be:

```typescript
export function calculateNextReview(
  currentEaseFactor: number,
  repetitionCount: number,
  rating: 'hard' | 'medium' | 'easy' | 'very_easy'
): {
  nextReviewDate: Date;
  newEaseFactor: number;
  newRepetitionCount: number;
  newStatus: 'in_progress' | 'due_for_review' | 'mastered';
}
```

---

## Application Routes

| Route | Page | Purpose |
|---|---|---|
| `/` | Landing Page | App intro, sign up / login CTA |
| `/auth/signup` | Sign Up | Email, Name, Password registration |
| `/auth/login` | Login | Email + password login |
| `/dashboard` | Dashboard | Due Today, Stats, Recent Activity, Streak |
| `/leetcode` | LeetCode Logs | Full table of all logged problems |
| `/leetcode/new` | Add Problem | Form to log a new LeetCode problem |
| `/leetcode/[id]` | Problem Detail | View, edit, trigger spaced repetition review |
| `/dsa` | DSA Concepts | Table of all studied DSA concepts |
| `/dsa/new` | Add Concept | Log a new DSA study session |
| `/interview` | Interview Questions | Common Q&A reference list |
| `/coding` | Coding Questions | Coding challenges with repo links |
| `/system-design` | System Design | System design Q&A by company |

### Route protection rules
- `/auth/login` and `/auth/signup` are **public** — redirect to `/dashboard` if already logged in
- `/` (landing) is **public**
- All other routes are **protected** — redirect to `/auth/login` if not authenticated
- Use Supabase Auth middleware (`middleware.ts`) for route protection

---

## Dashboard

The dashboard at `/dashboard` is the home screen after login. It must display:

1. **Due Today** — list of `leetcode_problems` where `next_review_date <= today` and `status != 'mastered'`. Each item shows problem title, difficulty badge, and a "Review Now" button.
2. **Problems Solved** — count of all problems broken down by `difficulty` (easy / medium / hard)
3. **Current Streak** — consecutive days where the user has at least one log entry across any table
4. **Mastery Progress** — count of `mastered` problems vs total problems
5. **Recent Activity** — the last 5 entries across all tables, sorted by `created_at` descending

---

## Features Per Tab

### LeetCode Tab (`/leetcode`)
- Table view of all logged problems with columns: Problem Number, Title, Difficulty, Language, Date Solved, Status, Next Review
- Status badge: `In Progress` (grey) / `Due for Review` (orange) / `Mastered` (green)
- Filter by difficulty: Easy / Medium / Hard
- Search by problem name or number
- Click a row to go to `/leetcode/[id]`
- Button to go to `/leetcode/new`

### LeetCode Problem Detail (`/leetcode/[id]`)
- Full view of all fields
- Monaco Editor for the code snippet (read-only unless in edit mode)
- Edit button to update any field
- **Review button** — only visible when `status === 'due_for_review'`. Opens a confidence rating modal with the four options (Hard / Medium / Easy / Very Easy). On submit, calls the SM-2 algorithm and updates the record.

### DSA Tab (`/dsa`)
- Table view of all DSA study sessions
- Columns: Topic, Resource Used, Mastery Level, Date Studied
- Filter by mastery level
- Mastery level badge with colour coding: Not Started (grey) / Learning (blue) / Comfortable (yellow) / Mastered (green)

### Interview Questions Tab (`/interview`)
- List/card view of all Q&A entries
- Expandable cards — click to reveal the full answer
- Add / Edit / Delete

### Coding Questions Tab (`/coding`)
- Table view with: Question, Repository Link (clickable), Date Created
- Click repo link opens GitHub in new tab
- Add / Edit / Delete

### System Design Tab (`/system-design`)
- Table view with: Question, Company badge, Date
- Click to expand full answer
- Add / Edit / Delete

---

## Development Order

Build in this exact order. Do not skip phases or build out of sequence.

| # | Phase | What to build |
|---|---|---|
| 1 | Project Setup | Next.js + Supabase + Tailwind CSS + Monaco Editor |
| 2 | Authentication | Signup, Login, middleware route protection |
| 3 | LeetCode Tab | Full CRUD for leetcode_problems |
| 4 | Spaced Repetition | SM-2 in `lib/sm2.ts`, review flow, Due Today on dashboard |
| 5 | DSA Tab | Full CRUD for dsa_concepts |
| 6 | Interview Questions | Full CRUD for interview_questions |
| 7 | Coding Questions | Full CRUD for coding_questions |
| 8 | System Design | Full CRUD for system_design |
| 9 | Stats Dashboard | Streak, difficulty breakdown, mastery progress, recent activity |
| 10 | UI Polish | Responsive layout, dark mode, empty states, loading skeletons |

---

## TypeScript Types

All types must be defined in `types/index.ts`. The agent must use these exact type names throughout the codebase.

```typescript
export type Difficulty = 'easy' | 'medium' | 'hard';
export type ProblemStatus = 'in_progress' | 'due_for_review' | 'mastered';
export type MasteryLevel = 'not_started' | 'learning' | 'comfortable' | 'mastered';
export type ReviewRating = 'hard' | 'medium' | 'easy' | 'very_easy';

export interface LeetCodeProblem {
  id: string;
  user_id: string;
  problem_number: number;
  question: string;
  link: string;
  difficulty: Difficulty;
  programming_language: string;
  code_snippet: string;
  notes: string;
  date_solved: string;
  next_review_date: string;
  repetition_count: number;
  ease_factor: number;
  status: ProblemStatus;
  created_at: string;
}

export interface DSAConcept {
  id: string;
  user_id: string;
  topic: string;
  resource_used: string;
  notes: string;
  mastery_level: MasteryLevel;
  date_studied: string;
  created_at: string;
}

export interface InterviewQuestion {
  id: string;
  user_id: string;
  question: string;
  answer: string;
  notes: string;
  created_at: string;
}

export interface CodingQuestion {
  id: string;
  user_id: string;
  question: string;
  repository_link: string;
  notes: string;
  date_created: string;
  created_at: string;
}

export interface SystemDesign {
  id: string;
  user_id: string;
  question: string;
  company: string;
  answer: string;
  notes: string;
  created_at: string;
}
```

---

## Supabase Setup

### Environment variables required
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Supabase client (`lib/supabase.ts`)
```typescript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

### Row Level Security (RLS)
All tables must have RLS enabled. The policy for every table must be:
- Users can only SELECT, INSERT, UPDATE, DELETE their own rows (`user_id = auth.uid()`)

---

## V2 Features (Out of Scope for V1 — Do Not Build)

The following must NOT be built in V1. If the user asks about them, note them as future features:

- Mobile app (React Native / PWA)
- LeetCode API integration (auto-fill problem details)
- GitHub integration (auto-import repos)
- PDF export
- Dark mode
- Shareable profiles
- AI hint system
- Interview simulator / timed mock mode
- Email reminders for due reviews
- Team / study group mode

---

## Agent Rules Summary

1. Always use TypeScript — never plain JavaScript
2. Always use App Router — never Pages Router
3. Always scope database queries to `user_id = auth.uid()`
4. Never modify `lib/sm2.ts` logic unless explicitly told to
5. Never build V2 features during V1 development
6. Always define new types in `types/index.ts`
7. Never write styling outside of Tailwind CSS classes
8. Always protect routes using Supabase Auth middleware
9. Always handle loading and error states in every component
10. Always follow the development order — do not skip phases
