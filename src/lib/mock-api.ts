import { sampleTools, sampleEmployees, type Tool } from "./demo";
const endpoint =
  process.env.NEXT_PUBLIC_DEMO_API_URL ||
  "https://kestrel-demo-api.juliomarianocampuzano.workers.dev";
export async function getSampleWorkspace(): Promise<{
  tools: Tool[];
  employees: typeof sampleEmployees;
}> {
  try {
    const response = await fetch(`${endpoint}/api/demo/workspace`, {
      credentials: "omit",
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error("Mock API unavailable");
    const data = await response.json();
    if (
      data.label !== "Demo – sample data" ||
      !Array.isArray(data.tools) ||
      data.tools.length !== 14 ||
      !Array.isArray(data.employees) ||
      data.employees.length !== 23
    )
      throw new Error("Invalid sample response");
    if (
      !data.tools.every(
        (tool: Tool) =>
          ["id", "name", "owner", "purpose", "category"].every(
            (k) => typeof tool[k as keyof Tool] === "string",
          ) &&
          ["Low", "Transparency", "Review"].includes(tool.risk) &&
          ["Reviewed", "Needs review"].includes(tool.status) &&
          typeof tool.personalData === "boolean",
      )
    )
      throw new Error("Invalid sample tool");
    return { tools: data.tools, employees: data.employees };
  } catch {
    return {
      tools: structuredClone(sampleTools),
      employees: structuredClone(sampleEmployees),
    };
  }
}
