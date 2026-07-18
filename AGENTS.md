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
| Backend + Frontend | Django (server-rendered) | Django views + templates. No separate frontend framework. |
| Database | SQLite (`db.sqlite3`) | Default Django DB backend. Django ORM only. |
| Authentication | Custom Django `User` model | Email + password login. See **Authentication** section below. |
| Styling | Tailwind CSS | No other CSS frameworks. No inline styles. Compiled via `django-tailwind` or the Tailwind CLI watching `templates/`. |
| Code Editor | Monaco Editor (via CDN, vanilla JS) | Used for the `code_snippet` field only. Loaded in the template, bound to a hidden `<textarea>` for form submission. |
| Deployment | Any Django-friendly host (Railway, Render, Fly.io, PythonAnywhere) | Vercel is not used — this is a WSGI/ASGI app, not a Next.js app. |

### Rules for the agent
- Always use **Django's MVT pattern** (models, views, templates). No API-only/headless split unless explicitly instructed later.
- Always use **Python type hints** on function signatures. Never leave public functions untyped.
- Always use **Tailwind CSS** for styling. Never write ad-hoc CSS files unless absolutely necessary (and if so, keep it in `static/css/custom.css`, used sparingly).
- Use the **Django ORM** for all database operations. Never write raw SQL unless there is no ORM equivalent, and never bypass the ORM's query filtering.
- Use the **custom Django auth system** described below — never build authentication from scratch with hand-rolled session/token logic.

---

## Project Structure

```
leetlog/
├── manage.py
├── leetlog/                     ← Django project package
│   ├── settings.py
│   ├── urls.py                  ← includes each app's urls.py
│   ├── asgi.py / wsgi.py
├── users/                    ← custom User model + auth views
│   ├── models.py                ← User, UserManager
│   ├── managers.py
│   ├── forms.py                 ← SignupForm, LoginForm
│   ├── views.py                 ← signup, login, logout
│   ├── urls.py
│   └── templates/accounts/
│       ├── login.html
│       └── signup.html
├── dashboard/                   ← aggregation view only, no models
│   ├── views.py                 ← pulls from leetcode/dsa/interview_questions/coding_questions/system_design
│   ├── urls.py
│   └── templates/dashboard/
│       └── dashboard.html
├── leetcode/
│   ├── models.py                ← LeetCodeProblem
│   ├── forms.py
│   ├── views.py
│   ├── urls.py
│   ├── sm2.py                   ← SM-2 spaced repetition algorithm (critical — do not modify logic)
│   └── templates/leetcode/
│       ├── list.html
│       ├── new.html
│       └── detail.html
├── dsa/
│   ├── models.py                ← DSAConcept
│   ├── forms.py
│   ├── views.py
│   ├── urls.py
│   └── templates/dsa/
│       ├── list.html
│       └── new.html
├── interview_questions/
│   ├── models.py                ← InterviewQuestion
│   ├── forms.py
│   ├── views.py
│   ├── urls.py
│   └── templates/interview_questions/
│       └── list.html
├── coding_questions/
│   ├── models.py                ← CodingQuestion
│   ├── forms.py
│   ├── views.py
│   ├── urls.py
│   └── templates/coding_questions/
│       └── list.html
├── system_design/
│   ├── models.py                ← SystemDesign
│   ├── forms.py
│   ├── views.py
│   ├── urls.py
│   └── templates/system_design/
│       └── list.html
├── components/                  ← shared, reusable template partials (not Python components)
│   ├── _navbar.html
│   ├── _sidebar.html
│   ├── _badge.html
│   └── _modal.html
├── static/
│   ├── css/
│   ├── js/
│   │   └── monaco-init.js
│   └── vendor/
└── templates/
    |── base.html                ← shared layout all pages extend
    |── navbar.html                ← shared top navigation bar notification and github icon all pages extend
    └── sidebar.html                ← shared sidebar for tab navigation all pages extend
```

### Rules for the agent
- The project has **six Django apps**: `accounts`, `dashboard`, `leetcode`, `dsa`, `interview_questions`, `coding_questions`, `system_design`. (`dashboard` and `accounts` hold no domain data of their own — `accounts` owns the `User` model, `dashboard` is aggregation-only.)
- Never put database logic directly in templates — use views, model methods, or a `services.py` inside the relevant app if logic grows complex.
- Never modify `leetcode/sm2.py` logic unless explicitly instructed. The SM-2 algorithm is fixed.
- Each app owns its own `models.py`, `forms.py`, `views.py`, `urls.py`, and `templates/<app_name>/`. Don't cross-define models in the wrong app.
- Shared template partials (navbar, sidebar, badges, modals) live in the top-level `components/` directory and are included via `{% include %}`.

