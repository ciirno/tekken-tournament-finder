// Start.gg GraphQL Response Types
export interface StartGGNode {
  name: string;
  startAt: number;
  city: string | null;
  url: string;
}

export interface StartGGResponse {
  data: {
    tournaments: {
      nodes: StartGGNode[];
    };
  };
}

// Challonge REST Response Types
export interface ChallongeTournament {
  tournament: {
    name: string;
    start_at: string | null;
    full_challonge_url: string;
    description: string;
  };
}

export interface ScrapedTournament {
  title: string;
  registrationLink: string;
  location: string;
  gameVersion: string;
  date: Date;
  organizer: string;
}
