import { Block, Box, Code, Header } from "react-lib-tools";
import TableColumnRenderersJson from "../../../public/generated/examples/TableColumnRenderers.json";
import { TableColumnRenderers } from "./examples/TableColumnRenderers";

export default function TableCellRenderersRoute() {
  return (
    <Box direction="column" gap={4}>
      <Header section="Table" title="Custom cells and headers" />
      <div>
        Each <code>Column</code> accepts three functions that control what its
        cells and header render:
      </div>
      <ul className="list-disc pl-6 flex flex-col gap-1">
        <li>
          <code>cellDataGetter</code> returns a cell's data, given its{" "}
          <code>dataKey</code>, <code>rowData</code>, and{" "}
          <code>columnData</code>. The default (
          <code>defaultTableCellDataGetter</code>) reads{" "}
          <code>rowData[dataKey]</code> (or calls{" "}
          <code>rowData.get(dataKey)</code> for Map-like objects). Override it
          if your data is calculated or requires custom processing.
        </li>
        <li>
          <code>cellRenderer</code> renders a cell's contents, given its{" "}
          <code>cellData</code>, <code>columnData</code>,{" "}
          <code>columnIndex</code>, <code>dataKey</code>,{" "}
          <code>isScrolling</code>, <code>parent</code>, <code>rowData</code>,
          and <code>rowIndex</code>. The default (
          <code>defaultTableCellRenderer</code>) displays the cell data as a
          string. Override it if your data is some other type of object or
          requires custom formatting.
        </li>
        <li>
          <code>headerRenderer</code> renders the column header, given its{" "}
          <code>columnData</code>, <code>dataKey</code>,{" "}
          <code>disableSort</code>, <code>label</code>, <code>sortBy</code>, and{" "}
          <code>sortDirection</code>. The default (
          <code>defaultTableHeaderRenderer</code>) displays the{" "}
          <code>label</code> along with a sort indicator if the table is sorted
          by this column.
        </li>
      </ul>
      <Block className="p-0!" data-focus-within="bold">
        <div>
          <TableColumnRenderers />
        </div>
      </Block>
      <Code html={TableColumnRenderersJson.html} />
      <div>
        The <code>columnData</code> prop can be used to pass additional data
        (e.g. action creators or relational data) to all three of these
        functions.
      </div>
    </Box>
  );
}
