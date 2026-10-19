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
