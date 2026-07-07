import { create } from "zustand";
import {
  persist,
  createJSONStorage,
  type StateStorage,
} from "zustand/middleware";
import type { Player } from "@/lib/api";

type AuthState = {
  username: string | null;
  player: Player | null;
  setSession: (username: string, player: Player) => void;
  clear: () => void;
};

// Session persistence: a refresh on /games shouldn't bounce the user back to
// login. sessionStorage (not localStorage) so the session dies with the tab.
// It's synchronous, so it has rehydrated by the time any component effect runs
// — consumers gate on their own `mounted` flag rather than a hydration flag.
const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      username: null,
      player: null,
      setSession: (username, player) => set({ username, player }),
      clear: () => set({ username: null, player: null }),
    }),
    {
      name: "comeon-auth",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.sessionStorage : noopStorage,
      ),
      partialize: (s) => ({ username: s.username, player: s.player }),
    },
  ),
);
