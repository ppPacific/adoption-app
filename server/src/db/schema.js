import {
    pgTable,
    serial,
    uuid,
    text,
    timestamp,
    boolean,
    integer,
    pgEnum,
    primaryKey,
    index,
    jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
// export const favoritesTable = pgTable("favorites", {
//     id: serial("id").primaryKey(),
//     userId: text("user_id").notNull(),
//     recipeId: integer("recipe_id").notNull(),
//     title: text("title").notNull(),
//     image: text("image"),
//     cookTime: text("cook_time"),
//     servings: text("servings"),
//     createdAt: timestamp("created_at").defaultNow(),
// });


export const userRoleEnum = pgEnum("user_role", ["USER", "STAFF", "ADMIN"]);
export const dogStatusEnum = pgEnum("dog_status", ["AVAILABLE", "PENDING", "ADOPTED", "HIDDEN"]);
export const bookingStatusEnum = pgEnum("booking_status", ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]);
export const eventStatusEnum = pgEnum("event_status", ["DRAFT", "PUBLISHED", "FULL", "CANCELLED"]);
export const commentStatusEnum = pgEnum("comment_status", ["VISIBLE", "HIDDEN", "FLAGGED", "DELETED"]);
export const chatStatusEnum = pgEnum("chat_status", ["OPEN", "ESCALATED", "CLOSED"]);
export const senderTypeEnum = pgEnum("sender_type", ["USER", "AI", "STAFF"]);
export const tagTypeEnum = pgEnum("tag_type", ["TEMPERAMENT", "SIZE", "ENERGY", "TRAINING", "SPECIAL"]);

export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    clerkUserId: text("clerk_user_id").notNull().unique(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    avatarUrl: text("avatar_url"),
    phone: text("phone"),
    role: userRoleEnum("role").notNull().default("USER"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const dogs = pgTable("dogs", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    sex: text("sex").notNull(),
    breed: text("breed").notNull(),
    ageMonths: integer("age_months"),
    size: text("size"),
    color: text("color"),
    description: text("description").notNull(),
    // temperament: text("temperament"),
    // medicalNotesPublic: text("medical_notes_public"),
    searchTags: text('search_tags').array().notNull(),
    adoptionStatus: dogStatusEnum("adoption_status").notNull().default("AVAILABLE"),
    kennelLocation: text("kennel_location"),
    featured: boolean("featured").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const dogPhotos = pgTable("dog_photos", {
    id: uuid("id").defaultRandom().primaryKey(),
    dogId: uuid("dog_id").notNull().references(() => dogs.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    altText: text("alt_text"),
    sortOrder: integer("sort_order").notNull().default(0),
    isPrimary: boolean("is_primary").notNull().default(false),
});

export const tags = pgTable("tags", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull().unique(),
    slug: text("slug").notNull().unique(),
    type: tagTypeEnum("type").notNull().default("SPECIAL"),
});

export const dogTags = pgTable(
    "dog_tags",
    {
        dogId: uuid("dog_id").notNull().references(() => dogs.id, { onDelete: "cascade" }),
        tagId: uuid("tag_id").notNull().references(() => tags.id, { onDelete: "cascade" }),
    },
    (t) => ({
        pk: primaryKey({ columns: [t.dogId, t.tagId] }),
    })
);

export const wishlistItems = pgTable(
    "wishlist_items",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
        dogId: uuid("dog_id").notNull().references(() => dogs.id, { onDelete: "cascade" }),
        createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    },
    (t) => ({
        uniqueWishlist: index("wishlist_unique_idx").on(t.userId, t.dogId),
    })
);

export const visitBookings = pgTable("visit_bookings", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    dogId: uuid("dog_id").references(() => dogs.id, { onDelete: "set null" }),
    visitDate: timestamp("visit_date", { withTimezone: true }).notNull(),
    timeSlot: text("time_slot").notNull(),
    visitorsCount: integer("visitors_count").notNull().default(1),
    note: text("note"),
    status: bookingStatusEnum("status").notNull().default("PENDING"),
    confirmationSentAt: timestamp("confirmation_sent_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const events = pgTable("events", {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    eventType: text("event_type").notNull(),
    startAt: timestamp("start_at", { withTimezone: true }).notNull(),
    endAt: timestamp("end_at", { withTimezone: true }).notNull(),
    capacity: integer("capacity").notNull(),
    location: text("location").notNull(),
    bannerUrl: text("banner_url"),
    status: eventStatusEnum("status").notNull().default("DRAFT"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const eventBookings = pgTable(
    "event_bookings",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
        eventId: uuid("event_id").notNull().references(() => events.id, { onDelete: "cascade" }),
        attendeeCount: integer("attendee_count").notNull().default(1),
        status: bookingStatusEnum("status").notNull().default("PENDING"),
        createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    },
    (t) => ({
        uniqueEventBooking: index("event_booking_unique_idx").on(t.userId, t.eventId),
    })
);

export const comments = pgTable("comments", {
    id: uuid("id").defaultRandom().primaryKey(),
    dogId: uuid("dog_id").notNull().references(() => dogs.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    body: text("body").notNull(),
    status: commentStatusEnum("status").notNull().default("VISIBLE"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const commentReplies = pgTable("comment_replies", {
    id: uuid("id").defaultRandom().primaryKey(),
    commentId: uuid("comment_id").notNull().references(() => comments.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    body: text("body").notNull(),
    isStaffReply: boolean("is_staff_reply").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const aiChatThreads = pgTable("ai_chat_threads", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    source: text("source").notNull().default("MOBILE"),
    escalatedToStaff: boolean("escalated_to_staff").notNull().default(false),
    assignedStaffId: uuid("assigned_staff_id").references(() => users.id, { onDelete: "set null" }),
    status: chatStatusEnum("status").notNull().default("OPEN"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const aiChatMessages = pgTable("ai_chat_messages", {
    id: uuid("id").defaultRandom().primaryKey(),
    threadId: uuid("thread_id").notNull().references(() => aiChatThreads.id, { onDelete: "cascade" }),
    senderType: senderTypeEnum("sender_type").notNull(),
    message: text("message").notNull(),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const adminAuditLogs = pgTable("admin_audit_logs", {
    id: uuid("id").defaultRandom().primaryKey(),
    actorUserId: uuid("actor_user_id").references(() => users.id, { onDelete: "set null" }),
    action: text("action").notNull(),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id").notNull(),
    payload: jsonb("payload"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
