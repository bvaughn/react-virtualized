import {
  Box,
  Callout,
  Code,
  ImperativeHandle,
  SectionHeader,
  type ImperativeHandleMetadata
} from "react-lib-tools";
import json from "../../../public/generated/docs/MasonryImperativeAPI.json";
import MasonryCellPositionerResetJson from "../../../public/generated/examples/MasonryCellPositionerReset.json";
import { Link } from "../../components/Link";

export default function MasonryMethodsRoute() {
  return (
    <Box direction="column" gap={4}>
      <ImperativeHandle
        json={{
          ...(json as ImperativeHandleMetadata),
          name: "Masonry methods"
        }}
        section="Masonry"
      />
      <SectionHeader>Usage</SectionHeader>
      <div>
        <code>Masonry</code> exposes these methods through an imperative handle,
        which can be accessed using a ref (eg{" "}
        <code>useRef&lt;MasonryImperativeAPI&gt;(null)</code>). The cell
        positioning methods are typically called after updating the{" "}
        <Link to="/masonry/cell-positioners">cell positioner</Link>, eg when the
        container is resized:
      </div>
      <Code html={MasonryCellPositionerResetJson.html} />
      <Callout intent="warning">
        <div>
          <code>recomputeCellPositions()</code> synchronously re-positions every
          cell that has already been measured, using cached measurements. Use it
          when the layout changes but cell sizes don&apos;t (eg the number of
          columns or the space between them).
        </div>
        <div className="mt-2">
          <code>clearCellPositions()</code> discards cached positions; cells are
          positioned again only as they are measured. If cell sizes have changed
          too (eg the column width changed, so text wraps differently), clear
          the <code>CellMeasurerCache</code> (<code>cache.clearAll()</code>)
          before calling it, otherwise cells that were already measured
          won&apos;t be re-positioned.
        </div>
      </Callout>
      <div>
        <code>invalidateCellSizeAfterRender</code> and{" "}
        <code>recomputeGridSize</code> are called by{" "}
        <Link to="/cell-measurer">
          <code>CellMeasurer</code>
        </Link>{" "}
        (through the <code>parent</code> passed to <code>cellRenderer</code>,
        which is this handle) and by{" "}
        <Link to="/infinite-loader">
          <code>InfiniteLoader</code>
        </Link>{" "}
        (to re-render cells once they have loaded); they don&apos;t need to be
        called directly.
      </div>
    </Box>
  );
}
