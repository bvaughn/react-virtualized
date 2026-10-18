import {
  Block,
  Box,
  Callout,
  Code,
  Header,
  SectionHeader
} from "react-lib-tools";
import CustomizingStylesClassNamesJson from "../../../public/generated/examples/CustomizingStylesClassNames.json";
import CustomizingStylesCssModulesJson from "../../../public/generated/examples/CustomizingStylesCssModules.json";
import CustomizingStylesCssModulesCssJson from "../../../public/generated/examples/CustomizingStylesCssModules.module.json";
import CustomizingStylesGlobalJson from "../../../public/generated/examples/CustomizingStylesGlobal.json";
import CustomizingStylesImportJson from "../../../public/generated/examples/CustomizingStylesImport.json";
import CustomizingStylesInlineStylesJson from "../../../public/generated/examples/CustomizingStylesInlineStyles.json";
import { Link } from "../../components/Link";
import { LIST } from "../../utils/data";
import { Example } from "./examples/CustomizingStylesClassNames";

const CLASS_NAMES: [component: string, classNames: string[]][] = [
  [
    "Grid",
    ["ReactVirtualized__Grid", "ReactVirtualized__Grid__innerScrollContainer"]
  ],
  ["List", ["ReactVirtualized__List"]],
  [
    "Table",
    [
      "ReactVirtualized__Table",
      "ReactVirtualized__Table__Grid",
      "ReactVirtualized__Table__headerRow",
      "ReactVirtualized__Table__headerColumn",
      "ReactVirtualized__Table__headerTruncatedText",
      "ReactVirtualized__Table__sortableHeaderColumn",
      "ReactVirtualized__Table__sortableHeaderIcon",
      "ReactVirtualized__Table__sortableHeaderIcon--ASC",
      "ReactVirtualized__Table__sortableHeaderIcon--DESC",
      "ReactVirtualized__Table__row",
      "ReactVirtualized__Table__rowColumn"
    ]
  ],
  [
    "Masonry",
    [
      "ReactVirtualized__Masonry",
      "ReactVirtualized__Masonry__innerScrollContainer"
    ]
  ]
];

export default function CustomizingStylesRoute() {
  return (
    <Box direction="column" gap={4}>
      <Header section="Guides" title="Customizing styles" />
      <div>
        react-virtualized components position their rows and cells using inline
        styles, but the rest of their default appearance is defined in a
        separate stylesheet. Keeping these styles in their own file simplifies
        universal (server-side rendered) usage while also allowing them to be
        customized.
      </div>
      <div>
        This stylesheet should be imported once, usually while bootstrapping
        your application:
      </div>
      <Code html={CustomizingStylesImportJson.html} />
      <Callout intent="primary">
        The default stylesheet is small. Most of it is for <code>Table</code>{" "}
        (laying out header and row columns, truncating header text, and the sort
        indicator). <code>List</code>, <code>Grid</code>, and the other
        components work without it.
      </Callout>
      <div>Component styles can be customized in any of the ways below.</div>
      <SectionHeader>Forked styles</SectionHeader>
      <div>
        Copy the react-virtualized <code>styles.css</code> file into your
        project and load your own, totally custom version of it instead of the
        default one.
      </div>
      <SectionHeader>Global CSS</SectionHeader>
      <div>
        Load an additional stylesheet (after the default one) that overrides or
        adds to the global class names that react-virtualized components render
        with. For example:
      </div>
      <Code html={CustomizingStylesGlobalJson.html} />
      <div>The following global class names are used:</div>
      <ul className="flex flex-col gap-2">
        {CLASS_NAMES.map(([component, classNames]) => (
          <li key={component}>
            <strong>{component}</strong>
            <ul className="list-disc pl-6">
              {classNames.map((className) => (
                <li key={className}>
                  <code>{className}</code>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <SectionHeader>Custom class names</SectionHeader>
      <div>
        Components also accept custom class names, which are added alongside the
        default ones. For example <code>Table</code> supports{" "}
        <code>className</code>, <code>gridClassName</code>,{" "}
        <code>headerClassName</code>, and <code>rowClassName</code> (which can
        also be a function of the row index), and <code>Column</code> supports{" "}
        <code>className</code> and <code>headerClassName</code>. These work well
        with utility CSS frameworks; the table below is styled with Tailwind CSS
        classes:
      </div>
      <Block className="h-80">
        <Example items={LIST} />
      </Block>
      <Code html={CustomizingStylesClassNamesJson.html} />
      <div>They also work well with CSS modules:</div>
      <Code html={CustomizingStylesCssModulesCssJson.html} />
      <Code html={CustomizingStylesCssModulesJson.html} />
      <SectionHeader>Inline styles</SectionHeader>
      <div>
        Components also support inline style props for style overrides (e.g.{" "}
        <code>Table</code> supports <code>style</code>, <code>gridStyle</code>,{" "}
        <code>headerStyle</code>, and <code>rowStyle</code>):
      </div>
      <Code html={CustomizingStylesInlineStylesJson.html} />
      <div>
        See the props pages (e.g. <Link to="/list/props">List props</Link>,{" "}
        <Link to="/grid/props">Grid props</Link>,{" "}
        <Link to="/table/props">Table props</Link>, and{" "}
        <Link to="/table/column-props">Column props</Link>) to learn which class
        name and style props each component supports.
      </div>
    </Box>
  );
}
