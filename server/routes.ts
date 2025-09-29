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
      const interactionData = insertGraceInteractionSchema.parse({
        ...req.body,
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
  app.post("/api/webhooks/livekit", async (req, res) => {
    try {
      // Handle LiveKit webhooks for voice/video sessions
      const { event, room, participant } = req.body;
      
      // Log the voice interaction
      if (event === 'room_finished' || event === 'participant_left') {
        // Extract churchId from room metadata or participant info
        const churchId = room?.metadata?.churchId;
        if (churchId) {
          await storage.createGraceInteraction({
            type: 'VOICE',
            function: 'Voice Session',
            description: `LiveKit voice session in room ${room.name}`,
            status: 'COMPLETED',
            churchId,
            metadata: { room, participant, event },
          });
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
      // Handle calendar booking webhooks (Cal.com, Google Calendar)
      const { event, booking, churchId } = req.body;
      
      if (churchId) {
        await storage.createGraceInteraction({
          type: 'CALENDAR',
          function: 'Calendar Booking',
          description: `Calendar event: ${event} - ${booking?.title || 'New booking'}`,
          status: 'COMPLETED',
          churchId,
          metadata: { event, booking },
        });
      }
      
      res.status(200).json({ received: true });
    } catch (error) {
      console.error('Calendar webhook error:', error);
      res.status(500).json({ message: "Webhook processing failed" });
    }
  });

  app.post("/api/webhooks/textbee", async (req, res) => {
    try {
      // Handle TextBee SMS webhooks
      const { message, status, churchId } = req.body;
      
      if (churchId) {
        await storage.createGraceInteraction({
          type: 'SMS',
          function: 'SMS Message',
          description: `TextBee SMS: ${message?.body || 'Message sent'}`,
          status: status === 'delivered' ? 'COMPLETED' : 'FAILED',
          churchId,
          metadata: { message, status },
        });
      }
      
      res.status(200).json({ received: true });
    } catch (error) {
      console.error('TextBee webhook error:', error);
      res.status(500).json({ message: "Webhook processing failed" });
    }
  });

  app.post("/api/webhooks/n8n", async (req, res) => {
    try {
      // Handle n8n workflow webhooks
      const { workflowId, status, execution, churchId } = req.body;
      
      if (churchId) {
        await storage.createGraceInteraction({
          type: 'WORKFLOW',
          function: 'n8n Workflow',
          description: `Workflow ${workflowId} ${status}`,
          status: status === 'success' ? 'COMPLETED' : 'FAILED',
          churchId,
          metadata: { workflowId, status, execution },
        });
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
