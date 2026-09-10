import { expect, test } from "vitest";

import { handleApiRequest } from "./app";

test("API responses include CORS headers", async () => {
  const response = await handleApiRequest(new Request("http://localhost:3000/api/health"));

  expect(response.status).toBe(200);
  expect(response.headers.get("access-control-allow-origin")).toBe("*");
  expect(response.headers.get("access-control-allow-methods")).toContain("GET");
});

test("OPTIONS preflight returns 204", async () => {
  const response = await handleApiRequest(
    new Request("http://localhost:3000/api/health", { method: "OPTIONS" }),
  );

  expect(response.status).toBe(204);
  expect(response.headers.get("access-control-allow-origin")).toBe("*");
  expect(response.headers.get("access-control-allow-methods")).toContain("OPTIONS");
});
