import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { AuthGuard } from "./auth-guard";
import { useAuthStore } from "@/lib/store/auth";
import * as hydrated from "@/lib/use-hydrated";

const replace = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
}));

vi.mock("@/lib/use-hydrated", () => ({
  useHydrated: vi.fn(() => true),
}));

describe("AuthGuard", () => {
  afterEach(() => {
    replace.mockClear();
    useAuthStore.getState().clear();
    vi.mocked(hydrated.useHydrated).mockReturnValue(true);
  });

  it("shows the loader and does not redirect before hydration, even with no player", () => {
    vi.mocked(hydrated.useHydrated).mockReturnValue(false);

    render(
      <AuthGuard>
        <div>protected content</div>
      </AuthGuard>,
    );

    expect(screen.queryByText("protected content")).not.toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it("redirects to /login once hydrated with no player", () => {
    render(
      <AuthGuard>
        <div>protected content</div>
      </AuthGuard>,
    );

    expect(replace).toHaveBeenCalledWith("/login");
    expect(screen.queryByText("protected content")).not.toBeInTheDocument();
  });

  it("renders children once hydrated with a player", () => {
    useAuthStore.getState().setSession("rebecka", {
      name: "Rebecka Awesome",
      avatar: "images/avatar/rebecka.jpg",
      event: "Last seen gambling on Starburst.",
    });

    render(
      <AuthGuard>
        <div>protected content</div>
      </AuthGuard>,
    );

    expect(screen.getByText("protected content")).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });
});
