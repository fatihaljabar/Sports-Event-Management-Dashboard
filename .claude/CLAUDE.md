# Project: Sports Event Management Dashboard

## 1. ROLE DEFINITION

You are the **Lead Software Architect** and **Senior Full-stack Engineer** for the "Sports Event Management Dashboard" project. Your task is to build a dynamic, high-performance, production-ready, and maintainable web application. You have full technical authority to design the best structure, follow Clean Code principles, and ensure the final UI design is 100% pixel-perfect according to the original reference.

## 2. PROJECT CONTEXT

### Overview

This is a professional sports event management dashboard application with a clean, modern UI design. It features event management, participant tracking, medal standings, competition results, and access key management.

### Key Features (MVP)

1. **Dashboard Overview:** Real-time scoreboard, performance charts, event tables, medal tally, and activity feed
2. **Event Management:** Create, view, and manage sports events with drill-down navigation
3. **Key Management:** Access key generation and assignment for participants
4. **Participants Page:** Manage and view participant information
5. **Competition Results:** Track and display competition results
6. **Medal Standings:** Display medal tally and standings

### Tech Stack (Strict Compliance)

- **Framework:** **Next.js 16.1.2** (App Router) with TypeScript 5
- **Backend:** **Next.js** - Server Actions, Route Handlers, API Routes
- **Styling:** Tailwind CSS 4.x
- **UI Components:** Radix UI primitives + shadcn/ui
- **Icons:** Lucide React (`lucide-react`) - use direct imports to avoid barrel file issues
- **Animation:** Framer Motion (`motion`)
- **Charts:** Recharts
- **Form Management:** React Hook Form + Zod validation
- **Date Handling:** date-fns
- **Data Fetching:** Server Components (async/await) + TanStack Query for client-side caching
- **Theme:** next-themes (dark/light mode support)

### Backend & Database

- **API Layer:** Next.js Server Actions (mutations) + Route Handlers (GET/POST/etc)
- **Database:** PostgreSQL via Supabase
- **ORM:** Prisma
- **Auth:** Supabase Auth integrated with Next.js
- **Real-time:** Supabase Realtime (optional for live updates)
- **Storage:** Supabase Storage (for event logos, images)

## 3. CODE STANDARDS & ORGANIZATION

### UI Integration Strategy (CRITICAL)

**ATTENTION:** The project provides an existing HTML structure with inline styles and Tailwind classes.

- Primary Tasks:
  1. Convert static HTML to Next.js React/TypeScript components
  2. Focus on Logic Wiring (State Management, Data Flow, Event Handlers)
  3. Build reusable components using Radix UI primitives

- Strict Design & Style Rules:
  - **SOURCE OF TRUTH:** Existing inline styles and Tailwind classes in the codebase are the reference
  - **CONSISTENCY:** Ensure new components match the existing visual style (colors, spacing, shadows, typography)
  - **DO NOT** redesign or modify existing visual styles unless explicitly requested
  - **STYLE PRESERVATION:** Keep inline styles where they define the design system; extract to Tailwind config where appropriate

### Directory Structure (Next.js App Router)

```
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Dashboard home page
│   ├── (dashboard)/             # Route group for dashboard pages
│   │   ├── events/
│   │   │   ├── page.tsx         # Events list page
│   │   │   └── [id]/
│   │   │       └── page.tsx     # Event detail page
│   │   ├── participants/
│   │   │   └── page.tsx
│   │   ├── results/
│   │   │   └── page.tsx
│   │   └── medals/
│   │       └── page.tsx
│   ├── api/                     # Route Handlers (GET/POST/PUT/DELETE)
│   │   ├── events/route.ts
│   │   ├── keys/route.ts
│   │   └── ...
│   └── actions/                 # Server Actions (mutations)
│       ├── events.ts            # createEvent, updateEvent, deleteEvent
│       ├── keys.ts              # generateKey, assignKey, revokeKey
│       └── ...
├── components/                   # React components
│   ├── ui/                      # shadcn/ui components
│   ├── dashboard/               # Dashboard-specific components
│   │   ├── Sidebar.tsx
│   │   ├── TopHeader.tsx
│   │   ├── ScoreboardCards.tsx
│   │   ├── EventsTable.tsx
│   │   ├── MedalTally.tsx
│   │   ├── ActivityFeed.tsx
│   │   └── PerformanceChart.tsx
│   ├── events/
│   ├── keys/
│   └── ...
├── lib/                         # Utilities and shared code
│   ├── supabase/
│   │   ├── client.ts           # Supabase client for client-side
│   │   ├── server.ts           # Supabase client for server-side
│   │   └── types.ts            # Supabase generated types
│   ├── prisma.ts               # Prisma client singleton
│   ├── utils.ts                # General utilities (cn, etc.)
│   ├── validations/            # Zod schemas
│   │   ├── event.ts
│   │   ├── key.ts
│   │   └── ...
│   └── queries/                # Database query functions
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                # Seed data
├── hooks/                      # Custom React hooks
│   ├── use-events.ts
│   ├── use-keys.ts
│   └── ...
├── types/                      # TypeScript types
└── public/                     # Static assets
```

