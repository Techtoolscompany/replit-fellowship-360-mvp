/**
 * Fellowship 360 - Create Dummy Users in Supabase Auth
 * 
 * This script creates users in Supabase Auth and links them to the dummy data
 * Run this AFTER setting up the database schema and RLS policies
 * 
 * Prerequisites:
 * 1. Database schema is set up (run setup-database-schema.sql)
 * 2. RLS policies are set up (run supabase/rls-policies.sql)
 * 3. Environment variables are configured (.env file)
 * 4. Dummy data is inserted (run create-dummy-data.sql)
 */

import { createClient } from '@supabase/supabase-js'

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing environment variables!')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Dummy users to create in Supabase Auth
const dummyUsers = [
  // Grace Community Church Staff (Large church with multiple staff)
  {
    id: '11111111-1111-1111-1111-111111111111',
    email: 'pastor@gracecommunity.org',
    password: 'pastor123',
    firstName: 'Dr. Michael',
    lastName: 'Johnson',
    role: 'ADMIN',
    churchId: '550e8400-e29b-41d4-a716-446655440001',
    phone: '(217) 555-1001'
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    email: 'admin@gracecommunity.org',
    password: 'admin123',
    firstName: 'Sarah',
    lastName: 'Williams',
    role: 'ADMIN',
    churchId: '550e8400-e29b-41d4-a716-446655440001',
    phone: '(217) 555-1002'
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    email: 'youth@gracecommunity.org',
    password: 'youth123',
    firstName: 'Mike',
    lastName: 'Davis',
    role: 'STAFF',
    churchId: '550e8400-e29b-41d4-a716-446655440001',
    phone: '(217) 555-1003'
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    email: 'children@gracecommunity.org',
    password: 'children123',
    firstName: 'Jennifer',
    lastName: 'Brown',
    role: 'STAFF',
    churchId: '550e8400-e29b-41d4-a716-446655440001',
    phone: '(217) 555-1004'
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    email: 'music@gracecommunity.org',
    password: 'music123',
    firstName: 'David',
    lastName: 'Wilson',
    role: 'STAFF',
    churchId: '550e8400-e29b-41d4-a716-446655440001',
    phone: '(217) 555-1005'
  },

  // Hope Baptist Church Staff (Medium church with traditional structure)
  {
    id: '66666666-6666-6666-6666-666666666666',
    email: 'pastor@hopebaptist.org',
    password: 'pastor123',
    firstName: 'Rev. James',
    lastName: 'Brown',
    role: 'ADMIN',
    churchId: '550e8400-e29b-41d4-a716-446655440002',
    phone: '(217) 555-2001'
  },
  {
    id: '77777777-7777-7777-7777-777777777777',
    email: 'secretary@hopebaptist.org',
    password: 'secretary123',
    firstName: 'Lisa',
    lastName: 'Garcia',
    role: 'STAFF',
    churchId: '550e8400-e29b-41d4-a716-446655440002',
    phone: '(217) 555-2002'
  },
  {
    id: '88888888-8888-8888-8888-888888888888',
    email: 'deacon@hopebaptist.org',
    password: 'deacon123',
    firstName: 'Robert',
    lastName: 'Miller',
    role: 'STAFF',
    churchId: '550e8400-e29b-41d4-a716-446655440002',
    phone: '(217) 555-2003'
  },

  // New Life Fellowship Staff (Smaller church with contemporary structure)
  {
    id: '99999999-9999-9999-9999-999999999999',
    email: 'elder@newlifefellowship.org',
    password: 'elder123',
    firstName: 'Elder Patricia',
    lastName: 'Martinez',
    role: 'ADMIN',
    churchId: '550e8400-e29b-41d4-a716-446655440003',
    phone: '(217) 555-3001'
  },
  {
    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    email: 'worship@newlifefellowship.org',
    password: 'worship123',
    firstName: 'Carlos',
    lastName: 'Rodriguez',
    role: 'STAFF',
    churchId: '550e8400-e29b-41d4-a716-446655440003',
    phone: '(217) 555-3002'
  },

  // Agency User (can see all churches)
  {
    id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    email: 'support@fellowship360.com',
    password: 'support123',
    firstName: 'Alex',
    lastName: 'Thompson',
    role: 'AGENCY',
    churchId: null,
    phone: '(217) 555-0001'
  }
]

