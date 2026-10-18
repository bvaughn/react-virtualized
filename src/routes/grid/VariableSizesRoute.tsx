import { useState } from "react";
import { Block, Box, Callout, Checkbox, Code, Header } from "react-lib-tools";
import { AutoSizer } from "react-virtualized-auto-sizer";
import GridVariableSizesJson from "../../../public/generated/examples/GridVariableSizes.json";
import { Link } from "../../components/Link";
import { GridVariableSizes } from "./examples/GridVariableSizes";

export default function VariableSizesRoute() {
  const [useDynamicRowHeight, setUseDynamicRowHeight] = useState(true);

  return (
    <Box direction="column" gap={4}>
      <Header section="Grid" title="Variable row and column sizes" />
      <div>
        Row heights and column widths must be known ahead of time, but they
        don&apos;t all need to be the same. Instead of a number,{" "}
        <code>rowHeight</code> and <code>columnWidth</code> can be functions
        that return the size of a row or column given its index.
      </div>
      <div>
        The example below renders 1,000 rows and 1,000 columns with variable
        column widths and (optionally) variable row heights:
      </div>
      <Checkbox checked={useDynamicRowHeight} onChange={setUseDynamicRowHeight}>
        Use variable row heights
      </Checkbox>
      <Block className="h-[314px]">
        <AutoSizer
          renderProp={({ width }) =>
            width !== undefined ? (
              <GridVariableSizes
                useDynamicRowHeight={useDynamicRowHeight}
                width={width}
              />
            ) : null
          }
        />
      </Block>
      <Code html={GridVariableSizesJson.html} />
      <div>
        When sizes are functions, also specify <code>estimatedRowSize</code>{" "}
        and/or <code>estimatedColumnSize</code>. Cells are only measured as they
        are rendered, so these estimates are used to calculate the total size of
        the grid (and the size of its scrollbars) before all of its cells have
        been measured, which makes scrolling more consistent.
      </div>
      <Callout intent="primary">
        <code>Grid</code> has no way of knowing when the data behind a{" "}
        <code>rowHeight</code> or <code>columnWidth</code> function changes. If
        sizes change, call the{" "}
        <Link to="/grid/methods#recomputeGridSize">
          <code>recomputeGridSize</code>
        </Link>{" "}
        method. For sizes that depend on the rendered content, see{" "}
        <Link to="/cell-measurer">CellMeasurer</Link>; to calculate column
        widths from the available width, see{" "}
        <Link to="/column-sizer">ColumnSizer</Link>.
      </Callout>
    </Box>
  );
}
