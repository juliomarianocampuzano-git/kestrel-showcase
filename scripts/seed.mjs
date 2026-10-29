import { mkdir, writeFile } from "node:fs/promises";
import { sampleTools, sampleEmployees } from "../src/lib/demo.ts";
await mkdir("public/samples", { recursive: true });
await writeFile(
  "public/samples/northwind-seed.json",
  JSON.stringify(
    {
      label: "Demo – sample data",
      company: "Northwind Studio",
      tools: sampleTools,
      employees: sampleEmployees,
    },
    null,
    2,
  ),
);
console.log("Fictional seed exported: 14 tools, 23 employees.");
