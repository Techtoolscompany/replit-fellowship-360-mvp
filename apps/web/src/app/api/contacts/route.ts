import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const contactSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().optional(),
  }).optional(),
  status: z.enum(['LEAD', 'ACTIVE', 'INACTIVE']).default('LEAD'),
  tags: z.array(z.string()).default([]),
  notes: z.string().optional(),
  assignedToUserId: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get authenticated user from Supabase session
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const churchId = searchParams.get('churchId')

    if (!churchId) {
      return NextResponse.json(
        { message: 'churchId is required' },
        { status: 400 }
      )
    }

    // Get user's profile to check church access
    const { data: userProfile } = await supabase
      .from('users')
      .select('role, church_id')
      .eq('id', user.id)
      .single()

    // Check if user has access to this church
    if (userProfile?.role !== 'AGENCY' && userProfile?.church_id !== churchId) {
      return NextResponse.json(
        { message: 'Access denied' },
        { status: 403 }
      )
    }

    // Fetch contacts - RLS policies will enforce additional security
    const { data: contacts, error } = await supabase
      .from('contacts')
      .select(`
        *,
        assigned_to_user:users!assigned_to_user_id(id, first_name, last_name, email)
      `)
      .eq('church_id', churchId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Get contacts error:', error)
      return NextResponse.json(
        { message: 'Failed to fetch contacts' },
        { status: 500 }
      )
    }

    return NextResponse.json(contacts)

  } catch (error) {
    console.error('Get contacts error:', error)
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

    const { searchParams } = new URL(request.url)
    const churchId = searchParams.get('churchId')

    if (!churchId) {
      return NextResponse.json(
        { message: 'churchId is required' },
        { status: 400 }
      )
    }

    // Get user's profile to check church access
    const { data: userProfile } = await supabase
      .from('users')
      .select('role, church_id')
      .eq('id', user.id)
      .single()

    if (userProfile?.role !== 'AGENCY' && userProfile?.church_id !== churchId) {
      return NextResponse.json(
        { message: 'Access denied' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const contactData = contactSchema.parse(body)

    const { data: contact, error } = await supabase
      .from('contacts')
      .insert({
        ...contactData,
        church_id: churchId,
        first_name: contactData.firstName,
        last_name: contactData.lastName,
        assigned_to_user_id: contactData.assignedToUserId,
      })
      .select()
      .single()

    if (error) {
      console.error('Create contact error:', error)
      return NextResponse.json(
        { message: 'Failed to create contact' },
        { status: 500 }
      )
    }

    return NextResponse.json(contact, { status: 201 })

  } catch (error) {
    console.error('Create contact error:', error)
    
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
