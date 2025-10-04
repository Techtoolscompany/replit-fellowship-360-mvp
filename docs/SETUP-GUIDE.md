# Fellowship 360 - Setup Guide

Complete step-by-step guide to get Fellowship 360 running after the codebase review and fixes.

---

## 📋 Prerequisites

Before you begin, ensure you have:

- [x] Node.js 18+ installed
- [x] A Supabase account (self-hosted or cloud)
- [x] Twilio account (for Grace AI features)
- [x] Git installed

---

## 🚀 Quick Start (5 Steps)

### Step 1: Install Dependencies

```bash
# Install root dependencies
npm install

# Install web app dependencies
cd apps/web
npm install
cd ../..
```

### Step 2: Configure Environment Variables

```bash
# Copy the environment template
cp .env.example .env

# Edit .env and fill in your values
nano .env  # or use your preferred editor
```

**Note:** The main `.env.example` file is in the project root. For the web app specifically, you can also use `apps/web/.env.local` for Next.js-specific environment variables.

**Required variables:**
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Twilio (for Grace AI)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Optional: ElevenLabs for AI voice
ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

### Step 3: Set Up Database Schema

**IMPORTANT:** You need to create the database tables first before setting up RLS policies.

1. Open your Supabase SQL Editor
2. Copy and run the SQL from the "Database Schema Setup" section below
3. This will create all required tables: `churches`, `users`, `contacts`, `activities`

### Step 4: Set Up Database Security (RLS)

1. Open your Supabase SQL Editor
2. Copy the contents of [`supabase/rls-policies.sql`](../supabase/rls-policies.sql)
3. Paste and run the SQL
4. Verify policies are active:
   ```sql
   SELECT tablename, COUNT(*) as policy_count
   FROM pg_policies 
   WHERE schemaname = 'public'
   GROUP BY tablename;
   ```

You should see policies for: `churches`, `users`, `contacts`, `activities`

### Step 5: Migrate Users to Supabase Auth

```bash
# Run the migration script
npm run migrate:users

# Send password reset emails to all users
npm run migrate:send-resets
```

### Step 6: Start the Development Server

```bash
npm run dev
```

Visit http://localhost:3000 🎉

---

## 🔧 Optional: MCP Server Setup

If you want to use Model Context Protocol (MCP) tools for database management:

### Configure Supabase MCP Server

1. **Get Supabase Access Token:**
   - Go to your Supabase dashboard
   - Navigate to Settings → Access Tokens
   - Generate a new token for MCP server

2. **Update MCP Configuration:**
   - Edit `~/.cursor/mcp.json` (or your MCP config file)
   - Add the Supabase MCP server configuration:
   ```json
   {
     "mcpServers": {
       "supabase": {
         "command": "npx",
         "args": [
           "-y",
           "@supabase/mcp-server-supabase@latest",
           "--access-token",
           "YOUR_SUPABASE_ACCESS_TOKEN",
           "--project-ref",
           "YOUR_PROJECT_REF"
         ],
         "env": {
           "SUPABASE_URL": "YOUR_SUPABASE_URL",
           "SUPABASE_ANON_KEY": "YOUR_SUPABASE_ANON_KEY"
         }
       }
     }
   }
   ```

3. **Restart Cursor** to load the MCP server

This enables database management tools directly in your IDE.

---

## 📖 Detailed Setup Instructions

### A. Supabase Configuration

#### Option 1: Using Cloud Supabase

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Project Settings > API
4. Copy your:
   - Project URL (`NEXT_PUBLIC_SUPABASE_URL`)
   - Anon/Public key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - Service role key (`SUPABASE_SERVICE_ROLE_KEY`)

#### Option 2: Using Self-Hosted Supabase

If you're using self-hosted Supabase:

1. Your URL will be your server address (e.g., `https://supabase.yourdomain.com`)
2. Find keys in your Supabase dashboard under Project Settings > API
3. Ensure your self-hosted instance is properly configured with:
   - PostgreSQL database
   - PostgREST API
   - GoTrue auth service

---

### B. Database Schema Setup

Your Supabase database should have these tables:

#### 1. Churches Table
```sql
CREATE TABLE churches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address JSONB,
  website TEXT,
  timezone TEXT DEFAULT 'America/New_York',
  settings JSONB DEFAULT '{}'::jsonb,
  grace_phone TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### 2. Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('STAFF', 'ADMIN', 'AGENCY')),
  church_id UUID REFERENCES churches(id),
  phone TEXT,
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### 3. Contacts Table
```sql
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address JSONB,
  status TEXT NOT NULL CHECK (status IN ('LEAD', 'ACTIVE', 'INACTIVE')),
  tags JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  church_id UUID NOT NULL REFERENCES churches(id),
  assigned_to_user_id UUID REFERENCES users(id),
  last_contacted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### 4. Activities Table
