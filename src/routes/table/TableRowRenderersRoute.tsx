import {
  Block,
  Box,
  Callout,
  Code,
  ExternalLink,
  Header
} from "react-lib-tools";
import TableRowRendererJson from "../../../public/generated/examples/TableRowRenderer.json";
import { TableRowRenderer } from "./examples/TableRowRenderer";

export default function TableRowRenderersRoute() {
  return (
    <Box direction="column" gap={4}>
      <Header section="Table" title="Custom rows" />
      <div>
        For more control than <code>rowClassName</code> and{" "}
        <code>rowStyle</code> offer, <code>Table</code> accepts a{" "}
        <code>rowRenderer</code> and a <code>headerRowRenderer</code>. These are
        advanced properties, useful when you need additional hooks into{" "}
        <code>Table</code> (e.g. integrating with a drag-and-drop library like{" "}
        <ExternalLink href="https://github.com/clauderic/react-sortable-hoc">
          react-sortable-hoc
        </ExternalLink>
        ) or need to render additional UI elements.
      </div>
      <div>
        The easiest way to override them is to decorate the default
        implementations, <code>defaultTableRowRenderer</code> and{" "}
        <code>defaultTableHeaderRowRenderer</code>, or to fork them. Click a row
        below to select it:
      </div>
      <Block className="p-0!" data-focus-within="bold">
        <div>
          <TableRowRenderer />
        </div>
      </Block>
      <Code html={TableRowRendererJson.html} />
      <div>
        A <code>headerRowRenderer</code> is passed the header row{" "}
        <code>className</code>, <code>style</code>, and the rendered{" "}
        <code>columns</code>. A <code>rowRenderer</code> is passed the same
        values plus the row <code>index</code>, <code>key</code>,{" "}
        <code>rowData</code>, <code>isScrolling</code>, and the{" "}
        <code>onRowClick</code>, <code>onRowDoubleClick</code>,{" "}
        <code>onRowMouseOut</code>, <code>onRowMouseOver</code>, and{" "}
        <code>onRowRightClick</code> handlers.
      </div>
      <Callout intent="warning">
        A custom row renderer must apply the <code>style</code> it is passed to
        the row element; it positions the row within the table.
      </Callout>
    </Box>
  );
}
