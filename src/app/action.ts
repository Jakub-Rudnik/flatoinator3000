'use server'

import { db } from "@/server/db";

export async function getClicksToday(counterId: number) {
    return await db.query.clicks.findMany({
        where: (clicks, { eq }) => eq(clicks.counterId, counterId),
    });
}
