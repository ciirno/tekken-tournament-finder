import axios from "axios";
import * as cheerio from "cheerio";
// Import the interface from your model
import { ITournament } from "@/models/Tournament";

export async function scrapeTekkenTournaments(): Promise<ITournament[]> {
  const url = "https://liquipedia.net/fighters/Tekken_8/Tournaments";

  try {
    const { data } = await axios.get(url, {
      headers: { "User-Agent": "TekkenTournamentFinder/1.0" },
    });

    const $ = cheerio.load(data);
    const tournaments: ITournament[] = []; // No more 'any'!

    $(".tournament-card").each((i, element) => {
      const title = $(element).find(".tournament-card-title").text().trim();
      const dateStr = $(element).find(".tournament-card-date").text().trim();
      const location = $(element)
        .find(".tournament-card-location")
        .text()
        .trim();

      if (title) {
        tournaments.push({
          title,
          location: location || "Online",
          date: new Date(dateStr),
          gameVersion: "Tekken 8",
          isOngoing: true,
        });
      }
    });

    return tournaments;
  } catch (error) {
    console.error("Scraping failed:", error);
    return [];
  }
}
