import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import twilio from 'twilio'

const VoiceResponse = twilio.twiml.VoiceResponse

// Use service role for Twilio webhooks (no user session)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const churchId = searchParams.get('churchId')
    const greeting = searchParams.get('greeting') || 'Hello, thank you for calling our church.'

    if (!churchId) {
      const twiml = new VoiceResponse()
      twiml.say({ voice: 'alice' }, 'Thank you for calling. Please try again later.')
      twiml.hangup()
      
      return new NextResponse(twiml.toString(), {
        headers: { 'Content-Type': 'text/xml' },
      })
    }

    // Validate church exists
    const { data: church } = await supabase
      .from('churches')
      .select('*')
      .eq('id', churchId)
      .single()

    if (!church) {
      const twiml = new VoiceResponse()
      twiml.say({ voice: 'alice' }, 'Thank you for calling. Please try again later.')
      twiml.hangup()
      
      return new NextResponse(twiml.toString(), {
        headers: { 'Content-Type': 'text/xml' },
      })
    }

    // Generate TwiML response
    const twiml = new VoiceResponse()
    
    // Play greeting
    twiml.say({ voice: 'alice' }, greeting)
    
    // Gather speech input
    const gather = twiml.gather({
      input: ['speech'],
      action: `/api/twilio/process-speech?churchId=${churchId}`,
      speechTimeout: 'auto',
      timeout: 10,
    })
    
    gather.say({ voice: 'alice' }, 'How can I help you today?')
    
    // Fallback if no speech detected
    twiml.say({ voice: 'alice' }, 'I didn\'t hear anything. Please try again.')
    twiml.redirect(`/api/twilio/voice-handler?churchId=${churchId}`)

    return new NextResponse(twiml.toString(), {
      headers: { 'Content-Type': 'text/xml' },
    })

  } catch (error) {
    console.error('Voice handler error:', error)
    
    const twiml = new VoiceResponse()
    twiml.say({ voice: 'alice' }, 'I\'m sorry, there was an error. Please try again later.')
    twiml.hangup()
    
    return new NextResponse(twiml.toString(), {
      headers: { 'Content-Type': 'text/xml' },
    })
  }
}
