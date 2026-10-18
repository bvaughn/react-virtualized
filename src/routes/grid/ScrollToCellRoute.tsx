import { Block, Box, Callout, Code, Header } from "react-lib-tools";
import { AutoSizer } from "react-virtualized-auto-sizer";
import GridScrollToCellJson from "../../../public/generated/examples/GridScrollToCell.json";
import { Link } from "../../components/Link";
import { GridScrollToCell } from "./examples/GridScrollToCell";

export default function ScrollToCellRoute() {
  return (
    <Box direction="column" gap={4}>
      <Header section="Grid" title="Scrolling to a cell" />
      <div>
        The{" "}
        <Link to="/grid/methods#scrollToCell">
          <code>scrollToCell</code>
        </Link>{" "}
        method ensures that a row and/or column is visible, scrolling the grid
        if necessary. Call it through a <code>ref</code> to the grid. Enter a
        row and column index below and click &quot;Scroll&quot;:
      </div>
      <Block className="h-[320px]">
        <AutoSizer
          renderProp={({ width }) =>
            width !== undefined ? <GridScrollToCell width={width} /> : null
          }
        />
      </Block>
      <Code html={GridScrollToCellJson.html} />
      <div>
        By default (<code>&quot;auto&quot;</code>), the grid scrolls the least
        amount possible to make the cell fully visible. Use the{" "}
        <code>align</code> parameter to align the cell to the{" "}
        <code>&quot;start&quot;</code> (top/left),{" "}
        <code>&quot;center&quot;</code>, or <code>&quot;end&quot;</code>{" "}
        (bottom/right) of the grid instead. Pass only a <code>rowIndex</code>{" "}
        (or only a <code>columnIndex</code>) to scroll in one direction.
      </div>
      <div>
        <code>scrollToCell</code> is a one-time scroll: the grid doesn&apos;t
        remember the cell, so it isn&apos;t kept in view if the grid&apos;s
        size, its cell sizes or its row and column counts change afterwards. To
        scroll to a cell that is being added, call <code>scrollToCell</code>{" "}
        once the grid has rendered it (e.g. in an effect). Cells that
        haven&apos;t been measured yet (e.g. by{" "}
        <Link to="/cell-measurer">CellMeasurer</Link>) are positioned using
        their estimated sizes. Use{" "}
        <Link to="/grid/methods#scrollToPosition">
          <code>scrollToPosition</code>
        </Link>{" "}
        to scroll to specific offsets instead.
      </div>
      <Callout intent="primary">
        In version 10, the <code>scrollToRow</code>, <code>scrollToColumn</code>
        , <code>scrollToAlignment</code>, <code>scrollTop</code> and{" "}
        <code>scrollLeft</code> props were replaced by the{" "}
        <code>scrollToCell</code> and <code>scrollToPosition</code>{" "}
        <Link to="/grid/methods">methods</Link>. The <code>autoHeight</code>,{" "}
        <code>autoWidth</code> and <code>isScrolling</code> props were removed
        as well: to scroll a <code>Grid</code> with the window, set its{" "}
        <Link to="/window-scrolling">
          <code>scrollElement</code>
        </Link>{" "}
        prop to <code>&quot;window&quot;</code>, in which case{" "}
        <code>scrollToCell</code> and <code>scrollToPosition</code> scroll the
        window (vertically).
      </Callout>
    </Box>
  );
}
