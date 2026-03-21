import { GET } from "./route";

test("returns search results as json", async () => {
  const response = await GET(new Request("http://localhost:3000/api/search?q=富士&prefecture=静岡県"));

  const data = (await response.json()) as {
    total: number;
    items: Array<{ slug: string }>;
  };

  expect(response.status).toBe(200);
  expect(data.total).toBe(1);
  expect(data.items[0]?.slug).toBe("michinoeki-fuji");
});