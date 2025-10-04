import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const churchSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().optional(),
  }).optional(),
  website: z.string().url().optional(),
  timezone: z.string().default('America/New_York'),
  settings: z.record(z.any()).default({}),
  gracePhone: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user's profile to check role
    const { data: userProfile } = await supabase
      .from('users')
      .select('role, church_id')
      .eq('id', user.id)
      .single()

    // Agency users can see all churches, others only see their own
    let query = supabase.from('churches').select('*')
    
    if (userProfile?.role !== 'AGENCY') {
      if (!userProfile?.church_id) {
        return NextResponse.json(
          { message: 'No church access' },
          { status: 403 }
        )
      }
      query = query.eq('id', userProfile.church_id)
    }

    const { data: churches, error } = await query

    if (error) {
      console.error('Get churches error:', error)
      return NextResponse.json(
        { message: 'Failed to fetch churches' },
        { status: 500 }
      )
    }

    return NextResponse.json(churches)

  } catch (error) {
    console.error('Get churches error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user's profile to check role
    const { data: userProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    // Only agency users can create churches
    if (userProfile?.role !== 'AGENCY') {
      return NextResponse.json(
        { message: 'Agency access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const churchData = churchSchema.parse(body)

    const { data: church, error } = await supabase
      .from('churches')
      .insert({
        name: churchData.name,
        email: churchData.email,
        phone: churchData.phone,
        address: churchData.address,
        website: churchData.website,
        timezone: churchData.timezone,
        settings: churchData.settings,
        grace_phone: churchData.gracePhone,
      })
      .select()
      .single()

    if (error) {
      console.error('Create church error:', error)
      return NextResponse.json(
        { message: 'Failed to create church' },
        { status: 500 }
      )
    }

    return NextResponse.json(church, { status: 201 })

  } catch (error) {
    console.error('Create church error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid input data', errors: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