---

## Authentication

Handled entirely by the `users` app with a **custom Django `User` model** (`AUTH_USER_MODEL = "users.User"`), not `django.contrib.auth`'s default model, and not any third-party auth service.

- Login field: **email** (`USERNAME_FIELD = "email"`).
- **Superuser** accounts (created via `python manage.py createsuperuser`) require **email + username + password**.
- **Regular user signups** (via the `/accounts/signup/` form) require **first name + last name + email + password** — no username is collected or required for them.
- Enforced via a custom `UserManager` with separate `create_user()` and `create_superuser()` methods — the validation rules live in the manager, not scattered across views.
- Route protection uses Django's built-in `@login_required` decorator (function views) or `LoginRequiredMixin` (class-based views), with `LOGIN_URL = "accounts:login"` set in `settings.py`. No custom middleware is needed for this unless a specific cross-cutting rule comes up later.

### Rules for the agent
- Never store passwords in plain text — always go through Django's `set_password()` / the model manager, never `User(password=...)` directly.
- Never create a second, competing `users` table. `accounts.User` is the single source of truth for identity across all apps.

---

## Project Structure — Data Models

Every domain table has a `user` foreign key to `settings.AUTH_USER_MODEL`. **Every queryset in every view must be filtered by `user=request.user`** — Django has no Row Level Security like Supabase does, so this filtering has to be explicit and consistent everywhere, with no exceptions. Never trust a `user_id`/`pk` from the client without checking it belongs to `request.user`.

### User (`users.User`)
See the **Authentication** section above and the existing `users/models.py` / `users/managers.py` for the full implementation.

---

### `leetcode.LeetCodeProblem`
The core table. Powers the LeetCode tab and the spaced repetition system.

| Field | Type | Notes |
|---|---|---|
| id | `UUIDField` (pk) | `default=uuid.uuid4, editable=False` |
| user | `ForeignKey(AUTH_USER_MODEL)` | `on_delete=models.CASCADE` |
| problem_number | `IntegerField` | LeetCode problem number |
| question | `CharField` | Problem title |
| link | `URLField` | URL to the LeetCode problem |
| difficulty | `CharField` + `choices` | `easy`, `medium`, `hard` |
| programming_language | `CharField` | e.g. JavaScript, Python, TypeScript |
| code_snippet | `TextField` | Full solution code — rendered in Monaco Editor |
| notes | `TextField` | Personal notes on approach, `blank=True` |
| date_solved | `DateField` | When the user first solved it |
| next_review_date | `DateField` | **Critical** — drives the Due Today feature |
| repetition_count | `IntegerField` | How many times reviewed. `default=0` |
| ease_factor | `FloatField` | SM-2 ease factor. `default=2.5` |
| status | `CharField` + `choices` | `in_progress`, `due_for_review`, `mastered` |
| created_at | `DateTimeField` | `auto_now_add=True` |

---

### `dsa.DSAConcept`
Tracks Data Structures & Algorithms study sessions.

| Field | Type | Notes |
|---|---|---|
| id | `UUIDField` (pk) | |
| user | `ForeignKey(AUTH_USER_MODEL)` | |
| topic | `CharField` | e.g. Binary Search, Dynamic Programming, Graphs |
| resource_used | `CharField` | YouTube video, book, article, NeetCode, etc. |
| notes | `TextField` | Detailed study notes |
| mastery_level | `CharField` + `choices` | `not_started`, `learning`, `comfortable`, `mastered` |
| date_studied | `DateField` | When the session took place |
| created_at | `DateTimeField` | `auto_now_add=True` |

---

### `interview_questions.InterviewQuestion`
Common behavioral and technical interview Q&A.

| Field | Type | Notes |
|---|---|---|
| id | `UUIDField` (pk) | |
| user | `ForeignKey(AUTH_USER_MODEL)` | |
| question | `CharField` | The interview question |
| answer | `TextField` | Model answer |
| notes | `TextField` | Personal notes or alternative answers, `blank=True` |
| created_at | `DateTimeField` | `auto_now_add=True` |

---

### `coding_questions.CodingQuestion`
Open-ended coding challenges with linked repository solutions.

| Field | Type | Notes |
|---|---|---|
| id | `UUIDField` (pk) | |
| user | `ForeignKey(AUTH_USER_MODEL)` | |
| question | `TextField` | The coding challenge description |
| repository_link | `URLField` | GitHub repo URL with the solution |
| notes | `TextField` | Approach, lessons learned, improvements, `blank=True` |
| date_created | `DateField` | When the challenge was completed |
| created_at | `DateTimeField` | `auto_now_add=True` |

---

