import { describe, it, expect } from "vitest";
import { POST } from "./route";

function req(body: unknown) {
  return new Request("http://test/api/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

describe("POST /api/login", () => {
  it("logs in with correct credentials and strips the password", async () => {
    const res = await POST(req({ username: "rebecka", password: "secret" }));

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe("success");
    expect(data.player).toEqual({
      name: "Rebecka Awesome",
      avatar: "images/avatar/rebecka.jpg",
      event: "Last seen gambling on Starburst.",
    });
    expect(data.player.password).toBeUndefined();
  });

  it("trims the username before lookup", async () => {
    const res = await POST(req({ username: "  rebecka  ", password: "secret" }));
    expect(res.status).toBe(200);
  });

  it("rejects a wrong password", async () => {
    const res = await POST(req({ username: "rebecka", password: "wrong" }));

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.status).toBe("fail");
  });

  it("rejects an unknown username", async () => {
    const res = await POST(req({ username: "nobody", password: "secret" }));
    expect(res.status).toBe(400);
  });

  it("rejects a malformed request body", async () => {
    const res = await POST(
      new Request("http://test/api/login", {
        method: "POST",
        body: "not json",
      }),
    );
    expect(res.status).toBe(400);
  });
});
