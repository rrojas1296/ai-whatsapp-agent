import { boolean, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./users.schema.js";

export const business = pgTable("business", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name"),
  ownerId: uuid("ownerId").references(() => users.id),
  isDeleted: boolean().notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
