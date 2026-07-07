// Server-only mock database. Mirrors the original json-server setup
// (mock/mock-data.json + mock/mock-api.js) so the app no longer needs a
// separate json-server process — the data is served from Next.js route
// handlers under app/api/* instead.
import data from "@/mock/mock-data.json";

export type Category = { id: number; name: string };

export type Game = {
  name: string;
  description: string;
  code: string;
  icon: string;
  categoryIds: number[];
};

export type Player = {
  name: string;
  avatar: string;
  event: string;
};

export const games: Game[] = data.games;
export const categories: Category[] = data.categories;

// Passwords live server-side only and are stripped before a player is returned.
// Credentials taken verbatim from the original mock/mock-api.js.
type PlayerRecord = Player & { password: string };

export const players: Record<string, PlayerRecord> = {
  rebecka: {
    name: "Rebecka Awesome",
    avatar: "images/avatar/rebecka.jpg",
    event: "Last seen gambling on Starburst.",
    password: "secret",
  },
  eric: {
    name: "Eric Beard",
    avatar: "images/avatar/eric.jpg",
    event: "I saw you won 500 SEK last time!",
    password: "dad",
  },
  stoffe: {
    name: "Stoffe Rocker",
    avatar: "images/avatar/stoffe.jpg",
    event: "Your are a rock star",
    password: "rock",
  },
};
