import {
  Block,
  Box,
  Callout,
  Code,
  Header,
  SectionHeader
} from "react-lib-tools";
import GridBasicJson from "../../../public/generated/examples/GridBasic.json";
import GridCellRendererJson from "../../../public/generated/examples/GridCellRenderer.json";
import { Link } from "../../components/Link";
import { GridBasic } from "./examples/GridBasic";

export default function GridRoute() {
  return (
    <Box direction="column" gap={4}>
      <Header section="Grid" title="Rendering a grid" />
      <div>
        <code>Grid</code> renders tabular data with virtualization along both
        the vertical and horizontal axes. Only the cells needed to fill the grid
        (based on its current horizontal and vertical scroll position) are
        rendered.
      </div>
      <Block className="h-80">
        <GridBasic />
      </Block>
      <div>
        To render a grid, specify its size (<code>width</code> and{" "}
        <code>height</code>), the number of rows and columns (
        <code>rowCount</code> and <code>columnCount</code>), the size of each (
        <code>rowHeight</code> and <code>columnWidth</code>), and a function
        that renders a cell (<code>cellRenderer</code>). The example above uses{" "}
        <Link to="/guides/sizing-components">AutoSizer</Link> to fill the
        available space:
      </div>
      <Code html={GridBasicJson.html} />
      <div>
        <code>Grid</code> is also the building block for the other components in
        this library; <Link to="/list">List</Link>,{" "}
        <Link to="/table">Table</Link>, and{" "}
        <Link to="/grid/fixed-rows-and-columns">MultiGrid</Link> all render a{" "}
        <code>Grid</code> internally. See{" "}
        <Link to="/grid/props">Grid props</Link> and{" "}
        <Link to="/grid/methods">Grid methods</Link> for the full API.
      </div>
      <SectionHeader>Rendering cells</SectionHeader>
      <div>
        The <code>cellRenderer</code> function is responsible for rendering a
        single cell, given its row and column index. It receives the following
        parameters:
      </div>
      <Code html={GridCellRendererJson.html} />
      <Callout intent="warning">
        The <code>style</code> parameter must be applied to the rendered cell;
        it specifies how the cell is sized and positioned, and the grid depends
        on it to scroll correctly. Don&apos;t modify the <code>style</code>{" "}
        object (it is cached and re-used by the grid); create a new object if
        you need to add style properties.
      </Callout>
      <div>
        Rows and columns don&apos;t all need to be the same size; see{" "}
        <Link to="/grid/variable-sizes">variable sizes</Link>.
      </div>
      <Callout intent="primary">
        <Box direction="column" gap={2}>
          <div>
            <code>Grid</code> supports the following static class names, in
            addition to the <code>className</code>, <code>id</code>, and{" "}
            <code>style</code> props (and <code>containerStyle</code> for the
            inner container):
          </div>
          <ul className="list-disc pl-6">
            <li>
              <code>ReactVirtualized__Grid</code>: main (outer) element
            </li>
            <li>
              <code>ReactVirtualized__Grid__innerScrollContainer</code>: inner
              scrollable area
            </li>
          </ul>
          <div>
            See <Link to="/guides/customizing-styles">customizing styles</Link>{" "}
            for more information.
          </div>
        </Box>
      </Callout>
    </Box>
  );
}
