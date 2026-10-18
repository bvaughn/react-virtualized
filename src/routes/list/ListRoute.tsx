import {
  Block,
  Box,
  Callout,
  Code,
  Header,
  SectionHeader
} from "react-lib-tools";
import ListBasicJson from "../../../public/generated/examples/ListBasic.json";
import ListNoRowsJson from "../../../public/generated/examples/ListNoRows.json";
import { Link } from "../../components/Link";
import { ListBasic } from "./examples/ListBasic";
import { ListNoRows } from "./examples/ListNoRows";

export default function ListRoute() {
  return (
    <Box direction="column" gap={4}>
      <Header section="List" title="Rendering a list" />
      <div>
        <code>List</code> renders a windowed (or &quot;virtualized&quot;) list
        of rows, meaning that only the rows visible within the list (plus a few
        overscanned rows) are rendered. This keeps the number of DOM elements
        small, no matter how many rows the list contains.
      </div>
      <Block className="h-80">
        <ListBasic />
      </Block>
      <div>
        To render a list, specify its size (<code>width</code> and{" "}
        <code>height</code>), how many rows it contains (<code>rowCount</code>
        ), the height of each row (<code>rowHeight</code>), and a function that
        renders a row (<code>rowRenderer</code>; see{" "}
        <Link to="/list/rendering-rows">rendering rows</Link>). Rows are
        rendered through a function, rather than as children, for performance
        reasons. The example above uses{" "}
        <Link to="/guides/sizing-components">AutoSizer</Link> to fill the
        available space:
      </div>
      <Code html={ListBasicJson.html} />
      <div>
        <code>List</code> uses a <Link to="/grid">Grid</Link> internally to
        render its rows, and all props are relayed to that inner{" "}
        <code>Grid</code>. That means <code>List</code> also accepts{" "}
        <Link to="/grid/props">Grid props</Link> in addition to its own{" "}
        <Link to="/list/props">List props</Link>.
      </div>
      <Callout intent="primary">
        By default <code>List</code> renders 10 extra rows above and below the
        visible ones (<code>overscanRowCount</code>), which can help reduce
        flickering during scrolling on certain browsers and devices. See{" "}
        <Link to="/grid/overscan">overscan</Link> for an important note about
        this property.
      </Callout>
      <Callout intent="primary">
        The outer element of a list has the static class name{" "}
        <code>ReactVirtualized__List</code>; a custom <code>className</code>,{" "}
        <code>id</code>, and <code>style</code> can be specified too. See{" "}
        <Link to="/guides/customizing-styles">customizing styles</Link> for more
        information.
      </Callout>
      <SectionHeader>Empty lists</SectionHeader>
      <div>
        Use the <code>noRowsRenderer</code> prop to render placeholder content
        when <code>rowCount</code> is 0:
      </div>
      <Block className="h-20">
        <ListNoRows />
      </Block>
      <Code html={ListNoRowsJson.html} />
    </Box>
  );
}
