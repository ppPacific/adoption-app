CREATE TYPE "public"."booking_status" AS ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');--> statement-breakpoint
CREATE TYPE "public"."chat_status" AS ENUM('OPEN', 'ESCALATED', 'CLOSED');--> statement-breakpoint
CREATE TYPE "public"."comment_status" AS ENUM('VISIBLE', 'HIDDEN', 'FLAGGED', 'DELETED');--> statement-breakpoint
CREATE TYPE "public"."dog_status" AS ENUM('AVAILABLE', 'PENDING', 'ADOPTED', 'HIDDEN');--> statement-breakpoint
CREATE TYPE "public"."event_status" AS ENUM('DRAFT', 'PUBLISHED', 'FULL', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."sender_type" AS ENUM('USER', 'AI', 'STAFF');--> statement-breakpoint
CREATE TYPE "public"."tag_type" AS ENUM('TEMPERAMENT', 'SIZE', 'ENERGY', 'TRAINING', 'SPECIAL');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('USER', 'STAFF', 'ADMIN');--> statement-breakpoint
CREATE TABLE "dog_photos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"dog_id" uuid NOT NULL,
	"url" text NOT NULL,
	"alt_text" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dog_tags" (
	"dog_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	CONSTRAINT "dog_tags_dog_id_tag_id_pk" PRIMARY KEY("dog_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "dogs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"sex" text NOT NULL,
	"breed" text NOT NULL,
	"age_months" integer,
	"size" text,
	"color" text,
	"description" text NOT NULL,
	"search_tags" text[] NOT NULL,
	"adoption_status" "dog_status" DEFAULT 'AVAILABLE' NOT NULL,
	"kennel_location" text,
	"featured" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"type" "tag_type" DEFAULT 'SPECIAL' NOT NULL,
	CONSTRAINT "tags_name_unique" UNIQUE("name"),
	CONSTRAINT "tags_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "dog_photos" ADD CONSTRAINT "dog_photos_dog_id_dogs_id_fk" FOREIGN KEY ("dog_id") REFERENCES "public"."dogs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dog_tags" ADD CONSTRAINT "dog_tags_dog_id_dogs_id_fk" FOREIGN KEY ("dog_id") REFERENCES "public"."dogs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dog_tags" ADD CONSTRAINT "dog_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;