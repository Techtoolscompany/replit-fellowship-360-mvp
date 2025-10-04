#!/bin/bash

# ============================================================================
# Fellowship 360 - Complete Setup Script
# ============================================================================
# This script sets up the entire Fellowship 360 application with dummy data
# Run this after configuring your .env file
# ============================================================================

set -e  # Exit on any error

echo "🚀 Fellowship 360 - Complete Setup"
echo "=================================="
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found!"
    echo "Please copy .env.example to .env and configure your credentials first."
    echo ""
    echo "Run: cp .env.example .env"
    echo "Then edit .env with your Supabase and Twilio credentials."
    exit 1
fi

echo "✅ Found .env file"
echo ""

# Check if required environment variables are set
echo "🔍 Checking environment variables..."

if ! grep -q "NEXT_PUBLIC_SUPABASE_URL=" .env || ! grep -q "SUPABASE_SERVICE_ROLE_KEY=" .env; then
    echo "❌ Error: Missing required Supabase credentials in .env file"
    echo "Please add your Supabase URL and Service Role Key to .env"
    exit 1
fi

echo "✅ Supabase credentials found"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Create scripts directory if it doesn't exist
mkdir -p scripts

echo "📋 Setup Instructions:"
echo "======================"
echo ""
echo "1. 🗄️  DATABASE SETUP"
echo "   - Open your Supabase SQL Editor"
echo "   - Run: scripts/setup-database-schema.sql"
echo "   - This creates all required tables"
echo ""
echo "2. 🔒 SECURITY SETUP"
echo "   - In Supabase SQL Editor, run: supabase/rls-policies.sql"
echo "   - This sets up Row Level Security policies"
echo ""
echo "3. 📊 DUMMY DATA SETUP"
echo "   - In Supabase SQL Editor, run: scripts/create-dummy-data.sql"
echo "   - This inserts realistic church data"
echo ""
echo "4. 👥 USER CREATION"
echo "   - Run: npm run create:dummy-users"
echo "   - This creates users in Supabase Auth"
echo ""
echo "5. 🚀 START APPLICATION"
echo "   - Run: npm run dev"
echo "   - Visit: http://localhost:3000"
echo ""
echo "🔑 LOGIN CREDENTIALS (after setup):"
echo "===================================="
echo ""
echo "Grace Community Church (Main Demo - Large, 450 avg attendance):"
echo "  Pastor: pastor@gracecommunity.org / pastor123"
echo "  Admin: admin@gracecommunity.org / admin123"
echo "  Youth Director: youth@gracecommunity.org / youth123"
echo "  Children Director: children@gracecommunity.org / children123"
echo "  Music Director: music@gracecommunity.org / music123"
echo ""
echo "Hope Baptist Church (Medium, 180 avg attendance):"
echo "  Pastor: pastor@hopebaptist.org / pastor123"
echo "  Secretary: secretary@hopebaptist.org / secretary123"
echo "  Deacon: deacon@hopebaptist.org / deacon123"
echo ""
echo "New Life Fellowship (Smaller, 95 avg attendance):"
echo "  Elder: elder@newlifefellowship.org / elder123"
echo "  Worship Leader: worship@newlifefellowship.org / worship123"
echo ""
echo "Agency (sees all churches):"
echo "  Support Manager: support@fellowship360.com / support123"
echo ""
echo "📊 DUMMY DATA INCLUDES:"
echo "======================"
echo ""
echo "🏛️  3 Churches with realistic characteristics:"
echo "   - Grace Community: Large, Non-denominational, established 1985"
echo "   - Hope Baptist: Medium, Southern Baptist, established 1972"
echo "   - New Life Fellowship: Smaller, Pentecostal, established 1995"
echo ""
echo "👥 11 Users with realistic church roles:"
echo "   - Pastors, Admins, Directors, Secretaries, Deacons"
echo "   - Different permission levels and responsibilities"
echo ""
echo "📞 15 Contacts with diverse demographics:"
echo "   - Active members (long-term relationships)"
echo "   - New visitors/leads (recent interest)"
echo "   - Inactive members (life changes)"
echo "   - Various ages, family situations, involvement levels"
echo ""
echo "🤖 18 Grace AI Activities showcasing real operations:"
echo "   - Voice calls: Welcome calls, follow-ups, prayer requests"
echo "   - SMS: Reminders, check-ins, confirmations"
echo "   - Email: Invitations, newsletters, personalized content"
echo "   - Manual: Pastoral visits, orientations, meetings"
echo "   - Workflows: Automated onboarding, event coordination"
echo "   - Calendar: Event scheduling, facility coordination"
echo ""
echo "📈 Realistic metrics and relationships:"
echo "   - Call durations and quality ratings"
echo "   - Message response times and engagement"
echo "   - Email open/click rates"
echo "   - Visit types and durations"
echo "   - Workflow completion rates"
echo "   - Event attendance and coordination"
echo ""
echo "🎯 FEATURES TO TEST:"
echo "==================="
echo ""
echo "✅ Multi-tenant architecture (church isolation)"
echo "✅ Role-based access control"
echo "✅ Grace AI activity tracking"
echo "✅ Contact management"
echo "✅ Dashboard metrics"
echo "✅ Responsive design"
echo ""
echo "⚠️  IMPORTANT NOTES:"
echo "==================="
echo ""
echo "• Make sure your Supabase project is active"
echo "• RLS policies are CRITICAL for security"
echo "• Test with different user roles"
echo "• Check that church data is properly isolated"
echo ""
echo "🎉 Ready to set up Fellowship 360!"
echo "Follow the steps above to complete the setup."
