# Fellowship 360 - Church Management Platform

AI-powered church management platform with Grace assistant - offloading administrative tasks to focus on ministry.

## Getting Started

### Development Mode

```bash
npm install
npm run dev
```

The application will be available at `http://localhost:3000`.

### Demo Mode

If you don't have Supabase configured, the app runs in demo mode with sample data. You can sign in with any email and password to see the full interface.

### Production Setup

1. Set up Supabase project and copy environment variables:

```bash
cp .env.example .env.local
```

2. Configure your Supabase variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

3. Deploy the database schema from `src/lib/database/schema.ts` to your Supabase project.

## Architecture

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Supabase** for authentication and database
- **Shadcn UI** for components
- **Tailwind CSS** with OKLCH color system
- **Multi-tenant** architecture with role-based access

## Features

### Current (Epic 1.1)

- ✅ Professional dashboard with metrics
- ✅ Contact management with status tracking
- ✅ Activity feed for Grace interactions
- ✅ Role-based authentication (Staff/Admin/Agency)
- ✅ Church-scoped multi-tenancy
- ✅ Grace AI widget placeholder

### Upcoming

- Grace AI assistant with voice/SMS integration
- Ministry and group management
- Event management with RSVP
- Automated follow-up workflows
- Digital child check-in/check-out
- Comprehensive reporting

## Project Structure

```
apps/web/src/
├── app/                    # Next.js App Router
├── components/
│   ├── ui/                # Shadcn UI components
│   ├── auth/              # Authentication components
│   ├── dashboard/         # Dashboard components
│   ├── contacts/          # Contact management
│   ├── activity/          # Activity feed
│   ├── grace/             # Grace AI components
│   └── layout/            # Layout components
├── lib/
│   ├── auth/              # Authentication context
│   ├── supabase/          # Supabase client
│   └── database/          # Database schema
└── styles/                # Global styles
```

## License

MIT