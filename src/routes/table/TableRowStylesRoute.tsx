import { useState } from "react";
import {
  Block,
  Box,
  Checkbox,
  Code,
  Header,
  SectionHeader
} from "react-lib-tools";
import TableFullFeaturedJson from "../../../public/generated/examples/TableFullFeatured.json";
import { Link } from "../../components/Link";
import { LIST } from "../../utils/data";
import { TableFullFeatured } from "./examples/TableFullFeatured";

export default function TableRowStylesRoute() {
  const [disableHeader, setDisableHeader] = useState(false);
  const [hideIndexColumn, setHideIndexColumn] = useState(false);
  const [showNoRows, setShowNoRows] = useState(false);
  const [useDynamicRowHeight, setUseDynamicRowHeight] = useState(false);

  return (
    <Box direction="column" gap={4}>
      <Header section="Table" title="Row styles and heights" />
      <div>
        Rows can be styled using the <code>rowClassName</code> and{" "}
        <code>rowStyle</code> props, and their heights can be fixed or vary from
        row to row.
      </div>
      <div>
        The table below has sortable headers, a custom header and cell renderer,
        alternating row styles, optional dynamic row heights, and a placeholder
        that is shown when there are no rows.
      </div>
      <Box direction="row" gap={4} wrap>
        <Checkbox
          checked={useDynamicRowHeight}
          onChange={setUseDynamicRowHeight}
        >
          Dynamic row heights
        </Checkbox>
        <Checkbox checked={hideIndexColumn} onChange={setHideIndexColumn}>
          Hide index column
        </Checkbox>
        <Checkbox checked={disableHeader} onChange={setDisableHeader}>
          Hide header
        </Checkbox>
        <Checkbox checked={showNoRows} onChange={setShowNoRows}>
          No rows
        </Checkbox>
      </Box>
      <Block className="p-0!" data-focus-within="bold">
        <div>
          <TableFullFeatured
            disableHeader={disableHeader}
            hideIndexColumn={hideIndexColumn}
            list={showNoRows ? EMPTY_LIST : LIST}
            useDynamicRowHeight={useDynamicRowHeight}
          />
        </div>
      </Block>
      <Code html={TableFullFeaturedJson.html} />
      <ul className="list-disc pl-6 flex flex-col gap-1">
        <li>
          <code>rowClassName</code> (and <code>rowStyle</code>) can be a static
          value or a function of the row <code>index</code>. They are also
          applied to the header row, which is passed an index of <code>-1</code>
          .
        </li>
        <li>
          <code>rowHeight</code> can be a fixed number or a function of the row{" "}
          <code>index</code>. If row heights change after they have been
          measured, call{" "}
          <Link to="/table/methods#recomputeRowHeights">
            <code>recomputeRowHeights</code>
          </Link>
          .
        </li>
        <li>
          Falsy children are ignored, so columns can be shown or hidden
          conditionally.
        </li>
        <li>
          <code>noRowsRenderer</code> renders placeholder content when{" "}
          <code>rowCount</code> is 0.
        </li>
        <li>
          The <code>headerClassName</code> prop applies a class to every column
          header (<code>normal-case</code> above overrides the default uppercase
          style). Sorting is covered in more detail on the{" "}
          <Link to="/table/sorting">sorting</Link> page.
        </li>
      </ul>
      <SectionHeader>Class names</SectionHeader>
      <div>
        <code>Table</code> renders the following static class names, which can
        be targeted by your styles:
      </div>
      <ul className="list-disc pl-6 flex flex-col gap-1">
        {CLASS_NAMES.map(([className, description]) => (
          <li key={className}>
            <code>{className}</code>: {description}
          </li>
        ))}
      </ul>
    </Box>
  );
}

const EMPTY_LIST: typeof LIST = [];

const CLASS_NAMES = [
  ["ReactVirtualized__Table", "main (outer) element"],
  ["ReactVirtualized__Table__Grid", "inner Grid (the scrollable body)"],
  ["ReactVirtualized__Table__headerRow", "header row (similar to thead > tr)"],
  [
    "ReactVirtualized__Table__headerColumn",
    "header cell (similar to thead > tr > th)"
  ],
  [
    "ReactVirtualized__Table__sortableHeaderColumn",
    "applied to header cells that are sortable"
  ],
  [
    "ReactVirtualized__Table__headerTruncatedText",
    "header label rendered by the default header renderer"
  ],
  [
    "ReactVirtualized__Table__sortableHeaderIcon",
    "SVG sort indicator (plus --ASC or --DESC modifier)"
  ],
  ["ReactVirtualized__Table__row", "table row (similar to tbody > tr)"],
  [
    "ReactVirtualized__Table__rowColumn",
    "table cell (similar to tbody > tr > td)"
  ]
] as const;
