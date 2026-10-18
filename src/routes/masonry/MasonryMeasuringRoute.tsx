import { Box, Callout, Header, SectionHeader } from "react-lib-tools";
import { Link } from "../../components/Link";

export default function MasonryMeasuringRoute() {
  return (
    <Box direction="column" gap={4}>
      <Header section="Masonry" title="Measuring and layout" />
      <div>Rendering occurs in two phases:</div>
      <ol className="list-decimal pl-6 flex flex-col gap-2">
        <li>
          <strong>Measurement</strong>: Estimated cell sizes (the{" "}
          <code>defaultHeight</code> and <code>defaultWidth</code> of the{" "}
          <code>cellMeasurerCache</code>) are used to decide how many cells to
          measure in a batch. The batch size is chosen using a fast, naive
          layout algorithm that stacks cells in order until the viewport has
          been filled. After measurement is complete, <code>Masonry</code>{" "}
          evaluates the positioned cells to determine whether another
          measurement pass is required (eg if actual cell sizes were smaller
          than the estimated sizes). All measurements are permanently cached
          (keyed by <code>keyMapper</code>) for performance purposes.
        </li>
        <li>
          <strong>Layout</strong>: The external{" "}
          <Link to="/masonry/cell-positioners">
            <code>cellPositioner</code>
          </Link>{" "}
          is used to position cells. At this point the positioner has access to
          cached size measurements for all of the cells it is asked to position.
          The positions it returns are cached by <code>Masonry</code> for fast
          access later.
        </li>
      </ol>
      <div>
        The measurement phase is repeated if the user scrolls beyond the bounds
        of the current layout. If the layout is invalidated (eg due to a
        resize), cached positions can be cleared using{" "}
        <Link to="/masonry/methods#recomputeCellPositions">
          <code>recomputeCellPositions()</code>
        </Link>{" "}
        or{" "}
        <Link to="/masonry/methods#clearCellPositions">
          <code>clearCellPositions()</code>
        </Link>
        .
      </div>
      <Callout intent="primary">
        By default, measurements and positions are cached by index. If cells can
        be re-ordered (or inserted), provide a <code>keyMapper</code> that maps
        an index to a unique id, and use the same mapping for the{" "}
        <code>CellMeasurerCache</code>&apos;s <code>keyMapper</code>, so that
        cached measurements aren&apos;t associated with the wrong cells.
      </Callout>
      <SectionHeader>Layout constraints</SectionHeader>
      <ul className="list-disc pl-6">
        <li>Multi-column layouts are supported.</li>
        <li>Each cell can have a unique, lazily-measured height.</li>
        <li>
          Cells may not span multiple columns: the width of all cells in a
          column should be equal (and must not exceed the column&apos;s width),
          and the left position of all cells within a column must align.
        </li>
      </ul>
      <Callout intent="warning">
        Cell measurements must be synchronous. A cell&apos;s size impacts the
        layout, and asynchronous measurements would require frequent layout
        invalidation. The asynchronous <code>measure</code> function passed to{" "}
        <code>CellMeasurer</code>&apos;s render callback is not supported by{" "}
        <code>Masonry</code>. (See <Link to="/masonry/images">images</Link> for
        how to handle content such as images whose size isn&apos;t known up
        front.)
      </Callout>
      <SectionHeader>Animation constraints</SectionHeader>
      <div>
        Simple animations are supported (eg translating or sliding cells into
        place when they are first revealed). More complex animations are not (eg
        cells flying from one position to another on resize).
      </div>
    </Box>
  );
}
