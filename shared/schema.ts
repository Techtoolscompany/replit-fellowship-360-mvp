import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const userRoleEnum = pgEnum("user_role", ["ADMIN", "MEMBER"]);
export const planEnum = pgEnum("plan", ["TRIAL", "STARTER", "PROFESSIONAL", "ENTERPRISE"]);
export const contactStatusEnum = pgEnum("contact_status", ["LEAD", "ACTIVE", "INACTIVE"]);
export const interactionTypeEnum = pgEnum("interaction_type", ["VOICE", "CHAT", "CALENDAR", "SMS", "WORKFLOW"]);
export const interactionStatusEnum = pgEnum("interaction_status", ["PENDING", "COMPLETED", "FAILED"]);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: userRoleEnum("role").notNull().default("MEMBER"),
  churchId: varchar("church_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const churches = pgTable("churches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  plan: planEnum("plan").notNull().default("TRIAL"),
  settings: jsonb("settings").default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

export const members = pgTable("members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  status: contactStatusEnum("status").notNull().default("LEAD"),
  notes: text("notes"),
  churchId: varchar("church_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const graceInteractions = pgTable("grace_interactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: interactionTypeEnum("type").notNull(),
  function: text("function").notNull(),
  description: text("description"),
  status: interactionStatusEnum("status").notNull().default("PENDING"),
  responseTime: integer("response_time"), // in milliseconds
  metadata: jsonb("metadata").default({}),
  churchId: varchar("church_id").notNull(),
  userId: varchar("user_id"),
  executedAt: timestamp("executed_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one }) => ({
  church: one(churches, {
    fields: [users.churchId],
    references: [churches.id],
  }),
}));

export const churchesRelations = relations(churches, ({ many }) => ({
  users: many(users),
  members: many(members),
  graceInteractions: many(graceInteractions),
}));

export const membersRelations = relations(members, ({ one }) => ({
  church: one(churches, {
    fields: [members.churchId],
    references: [churches.id],
  }),
}));

export const graceInteractionsRelations = relations(graceInteractions, ({ one }) => ({
  church: one(churches, {
    fields: [graceInteractions.churchId],
    references: [churches.id],
  }),
  user: one(users, {
    fields: [graceInteractions.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertChurchSchema = createInsertSchema(churches).omit({
  id: true,
  createdAt: true,
});

export const insertMemberSchema = createInsertSchema(members).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGraceInteractionSchema = createInsertSchema(graceInteractions).omit({
  id: true,
  executedAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertChurch = z.infer<typeof insertChurchSchema>;
export type Church = typeof churches.$inferSelect;
export type InsertMember = z.infer<typeof insertMemberSchema>;
export type Member = typeof members.$inferSelect;
export type InsertGraceInteraction = z.infer<typeof insertGraceInteractionSchema>;
export type GraceInteraction = typeof graceInteractions.$inferSelect;

// Extended types with relations
export type ChurchWithCounts = Church & {
  memberCount: number;
  graceInteractionCount: number;
  lastActivity?: string;
};

export type UserWithChurch = User & {
  church?: Church;
};

export type MemberWithChurch = Member & {
  church: Church;
};

export type GraceInteractionWithChurch = GraceInteraction & {
  church: Church;
  user?: User;
};
