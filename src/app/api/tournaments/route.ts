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
    // SCENARIO A: Sync Trigger (Only runs every 4 hours via Cron)
    if (isCronSync) {
      const freshData = await fetchStartGG();

      const ops = freshData.map((t: StartGGNode) => ({
        updateOne: {
          filter: { externalId: t.id }, // Ensure your model has an externalId
          update: { $set: t },
          upsert: true,
        },
      }));

      await Tournament.bulkWrite(ops);
      return NextResponse.json({
        message: "Sync complete",
        count: freshData.length,
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
    // If status is 'all' or null, query remains {} (returns everything)
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
