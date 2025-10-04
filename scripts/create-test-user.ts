/**
 * Create a test user in Supabase Auth and users table
 * This allows you to login and test the application
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'

// Load environment variables from root .env file
config({ path: resolve(process.cwd(), '.env') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing environment variables!')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
}

)

async function createTestUser() {
  console.log('🔍 Checking existing users...\n')

  // Check existing users
  const { data: existingUsers, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .limit(5)

  if (fetchError) {
    console.error('❌ Error checking users:', fetchError.message)
  } else {
    console.log(`Found ${existingUsers?.length || 0} users in database\n`)
  }

  // Create test user
  const testEmail = 'admin@fellowship360.com'
  const testPassword = 'TestPassword123!'

  console.log('Creating test user...')
  console.log(`Email: ${testEmail}`)
  console.log(`Password: ${testPassword}\n`)

  try {
    // Step 1: Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true,
      user_metadata: {
        first_name: 'Admin',
        last_name: 'User',
        role: 'ADMIN'
      }
    })

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('⚠️  User already exists in Supabase Auth')
        
        // Get existing user
        const { data: { users } } = await supabase.auth.admin.listUsers()
        const existingUser = users.find(u => u.email === testEmail)
        
        if (existingUser) {
          console.log(`✅ Found existing user: ${existingUser.id}`)
          
          // Check if user exists in users table
          const { data: userRecord } = await supabase
            .from('users')
            .select('*')
            .eq('id', existingUser.id)
            .single()
          
          if (!userRecord) {
            console.log('Creating record in users table...')
            
            // Create user record
            const { error: insertError } = await supabase
              .from('users')
              .insert({
                id: existingUser.id,
                email: testEmail,
                first_name: 'Admin',
                last_name: 'User',
                role: 'ADMIN',
                is_active: true
              })
            
            if (insertError) {
              console.error('❌ Error creating user record:', insertError.message)
            } else {
              console.log('✅ User record created')
            }
          } else {
            console.log('✅ User record already exists')
          }
        }
      } else {
        throw authError
      }
    } else {
      console.log(`✅ User created in Supabase Auth: ${authData.user.id}`)
      
      // Step 2: Create user in users table
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: testEmail,
          first_name: 'Admin',
          last_name: 'User',
          role: 'ADMIN',
          is_active: true,
          created_at: new Date().toISOString()
        })
      
      if (insertError) {
        console.error('❌ Error creating user record:', insertError.message)
      } else {
        console.log('✅ User record created in users table')
      }
    }

    console.log('\n' + '='.repeat(60))
    console.log('✅ TEST USER READY')
    console.log('='.repeat(60))
    console.log(`Email:    ${testEmail}`)
    console.log(`Password: ${testPassword}`)
    console.log('='.repeat(60))
    console.log('\n📝 Next steps:')
    console.log('1. Go to http://localhost:3000')
    console.log('2. Login with the credentials above')
    console.log('3. You should now be able to access the dashboard!')

  } catch (error: any) {
    console.error('\n❌ Failed to create user:', error.message)
    process.exit(1)
  }
}

createTestUser()