### `system_design.SystemDesign`
System design questions tagged by company.

| Field | Type | Notes |
|---|---|---|
| id | `UUIDField` (pk) | |
| user | `ForeignKey(AUTH_USER_MODEL)` | |
| question | `TextField` | The system design question |
| company | `CharField` | Company that asked the question |
| answer | `TextField` | Full answer/approach |
| notes | `TextField` | Feedback or improvements, `blank=True` |
| created_at | `DateTimeField` | `auto_now_add=True` |

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
Initial solve        →  next_review_date: +1 day,   repetition_count: 0
Review 1 (easy)      →  next_review_date: +7 days,  repetition_count: 1
Review 2 (easy)      →  next_review_date: +14 days, repetition_count: 2
Review 3 (easy)      →  next_review_date: +30 days, repetition_count: 3
Review 4 (very_easy) →  status: MASTERED,           repetition_count: 4
```

### SM-2 implementation location

All SM-2 logic lives exclusively in `leetcode/sm2.py`. The function signature must be:

```python
from dataclasses import dataclass
from datetime import date
from typing import Literal

Rating = Literal["hard", "medium", "easy", "very_easy"]
Status = Literal["in_progress", "due_for_review", "mastered"]


@dataclass
class ReviewResult:
    next_review_date: date
    new_ease_factor: float
    new_repetition_count: int
    new_status: Status


def calculate_next_review(
    current_ease_factor: float,
    repetition_count: int,
    rating: Rating,
) -> ReviewResult:
    ...
```

Called from the `leetcode` app's review view — never inline the interval/ease-factor math anywhere else.

---

## Application Routes

| Route | View | Purpose |
|---|---|---|
| `/` | Landing Page | App intro, sign up / login CTA |
| `/accounts/signup/` | Sign Up | First name, Last name, Email, Password registration |
| `/accounts/login/` | Login | Email + password login |
| `/dashboard/` | Dashboard | Due Today, Stats, Recent Activity, Streak |
| `/leetcode/` | LeetCode Logs | Full table of all logged problems |
| `/leetcode/new/` | Add Problem | Form to log a new LeetCode problem |
| `/leetcode/<uuid:pk>/` | Problem Detail | View, edit, trigger spaced repetition review |
| `/dsa/` | DSA Concepts | Table of all studied DSA concepts |
| `/dsa/new/` | Add Concept | Log a new DSA study session |
| `/interview/` | Interview Questions | Common Q&A reference list |
| `/coding/` | Coding Questions | Coding challenges with repo links |
| `/system-design/` | System Design | System design Q&A by company |

### Route protection rules
- `/accounts/login/` and `/accounts/signup/` are **public** — redirect to `/dashboard/` if already authenticated (check `request.user.is_authenticated` at the top of the view).
- `/` (landing) is **public**.
- All other routes are **protected** — decorate with `@login_required` (or use `LoginRequiredMixin` for CBVs); unauthenticated requests redirect to `/accounts/login/`.
- `LOGIN_URL`, `LOGIN_REDIRECT_URL`, and `LOGOUT_REDIRECT_URL` are set in `settings.py` — don't hardcode redirect paths in views.

---

## Dashboard

The dashboard at `/dashboard/` is the home screen after login. It must display:

1. **Due Today** — list of `LeetCodeProblem` rows where `next_review_date <= today` and `status != 'mastered'`, filtered to `user=request.user`. Each item shows problem title, difficulty badge, and a "Review Now" button.
2. **Problems Solved** — count of all problems for `request.user`, broken down by `difficulty` (easy / medium / hard) via `.values("difficulty").annotate(count=Count("id"))`.
3. **Current Streak** — consecutive days where `request.user` has at least one log entry across any of the five domain tables (computed by unioning `created_at` dates across all five models).
4. **Mastery Progress** — count of `mastered` problems vs total `LeetCodeProblem` rows for `request.user`.
5. **Recent Activity** — the last 5 entries across all five tables for `request.user`, sorted by `created_at` descending (query each table, tag with its source app, merge, sort, slice to 5 in the view).

Because this view touches five apps' models, it lives in its own `dashboard` app rather than inside any single domain app, to avoid circular imports.

---

## Features Per Tab

### LeetCode Tab (`/leetcode/`)
- Table view of all logged problems with columns: Problem Number, Title, Difficulty, Language, Date Solved, Status, Next Review
- Status badge: `In Progress` (grey) / `Due for Review` (orange) / `Mastered` (green)
- Filter by difficulty: Easy / Medium / Hard (via querystring, e.g. `?difficulty=easy`)
- Search by problem name or number (via querystring `?q=`)
- Click a row to go to `/leetcode/<uuid:pk>/`
- Button to go to `/leetcode/new/`

### LeetCode Problem Detail (`/leetcode/<uuid:pk>/`)
- Full view of all fields
- Monaco Editor for the code snippet (read-only unless in edit mode — toggled via a small vanilla-JS flag, not a JS framework)
- Edit button to update any field (Django `ModelForm`, same template with an `is_editing` context flag, or a separate `/leetcode/<uuid:pk>/edit/` route — pick one and stay consistent)
- **Review button** — only rendered in the template when `status == "due_for_review"`. Opens a confidence rating modal with the four options (Hard / Medium / Easy / Very Easy). On submit (POST), the view calls `calculate_next_review()` from `leetcode/sm2.py` and updates the record.

### DSA Tab (`/dsa/`)
- Table view of all DSA study sessions
- Columns: Topic, Resource Used, Mastery Level, Date Studied
- Filter by mastery level
- Mastery level badge with colour coding: Not Started (grey) / Learning (blue) / Comfortable (yellow) / Mastered (green)

### Interview Questions Tab (`/interview/`)
- List/card view of all Q&A entries
- Expandable cards — click to reveal the full answer (plain `<details>`/`<summary>` or minimal vanilla JS, no framework)
- Add / Edit / Delete

### Coding Questions Tab (`/coding/`)
- Table view with: Question, Repository Link (clickable), Date Created
- Click repo link opens GitHub in new tab (`target="_blank" rel="noopener noreferrer"`)
- Add / Edit / Delete

### System Design Tab (`/system-design/`)
- Table view with: Question, Company badge, Date
- Click to expand full answer
- Add / Edit / Delete

---

## Development Order

Build in this exact order. Do not skip phases or build out of sequence.

| # | Phase | What to build |
|---|---|---|
| 1 | Project Setup | Django project + CSS folder + Monaco Editor (CDN) + SQLite |
| 2 | Authentication | `accounts` app: custom `User` model, `UserManager`, signup, login, `@login_required` protection |
| 3 | LeetCode Tab | Full CRUD for `LeetCodeProblem` |
| 4 | Spaced Repetition | SM-2 in `leetcode/sm2.py`, review flow, Due Today on dashboard |
| 5 | DSA Tab | Full CRUD for `DSAConcept` |
| 6 | Interview Questions | Full CRUD for `InterviewQuestion` |
| 7 | Coding Questions | Full CRUD for `CodingQuestion` |
| 8 | System Design | Full CRUD for `SystemDesign` |
| 9 | Stats Dashboard | Streak, difficulty breakdown, mastery progress, recent activity — the `dashboard` app |
| 10 | UI Polish | Responsive layout, dark mode, empty states, loading skeletons |

---

## Django Project Setup

### `settings.py` essentials
```python
INSTALLED_APPS = [
    ...
    "accounts",
    "dashboard",
    "leetcode",
    "dsa",
    "interview_questions",
    "coding_questions",
    "system_design",
]

