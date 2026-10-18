import { useState } from "react";
import {
  Block,
  Box,
  Callout,
  Code,
  Header,
  type Option,
  Select
} from "react-lib-tools";
import MasonryExampleJson from "../../../public/generated/examples/MasonryExample.json";
import { Link } from "../../components/Link";
import { LIST } from "../../utils/data";
import { MasonryExample } from "./examples/MasonryExample";

const COLUMN_WIDTH_OPTIONS: Option<string>[] = [
  { label: "150px columns", value: "150" },
  { label: "200px columns", value: "200" },
  { label: "250px columns", value: "250" }
];

const GUTTER_SIZE_OPTIONS: Option<string>[] = [
  { label: "No gutter", value: "0" },
  { label: "5px gutter", value: "5" },
  { label: "10px gutter", value: "10" },
  { label: "20px gutter", value: "20" }
];

export default function MasonryRoute() {
  const [columnWidth, setColumnWidth] = useState(COLUMN_WIDTH_OPTIONS[1]);
  const [gutterSize, setGutterSize] = useState(GUTTER_SIZE_OPTIONS[2]);

  return (
    <Box direction="column" gap={4}>
      <Header
        section="Masonry"
        sourceCodePath="lib/components/Masonry/Masonry.tsx"
        title="Rendering a masonry layout"
      />
      <div>
        <code>Masonry</code> efficiently displays dynamically-sized,
        user-positioned cells using windowing techniques. Cells are measured
        just-in-time and laid out as the user scrolls. Sizes are cached so that
        resizing (and re-flowing) the layout is fast and does not require
        re-measuring.
      </div>
      <div>
        Cell positions are controlled by an injected{" "}
        <Link to="/masonry/cell-positioners">
          <code>cellPositioner</code>
        </Link>{" "}
        prop. Windowing is vertical; <code>Masonry</code> does not support
        horizontal scrolling.
      </div>
      <Box direction="row" gap={4} align="center" wrap>
        <Select
          className="w-44"
          onChange={setColumnWidth}
          options={COLUMN_WIDTH_OPTIONS}
          value={columnWidth}
        />
        <Select
          className="w-44"
          onChange={setGutterSize}
          options={GUTTER_SIZE_OPTIONS}
          value={gutterSize}
        />
      </Box>
      <Block className="h-120">
        <MasonryExample
          columnWidth={parseInt(columnWidth.value, 10)}
          gutterSize={parseInt(gutterSize.value, 10)}
          items={LIST}
        />
      </Block>
      <div>
        A <code>Masonry</code> requires a{" "}
        <Link to="/cell-measurer">
          <code>CellMeasurerCache</code>
        </Link>{" "}
        (to measure and cache the size of each cell), a{" "}
        <Link to="/masonry/cell-positioners">cell positioner</Link> (to lay out
        the measured cells), and a <code>cellRenderer</code> that wraps each
        cell in a <code>CellMeasurer</code>:
      </div>
      <Code html={MasonryExampleJson.html} />
      <div>
        The <code>style</code> passed to <code>cellRenderer</code> positions the
        cell, so it must be passed through to the rendered element. The{" "}
        <code>parent</code> parameter is the <code>Masonry</code>&apos;s{" "}
        <Link to="/masonry/methods">imperative handle</Link> and should be
        passed to <code>CellMeasurer</code>. See the{" "}
        <Link to="/masonry/props">props page</Link> for the full list of
        supported props, and{" "}
        <Link to="/masonry/measuring-and-layout">measuring and layout</Link> for
        how (and with which constraints) cells are measured and positioned.
      </div>
      <Callout intent="primary">
        <code>Masonry</code> renders the following static class names, which can
        be used for <Link to="/guides/customizing-styles">styling</Link>:
        <ul className="list-disc pl-6">
          <li>
            <code>ReactVirtualized__Masonry</code>: main (outer) element
          </li>
          <li>
            <code>ReactVirtualized__Masonry__innerScrollContainer</code>: inner
            scrollable area
          </li>
        </ul>
      </Callout>
    </Box>
  );
}
