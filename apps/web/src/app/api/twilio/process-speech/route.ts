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
    
    // Parse Twilio form data
    const formData = await request.formData()
    const speechResult = formData.get('SpeechResult') as string
    const from = formData.get('From') as string
    const callSid = formData.get('CallSid') as string

    if (!churchId || !speechResult) {
      const twiml = new VoiceResponse()
      twiml.say({ voice: 'alice' }, 'I\'m sorry, I didn\'t understand that.')
      twiml.redirect(`/api/twilio/voice-handler?churchId=${churchId}`)
      
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

    // Log the interaction as an activity
    await supabase
      .from('activities')
      .insert({
        type: 'VOICE',
        status: 'COMPLETED',
        description: `Grace AI call: ${speechResult}`,
        metadata: {
          speech_result: speechResult,
          from: from,
          call_sid: callSid
        },
        church_id: churchId,
      })

    // TODO: Process speech with AI (OpenAI, etc.)
    // For now, provide a generic response
    const twiml = new VoiceResponse()
    
    // Simple response - replace with actual AI processing
    twiml.say({ voice: 'alice' }, 'Thank you for your message. A member of our team will get back to you soon.')
    
    // Optionally gather more input
    twiml.say({ voice: 'alice' }, 'Is there anything else I can help you with?')
    twiml.gather({
      input: ['speech'],
      action: `/api/twilio/process-speech?churchId=${churchId}`,
      speechTimeout: 'auto',
      timeout: 5,
    })
    
    // End call if no response
    twiml.say({ voice: 'alice' }, 'Thank you for calling. Goodbye!')
    twiml.hangup()

    return new NextResponse(twiml.toString(), {
      headers: { 'Content-Type': 'text/xml' },
    })

  } catch (error) {
    console.error('Process speech error:', error)
    
    const twiml = new VoiceResponse()
    twiml.say({ voice: 'alice' }, 'I\'m sorry, there was an error processing your request. Please try again later.')
    twiml.hangup()
    
    return new NextResponse(twiml.toString(), {
      headers: { 'Content-Type': 'text/xml' },
    })
  }
}
