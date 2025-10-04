/**
 * Fellowship 360 - User Migration Script
 * 
 * This script migrates existing users from your users table to Supabase Auth.
 * 
 * IMPORTANT: Run this ONCE after setting up RLS policies
 * 
 * Prerequisites:
 * 1. RLS policies are set up (run supabase/rls-policies.sql)
 * 2. Environment variables are configured
 * 3. You have SUPABASE_SERVICE_ROLE_KEY in your .env
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

interface ExistingUser {
  id: string
  email: string
  first_name: string
  last_name: string
  role: 'STAFF' | 'ADMIN' | 'AGENCY'
  church_id: string | null
  phone: string | null
}

async function migrateUsers() {
  console.log('🚀 Starting user migration to Supabase Auth...\n')

  try {
    // Step 1: Fetch all existing users from your users table
    console.log('📋 Fetching existing users...')
    const { data: existingUsers, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: true })

    if (fetchError) {
      throw new Error(`Failed to fetch users: ${fetchError.message}`)
    }

    if (!existingUsers || existingUsers.length === 0) {
      console.log('✅ No users to migrate.')
      return
    }

    console.log(`Found ${existingUsers.length} users to migrate\n`)

    // Step 2: Migrate each user
    let successCount = 0
    let errorCount = 0
    const errors: Array<{ email: string; error: string }> = []

    for (const user of existingUsers as ExistingUser[]) {
      try {
        console.log(`Migrating: ${user.email}...`)

        // Check if user already exists in Supabase Auth
        const { data: existingAuthUser } = await supabase.auth.admin.getUserById(user.id)
        
        if (existingAuthUser.user) {
          console.log(`  ⏭️  Already exists in Supabase Auth`)
          successCount++
          continue
        }

        // Create user in Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          id: user.id, // Preserve the same ID
          email: user.email,
          email_confirm: true, // Auto-confirm email
          password: generateTemporaryPassword(), // Generate temporary password
          user_metadata: {
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role,
            church_id: user.church_id,
            migrated: true,
            migrated_at: new Date().toISOString()
          }
        })

        if (authError) {
          throw authError
        }

        console.log(`  ✅ Created in Supabase Auth`)
        
        // Update the users table to mark as migrated
        await supabase
          .from('users')
          .update({ 
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id)

        successCount++

      } catch (error: any) {
        console.log(`  ❌ Failed: ${error.message}`)
        errorCount++
        errors.push({ email: user.email, error: error.message })
      }
    }

    // Step 3: Summary
    console.log('\n' + '='.repeat(60))
    console.log('📊 MIGRATION SUMMARY')
    console.log('='.repeat(60))
    console.log(`✅ Successfully migrated: ${successCount}`)
    console.log(`❌ Failed: ${errorCount}`)
    console.log('='.repeat(60))

    if (errors.length > 0) {
      console.log('\n❌ ERRORS:')
      errors.forEach(({ email, error }) => {
        console.log(`  - ${email}: ${error}`)
      })
    }

    // Step 4: Next steps
    console.log('\n' + '='.repeat(60))
    console.log('📝 NEXT STEPS')
    console.log('='.repeat(60))
    console.log('1. All users now have TEMPORARY passwords')
    console.log('2. Send password reset emails to all users:')
    console.log('   - Use Supabase dashboard: Authentication > Users > "Send reset password email"')
    console.log('   - Or use the provided script: npm run send-password-resets')
    console.log('')
    console.log('3. Users will receive an email to set their new password')
    console.log('='.repeat(60))

  } catch (error: any) {
    console.error('\n❌ Migration failed:', error.message)
    process.exit(1)
  }
}

// Helper function to generate temporary password
function generateTemporaryPassword(): string {
  const length = 16
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  let password = ''
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  return password
}

// Optional: Send password reset emails to all migrated users
async function sendPasswordResetEmails() {
  console.log('📧 Sending password reset emails...\n')

  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('email')

    if (error) throw error

    if (!users || users.length === 0) {
      console.log('No users found.')
      return
    }

    let successCount = 0
    let errorCount = 0

    for (const user of users) {
      try {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(
          user.email,
          {
            redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`
          }
        )

        if (resetError) throw resetError

        console.log(`✅ Sent to: ${user.email}`)
        successCount++

      } catch (error: any) {
        console.log(`❌ Failed for ${user.email}: ${error.message}`)
        errorCount++
      }
    }

    console.log(`\n✅ Successfully sent: ${successCount}`)
    console.log(`❌ Failed: ${errorCount}`)

  } catch (error: any) {
    console.error('❌ Failed to send password reset emails:', error.message)
    process.exit(1)
  }
}

// Main execution
const command = process.argv[2]

if (command === 'send-resets') {
  sendPasswordResetEmails()
} else {
  migrateUsers()
}