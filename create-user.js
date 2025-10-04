import { createClient } from '@supabase/supabase-js'

// Configuration
const SUPABASE_URL = 'https://wzjcwqgxhrdboepbjint.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6amN3cWd4aHJkYm9lcGJqaW50Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTUyMzY5NywiZXhwIjoyMDc1MDk5Njk3fQ.nZO3Y2sdE8VbNCkVNyRIcbJEztpwAzM1sT6HVX9IZdo'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createTestUser() {
  console.log('🔑 Creating test user with Supabase Admin API...\n')

  try {
    // Create user in Supabase Auth using admin API
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'test@example.com',
      password: 'TestPassword123!',
      email_confirm: true,
      user_metadata: {
        first_name: 'Test',
        last_name: 'User',
        role: 'ADMIN',
        church_id: '550e8400-e29b-41d4-a716-446655440001'
      }
    })

    if (authError) {
      console.error('❌ Auth creation failed:', authError.message)
      return
    }

    console.log('✅ User created in Supabase Auth:', authData.user?.email)

    // Add to our users table
    const { error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        role: 'ADMIN',
        church_id: '550e8400-e29b-41d4-a716-446655440001',
        phone: '(555) 555-5555',
        is_active: true
      })

    if (userError) {
      console.error('❌ User table insert failed:', userError.message)
      return
    }

    console.log('✅ User added to users table')
    console.log('\n🎉 Test user created successfully!')
    console.log('Email: test@example.com')
    console.log('Password: TestPassword123!')

  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

createTestUser()
