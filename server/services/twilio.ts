import twilio from 'twilio';

const VoiceResponse = twilio.twiml.VoiceResponse;

interface TwilioConfig {
  accountSid: string;
  authToken: string;
  phoneNumber: string;
}

export class TwilioService {
  private client: twilio.Twilio;
  private config: TwilioConfig;

  constructor(config: TwilioConfig) {
    this.config = config;
    this.client = twilio(config.accountSid, config.authToken);
  }

  /**
   * Make outbound call with Grace voice capabilities
   */
  async makeCall(to: string, churchId: string, greeting?: string): Promise<string> {
    try {
      const call = await this.client.calls.create({
        url: `${process.env.REPLIT_DOMAINS?.split(',')[0] || 'http://localhost:5000'}/api/twilio/voice-handler?churchId=${churchId}&greeting=${encodeURIComponent(greeting || '')}`,
        to: to,
        from: this.config.phoneNumber,
        timeout: 60,
        record: true, // Record for transcription
      });
      
      return call.sid;
    } catch (error) {
      console.error('Twilio call error:', error);
      throw new Error(`Failed to make call: ${error}`);
    }
  }

  /**
   * Generate TwiML for incoming calls - Grace conversation handler
   */
  generateIncomingCallTwiML(churchId: string, greeting?: string): string {
    const twiml = new VoiceResponse();
    
    // Welcome message
    const welcomeMessage = greeting || "Hello! You've reached Grace, your church's AI assistant. How can I help you today?";
    twiml.say({ voice: 'alice', language: 'en-US' }, welcomeMessage);
    
    // Gather speech input with timeout
    const gather = twiml.gather({
      input: ['speech'],
      timeout: 10,
      action: `/api/twilio/process-speech?churchId=${churchId}`,
      method: 'POST',
      speechTimeout: 'auto',
      enhanced: true,
    });
    
    gather.say({ voice: 'alice' }, "Please speak your question or request.");
    
    // Fallback if no input
    twiml.say({ voice: 'alice' }, "I didn't hear anything. Please call back if you need assistance. Have a blessed day!");
    twiml.hangup();
    
    return twiml.toString();
  }

  /**
   * Generate TwiML response for speech processing
   */
  generateSpeechResponseTwiML(responseText: string, shouldContinue: boolean = false): string {
    const twiml = new VoiceResponse();
    
    // Speak Grace's response
    twiml.say({ voice: 'alice', language: 'en-US' }, responseText);
    
    if (shouldContinue) {
      // Continue conversation
      const gather = twiml.gather({
        input: ['speech'],
        timeout: 10,
        action: '/api/twilio/process-speech',
        method: 'POST',
        speechTimeout: 'auto',
        enhanced: true,
      });
      
      gather.say({ voice: 'alice' }, "Is there anything else I can help you with?");
      
      // Fallback
      twiml.say({ voice: 'alice' }, "Thank you for calling. Have a wonderful day!");
    } else {
      // End conversation
      twiml.say({ voice: 'alice' }, "Thank you for calling. Have a blessed day!");
    }
    
    twiml.hangup();
    return twiml.toString();
  }

  /**
   * Process Grace's AI response for phone conversations
   */
  async processGraceResponse(speechText: string, churchId: string): Promise<{ response: string; shouldContinue: boolean }> {
    // This would integrate with your AI service (OpenAI, etc.)
    // For now, implementing basic responses based on common church inquiries
    
    const lowerText = speechText.toLowerCase();
    
    // Service times inquiry
    if (lowerText.includes('service') || lowerText.includes('worship') || lowerText.includes('time')) {
      return {
        response: "Our worship services are on Sundays at 9 AM and 11 AM, with Wednesday evening services at 7 PM. We'd love to see you there!",
        shouldContinue: true
      };
    }
    
    // Prayer request
    if (lowerText.includes('prayer') || lowerText.includes('pray')) {
      return {
        response: "I'd be happy to help with prayer requests. Please know that our pastoral team will be notified, and we'll keep you in our prayers. You can also speak with someone from our prayer ministry by calling during office hours.",
        shouldContinue: true
      };
    }
    
    // Address/directions
    if (lowerText.includes('address') || lowerText.includes('location') || lowerText.includes('directions')) {
      return {
        response: "You can find our church address and directions on our website, or I can have someone from our staff contact you with detailed directions. Would you like me to arrange that?",
        shouldContinue: true
      };
    }
    
    // Pastor or staff contact
    if (lowerText.includes('pastor') || lowerText.includes('minister') || lowerText.includes('staff')) {
      return {
        response: "I can connect you with our pastoral team. Our office hours are Monday through Friday, 9 AM to 4 PM. Would you like me to have someone call you back, or would you prefer to call during office hours?",
        shouldContinue: true
      };
    }
    
    // Emergency or urgent
    if (lowerText.includes('emergency') || lowerText.includes('urgent') || lowerText.includes('help')) {
      return {
        response: "For pastoral emergencies, please call our emergency line or contact Pastor directly. I'll make sure someone from our team reaches out to you right away. This call will be flagged as urgent for our staff.",
        shouldContinue: false
      };
    }
    
    // General/fallback response
    return {
      response: "Thank you for your question. I'll make sure someone from our team follows up with you. In the meantime, you can find more information on our website or call during office hours for immediate assistance.",
      shouldContinue: true
    };
  }

  /**
   * Send SMS message (for follow-up)
   */
  async sendSMS(to: string, message: string): Promise<string> {
    try {
      const sms = await this.client.messages.create({
        body: message,
        from: this.config.phoneNumber,
        to: to,
      });
      
      return sms.sid;
    } catch (error) {
      console.error('Twilio SMS error:', error);
      throw new Error(`Failed to send SMS: ${error}`);
    }
  }

  /**
   * Get call details and recordings
   */
  async getCallDetails(callSid: string): Promise<any> {
    try {
      const call = await this.client.calls(callSid).fetch();
      
      // Get recordings if available
      const recordings = await this.client.recordings.list({ callSid: callSid });
      
      return {
        call,
        recordings: recordings.map(r => ({
          sid: r.sid,
          duration: r.duration,
          uri: r.uri,
        }))
      };
    } catch (error) {
      console.error('Error fetching call details:', error);
      throw error;
    }
  }
}

// Export singleton instance (will be initialized when secrets are available)
let twilioService: TwilioService | null = null;

export function initializeTwilioService(config: TwilioConfig): TwilioService {
  twilioService = new TwilioService(config);
  return twilioService;
}

export function getTwilioService(): TwilioService | null {
  return twilioService;
}