// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import {sql} from "drizzle-orm";
import {integer, pgTableCreator, timestamp} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */

export type click = {
  id: number;
  createdAt: Date | null;
  updatedAt: Date;
};

export const createTable = pgTableCreator((name) => `flatoinator3000_${name}`);

export const clicks = createTable("clicks", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  createdAt: timestamp("created_at", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Warsaw'`),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Warsaw'`),
});
