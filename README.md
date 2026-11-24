# Grammarin

DEMO VIDEO : https://youtu.be/yyBUNNnncMc

Open-source Mandarin learning app for foreigners. Learn HSK-style sentence structures with clear English explanations, then practice with interactive drag-and-drop quizzes. Progress is saved per account.

**Stack:** Next.js (App Router) · Supabase (Auth + Postgres + RLS) · shadcn/ui · Tailwind CSS

---

## Table of contents

1. [Features](#features)
2. [Project structure](#project-structure)
3. [Prerequisites](#prerequisites)
4. [Quick start](#quick-start)
5. [Supabase setup (step by step)](#supabase-setup-step-by-step)
6. [Environment variables](#environment-variables)
7. [Running the app](#running-the-app)
8. [Auth providers](#auth-providers)
9. [Security notes](#security-notes)
10. [Contributing](#contributing)
11. [License](#license)

---

## Features

- Grammar lessons with structure, examples, tips, and common mistakes
- Drag-and-drop sentence-building quizzes after each lesson
- Email/password auth (optional Google OAuth)
- Per-user progress tracking (lesson + quiz completion)
- Row Level Security so users only read/write their own progress

---

## Project structure

```
grammarin/
├── app/
│   ├── (public)/              # Landing, login, register (no auth required)
│   │   ├── page.tsx           # Landing page
│   │   ├── login/
│   │   └── register/
│   ├── (protected)/           # Requires signed-in user
│   │   ├── grammar/           # Lesson list + lesson detail
│   │   └── quiz/[id]/         # Quiz for a grammar point
│   ├── auth/callback/         # OAuth / magic-link session exchange
│   └── api/auth/callback/     # Alternate auth callback route
├── components/
│   ├── app/                   # Feature UI (auth, grammar, learn, quiz, navbar)
│   └── ui/                    # shadcn/ui primitives
├── hooks/                     # Client hooks (auth, progress)
├── lib/
│   └── supabase/              # Supabase clients + data helpers
│       ├── client.ts          # Browser client
│       ├── server.ts          # Server/RSC client (cookies)
│       ├── admin.ts           # Service-role client (server only)
│       ├── auth.ts            # Sign-in / sign-up / OAuth / sign-out
│       ├── db.ts              # Grammars + progress helpers
│       ├── quiz.ts            # Quiz questions + progress keys
│       └── progress.ts        # Progress upserts
├── types/                     # Shared TypeScript types
├── schema.sql                 # Schema + RLS only (no seed data)
├── init.sql                   # Schema + RLS + sample seed data  ← use this
├── .env.example               # Env template (no secrets)
└── package.json
```

### How routing works

| Route | Access | Purpose |
|-------|--------|---------|
| `/` | Public | Landing |
| `/login`, `/register` | Public | Auth |
| `/grammar` | Protected | Lesson list |
| `/grammar/[id]` | Protected | Lesson + explanation |
| `/quiz/[id]` | Protected | Drag-and-drop quiz |
| `/auth/callback` | Public | Completes OAuth / email link |

Protected layouts check the Supabase session and redirect unauthenticated users to login.

---

## Prerequisites

- **Node.js** 20+ (LTS recommended)
- **npm** (or yarn / pnpm / bun)
- A free [Supabase](https://supabase.com) account

---

## Quick start

If Supabase is already configured:

```bash
git clone https://github.com/YOUR_USERNAME/grammarin.git
cd grammarin
cp .env.example .env.local
# Fill in .env.local with your Supabase values (see below)
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

For a first-time setup, follow the full Supabase guide below.

---

## Supabase setup (step by step)

### 1. Create a project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **New project**
3. Choose an organization, name (e.g. `grammarin`), set a strong database password, pick a region
4. Wait until the project is ready

### 2. Create the database (schema + seed)

1. In the dashboard, open **SQL Editor** → **New query**
2. Open `init.sql` from this repo and paste its full contents into the editor  
   - Prefer **`init.sql`** — it creates tables, RLS policies, triggers, **and** sample grammar + quiz rows  
   - Use `schema.sql` only if you want an empty schema with no seed data
   - Use `seeder.sql` to seed with questions
3. Click **Run**
4. Confirm success (no errors). You should see tables under **Table Editor**:
   - `grammars`
   - `quiz_questions`
   - `user_progress`
   - `profiles`

### 3. Enable authentication

1. Open **Authentication** → **Providers**
2. Ensure **Email** is enabled (default)
3. Optional: under **Authentication** → **URL Configuration**, set:
   - **Site URL:** `http://localhost:3000` (local) or your production URL
   - **Redirect URLs:** add  
     - `http://localhost:3000/auth/callback`  
     - `https://YOUR_PRODUCTION_DOMAIN/auth/callback`

### 4. (Optional) Enable Google sign-in

1. **Authentication** → **Providers** → **Google** → enable
2. Create OAuth credentials in [Google Cloud Console](https://console.cloud.google.com/)
3. Add the Client ID and Client Secret into Supabase’s Google provider fields
4. Add your redirect URL as allowed in Google (Supabase shows the callback URL to use)

### 5. Copy API keys into the app

1. Open **Project Settings** → **API**
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / publishable** key → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (server only; optional for basic local use)

> The service role key bypasses RLS. Never put it in client code or prefix it with `NEXT_PUBLIC_`.

### 6. Create `.env.local`

From the project root:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOi...your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## Environment variables

| Variable | Required | Public? | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Yes | Yes | Anon / publishable API key |
| `SUPABASE_SERVICE_ROLE_KEY` | No* | **No** | Admin key; never expose to the browser |
| `NEXT_PUBLIC_SITE_URL` | For OAuth | Yes | App origin for auth redirects |

\*Required only if you use `lib/supabase/admin.ts` for privileged server operations. Email/password learning flow works without it for normal user traffic.

`.env*` files are gitignored. Commit only `.env.example`.

---

## Running the app

```bash
npm install
npm run dev
```

| Script | Command |
|--------|---------|
| Dev server | `npm run dev` |
| Production build | `npm run build` |
| Start production | `npm start` |
| Lint | `npm run lint` |

### First-run checklist

1. Open `http://localhost:3000`
2. Register a new account
3. Confirm a profile row appears in Supabase **Table Editor** → `profiles`
4. Open **Grammar**, complete a lesson, finish the quiz
5. Confirm `user_progress` updates for your user

---

## Auth providers

| Method | Status | Notes |
|--------|--------|-------|
| Email + password | Default | Works after Email provider is on |
| Google OAuth | Optional | Needs Google + Supabase provider config and `NEXT_PUBLIC_SITE_URL` |

OAuth callback path used by the app: `/auth/callback`.

---

## Security notes

Credential scan of this repository (source, SQL, configs):

- **No hardcoded API keys, JWTs, or Supabase URLs** in source
- Clients read secrets only from environment variables
- `.env*` is gitignored; use `.env.example` as the template
- Browser client uses the **publishable/anon** key only
- **Service role** is isolated in `lib/supabase/admin.ts` and must stay server-side
- Database access is constrained with **Row Level Security** (see `init.sql` / `schema.sql`)

If you ever paste a real key into chat, a screenshot, or a commit by mistake, **rotate it** in Supabase → Project Settings → API → regenerate keys.

---

## Database overview

| Table | Purpose |
|-------|---------|
| `grammars` | Lesson content (title, pinyin, HSK, explanation JSON) |
| `quiz_questions` | Per-lesson drag-and-drop questions |
| `user_progress` | Learn + quiz completion flags per user |
| `profiles` | Display name / avatar; auto-created on signup |

RLS highlights:

- Anyone can **read** grammars and quiz questions
- Only the **service role** can insert/update grammar content
- Users can only **read/write their own** `user_progress` and `profiles`

---

## Contributing

1. Fork the repo and create a branch
2. Copy `.env.example` → `.env.local` and point at your own Supabase project
3. Run `init.sql` on that project (do not share production keys)
4. Make changes, run `npm run lint` / `npm run build`
5. Open a pull request with a short description of what and why

Ideas that help the project:

- More HSK grammar points + quiz items in `init.sql` (or a dedicated seed file)
- UI / accessibility improvements
- Docs and translations

---

## Troubleshooting

| Problem | What to try |
|---------|-------------|
| `Invalid API key` / auth errors | Recheck URL and publishable key in `.env.local`; restart `npm run dev` |
| Empty grammar list | Confirm `init.sql` ran and `grammars` has rows in Table Editor |
| Redirect loop / cannot access `/grammar` | Sign in; confirm cookies work on `localhost` |
| Google sign-in fails | Check Site URL + Redirect URLs in Supabase and `NEXT_PUBLIC_SITE_URL` |
| Profile missing after signup | Confirm `handle_new_user` trigger exists (included in `init.sql`) |

---

## License

This project is intended as open source. Add a `LICENSE` file (e.g. MIT) when you publish the repository so contributors know the terms.
