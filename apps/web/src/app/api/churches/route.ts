import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const JWT_SECRET = process.env.SESSION_SECRET || 'fallback-secret'

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

    // Admin can see all churches, others only see their own
    let query = supabase.from('churches').select('*')
    
    if (user.role !== 'ADMIN') {
      if (!user.churchId) {
        return NextResponse.json(
          { message: 'No church access' },
          { status: 403 }
        )
      }
      query = query.eq('id', user.churchId)
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
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json(
        { message: 'Access token required' },
        { status: 401 }
      )
    }

    // Only admins can create churches
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const churchData = churchSchema.parse(body)

    const { data: church, error } = await supabase
      .from('churches')
      .insert(churchData)
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
