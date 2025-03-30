import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema';

declare global {
    var cachedConnection: postgres.Sql | undefined;
}

let sqlClient: postgres.Sql;

if (process.env.NODE_ENV === 'production') {
    sqlClient = postgres(process.env.DATABASE_URL!, {
        max: 10,
        idle_timeout: 20,
        connect_timeout: 10,
        ssl: { require: true },
    });
} else {
    if (!global.cachedConnection) {
        global.cachedConnection = postgres(process.env.DATABASE_URL!, {
            max: 10,
            idle_timeout: 20,
            connect_timeout: 10,
            ssl: { require: true },
        });
    }
    sqlClient = global.cachedConnection;
}

export const db = drizzle(sqlClient, { schema });