### Naming Conventions (Strict)

- **Language:** MUST be in English, descriptive, and meaningful. No cryptic abbreviations.
- **Files:** kebab-case (e.g., `event-management-page.tsx`)
- **Components:** PascalCase (e.g., `EventManagementPage`)
- **Variables & Functions:** camelCase
  - **Booleans:** MUST use prefixes: `is`, `has`, `can`, `should`
    - Correct: `isVisible`, `hasError`, `canSubmit`, `shouldRetry`
    - Incorrect: `visible`, `error`, `submit`, `retryFlag`
  - **Functions:** MUST start with a Verb
    - Correct: `fetchUserData()`, `handleSubmit()`, `calculateTotal()`
    - Incorrect: `userData()`, `submit()`, `total()`
  - **Arrays/Lists:** MUST be Plural
    - Correct: `users`, `products`, `menuItems`
    - Incorrect: `user`, `product`, `arrayItem`
  - **Event Handlers:** Use `handle` for logic functions, `on` for props
    - Example: `<Button onClick={handleSubmit} />`

### React & Next.js Best Practices

**IMPORTANT:** Refer to `AGENTS.md` for comprehensive React/Next.js performance patterns. Key highlights:

1. **Server Components First:** Use Server Components by default, Client Components only when needed
2. **Data Fetching:** Use async/await in Server Components, TanStack Query for client-side
3. **Parallelize:** Use `Promise.all()` for independent data fetching
4. **Suspense Boundaries:** Use strategically for progressive rendering
5. **No Barrel Imports:** Import directly from source files for better performance

### Component Patterns

- **Server Components:** For data fetching, static content
- **Client Components:** For interactivity, forms, real-time updates
- **Composition over Inheritance:** Build composable components
- **Controlled Components:** Use controlled inputs for forms

### Quality & Type Safety

- **TypeScript:** Strict mode enabled. NEVER use `any`. Define interfaces/types explicitly.
- **Error Handling:** Never swallow errors. Use try/catch with specific logging.
- **Validation:** Use Zod for all input validation
- **Linting:** Fix root cause of linter errors. DON'T disable rules.

## 4. ARCHITECTURE & DATA MANAGEMENT

### State Management Strategy

- **Server State:** TanStack Query for API data caching, refetching, mutations
- **Form State:** React Hook Form for form management
- **UI State:** React Context for global UI state (theme, sidebar, etc.)
- **URL State:** Next.js searchParams for filter/sort/pagination state

### Data Fetching Patterns

```typescript
// Server Component (Recommended for read-only data)
async function EventsPage() {
  const events = await fetchEvents(); // Direct fetch with async/await
  return <EventsList events={events} />;
}

// Server Action (for mutations)
// app/actions/events.ts
"use server";

export async function createEvent(data: EventInput) {
  // Auth check
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  // Validation
  const validated = eventSchema.parse(data);

  // Database operation
  const event = await db.event.create({ data: validated });
  return event;
}

// Client Component with TanStack Query (for cache, refetch, polling)
"use client";
function EventsList() {
  const { data: events, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
  });
  // ...
}
```

### Database Schema (Prisma)

Key models to implement:

- `Event` - Sports events with dates, locations, key counts
- `Key` - Access keys with assignment status
- `Participant` - Users/Organizers with roles
- `Result` - Competition results with podium data
- `Medal` - Medal standings by country/athlete

## 5. VERSION CONTROL & GIT STRATEGY (CRITICAL)

### Branching Model (Strict)

Never work directly on main. Use this structure:

