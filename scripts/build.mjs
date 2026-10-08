import { cp, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const output = resolve(root, "dist");
const items = [
  "index.html",
  "styles.css",
  "assets",
  "funnet",
  "mistet",
  "registrer",
  "rammenummer",
];

await rm(output, { recursive: true, force: true });
await mkdir(output);
for (const item of items) {
  await cp(resolve(root, item), resolve(output, item), { recursive: true });
}

console.log(`Built ${items.length} site entries in dist/.`);
