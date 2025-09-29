import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { VoiceResponse } from 'twilio'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const churchId = searchParams.get('churchId')
    
    const formData = await request.formData()
    const speechResult = formData.get('SpeechResult') as string
    const callSid = formData.get('CallSid') as string
    const from = formData.get('From') as string
    const to = formData.get('To') as string
    const caller = formData.get('Caller') as string

    if (!speechResult || !churchId) {
      const twiml = new VoiceResponse()
      twiml.say({ voice: 'alice' }, 'I\'m sorry, I didn\'t understand. Please try again later.')
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
      console.warn(`Invalid churchId in Twilio call: ${churchId}`)
      const twiml = new VoiceResponse()
      twiml.say({ voice: 'alice' }, 'Thank you for calling. Please try again later.')
      twiml.hangup()
      
      return new NextResponse(twiml.toString(), {
        headers: { 'Content-Type': 'text/xml' },
      })
    }

    // Process Grace's response (simplified for now)
    let response = 'Thank you for calling. I understand you said: ' + speechResult + '. Is there anything else I can help you with?'
    let shouldContinue = true

    // Simple FAQ responses
    const lowerSpeech = speechResult.toLowerCase()
    if (lowerSpeech.includes('service time') || lowerSpeech.includes('when is service')) {
      response = 'Our services are on Sundays at 10:00 AM and 6:00 PM. We also have Wednesday evening prayer at 7:00 PM.'
    } else if (lowerSpeech.includes('address') || lowerSpeech.includes('location')) {
      response = 'We are located at 123 Main Street in your city. Would you like me to text you the address?'
    } else if (lowerSpeech.includes('pastor') || lowerSpeech.includes('minister')) {
      response = 'Our pastor is Reverend Smith. Would you like to schedule a meeting with him?'
    } else if (lowerSpeech.includes('prayer') || lowerSpeech.includes('pray')) {
      response = 'I would be happy to add you to our prayer list. Can you tell me your name and prayer request?'
    } else if (lowerSpeech.includes('thank you') || lowerSpeech.includes('goodbye')) {
      response = 'Thank you for calling. Have a blessed day!'
      shouldContinue = false
    }

    // Log the interaction
    await supabase
      .from('activity_log')
      .insert({
        type: 'VOICE',
        title: 'Phone Call - Grace Response',
        description: `Caller: ${speechResult.substring(0, 100)}... | Grace: ${response.substring(0, 100)}...`,
        status: 'COMPLETED',
        church_id: churchId,
        grace_function: 'answer_faq',
        external_id: callSid,
        metadata: {
          callSid,
          from,
          to,
          caller,
          speechInput: speechResult,
          graceResponse: response,
        },
      })

    // Generate TwiML response
    const twiml = new VoiceResponse()
    twiml.say({ voice: 'alice' }, response)
    
    if (shouldContinue) {
      const gather = twiml.gather({
        input: 'speech',
        action: `/api/twilio/process-speech?churchId=${churchId}`,
        speechTimeout: 'auto',
        timeout: 10,
      })
      
      gather.say({ voice: 'alice' }, 'Is there anything else I can help you with?')
      
      // Fallback
      twiml.say({ voice: 'alice' }, 'Thank you for calling. Have a blessed day!')
    }
    
    twiml.hangup()

    return new NextResponse(twiml.toString(), {
      headers: { 'Content-Type': 'text/xml' },
    })

  } catch (error) {
    console.error('Speech processing error:', error)
    
    const twiml = new VoiceResponse()
    twiml.say({ voice: 'alice' }, 'I\'m sorry, there was an error processing your request. Please try again later.')
    twiml.hangup()
    
    return new NextResponse(twiml.toString(), {
      headers: { 'Content-Type': 'text/xml' },
    })
  }
}
