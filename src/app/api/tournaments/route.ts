import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Tournament from "@/models/Tournament";
import { scrapeTekkenTournaments } from "@/lib/scraper";

export async function GET() {
  await dbConnect();

  // 1. Scrape fresh data
  const freshData = await scrapeTekkenTournaments();

  // 2. (Optional) Save to MongoDB so you don't over-scrape
  // upsert (update if exists, insert if not) to avoid duplicates
  for (const t of freshData) {
    await Tournament.findOneAndUpdate({ title: t.title }, t, { upsert: true });
  }

  const allTournaments = await Tournament.find({}).sort({ date: 1 });
  return NextResponse.json({ success: true, data: allTournaments });
}
