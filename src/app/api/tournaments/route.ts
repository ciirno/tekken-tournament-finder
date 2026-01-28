import { NextRequest, NextResponse } from "next/server";
import { fetchStartGG } from "@/lib/startgg"; // Your Start.gg logic
import dbConnect from "@/lib/dbConnect";
import Tournament from "@/models/Tournament";
import { StartGGNode } from "@/types/api";

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

    // SCENARIO B: Frontend Fetch (Always hits MongoDB)
    const now = new Date();
    const tournaments = await Tournament.find({
      date: { $gte: now }, // Only show current/future tournaments
    }).sort({ date: 1 });

    return NextResponse.json({ success: true, data: tournaments });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "API Error" },
      { status: 500 },
    );
  }
}
