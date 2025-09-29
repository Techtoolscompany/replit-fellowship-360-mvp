import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertChurchSchema, 
  insertMemberSchema, 
  insertGraceInteractionSchema 
} from "@shared/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Extend Express Request type to include user
interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    role: string;
    churchId: string;
  };
}

const JWT_SECRET = process.env.SESSION_SECRET || "fallback-secret";

// Middleware for authentication
function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Middleware for admin-only routes
function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role, churchId: user.churchId },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({ 
        token, 
        user: { 
          id: user.id, 
          email: user.email, 
          role: user.role, 
          churchId: user.churchId,
          church: user.church 
        } 
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role, churchId: user.churchId },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({ 
        token, 
        user: { 
          id: user.id, 
          email: user.email, 
          role: user.role, 
          churchId: user.churchId 
        } 
      });
    } catch (error) {
      console.error('Registration error:', error);
      if (error instanceof Error && 'name' in error && error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid input data", errors: (error as any).errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Church routes
  app.get("/api/churches", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const churches = await storage.getAllChurches();
      res.json(churches);
    } catch (error) {
      console.error('Get churches error:', error);
      res.status(500).json({ message: "Failed to fetch churches" });
    }
  });

  app.get("/api/churches/:id", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      
      // Check access permissions
      if (req.user.role !== 'ADMIN' && req.user.churchId !== id) {
        return res.status(403).json({ message: "Access denied" });
      }

      const church = await storage.getChurch(id);
      if (!church) {
        return res.status(404).json({ message: "Church not found" });
      }

      res.json(church);
    } catch (error) {
      console.error('Get church error:', error);
      res.status(500).json({ message: "Failed to fetch church" });
    }
  });

  app.post("/api/churches", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const churchData = insertChurchSchema.parse(req.body);
      const church = await storage.createChurch(churchData);
      res.status(201).json(church);
    } catch (error) {
      console.error('Create church error:', error);
      if (error instanceof Error && 'name' in error && error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid input data", errors: (error as any).errors });
      }
      res.status(500).json({ message: "Failed to create church" });
    }
  });

  // Member routes
  app.get("/api/churches/:churchId/members", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { churchId } = req.params;
      
      // Check access permissions
      if (req.user.role !== 'ADMIN' && req.user.churchId !== churchId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const members = await storage.getMembersByChurch(churchId);
      res.json(members);
    } catch (error) {
      console.error('Get members error:', error);
      res.status(500).json({ message: "Failed to fetch members" });
    }
  });

  app.post("/api/churches/:churchId/members", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { churchId } = req.params;
      
      // Check access permissions
      if (req.user.role !== 'ADMIN' && req.user.churchId !== churchId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const memberData = insertMemberSchema.parse({ ...req.body, churchId });
      const member = await storage.createMember(memberData);
      res.status(201).json(member);
    } catch (error) {
      console.error('Create member error:', error);
      if (error instanceof Error && 'name' in error && error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid input data", errors: (error as any).errors });
      }
      res.status(500).json({ message: "Failed to create member" });
    }
  });

  app.put("/api/members/:id", authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Note: In a real app, you'd want to check if the user has permission to update this specific member
      const member = await storage.updateMember(id, updates);
      res.json(member);
    } catch (error) {
      console.error('Update member error:', error);
      res.status(500).json({ message: "Failed to update member" });
    }
  });

  app.delete("/api/members/:id", authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      
      // Note: In a real app, you'd want to check if the user has permission to delete this specific member
      await storage.deleteMember(id);
      res.status(204).send();
    } catch (error) {
      console.error('Delete member error:', error);
      res.status(500).json({ message: "Failed to delete member" });
    }
  });

  // Grace Interaction routes
  app.get("/api/churches/:churchId/grace-interactions", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { churchId } = req.params;
      
      // Check access permissions
      if (req.user.role !== 'ADMIN' && req.user.churchId !== churchId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const interactions = await storage.getGraceInteractionsByChurch(churchId);
      res.json(interactions);
    } catch (error) {
      console.error('Get grace interactions error:', error);
      res.status(500).json({ message: "Failed to fetch grace interactions" });
    }
  });

  app.get("/api/grace-interactions/recent", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const interactions = await storage.getRecentGraceInteractions(limit);
      res.json(interactions);
    } catch (error) {
      console.error('Get recent grace interactions error:', error);
      res.status(500).json({ message: "Failed to fetch recent grace interactions" });
    }
  });

  app.post("/api/grace-interactions", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      let churchId = req.body.churchId;
      
      // Enforce tenant isolation - non-admins can only create for their own church
      if (req.user.role !== 'ADMIN') {
        if (churchId && churchId !== req.user.churchId) {
          return res.status(403).json({ message: "Cannot create interactions for other churches" });
        }
        churchId = req.user.churchId;
      } else {
        // Admins must provide a valid churchId
        if (!churchId) {
          return res.status(400).json({ message: "churchId is required" });
        }
        // Validate churchId exists
        const church = await storage.getChurch(churchId);
        if (!church) {
          return res.status(400).json({ message: "Invalid churchId" });
        }
      }
      
      const interactionData = insertGraceInteractionSchema.parse({
        ...req.body,
        churchId,
        userId: req.user.id,
      });
      
      const interaction = await storage.createGraceInteraction(interactionData);
      res.status(201).json(interaction);
    } catch (error) {
      console.error('Create grace interaction error:', error);
      if (error instanceof Error && 'name' in error && error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid input data", errors: (error as any).errors });
      }
      res.status(500).json({ message: "Failed to create grace interaction" });
    }
  });

  // Analytics routes
  app.get("/api/analytics/agency", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const metrics = await storage.getAgencyMetrics();
      res.json(metrics);
    } catch (error) {
      console.error('Get agency metrics error:', error);
      res.status(500).json({ message: "Failed to fetch agency metrics" });
    }
  });

  app.get("/api/analytics/churches/:churchId", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { churchId } = req.params;
      
      // Check access permissions
      if (req.user.role !== 'ADMIN' && req.user.churchId !== churchId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const metrics = await storage.getChurchMetrics(churchId);
      res.json(metrics);
    } catch (error) {
      console.error('Get church metrics error:', error);
      res.status(500).json({ message: "Failed to fetch church metrics" });
    }
  });

  // Integration webhooks
  // Twilio TwiML Routes
  app.post("/api/twilio/voice-handler", async (req, res) => {
    try {
      const { churchId, greeting } = req.query;
      const twilioService = await import('./services/twilio').then(m => m.getTwilioService());
      
      if (!twilioService) {
        // Fallback TwiML if Twilio not configured
        const VoiceResponse = (await import('twilio')).twiml.VoiceResponse;
        const twiml = new VoiceResponse();
        twiml.say({ voice: 'alice' }, "Thank you for calling. Please try again later.");
        twiml.hangup();
        
        res.type('text/xml');
        return res.send(twiml.toString());
      }
      
      const twiml = twilioService.generateIncomingCallTwiML(churchId as string, greeting as string);
      
      res.type('text/xml');
      res.send(twiml);
    } catch (error) {
      console.error('Voice handler error:', error);
      res.status(500).send('Error processing voice call');
    }
  });

  app.post("/api/twilio/process-speech", async (req, res) => {
    try {
      const { SpeechResult, CallSid, From, To, Caller } = req.body;
      const { churchId } = req.query;
      
      const twilioService = await import('./services/twilio').then(m => m.getTwilioService());
      
      if (!twilioService || !SpeechResult || !churchId) {
        const VoiceResponse = (await import('twilio')).twiml.VoiceResponse;
        const twiml = new VoiceResponse();
        twiml.say({ voice: 'alice' }, "I'm sorry, I didn't understand. Please try again later.");
        twiml.hangup();
        
        res.type('text/xml');
        return res.send(twiml.toString());
      }
      
      // Validate churchId
      const church = await storage.getChurch(churchId as string);
      if (!church) {
        console.warn(`Invalid churchId in Twilio call: ${churchId}`);
        const VoiceResponse = (await import('twilio')).twiml.VoiceResponse;
        const twiml = new VoiceResponse();
        twiml.say({ voice: 'alice' }, "Thank you for calling. Please try again later.");
        twiml.hangup();
        
        res.type('text/xml');
        return res.send(twiml.toString());
      }
      
      // Process Grace's response
      const { response, shouldContinue } = await twilioService.processGraceResponse(SpeechResult, churchId as string);
      
      // Log the interaction
      await storage.createGraceInteraction({
        type: 'VOICE',
        function: 'Phone Call - Grace Response',
        description: `Caller: ${SpeechResult.substring(0, 100)}... | Grace: ${response.substring(0, 100)}...`,
        status: 'COMPLETED',
        churchId: churchId as string,
        metadata: {
          callSid: CallSid,
          from: From,
          to: To,
          caller: Caller,
          speechInput: SpeechResult,
          graceResponse: response,
          duration: 0, // Will be updated when call ends
        },
      });
      
      // Generate TwiML response
      const twiml = twilioService.generateSpeechResponseTwiML(response, shouldContinue);
      
      res.type('text/xml');
      res.send(twiml);
    } catch (error) {
      console.error('Speech processing error:', error);
      
      const VoiceResponse = (await import('twilio')).twiml.VoiceResponse;
      const twiml = new VoiceResponse();
      twiml.say({ voice: 'alice' }, "I'm sorry, there was an error processing your request. Please try again later.");
      twiml.hangup();
      
      res.type('text/xml');
      res.send(twiml.toString());
    }
  });

  app.post("/api/twilio/call-status", async (req, res) => {
    try {
      const { CallSid, CallStatus, CallDuration, From, To } = req.body;
      const { churchId } = req.query;
      
      // Log call completion
      if (CallStatus === 'completed' && churchId) {
        const church = await storage.getChurch(churchId as string);
        if (church) {
          await storage.createGraceInteraction({
            type: 'VOICE',
            function: 'Phone Call - Completed',
            description: `Call completed: ${From} to ${To} (${CallDuration}s)`,
            status: 'COMPLETED',
            responseTime: parseInt(CallDuration) * 1000, // Convert to milliseconds
            churchId: churchId as string,
            metadata: {
              callSid: CallSid,
              callStatus: CallStatus,
              callDuration: CallDuration,
              from: From,
              to: To,
            },
          });
        }
      }
      
      res.status(200).json({ received: true });
    } catch (error) {
      console.error('Call status webhook error:', error);
      res.status(500).json({ message: "Webhook processing failed" });
    }
  });

  // Twilio API Routes for frontend
  app.post("/api/twilio/make-call", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { to, greeting } = req.body;
      const twilioService = await import('./services/twilio').then(m => m.getTwilioService());
      
      if (!twilioService) {
        return res.status(503).json({ message: "Twilio service not available" });
      }
      
      if (!to) {
        return res.status(400).json({ message: "Phone number is required" });
      }
      
      // Use user's church ID for the call
      const churchId = req.user.churchId;
      if (!churchId) {
        return res.status(400).json({ message: "User not associated with a church" });
      }
      
      const callSid = await twilioService.makeCall(to, churchId, greeting);
      
      // Log the outbound call initiation
      await storage.createGraceInteraction({
        type: 'VOICE',
        function: 'Outbound Call - Initiated',
        description: `Outbound call to ${to} initiated by user`,
        status: 'PENDING',
        churchId,
        userId: req.user.id,
        metadata: {
          callSid,
          to,
          greeting: greeting || 'Default greeting',
          initiatedBy: req.user.email,
        },
      });
      
      res.json({ callSid, message: "Call initiated successfully" });
    } catch (error) {
      console.error('Make call error:', error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to make call" });
    }
  });

  app.post("/api/twilio/send-sms", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { to, message } = req.body;
      const twilioService = await import('./services/twilio').then(m => m.getTwilioService());
      
      if (!twilioService) {
        return res.status(503).json({ message: "Twilio service not available" });
      }
      
      if (!to || !message) {
        return res.status(400).json({ message: "Phone number and message are required" });
      }
      
      // Use user's church ID for the SMS
      const churchId = req.user.churchId;
      if (!churchId) {
        return res.status(400).json({ message: "User not associated with a church" });
      }
      
      const messageSid = await twilioService.sendSMS(to, message);
      
      // Log the SMS
      await storage.createGraceInteraction({
        type: 'SMS',
        function: 'SMS - Sent',
        description: `SMS sent to ${to}: ${message.substring(0, 100)}...`,
        status: 'COMPLETED',
        churchId,
        userId: req.user.id,
        metadata: {
          messageSid,
          to,
          message,
          sentBy: req.user.email,
        },
      });
      
      res.json({ messageSid, message: "SMS sent successfully" });
    } catch (error) {
      console.error('Send SMS error:', error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to send SMS" });
    }
  });

  app.post("/api/webhooks/livekit", async (req, res) => {
    try {
      // TODO: Add HMAC signature verification for production
      // const signature = req.headers['x-livekit-signature'];
      // if (!verifyLiveKitSignature(req.body, signature)) {
      //   return res.status(401).json({ message: "Invalid signature" });
      // }
      
      // Handle LiveKit webhooks for voice/video sessions
      const { event, room, participant } = req.body;
      
      // Log the voice interaction
      if (event === 'room_finished' || event === 'participant_left') {
        // Extract churchId from room metadata or participant info
        const churchId = room?.metadata?.churchId;
        if (churchId) {
          // Validate churchId exists to prevent injection
          const church = await storage.getChurch(churchId);
          if (church) {
            await storage.createGraceInteraction({
              type: 'VOICE',
              function: 'Voice Session',
              description: `LiveKit voice session in room ${room.name}`,
              status: 'COMPLETED',
              churchId,
              metadata: { room, participant, event },
            });
          } else {
            console.warn(`Invalid churchId in LiveKit webhook: ${churchId}`);
          }
        }
      }
      
      res.status(200).json({ received: true });
    } catch (error) {
      console.error('LiveKit webhook error:', error);
      res.status(500).json({ message: "Webhook processing failed" });
    }
  });

  app.post("/api/webhooks/calendar", async (req, res) => {
    try {
      // TODO: Add signature verification for production (Cal.com, Google Calendar)
      // const signature = req.headers['x-calendar-signature'];
      // if (!verifyCalendarSignature(req.body, signature)) {
      //   return res.status(401).json({ message: "Invalid signature" });
      // }
      
      // Handle calendar booking webhooks (Cal.com, Google Calendar)
      const { event, booking, churchId } = req.body;
      
      if (churchId) {
        // Validate churchId exists to prevent injection
        const church = await storage.getChurch(churchId);
        if (church) {
          await storage.createGraceInteraction({
            type: 'CALENDAR',
            function: 'Calendar Booking',
            description: `Calendar event: ${event} - ${booking?.title || 'New booking'}`,
            status: 'COMPLETED',
            churchId,
            metadata: { event, booking },
          });
        } else {
          console.warn(`Invalid churchId in calendar webhook: ${churchId}`);
        }
      }
      
      res.status(200).json({ received: true });
    } catch (error) {
      console.error('Calendar webhook error:', error);
      res.status(500).json({ message: "Webhook processing failed" });
    }
  });

  app.post("/api/webhooks/textbee", async (req, res) => {
    try {
      // TODO: Add signature verification for production
      // const signature = req.headers['x-textbee-signature'];
      // if (!verifyTextBeeSignature(req.body, signature)) {
      //   return res.status(401).json({ message: "Invalid signature" });
      // }
      
      // Handle TextBee SMS webhooks
      const { message, status, churchId } = req.body;
      
      if (churchId) {
        // Validate churchId exists to prevent injection
        const church = await storage.getChurch(churchId);
        if (church) {
          await storage.createGraceInteraction({
            type: 'SMS',
            function: 'SMS Message',
            description: `TextBee SMS: ${message?.body || 'Message sent'}`,
            status: status === 'delivered' ? 'COMPLETED' : 'FAILED',
            churchId,
            metadata: { message, status },
          });
        } else {
          console.warn(`Invalid churchId in TextBee webhook: ${churchId}`);
        }
      }
      
      res.status(200).json({ received: true });
    } catch (error) {
      console.error('TextBee webhook error:', error);
      res.status(500).json({ message: "Webhook processing failed" });
    }
  });

  app.post("/api/webhooks/n8n", async (req, res) => {
    try {
      // TODO: Add signature verification for production
      // const signature = req.headers['x-n8n-signature'];
      // if (!verifyN8nSignature(req.body, signature)) {
      //   return res.status(401).json({ message: "Invalid signature" });
      // }
      
      // Handle n8n workflow webhooks
      const { workflowId, status, execution, churchId } = req.body;
      
      if (churchId) {
        // Validate churchId exists to prevent injection
        const church = await storage.getChurch(churchId);
        if (church) {
          await storage.createGraceInteraction({
            type: 'WORKFLOW',
            function: 'n8n Workflow',
            description: `Workflow ${workflowId} ${status}`,
            status: status === 'success' ? 'COMPLETED' : 'FAILED',
            churchId,
            metadata: { workflowId, status, execution },
          });
        } else {
          console.warn(`Invalid churchId in n8n webhook: ${churchId}`);
        }
      }
      
      res.status(200).json({ received: true });
    } catch (error) {
      console.error('n8n webhook error:', error);
      res.status(500).json({ message: "Webhook processing failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
