import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LoginScreen } from "./login-screen";
import { useAuthStore } from "@/lib/store/auth";
import * as api from "@/lib/api";

const replace = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
}));

vi.mock("@/lib/api", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/api")>()),
  login: vi.fn(),
}));

function renderLoginScreen() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <LoginScreen />
    </QueryClientProvider>,
  );
}

describe("LoginScreen", () => {
  afterEach(() => {
    replace.mockClear();
    vi.mocked(api.login).mockReset();
    useAuthStore.getState().clear();
  });

  it("shows a validation error instead of submitting when fields are empty", async () => {
    const user = userEvent.setup();
    renderLoginScreen();

    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(await screen.findByText("Enter your username")).toBeInTheDocument();
    expect(api.login).not.toHaveBeenCalled();
  });

  it("logs in, stores the session and redirects to /games on success", async () => {
    const player = {
      name: "Rebecka Awesome",
      avatar: "images/avatar/rebecka.jpg",
      event: "Last seen gambling on Starburst.",
    };
    vi.mocked(api.login).mockResolvedValue(player);

    const user = userEvent.setup();
    renderLoginScreen();

    await user.type(screen.getByPlaceholderText("rebecka"), "rebecka");
    await user.type(screen.getByPlaceholderText("••••••••"), "secret");
    await user.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => expect(replace).toHaveBeenCalledWith("/games"));
    expect(api.login).toHaveBeenCalledWith("rebecka", "secret");
    expect(useAuthStore.getState().player).toEqual(player);
  });

  it("shows the API error message and does not redirect on failure", async () => {
    vi.mocked(api.login).mockRejectedValue(
      new Error("Incorrect username or password. Please try again."),
    );

    const user = userEvent.setup();
    renderLoginScreen();

    await user.type(screen.getByPlaceholderText("rebecka"), "rebecka");
    await user.type(screen.getByPlaceholderText("••••••••"), "wrong");
    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(
      await screen.findByText(
        "Incorrect username or password. Please try again.",
      ),
    ).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
    expect(useAuthStore.getState().player).toBeNull();
  });
});
