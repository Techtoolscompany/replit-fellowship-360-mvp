import { 
  users, 
  churches, 
  members, 
  graceInteractions,
  type User, 
  type InsertUser,
  type Church,
  type InsertChurch,
  type Member,
  type InsertMember,
  type GraceInteraction,
  type InsertGraceInteraction,
  type ChurchWithCounts,
  type UserWithChurch
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, count, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<UserWithChurch | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Church operations
  getChurch(id: string): Promise<Church | undefined>;
  getAllChurches(): Promise<ChurchWithCounts[]>;
  createChurch(church: InsertChurch): Promise<Church>;
  updateChurch(id: string, updates: Partial<Church>): Promise<Church>;
  
  // Member operations
  getMembersByChurch(churchId: string): Promise<Member[]>;
  createMember(member: InsertMember): Promise<Member>;
  updateMember(id: string, updates: Partial<Member>): Promise<Member>;
  deleteMember(id: string): Promise<void>;
  
  // Grace Interaction operations
  getGraceInteractionsByChurch(churchId: string): Promise<GraceInteraction[]>;
  getRecentGraceInteractions(limit?: number): Promise<GraceInteraction[]>;
  createGraceInteraction(interaction: InsertGraceInteraction): Promise<GraceInteraction>;
  
  // Analytics
  getChurchMetrics(churchId: string): Promise<{
    memberCount: number;
    graceInteractionCount: number;
    leadCount: number;
    activeCount: number;
    inactiveCount: number;
  }>;
  
  getAgencyMetrics(): Promise<{
    totalChurches: number;
    totalMembers: number;
    totalGraceInteractions: number;
    avgResponseTime: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<UserWithChurch | undefined> {
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        password: users.password,
        role: users.role,
        churchId: users.churchId,
        createdAt: users.createdAt,
        church: churches,
      })
      .from(users)
      .leftJoin(churches, eq(users.churchId, churches.id))
      .where(eq(users.email, email));
    
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getChurch(id: string): Promise<Church | undefined> {
    const [church] = await db.select().from(churches).where(eq(churches.id, id));
    return church || undefined;
  }

  async getAllChurches(): Promise<ChurchWithCounts[]> {
    const result = await db
      .select({
        id: churches.id,
        name: churches.name,
        email: churches.email,
        phone: churches.phone,
        plan: churches.plan,
        settings: churches.settings,
        createdAt: churches.createdAt,
        memberCount: count(members.id),
        graceInteractionCount: count(graceInteractions.id),
      })
      .from(churches)
      .leftJoin(members, eq(churches.id, members.churchId))
      .leftJoin(graceInteractions, eq(churches.id, graceInteractions.churchId))
      .groupBy(churches.id);

    // Get last activity for each church
    const churchesWithActivity = await Promise.all(
      result.map(async (church) => {
        const [lastInteraction] = await db
          .select({ executedAt: graceInteractions.executedAt })
          .from(graceInteractions)
          .where(eq(graceInteractions.churchId, church.id))
          .orderBy(desc(graceInteractions.executedAt))
          .limit(1);

        return {
          ...church,
          lastActivity: lastInteraction?.executedAt?.toISOString(),
        };
      })
    );

    return churchesWithActivity;
  }

  async createChurch(insertChurch: InsertChurch): Promise<Church> {
    const [church] = await db
      .insert(churches)
      .values(insertChurch)
      .returning();
    return church;
  }

  async updateChurch(id: string, updates: Partial<Church>): Promise<Church> {
    const [church] = await db
      .update(churches)
      .set(updates)
      .where(eq(churches.id, id))
      .returning();
    return church;
  }

  async getMembersByChurch(churchId: string): Promise<Member[]> {
    return await db
      .select()
      .from(members)
      .where(eq(members.churchId, churchId))
      .orderBy(desc(members.createdAt));
  }

  async createMember(insertMember: InsertMember): Promise<Member> {
    const [member] = await db
      .insert(members)
      .values(insertMember)
      .returning();
    return member;
  }

  async updateMember(id: string, updates: Partial<Member>): Promise<Member> {
    const [member] = await db
      .update(members)
      .set({ ...updates, updatedAt: sql`now()` })
      .where(eq(members.id, id))
      .returning();
    return member;
  }

  async deleteMember(id: string): Promise<void> {
    await db.delete(members).where(eq(members.id, id));
  }

  async getGraceInteractionsByChurch(churchId: string): Promise<GraceInteraction[]> {
    return await db
      .select()
      .from(graceInteractions)
      .where(eq(graceInteractions.churchId, churchId))
      .orderBy(desc(graceInteractions.executedAt));
  }

  async getRecentGraceInteractions(limit = 10): Promise<GraceInteraction[]> {
    return await db
      .select()
      .from(graceInteractions)
      .orderBy(desc(graceInteractions.executedAt))
      .limit(limit);
  }

  async createGraceInteraction(insertInteraction: InsertGraceInteraction): Promise<GraceInteraction> {
    const [interaction] = await db
      .insert(graceInteractions)
      .values(insertInteraction)
      .returning();
    return interaction;
  }

  async getChurchMetrics(churchId: string): Promise<{
    memberCount: number;
    graceInteractionCount: number;
    leadCount: number;
    activeCount: number;
    inactiveCount: number;
  }> {
    const [metrics] = await db
      .select({
        memberCount: count(members.id),
        graceInteractionCount: count(graceInteractions.id),
        leadCount: sql<number>`count(case when ${members.status} = 'LEAD' then 1 end)`,
        activeCount: sql<number>`count(case when ${members.status} = 'ACTIVE' then 1 end)`,
        inactiveCount: sql<number>`count(case when ${members.status} = 'INACTIVE' then 1 end)`,
      })
      .from(churches)
      .leftJoin(members, eq(churches.id, members.churchId))
      .leftJoin(graceInteractions, eq(churches.id, graceInteractions.churchId))
      .where(eq(churches.id, churchId))
      .groupBy(churches.id);

    return metrics || {
      memberCount: 0,
      graceInteractionCount: 0,
      leadCount: 0,
      activeCount: 0,
      inactiveCount: 0,
    };
  }

  async getAgencyMetrics(): Promise<{
    totalChurches: number;
    totalMembers: number;
    totalGraceInteractions: number;
    avgResponseTime: number;
  }> {
    const [metrics] = await db
      .select({
        totalChurches: count(churches.id),
        totalMembers: count(members.id),
        totalGraceInteractions: count(graceInteractions.id),
        avgResponseTime: sql<number>`avg(${graceInteractions.responseTime})`,
      })
      .from(churches)
      .leftJoin(members, eq(churches.id, members.churchId))
      .leftJoin(graceInteractions, eq(churches.id, graceInteractions.churchId));

    return {
      totalChurches: metrics?.totalChurches || 0,
      totalMembers: metrics?.totalMembers || 0,
      totalGraceInteractions: metrics?.totalGraceInteractions || 0,
      avgResponseTime: metrics?.avgResponseTime || 0,
    };
  }
}

export const storage = new DatabaseStorage();
