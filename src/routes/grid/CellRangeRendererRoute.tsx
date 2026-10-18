import {
  Block,
  Box,
  Callout,
  Code,
  Header,
  SectionHeader
} from "react-lib-tools";
import { AutoSizer } from "react-virtualized-auto-sizer";
import GridCellRangeRendererJson from "../../../public/generated/examples/GridCellRangeRenderer.json";
import { Link } from "../../components/Link";
import { GridCellRangeRenderer } from "./examples/GridCellRangeRenderer";

export default function CellRangeRendererRoute() {
  return (
    <Box direction="column" gap={4}>
      <Header section="Grid" title="Custom cell range rendering" />
      <div>
        The <code>cellRangeRenderer</code> prop is an advanced property,
        responsible for rendering the group of cells within a range of row and
        column indices. It is useful for situations where the grid requires
        additional, overlaid UI, such as a Gantt chart or a calendar
        application.
      </div>
      <Callout intent="primary">
        Many use cases can be solved more easily using the <code>onScroll</code>{" "}
        callback or the <Link to="/scroll-sync">ScrollSync</Link> component.
      </Callout>
      <div>
        If you do want to override <code>cellRangeRenderer</code>, the easiest
        way is to decorate the <code>defaultCellRangeRenderer</code> function
        (exported by the library) and add your own elements to the array it
        returns. Elements are positioned within the grid&apos;s inner scrollable
        container:
      </div>
      <Block className="h-[264px]">
        <AutoSizer
          renderProp={({ width }) =>
            width !== undefined ? <GridCellRangeRenderer width={width} /> : null
          }
        />
      </Block>
      <Code html={GridCellRangeRendererJson.html} />
      <SectionHeader>Parameters</SectionHeader>
      <div>
        The <code>cellRangeRenderer</code> function receives the following
        parameters. If you require greater customization, you may want to fork{" "}
        <code>defaultCellRangeRenderer</code> and use them to render cells
        yourself.
      </div>
      <ul className="list-disc pl-6">
        <li>
          <code>cellCache</code>, <code>styleCache</code>: temporary cell and
          style caches used while scrolling
        </li>
        <li>
          <code>cellRenderer</code>: the <code>cellRenderer</code> prop supplied
          to the grid
        </li>
        <li>
          <code>columnStartIndex</code>, <code>columnStopIndex</code>,{" "}
          <code>rowStartIndex</code>, <code>rowStopIndex</code>: indices of the
          first and last columns and rows (inclusive) to render, including
          overscanned cells
        </li>
        <li>
          <code>visibleColumnIndices</code>, <code>visibleRowIndices</code>: the
          range of visible (not overscanned) columns and rows
        </li>
        <li>
          <code>columnSizeAndPositionManager</code>,{" "}
          <code>rowSizeAndPositionManager</code>: their{" "}
          <code>getSizeAndPositionOfCell(index)</code> method returns the{" "}
          <code>offset</code> (left or top) and <code>size</code> (width or
          height) of a column or row
        </li>
        <li>
          <code>horizontalOffsetAdjustment</code>,{" "}
          <code>verticalOffsetAdjustment</code>: pixel offsets to add to cell
          positions. Browsers limit the size of an element, so for very large
          grids, cell offsets are scaled down and cells are shifted as the user
          scrolls.
        </li>
        <li>
          <code>isScrolling</code>: the grid is currently being scrolled;{" "}
          <code>isScrollingOptOut</code>: the value of the grid prop
        </li>
        <li>
          <code>scrollLeft</code>, <code>scrollTop</code>: the current scroll
          offsets of the grid
        </li>
        <li>
          <code>deferredMeasurementCache</code>: the{" "}
          <Link to="/cell-measurer">CellMeasurer</Link> cache, if one was passed
          to the grid
        </li>
        <li>
          <code>parent</code>: the grid instance (or the component that wraps
          it)
        </li>
      </ul>
      <Callout intent="warning">
        Each rendered element needs a unique <code>key</code>. Cell positions
        must include the offset adjustments; otherwise cells will be
        mispositioned in very large grids.
      </Callout>
    </Box>
  );
}