async function createDummyUsers() {
  console.log('🚀 Creating dummy users in Supabase Auth...\n')

  try {
    let successCount = 0
    let errorCount = 0
    const errors: Array<{ email: string; error: string }> = []

    for (const user of dummyUsers) {
      try {
        console.log(`Creating user: ${user.email}...`)

        // Check if user already exists
        const { data: existingUser } = await supabase.auth.admin.getUserById(user.id)
        
        if (existingUser.user) {
          console.log(`  ⏭️  Already exists in Supabase Auth`)
          successCount++
          continue
        }

        // Create user in Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          id: user.id, // Preserve the same ID
          email: user.email,
          email_confirm: true, // Auto-confirm email
          password: user.password,
          user_metadata: {
            first_name: user.firstName,
            last_name: user.lastName,
            role: user.role,
            church_id: user.churchId,
            phone: user.phone,
            created_by: 'dummy-data-script',
            created_at: new Date().toISOString()
          }
        })

        if (authError) {
          throw authError
        }

        console.log(`  ✅ Created successfully`)
        successCount++

      } catch (error: any) {
        console.log(`  ❌ Failed: ${error.message}`)
        errorCount++
        errors.push({ email: user.email, error: error.message })
      }
    }

    // Summary
    console.log('\n' + '='.repeat(60))
    console.log('📊 USER CREATION SUMMARY')
    console.log('='.repeat(60))
    console.log(`✅ Successfully created: ${successCount}`)
    console.log(`❌ Failed: ${errorCount}`)
    console.log('='.repeat(60))

    if (errors.length > 0) {
      console.log('\n❌ ERRORS:')
      errors.forEach(({ email, error }) => {
        console.log(`  - ${email}: ${error}`)
      })
    }

    // Login credentials
    console.log('\n' + '='.repeat(60))
    console.log('🔑 LOGIN CREDENTIALS')
    console.log('='.repeat(60))
    console.log('You can now log in with these credentials:')
    console.log('')
    
    // Grace Community Church (Main Demo)
    console.log('🏛️  GRACE COMMUNITY CHURCH (Large - 450 avg attendance):')
    console.log('  Pastor: pastor@gracecommunity.org / pastor123')
    console.log('  Admin: admin@gracecommunity.org / admin123')
    console.log('  Youth Director: youth@gracecommunity.org / youth123')
    console.log('  Children Director: children@gracecommunity.org / children123')
    console.log('  Music Director: music@gracecommunity.org / music123')
    console.log('')
    
    // Hope Baptist Church
    console.log('⛪ HOPE BAPTIST CHURCH (Medium - 180 avg attendance):')
    console.log('  Pastor: pastor@hopebaptist.org / pastor123')
    console.log('  Secretary: secretary@hopebaptist.org / secretary123')
    console.log('  Deacon: deacon@hopebaptist.org / deacon123')
    console.log('')
    
    // New Life Fellowship
    console.log('🙏 NEW LIFE FELLOWSHIP (Smaller - 95 avg attendance):')
    console.log('  Elder: elder@newlifefellowship.org / elder123')
    console.log('  Worship Leader: worship@newlifefellowship.org / worship123')
    console.log('')
    
    // Agency
    console.log('🏢 AGENCY (sees all churches):')
    console.log('  Support Manager: support@fellowship360.com / support123')
    console.log('')
    
    console.log('='.repeat(60))
    console.log('🎉 Ready to test Fellowship 360!')
    console.log('='.repeat(60))

  } catch (error: any) {
    console.error('\n❌ Script failed:', error.message)
    process.exit(1)
  }
}

// Run the script
createDummyUsers()
