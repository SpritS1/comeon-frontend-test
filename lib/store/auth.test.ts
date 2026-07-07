import { describe, it, expect, afterEach } from "vitest";
import { useAuthStore } from "./auth";
import type { Player } from "@/lib/api";

const player: Player = {
  name: "Rebecka Awesome",
  avatar: "images/avatar/rebecka.jpg",
  event: "Last seen gambling on Starburst.",
};

describe("useAuthStore", () => {
  afterEach(() => {
    useAuthStore.getState().clear();
  });

  it("starts with no session", () => {
    expect(useAuthStore.getState().username).toBeNull();
    expect(useAuthStore.getState().player).toBeNull();
  });

  it("setSession stores the username and player", () => {
    useAuthStore.getState().setSession("rebecka", player);

    expect(useAuthStore.getState().username).toBe("rebecka");
    expect(useAuthStore.getState().player).toEqual(player);
  });

  it("clear resets the session", () => {
    useAuthStore.getState().setSession("rebecka", player);
    useAuthStore.getState().clear();

    expect(useAuthStore.getState().username).toBeNull();
    expect(useAuthStore.getState().player).toBeNull();
  });

  it("persists the session to sessionStorage", () => {
    useAuthStore.getState().setSession("rebecka", player);

    const raw = window.sessionStorage.getItem("comeon-auth");
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed.state.username).toBe("rebecka");
  });
});
