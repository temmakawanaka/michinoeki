import type { AddressInfo } from "node:net";

import { afterEach, expect, test } from "vitest";

import { createApiServer } from "./server";

const openServers: ReturnType<typeof createApiServer>[] = [];

afterEach(async () => {
  await Promise.all(
    openServers.splice(0).map(
      (server) =>
        new Promise<void>((resolve, reject) => {
          server.close((error) => {
            if (error) {
              reject(error);
              return;
            }

            resolve();
          });
        }),
    ),
  );
});

test("serves the health endpoint over HTTP", async () => {
  const server = createApiServer();
  openServers.push(server);

  await new Promise<void>((resolve) => {
    server.listen(0, "127.0.0.1", resolve);
  });

  const address = server.address() as AddressInfo;
  const response = await fetch(`http://127.0.0.1:${address.port}/api/health`);

  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({ status: "ok" });
});
