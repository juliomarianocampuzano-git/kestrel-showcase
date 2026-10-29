import { readdir, readFile } from "node:fs/promises";
const forbidden = [
  /kestrel-core/i,
  /SUPABASE_SERVICE_ROLE_KEY/,
  /sk_live_[a-zA-Z0-9]{12,}/,
  /BEGIN (RSA |EC |)PRIVATE KEY/,
];
async function scan(dir) {
  for (const item of await readdir(dir, { withFileTypes: true })) {
    if (
      ["node_modules", ".git", ".next", "out", ".wrangler"].includes(item.name)
    )
      continue;
    const path = `${dir}/${item.name}`;
    if (item.isDirectory()) await scan(path);
    else if (
      /\.(tsx?|m?js|json|ya?ml|toml|env)$/.test(item.name) &&
      !path.endsWith("check-boundary.mjs")
    ) {
      const text = await readFile(path, "utf8");
      for (const r of forbidden)
        if (r.test(text)) throw Error(`Public boundary check failed: ${path}`);
    }
  }
}
await scan(".");
console.log("Public source boundary check passed.");
