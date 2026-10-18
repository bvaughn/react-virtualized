import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { withCompilerOptions } from "react-docgen-typescript";
import { compileDocs } from "react-lib-tools/scripts/compile-docs.ts";
import { compileComponent } from "react-lib-tools/scripts/utils/docs/compileComponent.ts";
import { parseDescription } from "react-lib-tools/scripts/utils/docs/parseDescription.ts";
import { syntaxHighlight } from "react-lib-tools/scripts/utils/syntax-highlight.ts";
import type {
  ComponentMetadata,
  ImperativeHandleMetadata
} from "react-lib-tools";
import ts from "typescript";

const outputDir = resolve("public", "generated", "docs");

await compileDocs({
  componentNames: [
    "ArrowKeyStepper",
    "CellMeasurer",
    "ColumnSizer",
    "Grid",
    "InfiniteLoader",
    "List",
    "Masonry",
    "MultiGrid",
    "ScrollSync",
    "Column",
    "Table"
  ],
  imperativeHandleNames: [
    "ArrowKeyStepperImperativeAPI",
    "CellMeasurerCacheAPI",
    "GridImperativeAPI",
    "InfiniteLoaderImperativeAPI",
    "ListImperativeAPI",
    "MasonryImperativeAPI",
    "MultiGridImperativeAPI",
    "TableImperativeAPI"
  ],
  readmePath: false
});

// The CellMeasurerCache constructor options are a plain type (not component props),
// so they're compiled through a docs-only stub component whose props are those options.
// (This runs after compileDocs, which deletes the generated JSON files before compiling.)
{
  const parser = withCompilerOptions(
    {
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      skipLibCheck: true,
      strict: true,
      target: ts.ScriptTarget.ES2022
    },
    {
      savePropValueAsString: true,
      shouldExtractLiteralValuesFromEnum: true,
      shouldExtractValuesFromUnion: true,
      shouldRemoveUndefinedFromOptional: true
    }
  );

  await compileComponent({
    filePath: resolve("scripts", "docs-stubs", "CellMeasurerCacheOptions.tsx"),
    outputDir,
    parser
  });

  // Point the "source code" link at the class rather than the stub
  const outputFile = resolve(outputDir, "CellMeasurerCacheOptions.json");
  const json = JSON.parse(
    await readFile(outputFile, "utf-8")
  ) as ComponentMetadata;
  json.filePath = "lib/components/CellMeasurer/CellMeasurerCache.ts";
  await writeFile(outputFile, JSON.stringify(json, null, 2));
}

// compileDocs only documents the methods of an interface;
// add its (read-only) properties too, e.g. CellMeasurerCacheAPI's defaultHeight and defaultWidth getters.
await addInterfaceProperties(
  "lib/components/CellMeasurer/types.ts",
  "CellMeasurerCacheAPI"
);

async function addInterfaceProperties(filePath: string, name: string) {
  const outputFile = resolve(outputDir, `${name}.json`);
  const json = JSON.parse(
    await readFile(outputFile, "utf-8")
  ) as ImperativeHandleMetadata;

  const sourceFile = ts.createSourceFile(
    filePath,
    await readFile(filePath, "utf-8"),
    ts.ScriptTarget.Latest,
    true
  );
  const interfaceDeclaration = sourceFile.statements.find(
    (statement): statement is ts.InterfaceDeclaration =>
      ts.isInterfaceDeclaration(statement) && statement.name.text === name
  );
  if (!interfaceDeclaration) {
    throw Error(`Interface ${name} not found in ${filePath}`);
  }

  // Keep the declaration order
  const methods: ImperativeHandleMetadata["methods"] = [];
  for (const member of interfaceDeclaration.members) {
    const memberName = member.name?.getText(sourceFile) ?? "";
    if (ts.isPropertySignature(member) || ts.isGetAccessor(member)) {
      const comment = ts
        .getJSDocCommentsAndTags(member)
        .filter(ts.isJSDoc)
        .map((jsDoc) => ts.getTextOfJSDocComment(jsDoc.comment) ?? "")
        .join("\n\n");
      if (!comment) {
        throw Error(`Missing JSDoc comment for ${name}.${memberName}`);
      }

      methods.push({
        description: await parseDescription(comment),
        html: await syntaxHighlight(member.getText(sourceFile), "TS"),
        name: memberName
      });
    } else {
      const method = json.methods.find((method) => method.name === memberName);
      if (method) {
        methods.push(method);
      }
    }
  }
  json.methods = methods;

  await writeFile(outputFile, JSON.stringify(json, null, 2));
}
