// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import {sql} from "drizzle-orm";
import {date, integer, pgTableCreator, timestamp} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `flatoinator3000_${name}`);

export const days = createTable("days", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  amount: integer("amount").notNull(),
  date: date("date").notNull(),
  createdAt: timestamp("created_at", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