```sql
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('VOICE', 'SMS', 'EMAIL', 'VISIT', 'CALENDAR', 'WORKFLOW', 'MANUAL')),
  status TEXT NOT NULL CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED')),
  description TEXT,
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  contact_id UUID REFERENCES contacts(id),
  church_id UUID NOT NULL REFERENCES churches(id),
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

---

### C. User Migration Process

The user migration has two parts:

#### Part 1: Migrate to Supabase Auth

```bash
npm run migrate:users
```

This will:
- Read all users from your `users` table
- Create corresponding users in Supabase Auth
- Preserve user IDs and metadata
- Generate temporary passwords

#### Part 2: Send Password Resets

```bash
npm run migrate:send-resets
```

This will:
- Send password reset emails to all users
- Users click the link to set their new password
- Users can then log in with new password

---

### D. Testing Your Setup

#### 1. Test Database Connection

Create a test file: `scripts/test-connection.ts`

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function testConnection() {
  const { data, error } = await supabase.from('churches').select('count')
  
  if (error) {
    console.error('❌ Connection failed:', error)
  } else {
    console.log('✅ Connected to Supabase!')
  }
}

testConnection()
```

Run: `tsx scripts/test-connection.ts`

#### 2. Test Authentication

1. Go to http://localhost:3000
2. Try to log in with a migrated user
3. You should see the login form
4. After login, you should see the dashboard

#### 3. Test RLS Policies

Try these queries in Supabase SQL Editor:

```sql
-- Should return your churches
SELECT * FROM churches;

-- Should return users in your church
SELECT * FROM users;

-- Should return contacts in your church
SELECT * FROM contacts;
```

---

## 🔧 Troubleshooting

### Issue: "Unauthorized" errors

**Cause:** RLS policies not set up correctly

**Fix:**
1. Verify RLS is enabled: `SELECT tablename FROM pg_tables WHERE rowsecurity = true;`
2. Re-run `supabase/rls-policies.sql`
3. Check user has correct `church_id`

### Issue: Users can't log in

**Cause:** Users not migrated to Supabase Auth

**Fix:**
1. Run `npm run migrate:users`
2. Run `npm run migrate:send-resets`
3. Users must reset their password

### Issue: "Invalid JWT" errors

**Cause:** Environment variables incorrect

**Fix:**
1. Verify `.env` has correct Supabase keys
2. Restart development server: `npm run dev`
3. Clear browser cookies/local storage

### Issue: TypeScript errors

**Cause:** Dependencies not installed or types missing

**Fix:**
```bash
cd apps/web
npm install
cd ../..
npm run check
```

### Issue: Database tables don't exist

**Cause:** Database schema not set up

**Fix:**
1. Run the SQL from "Database Schema Setup" section
2. Verify tables exist: `SELECT tablename FROM pg_tables WHERE schemaname = 'public';`
3. Then run RLS policies

### Issue: MCP server not working

**Cause:** Incorrect project reference or access token

**Fix:**
1. Verify project reference matches your Supabase URL
2. Check access token is valid and has proper permissions
3. Restart Cursor after updating MCP config

### Issue: Twilio webhooks not working

**Cause:** Webhook URLs not configured in Twilio

**Fix:**
1. Go to Twilio Console > Phone Numbers
2. Set Voice URL to: `https://yourdomain.com/api/twilio/voice-handler?churchId=YOUR_CHURCH_ID`
3. Set SMS URL to: `https://yourdomain.com/api/twilio/process-speech?churchId=YOUR_CHURCH_ID`

---

## 📚 Next Steps

After setup is complete:

1. **Create Your First Church**
   - Use Supabase dashboard to insert a church record
   - Or use the API: `POST /api/churches`

2. **Add Users**
   - Create users in Supabase Auth
   - Link them to churches in `users` table

3. **Import Contacts**
   - Use the API: `POST /api/contacts`
   - Or import via CSV (feature to be added)

4. **Configure Grace AI**
   - Set up Twilio phone number
   - Configure ElevenLabs for voice (optional)
   - Test voice interactions

5. **Customize Settings**
   - Church settings in `churches` table
   - User preferences
   - Grace AI behavior

---

## 🔒 Security Checklist

Before going to production:

- [ ] All RLS policies are active
- [ ] Service role key is kept secret
- [ ] HTTPS is enabled
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled (future enhancement)
- [ ] All users have strong passwords
- [ ] Backup strategy is in place
- [ ] Monitoring is set up

---

## 📞 Support

If you encounter issues:

1. Check the [CODEBASE-REVIEW-FIXES.md](./CODEBASE-REVIEW-FIXES.md) document
2. Review Supabase logs in dashboard
3. Check browser console for errors
4. Review server logs: `npm run dev`

---

## 🎯 Summary

You should now have:
- ✅ Dependencies installed
- ✅ Environment variables configured
- ✅ Database with RLS policies
- ✅ Users migrated to Supabase Auth
- ✅ Development server running

**Your Fellowship 360 app is ready to use! 🎉**

---

*Last updated: January 2025*