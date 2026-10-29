// Independent public mock endpoint. Contains only fictional data.
import { sampleTools, sampleEmployees } from "../src/lib/demo";
interface Env {
  DEMO_LIMITER: {
    limit(input: { key: string }): Promise<{ success: boolean }>;
  };
}
export default {
  async fetch(request: Request, env: Env) {
    const headers = {
      "access-control-allow-origin": "*",
      "content-type": "application/json",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
    };
    if (request.method !== "GET")
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers,
      });
    const { success } = await env.DEMO_LIMITER.limit({
      key: request.headers.get("CF-Connecting-IP") || "unknown",
    });
    if (!success)
      return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
        status: 429,
        headers: { ...headers, "retry-after": "60" },
      });
    const path = new URL(request.url).pathname;
    if (path === "/api/demo/workspace")
      return new Response(
        JSON.stringify({
          label: "Demo – sample data",
          company: "Northwind Studio",
          tools: sampleTools,
          employees: sampleEmployees,
        }),
        { headers },
      );
    if (path !== "/api/demo/summary")
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers,
      });
    return new Response(
      JSON.stringify({
        label: "Demo – sample data",
        company: "Northwind Studio",
        tools: 14,
        employees: 23,
        trained: 18,
      }),
      { headers },
    );
  },
};
