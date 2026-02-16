import { Schema, model, models, Model } from "mongoose";

export interface ITournament {
  title: string;
  location: string;
  date: Date;
  gameVersion: "Tekken 8" | "Tekken 7";
  isOngoing: boolean;
  registrationLink?: string;
  externalId: string;
}

const TournamentSchema = new Schema<ITournament>(
  {
    title: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    gameVersion: {
      type: String,
      enum: ["Tekken 8", "Tekken 7"],
      default: "Tekken 8",
    },
    externalId: {
      type: String,
      unique: true, // Prevents duplicate tournaments
      index: true, // Makes the "upsert" lookups much faster
    },
    isOngoing: { type: Boolean, default: false },
    registrationLink: { type: String },
  },
  {
    timestamps: true, // Optional: adds createdAt and updatedAt automatically
  },
);

// The fix: Use a clear check for existing models and cast the type
const Tournament =
  (models.Tournament as Model<ITournament>) ||
  model<ITournament>("Tournament", TournamentSchema);

export default Tournament;
