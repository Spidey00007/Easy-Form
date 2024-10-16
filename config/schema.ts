import { boolean, integer, serial, text, varchar } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

export type JsonForm = {
  id?: number;
  jsonform: string;
  theme?: string | null;
  background?: string | null;
  style?: string | null;
  createdBy: string;
  createdAt: string;
  enableSignIn:boolean
};

export interface UserResponse {
  id?: number;
  jsonResponse: string;
  createdBy?: string;
  createdAt: string;
  formRef: number;
}

export const JsonForms = pgTable("jsonForms", {
  id: serial("id").primaryKey(),
  jsonform: text("jsonform").notNull(),
  theme: varchar("theme"),
  background: varchar("background"),
  style: varchar("style"),
  createdBy: varchar("createdBy").notNull(),
  createdAt: varchar("createdAt").notNull(),
  enableSignIn:boolean("enableSignIn").default(false)
});

export const userResponses = pgTable("userResponses", {
  id: serial("id").primaryKey(),
  jsonResponse: text("jsonResponse").notNull(),
  createdBy: varchar("createdBy").default("Anonymous"),
  createdAt: varchar("createdAt").notNull(),
  formRef: integer("formRef").references(() => JsonForms.id).notNull(),
});
