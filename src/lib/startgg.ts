import { StartGGNode, StartGGResponse } from "@/types/api";

const query = `
  query TournamentsByCountry($videogameId: ID!, $countryCode: String!) {
    tournaments(query: {
      perPage: 20,
      filter: { 
        videogameIds: [$videogameId], 
        upcoming: true,
        countryCode: $countryCode 
      }
    }) {
      nodes {
        name
        startAt
        city
        url
      }
    },
  }
`;

export async function fetchStartGG(): Promise<StartGGNode[]> {
  const res = await fetch("https://api.start.gg/gql/alpha", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.STARTGG_API_KEY}`,
    },
    body: JSON.stringify({
      query: query,
      variables: { videogameId: "49783", countryCode: "PH" },
    }),
  });

  const json: StartGGResponse = await res.json();
  return json.data?.tournaments?.nodes || [];
}