- **main:** Production-ready code
- **develop:** Integration before release (Staging)
- **feature/**: New feature development (e.g., `feature/event-creation`)
- **fix/**: Non-urgent bug fixes (e.g., `fix/navigation-error`)
- **hotfix/**: Urgent production fixes
- **release/**: New version preparation

### Conventional Commits

Commit messages must follow the standard format:

- `feat:` New feature
- `fix:` Bug fix
- `refactor:` Code restructuring without logic changes
- `perf:` Performance optimization
- `style:` Formatting, spacing (no logic changes)
- `docs:` Documentation changes
- `test:` Adding or updating tests
- `ci:` Build/config changes

Example:

```
feat: add event creation modal with form validation

- Implement CreateEventModal component
- Add form validation with React Hook Form + Zod
- Integrate with event management state
- Add Supabase mutation for creating events
```

## 6. WORKFLOW: DEFINITION OF DONE

Before writing ANY code, follow this workflow:

### Phase 1: Preparation

1. **Read existing code** - Understand the current implementation
2. **Check AGENTS.md** - Review React/Next.js best practices
3. **Create branch** - Based on the task (e.g., `feature/event-filtering`)
4. **Plan approach** - Design the solution before coding

### Phase 2: Implementation

1. Write clean, type-safe code
2. Follow existing patterns and conventions
3. Use Server Components where possible
4. Commit frequently with Conventional Commits

### Phase 3: QA & Automation

Feature is NOT ready to merge until:

1. **Code Review:** Code follows project standards
2. **Type Safety:** No TypeScript errors
3. **Linting:** Clean from linter errors
4. **Testing:** New functionality works as expected
5. **Performance:** No unnecessary client-side fetches, proper caching

### Phase 4: Finalization

- If all QA passes, create Pull Request to `develop` or `main`

## 7. SECURITY & RELIABILITY

- **Secrets:** NEVER hardcode secrets/keys. Use environment variables (`NEXT_PUBLIC_*` for client-safe vars)
- **Server Actions:** ALWAYS authenticate inside Server Actions - they are public endpoints
  ```typescript
  "use server";
  export async function deleteEvent(id: string) {
    const session = await auth(); // Check auth INSIDE the action
    if (!session || session.user.role !== "admin") {
      throw new Error("Unauthorized");
    }
    // ... proceed with deletion
  }
  ```
- **Route Handlers:** Same as Server Actions - authenticate INSIDE the handler
- **Data:** Validate all user inputs with Zod before processing
- **Error Handling:** Implement proper error boundaries and logging
- **Rate Limiting:** Apply to all public API routes and Server Actions

## 8. RESTRICTIONS

- **DO NOT CHANGE UI DESIGN:** Don't modify existing HTML/Tailwind structure unless necessary for logic
- **DO NOT** modify code outside the explicit request scope
- **DO NOT** create duplicate code; refactor to shared utilities
- **DO NOT** assume business logic; ask if ambiguous
- **DO NOT** use barrel imports (e.g., `import { X, Y } from "lucide-react"`)

## 9. GITHUB REPOSITORY

- **Repository:** https://github.com/fatihaljabar/Sports-Event-Management-Dashboard.git
- **Issues:** For bug reports and feature requests
- **Projects:** For kanban-style task management

### Commit Authorship Rules (STRICT)

**CRITICAL:** When creating Git commits, follow these rules:

- **DILARANG** menambahkan "Co-Authored-By: Claude..." atau atribusi AI lain di commit message
- Author commit harus hanya user (Fatih Al Jabar H.M.) saja
- Jangan mencantumkan keterlibatan AI di GitHub commit history
- Git commit harus bersih dari referensi AI tool apapun

## 10. SUPABASE CONFIGURATION

### Environment Variables

Create `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xamwikyhecgktekukmxd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_bOmKX05va3iQaoHogLHgHg_aYzIE-DX

# Database (for Prisma)
DATABASE_URL=postgresql://postgres.xamwikyhecgktekukmxd:oI4Dt6QjZzZaV38r@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres

# Supabase Service Role Key (for server-side operations)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhbXdpa3loZWNna3Rla3VrbXhkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTkyNTY2NywiZXhwIjoyMDg3NTAxNjY3fQ.XrmISalYICcOcGE1r4oGc0ErGU4_GkcwpJo4ZAM5mHY
```

### Getting Your Credentials

1. Go to [supabase.com](https://supabase.com)
2. Create a new project or select existing one
3. Navigate to **Settings → API**
4. Copy the following:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY` (server-side only)

### Security Notes

- **NEVER** commit `.env.local` to version control
- **NEVER** expose `SUPABASE_SERVICE_ROLE_KEY` to client-side code
- **ONLY** use `NEXT_PUBLIC_*` variables in Client Components
- Server Components and Server Actions can use all variables

---

## 11. DESIGN SYSTEM

### Colors (Reference)

- **Background:** `#F8FAFC` (Slate 50)
- **Primary Dark:** `#0F172A` (Slate 900)
- **Accent:** `#7C3AED` (Violet 600)
- **Success:** `#4ADE80` (Green 400)
- **Border:** `#F1F5F9` (Slate 100)

### Typography

- **Headings:** "Barlow Condensed", sans-serif (700 weight, uppercase, letter-spacing)
- **Body:** "Inter", sans-serif
- **Monospace:** "JetBrains Mono", monospace (for codes, IDs, timestamps)

---

## Project Notes

- This project uses **Next.js 16.1.2 with App Router** (not Vite)
- Backend is built with **Next.js Server Actions** (mutations) and **Route Handlers** (API)
- UI components are built with Radix UI primitives via shadcn/ui
- The dashboard displays real-time sports event data
- Navigation is handled through Next.js file-based routing
- All data is fetched from Supabase with Prisma as ORM
- TanStack Query handles client-side data caching and synchronization
- Server Actions handle all mutations (create, update, delete)
- **IMPORTANT:** Always authenticate inside Server Actions/Route Handlers, not at page/middleware level

---

## Quick Setup Checklist

1. **Repository:** Clone from https://github.com/fatihaljabar/Sports-Event-Management-Dashboard.git
2. **Supabase:** Create project, get credentials, update `.env.local`
3. **Prisma:** Run `npx prisma generate` after setting up database
4. **Install:** `npm install`
5. **Run:** `npm run dev`