AUTH_USER_MODEL = "accounts.User"

LOGIN_URL = "accounts:login"
LOGIN_REDIRECT_URL = "dashboard:dashboard"
LOGOUT_REDIRECT_URL = "accounts:login"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}
```

### Migrations
```bash
python manage.py makemigrations accounts leetcode dsa interview_questions coding_questions system_design
python manage.py migrate
```
`AUTH_USER_MODEL` must be set **before** the first migration — swapping it afterward means resetting migrations/db.

### No RLS equivalent
Supabase's Row Level Security is a database-level guarantee. SQLite/Django has no equivalent, so the same guarantee must be enforced **in every view**, by hand, every time:
```python
LeetCodeProblem.objects.filter(user=request.user)
```
Never `LeetCodeProblem.objects.all()` or `.get(pk=pk)` without a `user=request.user` filter — that's a data-leak bug, not a style preference.

---

## V2 Features (Out of Scope for V1 — Do Not Build)

The following must NOT be built in V1. If the user asks about them, note them as future features:

- Mobile app (native or PWA)
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

1. Always use Python type hints — never leave function signatures untyped
2. Always use Django's MVT pattern (models, views, templates) — no separate frontend framework
3. Always scope database queries to `user=request.user` — there is no RLS safety net
4. Never modify `leetcode/sm2.py` logic unless explicitly told to
5. Never build V2 features during V1 development
6. Always define new domain models in the correct app's `models.py` — one app, one responsibility
7. Never write styling outside of Tailwind CSS classes
8. Always protect routes with `@login_required` / `LoginRequiredMixin`
9. Always handle empty states and (where relevant) loading states in every template
10. Always follow the development order — do not skip phases
10. Always write sll page styles in the static/css folder - do not write inline page styles unless the user requests so.