import { pgTable, text, serial, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const priorityEnum = z.enum(["low", "medium", "high"]);
export type Priority = z.infer<typeof priorityEnum>;

export const categoryEnum = z.enum(["work", "personal", "shopping", "health", "other"]);
export type Category = z.infer<typeof categoryEnum>;

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  priority: text("priority").notNull().$type<Priority>(),
  category: text("category").notNull().$type<Category>().default("other"),
  completed: boolean("completed").notNull().default(false),
  dueDate: timestamp("due_date"),
});

export const insertTaskSchema = createInsertSchema(tasks)
  .pick({
    title: true,
    description: true,
    priority: true,
    category: true,
    dueDate: true,
  })
  .extend({
    priority: priorityEnum,
    category: categoryEnum,
  });

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;