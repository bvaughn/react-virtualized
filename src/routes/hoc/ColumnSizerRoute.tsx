import { useState } from "react";
import {
  Block,
  Box,
  Callout,
  Code,
  ComponentPropsSection,
  Header,
  Input,
  type ComponentMetadata
} from "react-lib-tools";
import { AutoSizer } from "react-virtualized-auto-sizer";
import json from "../../../public/generated/docs/ColumnSizer.json";
import ColumnSizerGridJson from "../../../public/generated/examples/ColumnSizerGrid.json";
import { Link } from "../../components/Link";
import { ColumnSizerGrid } from "./examples/ColumnSizerGrid";

const props = Object.values((json as ComponentMetadata).props);

function parseNumber(text: string) {
  const value = parseInt(text, 10);
  return isNaN(value) ? undefined : value;
}

export default function ColumnSizerRoute() {
  const [columnCountText, setColumnCountText] = useState("10");
  const [columnMinWidthText, setColumnMinWidthText] = useState("75");
  const [columnMaxWidthText, setColumnMaxWidthText] = useState("100");

  const columnCount = Math.max(
    1,
    Math.min(100, parseNumber(columnCountText) ?? 1)
  );
  const columnMinWidth = parseNumber(columnMinWidthText);
  const columnMaxWidth = parseNumber(columnMaxWidthText);

  return (
    <Box direction="column" gap={4}>
      <Header section="Higher-order components" title="ColumnSizer" />
      <div>
        <code>ColumnSizer</code> decorates a <Link to="/grid">Grid</Link> and
        calculates the width of its columns based on the available width, the
        number of columns, and optional minimum and maximum column widths.
        Change the values below (or resize the window) to see the columns
        resize:
      </div>
      <Box direction="row" gap={4} wrap>
        <label className="flex flex-1 flex-col gap-1 text-sm">
          Number of columns
          <Input
            min={1}
            onChange={setColumnCountText}
            type="number"
            value={columnCountText}
          />
        </label>
        <label className="flex flex-1 flex-col gap-1 text-sm">
          Min column width
          <Input
            min={1}
            onChange={setColumnMinWidthText}
            type="number"
            value={columnMinWidthText}
          />
        </label>
        <label className="flex flex-1 flex-col gap-1 text-sm">
          Max column width
          <Input
            min={1}
            onChange={setColumnMaxWidthText}
            type="number"
            value={columnMaxWidthText}
          />
        </label>
      </Box>
      <Block className="h-[174px]">
        <AutoSizer
          renderProp={({ width }) =>
            width !== undefined ? (
              <ColumnSizerGrid
                columnCount={columnCount}
                columnMaxWidth={columnMaxWidth}
                columnMinWidth={columnMinWidth}
                width={width}
              />
            ) : null
          }
        />
      </Block>
      <div>
        <code>ColumnSizer</code> uses a render function as its children. It is
        passed the following parameters:
      </div>
      <ul className="list-disc pl-6">
        <li>
          <code>columnWidth</code>: the calculated column width; pass it to the{" "}
          <code>Grid</code>&apos;s <code>columnWidth</code> prop
        </li>
        <li>
          <code>registerChild</code>: pass it to the <code>Grid</code>&apos;s{" "}
          <code>ref</code> prop, so that column sizes can be recomputed when the{" "}
          <code>ColumnSizer</code> props change
        </li>
        <li>
          <code>adjustedWidth</code>: the lesser of the overall width or the
          width of all columns; use it as the <code>Grid</code>&apos;s{" "}
          <code>width</code> to make the grid shrink to fit sparse content (as
          in the example above)
        </li>
      </ul>
      <Code html={ColumnSizerGridJson.html} />
      <Callout intent="primary">
        A <code>getColumnWidth</code> function is also passed to the children
        function. It is a legacy parameter; use <code>columnWidth</code>{" "}
        instead.
      </Callout>
      <div>
        <code>ColumnSizer</code> needs to know the width of the grid; it is
        typically used together with{" "}
        <Link to="/guides/sizing-components">AutoSizer</Link>.
      </div>
      <ComponentPropsSection
        header="Required props"
        props={props.filter((prop) => prop.required)}
      />
      <ComponentPropsSection
        header="Optional props"
        props={props.filter((prop) => !prop.required)}
      />
    </Box>
  );
}
