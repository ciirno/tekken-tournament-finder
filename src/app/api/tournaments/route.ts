import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Tournament from "@/models/Tournament";
import { fetchStartGG } from "@/lib/startgg";
// src/app/api/tournaments/route.ts
import { StartGGNode } from "@/types/api";

export async function GET() {
  await dbConnect();
  const now = new Date();
  try {
    const [startgg] = await Promise.all([fetchStartGG()]);

    // Map Start.gg (PH Filtered by Query already)
    const normalizedStartGG = startgg.map((t: StartGGNode) => ({
      title: t.name,
      location: t.city ? `${t.city}, PH` : "Philippines (Online)",
      date: new Date(t.startAt * 1000),
      gameVersion: "Tekken 8",
      registrationLink: `https://start.gg${t.url}`,
      isOngoing: t.startAt * 1000 <= now.getTime(),
    }));

    const combined = [...normalizedStartGG];

    // MongoDB Upsert
    for (const t of combined) {
      await Tournament.findOneAndUpdate({ title: t.title }, t, {
        upsert: true,
      });
    }

    const count = await Tournament.countDocuments();
    console.log(`📊 Current total tournaments in DB: ${count}`);

    // Final clean fetch from DB: only future/ongoing PH tournaments
    const all = await Tournament.find({ date: { $gte: now } }).sort({
      date: 1,
    });

    return NextResponse.json({ success: true, data: all });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
