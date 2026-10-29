import { boolean, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./users.schema.js";

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  refreshHash: varchar("refresh_hash").notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  isDeleted: boolean().notNull().default(false),
  businessId: uuid("business_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
