import { useState } from "react";
import { Block, Box, Callout, Code, Header, Input } from "react-lib-tools";
import MultiGridFixedRowsAndColumnsJson from "../../../public/generated/examples/MultiGridFixedRowsAndColumns.json";
import { Link } from "../../components/Link";
import { Example } from "./examples/MultiGridFixedRowsAndColumns";

export default function FixedRowsAndColumnsRoute() {
  const [fixedColumnCount, setFixedColumnCount] = useState("2");
  const [fixedRowCount, setFixedRowCount] = useState("1");

  return (
    <Box direction="column" gap={4}>
      <Header
        section="Grid"
        sourceCodePath="lib/components/MultiGrid/MultiGrid.tsx"
        title="Fixed rows and columns"
      />
      <div>
        <code>MultiGrid</code> decorates <Link to="/grid">Grid</Link> and adds
        fixed columns and/or rows. This is already possible using{" "}
        <Link to="/scroll-sync">ScrollSync</Link> and two or more{" "}
        <code>Grid</code>s, but <code>MultiGrid</code> reduces the boilerplate.
      </div>
      <Box direction="row" gap={4} wrap>
        <Box direction="row" gap={2} align="center">
          <label htmlFor="MultiGrid-fixedColumnCount">Fixed columns</label>
          <Input
            className="w-20"
            id="MultiGrid-fixedColumnCount"
            min={0}
            onChange={setFixedColumnCount}
            type="number"
            value={fixedColumnCount}
          />
        </Box>
        <Box direction="row" gap={2} align="center">
          <label htmlFor="MultiGrid-fixedRowCount">Fixed rows</label>
          <Input
            className="w-20"
            id="MultiGrid-fixedRowCount"
            min={0}
            onChange={setFixedRowCount}
            type="number"
            value={fixedRowCount}
          />
        </Box>
      </Box>
      <Block className="h-80">
        <Example
          fixedColumnCount={toCount(fixedColumnCount)}
          fixedRowCount={toCount(fixedRowCount)}
        />
      </Block>
      <Code html={MultiGridFixedRowsAndColumnsJson.html} />
      <div>
        <code>MultiGrid</code> accepts most of the{" "}
        <Link to="/grid/props">Grid props</Link>. The majority of them (e.g.{" "}
        <code>cellRenderer</code>) are relayed to all of the child{" "}
        <code>Grid</code>s, while some (e.g. <code>columnCount</code> and{" "}
        <code>rowCount</code>) are adjusted slightly to support fixed rows and
        columns. Row and column indices passed to <code>cellRenderer</code> (and
        to <code>columnWidth</code> and <code>rowHeight</code> functions) are
        always relative to the full grid, including the fixed rows and columns,
        and the <code>parent</code> passed to <code>cellRenderer</code> is the{" "}
        <code>MultiGrid</code> itself (so it can be passed to{" "}
        <code>CellMeasurer</code> as-is).
      </div>
      <div>
        A <code>MultiGrid</code> always scrolls itself, so (unlike{" "}
        <code>Grid</code>) it has no <code>scrollElement</code> prop and
        can&apos;t be <Link to="/window-scrolling">scrolled by the window</Link>
        .
      </div>
      <div>
        Each of the four inner <code>Grid</code>s (top-left, top-right,
        bottom-left, and bottom-right) can be styled separately using the{" "}
        <code>className*Grid</code> and <code>style*Grid</code> props listed
        (see <Link to="/grid/multi-grid-props">MultiGrid props</Link>).
      </div>
      <Callout intent="primary">
        Use <code>enableFixedColumnScroll</code> and{" "}
        <code>enableFixedRowScroll</code> to allow the user to scroll (e.g. with
        a mouse wheel) while the cursor is over the fixed column or row. The
        extra scrollbars this adds can be hidden with{" "}
        <code>hideBottomLeftGridScrollbar</code> and{" "}
        <code>hideTopRightGridScrollbar</code>.
      </Callout>
      <div>
        <code>MultiGrid</code> also works with{" "}
        <Link to="/cell-measurer">CellMeasurer</Link> to measure dynamic column
        widths or row heights.
      </div>
      <div>
        To scroll a <code>MultiGrid</code>, call its <code>scrollToCell</code>{" "}
        or <code>scrollToPosition</code>{" "}
        <Link to="/grid/multi-grid-methods">methods</Link> through a{" "}
        <code>ref</code>; the fixed rows and columns are kept in sync with the
        scrollable section.
      </div>
    </Box>
  );
}

function toCount(value: string) {
  const number = parseInt(value, 10);
  return isNaN(number) ? 0 : Math.max(0, Math.min(10, number));
}
