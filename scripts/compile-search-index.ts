import { readFile, writeFile } from "node:fs/promises";
import { compileSearchIndex } from "react-lib-tools/scripts/compile-search-index.ts";

await compileSearchIndex({
  chromeExecutablePath: process.env.CHROME_PATH,
  // Exclude the (generated) contents of live demos from the index
  filterSelector: [
    ".ReactVirtualized__Grid",
    ".ReactVirtualized__Masonry",
    ".ReactVirtualized__Table"
  ].join(", "),
  // Defaults to the dev server (its port is configured in package.json)
  host: process.env.SEARCH_INDEX_HOST
});

// Pages are crawled concurrently, so they're added to the site map in a different order each time;
// sort them by path so the output only changes when the content does
const siteMapPath = "public/generated/site-map.json";
const siteMap: { path: string }[] = JSON.parse(
  await readFile(siteMapPath, "utf8")
);
siteMap.sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
await writeFile(siteMapPath, JSON.stringify(siteMap, null, 2));
