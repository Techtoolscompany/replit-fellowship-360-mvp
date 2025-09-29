import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const JWT_SECRET = process.env.SESSION_SECRET || 'fallback-secret'

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

// Helper function to verify JWT token
async function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.split(' ')[1]

  if (!token) {
    return null
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return decoded
  } catch (error) {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json(
        { message: 'Access token required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const churchId = searchParams.get('churchId')

    // Validate church access
    if (!churchId) {
      return NextResponse.json(
        { message: 'churchId is required' },
        { status: 400 }
      )
    }

    if (user.role !== 'ADMIN' && user.churchId !== churchId) {
      return NextResponse.json(
        { message: 'Access denied' },
        { status: 403 }
      )
    }

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
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json(
        { message: 'Access token required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const churchId = searchParams.get('churchId')

    // Validate church access
    if (!churchId) {
      return NextResponse.json(
        { message: 'churchId is required' },
        { status: 400 }
      )
    }

    if (user.role !== 'ADMIN' && user.churchId !== churchId) {
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
