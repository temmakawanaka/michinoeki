import { createServer, type ServerResponse } from "node:http";
import { pathToFileURL } from "node:url";

import { handleApiRequest } from "@/http/app";
import { prisma } from "@/lib/db";

function toRequestUrl(requestUrl: string | undefined, host: string | undefined) {
  return new URL(requestUrl ?? "/", `http://${host ?? "localhost"}`);
}

function toHeaders(headers: Record<string, string | string[] | undefined>) {
  const result = new Headers();

  for (const [key, value] of Object.entries(headers)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        result.append(key, item);
      }
    } else if (value !== undefined) {
      result.set(key, value);
    }
  }

  return result;
}

async function writeResponse(nodeResponse: ServerResponse, response: Response) {
  nodeResponse.statusCode = response.status;

  response.headers.forEach((value, key) => {
    nodeResponse.setHeader(key, value);
  });

  nodeResponse.end(Buffer.from(await response.arrayBuffer()));
}

export function createApiServer() {
  return createServer(async (nodeRequest, nodeResponse) => {
    try {
      const request = new Request(toRequestUrl(nodeRequest.url, nodeRequest.headers.host), {
        method: nodeRequest.method,
        headers: toHeaders(nodeRequest.headers),
      });

      await writeResponse(nodeResponse, await handleApiRequest(request));
    } catch (error) {
      console.error(error);
      nodeResponse.statusCode = 500;
      nodeResponse.setHeader("content-type", "application/json; charset=utf-8");
      nodeResponse.end(JSON.stringify({ error: "Internal server error" }));
    }
  });
}

function readPort() {
  const port = Number(process.env.PORT ?? 3000);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("PORT must be a positive integer.");
  }

  return port;
}

const isMain = process.argv[1] ? import.meta.url === pathToFileURL(process.argv[1]).href : false;

if (isMain) {
  const port = readPort();
  const server = createApiServer();

  server.listen(port, () => {
    console.log(`API server listening on http://localhost:${port}`);
  });

  async function shutdown() {
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  }

  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
}
