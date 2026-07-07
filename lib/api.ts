// Same-origin API client. The mock backend now lives in Next.js route
// handlers under app/api/*, so there is no json-server and no CORS concern.
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

const AUTH_ERROR = "Incorrect username or password. Please try again.";

export async function getGames(): Promise<Game[]> {
  const res = await fetch("/api/games");
  if (!res.ok) throw new Error("Could not load games. Please try again.");
  return res.json();
}

export async function getCategories(): Promise<Category[]> {
  const res = await fetch("/api/categories");
  if (!res.ok) throw new Error("Could not load categories.");
  return res.json();
}

export async function login(
  username: string,
  password: string,
): Promise<Player> {
  const res = await fetch("/api/login", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok || !data || data.status !== "success") {
    throw new Error(AUTH_ERROR);
  }
  return data.player as Player;
}

export async function logout(username: string): Promise<void> {
  await fetch("/api/logout", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  }).catch(() => {
    // Logout is best-effort — the mock API has no real session to invalidate.
  });
}
