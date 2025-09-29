// Fellowship 360 Multi-tenant Database Schema
// All primary records are associated with a Church organization for multi-tenancy

import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, jsonb, pgEnum, boolean, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const userRoleEnum = pgEnum("user_role", ["STAFF", "ADMIN", "AGENCY"]);
export const contactStatusEnum = pgEnum("contact_status", ["LEAD", "ACTIVE", "INACTIVE"]);
export const activityTypeEnum = pgEnum("activity_type", ["VOICE", "SMS", "EMAIL", "VISIT", "CALENDAR", "WORKFLOW", "MANUAL"]);
export const activityStatusEnum = pgEnum("activity_status", ["PENDING", "COMPLETED", "FAILED"]);
export const eventTypeEnum = pgEnum("event_type", ["SERVICE", "MEETING", "OUTREACH", "SOCIAL", "CHILDREN", "OTHER"]);

// Churches - Multi-tenant root organization
export const churches = pgTable("churches", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  address: jsonb("address"), // { street, city, state, zip }
  website: text("website"),
  timezone: text("timezone").default("America/New_York"),
  settings: jsonb("settings").default({}), // Grace preferences, workflows, etc.
  gracePhone: text("grace_phone"), // Dedicated Grace phone number
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Users - Staff members with role-based access
export const users = pgTable("users", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: userRoleEnum("role").notNull().default("STAFF"),
  churchId: uuid("church_id"), // null for AGENCY users
  phone: text("phone"),
  isActive: boolean("is_active").default(true),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Contacts - Church members and visitors
export const contacts = pgTable("contacts", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email"),
  phone: text("phone"),
  address: jsonb("address"), // { street, city, state, zip }
  status: contactStatusEnum("status").notNull().default("LEAD"),
  tags: jsonb("tags").default([]), // ["new_visitor", "prayer_request", etc.]
  notes: text("notes"),
  churchId: uuid("church_id").notNull(),
  assignedToUserId: uuid("assigned_to_user_id"), // Staff member responsible
  lastContactedAt: timestamp("last_contacted_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Ministries - Groups within the church
export const ministries = pgTable("ministries", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  leaderContactId: uuid("leader_contact_id"), // Reference to contact who leads
  churchId: uuid("church_id").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Ministry Members - Many-to-many relationship between contacts and ministries
export const ministryMembers = pgTable("ministry_members", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  contactId: uuid("contact_id").notNull(),
  ministryId: uuid("ministry_id").notNull(),
  joinedAt: timestamp("joined_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Events - Church events and activities
export const events = pgTable("events", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  type: eventTypeEnum("type").notNull().default("OTHER"),
  startDateTime: timestamp("start_date_time").notNull(),
  endDateTime: timestamp("end_date_time"),
  location: text("location"),
  maxAttendees: integer("max_attendees"),
  rsvpRequired: boolean("rsvp_required").default(false),
  rsvpDeadline: timestamp("rsvp_deadline"),
  churchId: uuid("church_id").notNull(),
  ministryId: uuid("ministry_id"), // Optional ministry association
  createdByUserId: uuid("created_by_user_id").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Event RSVPs - Track event attendance
export const eventRsvps = pgTable("event_rsvps", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  eventId: uuid("event_id").notNull(),
  contactId: uuid("contact_id").notNull(),
  status: text("status").notNull(), // "yes", "no", "maybe"
  attendeeCount: integer("attendee_count").default(1), // For families
  notes: text("notes"),
  rsvpAt: timestamp("rsvp_at").defaultNow(),
  attendedAt: timestamp("attended_at"), // Actual attendance
  createdAt: timestamp("created_at").defaultNow(),
});

// Activity Log - All Grace interactions and communications
export const activityLog = pgTable("activity_log", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  type: activityTypeEnum("type").notNull(),
  title: text("title").notNull(), // "Phone Call", "SMS Sent", "Grace Response"
  description: text("description"),
  status: activityStatusEnum("status").notNull().default("PENDING"),
  
  // Relations
  churchId: uuid("church_id").notNull(),
  contactId: uuid("contact_id"), // Optional - may be system-wide activities
  userId: uuid("user_id"), // Staff member who initiated (optional for automated)
  eventId: uuid("event_id"), // Optional event association
  
  // Grace/AI specific data
  graceFunction: text("grace_function"), // "answer_faq", "schedule_appointment", etc.
  responseTimeMs: integer("response_time_ms"), // Performance tracking
  
  // External service references
  externalId: text("external_id"), // Twilio SID, ElevenLabs ID, etc.
  metadata: jsonb("metadata").default({}), // Service-specific data
  
  occurredAt: timestamp("occurred_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Follow-up Tasks - Manual and automated tasks
export const followUpTasks = pgTable("follow_up_tasks", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: timestamp("due_date"),
  priority: text("priority").default("medium"), // "low", "medium", "high", "urgent"
  status: text("status").default("pending"), // "pending", "in_progress", "completed", "cancelled"
  
  // Relations
  churchId: uuid("church_id").notNull(),
  contactId: uuid("contact_id").notNull(),
  assignedToUserId: uuid("assigned_to_user_id"),
  createdByUserId: uuid("created_by_user_id"),
  
  // Follow-up workflow
  isAutomated: boolean("is_automated").default(false), // Created by Grace/workflows
  workflowId: text("workflow_id"), // n8n workflow reference
  
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const churchesRelations = relations(churches, ({ many }) => ({
  users: many(users),
  contacts: many(contacts),
  ministries: many(ministries),
  events: many(events),
  activityLog: many(activityLog),
  followUpTasks: many(followUpTasks),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  church: one(churches, {
    fields: [users.churchId],
    references: [churches.id],
  }),
  assignedContacts: many(contacts, { relationName: "assignedToUser" }),
  createdEvents: many(events, { relationName: "createdByUser" }),
  activityLog: many(activityLog),
  assignedTasks: many(followUpTasks, { relationName: "assignedToUser" }),
  createdTasks: many(followUpTasks, { relationName: "createdByUser" }),
}));

export const contactsRelations = relations(contacts, ({ one, many }) => ({
  church: one(churches, {
    fields: [contacts.churchId],
    references: [churches.id],
  }),
  assignedToUser: one(users, {
    fields: [contacts.assignedToUserId],
    references: [users.id],
    relationName: "assignedToUser",
  }),
  ministryMembers: many(ministryMembers),
  eventRsvps: many(eventRsvps),
  activityLog: many(activityLog),
  followUpTasks: many(followUpTasks),
  ledMinistries: many(ministries, { relationName: "ministryLeader" }),
}));

export const ministriesRelations = relations(ministries, ({ one, many }) => ({
  church: one(churches, {
    fields: [ministries.churchId],
    references: [churches.id],
  }),
  leader: one(contacts, {
    fields: [ministries.leaderContactId],
    references: [contacts.id],
    relationName: "ministryLeader",
  }),
  members: many(ministryMembers),
  events: many(events),
}));

export const ministryMembersRelations = relations(ministryMembers, ({ one }) => ({
  contact: one(contacts, {
    fields: [ministryMembers.contactId],
    references: [contacts.id],
  }),
  ministry: one(ministries, {
    fields: [ministryMembers.ministryId],
    references: [ministries.id],
  }),
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
  church: one(churches, {
    fields: [events.churchId],
    references: [churches.id],
  }),
  ministry: one(ministries, {
    fields: [events.ministryId],
    references: [ministries.id],
  }),
  createdByUser: one(users, {
    fields: [events.createdByUserId],
    references: [users.id],
    relationName: "createdByUser",
  }),
  rsvps: many(eventRsvps),
  activityLog: many(activityLog),
}));

export const eventRsvpsRelations = relations(eventRsvps, ({ one }) => ({
  event: one(events, {
    fields: [eventRsvps.eventId],
    references: [events.id],
  }),
  contact: one(contacts, {
    fields: [eventRsvps.contactId],
    references: [contacts.id],
  }),
}));

export const activityLogRelations = relations(activityLog, ({ one }) => ({
  church: one(churches, {
    fields: [activityLog.churchId],
    references: [churches.id],
  }),
  contact: one(contacts, {
    fields: [activityLog.contactId],
    references: [contacts.id],
  }),
  user: one(users, {
    fields: [activityLog.userId],
    references: [users.id],
  }),
  event: one(events, {
    fields: [activityLog.eventId],
    references: [events.id],
  }),
}));

export const followUpTasksRelations = relations(followUpTasks, ({ one }) => ({
  church: one(churches, {
    fields: [followUpTasks.churchId],
    references: [churches.id],
  }),
  contact: one(contacts, {
    fields: [followUpTasks.contactId],
    references: [contacts.id],
  }),
  assignedToUser: one(users, {
    fields: [followUpTasks.assignedToUserId],
    references: [users.id],
    relationName: "assignedToUser",
  }),
  createdByUser: one(users, {
    fields: [followUpTasks.createdByUserId],
    references: [users.id],
    relationName: "createdByUser",
  }),
}));

// Types for TypeScript
export type Church = typeof churches.$inferSelect;
export type NewChurch = typeof churches.$inferInsert;

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Contact = typeof contacts.$inferSelect;
export type NewContact = typeof contacts.$inferInsert;

export type Ministry = typeof ministries.$inferSelect;
export type NewMinistry = typeof ministries.$inferInsert;

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;

export type ActivityLog = typeof activityLog.$inferSelect;
export type NewActivityLog = typeof activityLog.$inferInsert;

export type FollowUpTask = typeof followUpTasks.$inferSelect;
export type NewFollowUpTask = typeof followUpTasks.$inferInsert;

// Extended types with relations for UI
export type ContactWithRelations = Contact & {
  church: Church;
  assignedToUser?: User;
  ministryMembers: Array<{
    ministry: Ministry;
    joinedAt: Date;
  }>;
  activityLog: ActivityLog[];
  followUpTasks: FollowUpTask[];
};

export type ChurchWithCounts = Church & {
  memberCount: number;
  activeEvents: number;
  graceInteractions: number;
  lastActivity?: Date;
};