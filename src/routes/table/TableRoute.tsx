import {
  Block,
  Box,
  Callout,
  Code,
  Header,
  SectionHeader
} from "react-lib-tools";
import TableBasicJson from "../../../public/generated/examples/TableBasic.json";
import { Link } from "../../components/Link";
import { TableBasic } from "./examples/TableBasic";

export default function TableRoute() {
  return (
    <Box direction="column" gap={4}>
      <Header section="Table" title="Rendering a table" />
      <div>
        <code>Table</code> renders tabular data with a fixed header and windowed
        rows, for improved performance with large data sets. Its layout is
        created with flexboxes, and it uses a <Link to="/grid">Grid</Link>{" "}
        internally to render only the rows that are visible.
      </div>
      <Block className="p-0!" data-focus-within="bold">
        <div>
          <TableBasic />
        </div>
      </Block>
      <div>
        A table requires an explicit <code>width</code> and <code>height</code>,
        the height of its header (<code>headerHeight</code>) and rows (
        <code>rowHeight</code>), the number of rows (<code>rowCount</code>), and
        a <code>rowGetter</code> function that returns the data for a given row
        index. Its children are one or more <code>Column</code>s, each
        describing a column's header and the row attribute (<code>dataKey</code>
        ) its cells display.
      </div>
      <Code html={TableBasicJson.html} />
      <Callout intent="primary">
        <Box direction="column" gap={2}>
          <div>
            The default table styles are in{" "}
            <code>react-virtualized/styles.css</code>; they only need to be
            imported once. The{" "}
            <Link to="/guides/customizing-styles">customizing styles</Link>{" "}
            guide explains how to override them.
          </div>
          <div>
            The example above uses{" "}
            <Link to="/guides/sizing-components">
              <code>AutoSizer</code>
            </Link>{" "}
            to fill the available width.
          </div>
        </Box>
      </Callout>
      <Callout intent="warning">
        <code>Table</code> content can scroll vertically, but it is not meant to
        scroll horizontally. Columns shrink and grow to fit the table's{" "}
        <code>width</code>; consider using a{" "}
        <Link to="/grid/fixed-rows-and-columns">
          <code>MultiGrid</code>
        </Link>{" "}
        for data with many columns.
      </Callout>
      <SectionHeader>Column sizes</SectionHeader>
      <div>
        A column's <code>width</code> is its flex basis. Columns can grow (
        <code>flexGrow</code>, defaults to 0) to fill unused space, or shrink (
        <code>flexShrink</code>, defaults to 1) when there is not enough room,
        within the bounds of <code>minWidth</code> and <code>maxWidth</code>.
        See the <Link to="/table/column-props">Column props</Link> for more.
      </div>
      <SectionHeader>Column components</SectionHeader>
      <div>
        <code>Column</code> doesn&apos;t render anything itself:{" "}
        <code>Table</code> reads the props of its children (applying the{" "}
        <code>Column</code> defaults, also exported as{" "}
        <code>defaultColumnProps</code>) to render headers and cells. Falsy
        children are ignored, so columns can be shown or hidden conditionally.
      </div>
      <div>
        Because the defaults are applied to any child element, a component that
        wraps <code>Column</code> can be used as a column as well, e.g.{" "}
        <code>
          {"const NameColumn = (props: ColumnProps) => <Column {...props} />"}
        </code>{" "}
        rendered as{" "}
        <code>{'<NameColumn dataKey="name" label="Name" width={120} />'}</code>.
        (The wrapper itself is never rendered, so it should only forward or
        compute props.)
      </div>
      <Callout intent="warning">
        In version 10, <code>Column</code> is a function component; subclassing{" "}
        <code>Column</code> (<code>class MyColumn extends Column</code>) is no
        longer supported. Use a wrapper component instead.
      </Callout>
      <div>
        Next, learn how to style rows and use{" "}
        <Link to="/table/row-styles">dynamic row heights</Link>, customize{" "}
        <Link to="/table/cell-renderers">cells and headers</Link> or{" "}
        <Link to="/table/row-renderers">entire rows</Link>, or{" "}
        <Link to="/table/sorting">sort</Link> a table.
      </div>
    </Box>
  );
}
