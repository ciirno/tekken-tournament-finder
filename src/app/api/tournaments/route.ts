import { NextRequest, NextResponse } from "next/server";
import { fetchStartGG } from "@/lib/startgg"; // Your Start.gg logic
import dbConnect from "@/lib/dbConnect";
import Tournament from "@/models/Tournament";
import { StartGGNode } from "@/types/api";
import { dateToday, startOfDay, endOfDay } from "@/app/helpers/date";
export async function GET(req: NextRequest) {
  await dbConnect();
  const authHeader = req.headers.get("authorization");
  const isCronSync = authHeader === `Bearer ${process.env.CRON_SECRET}`;

  try {
    // Sync Trigger (Only runs every 12 am via Cron)
    if (isCronSync) {
      const freshData = await fetchStartGG();

      const ops = freshData.map((t: StartGGNode) => ({
        updateOne: {
          filter: { externalId: String(t.id) },
          update: {
            $set: {
              title: t.name,
              // CRITICAL: Start.gg returns seconds, JS needs milliseconds
              date: new Date(t.startAt * 1000),
              location: t.city || "Online",
              registrationLink: `https://start.gg${t.url}`,
              externalId: String(t.id),
              gameVersion: "Tekken 8" as const,
              isOngoing: false, // Default to false, logic in component handles display
            },
          },
          upsert: true,
        },
      }));

      // Perform the write and capture the result object
      const result = await Tournament.bulkWrite(ops);

      return NextResponse.json({
        message: "Sync complete",
        count: freshData.length,
        details: {
          upserted: result.upsertedCount,
          matched: result.matchedCount,
        },
      });
    }
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status"); // 'all', 'upcoming', 'ongoing','completed'

    let query = {};

    if (status === "upcoming") {
      query = { date: { $gt: dateToday } };
    } else if (status === "ongoing") {
      // Logic for 'Today'
      query = { date: { $gte: startOfDay, $lte: endOfDay } };
    } else if (status === "completed") {
      query = { date: { $lt: startOfDay } };
    }
    const tournaments = await Tournament.find(query).sort({ date: 1 });
    return NextResponse.json({ success: true, data: tournaments });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, error: "API Error" },
      { status: 500 },
    );
  }
}
