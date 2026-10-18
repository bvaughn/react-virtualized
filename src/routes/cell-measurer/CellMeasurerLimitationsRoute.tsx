import { Box, Callout, Header } from "react-lib-tools";
import { Link } from "../../components/Link";

export default function CellMeasurerLimitationsRoute() {
  return (
    <Box direction="column" gap={4}>
      <Header section="Measuring content" title="Limitations & performance" />
      <div>
        Measuring a column&apos;s width requires measuring all of the rows in
        order to determine the widest occurrence of that column. The same is
        true in reverse for measuring a row&apos;s height. For this reason it
        may not be a good idea to use <code>CellMeasurer</code> for{" "}
        <code>Grid</code>s containing a large number of both columns{" "}
        <em>and</em> rows. (This is also why a{" "}
        <Link to="/cell-measurer/cache">CellMeasurerCache</Link> should be
        configured with either <code>fixedWidth</code> or{" "}
        <code>fixedHeight</code>.)
      </div>
      <Callout intent="warning">
        Since cells are measured one at a time as they are rendered, performance
        can suffer if a user skips many rows (or columns) at once, by dragging
        the scrollbar or by calling a method like <code>scrollToCell</code> or{" "}
        <code>scrollToRow</code>. There is (unfortunately) no workaround for
        this limitation at the moment.
      </Callout>
      <div>
        If sizes can be determined ahead of time (e.g. from the data), it&apos;s
        more efficient to pass a <code>rowHeight</code> or{" "}
        <code>columnWidth</code> function than to measure cells.
      </div>
    </Box>
  );
}
