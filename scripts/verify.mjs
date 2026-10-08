import { readFile, stat } from "node:fs/promises";
import { resolve, dirname, extname, join } from "node:path";

const root = resolve(import.meta.dirname, "..", process.argv[2] ?? ".");
const pages = [
  "index.html",
  "funnet/index.html",
  "mistet/index.html",
  "registrer/index.html",
  "rammenummer/index.html",
];
const errors = [];
const idsByPage = new Map();

for (const page of pages) {
  const source = await readFile(join(root, page), "utf8");
  const ids = [...source.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  idsByPage.set(page, new Set(ids));
  if (new Set(ids).size !== ids.length) errors.push(`${page}: duplicate ID`);
  if ([...source.matchAll(/<h1(?:\s|>)/g)].length !== 1)
    errors.push(`${page}: expected one h1`);
  if (/<(?:script|form)(?:\s|>)/i.test(source))
    errors.push(`${page}: unexpected script or form`);
  if (/https?:\/\/(?:www\.)?sykkelreg\.no/i.test(source))
    errors.push(`${page}: Sykkelreg link`);

  for (const [, target] of source.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    if (/^(?:https?:|mailto:|tel:|data:)/.test(target)) continue;
    const [pathPart, fragment] = target.split("#");
    let destination = resolve(
      root,
      dirname(page),
      pathPart || page.split("/").pop(),
    );
    try {
      if ((await stat(destination)).isDirectory())
        destination = join(destination, "index.html");
      await stat(destination);
    } catch {
      errors.push(`${page}: missing ${target}`);
      continue;
    }
    if (fragment && extname(destination) === ".html") {
      const relative = destination.slice(root.length + 1);
      if (!idsByPage.has(relative)) {
        const html = await readFile(destination, "utf8");
        idsByPage.set(
          relative,
          new Set(
            [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]),
          ),
        );
      }
      if (!idsByPage.get(relative).has(fragment))
        errors.push(`${page}: missing anchor ${target}`);
    }
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(
    `Verified ${pages.length} pages, links, assets, headings, and IDs in ${root}.`,
  );
}
