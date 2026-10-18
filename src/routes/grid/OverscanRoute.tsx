import { useCallback, useState } from "react";
import {
  Block,
  Box,
  Callout,
  Code,
  ExternalLink,
  Header,
  Input,
  SectionHeader,
  Select,
  type Option
} from "react-lib-tools";
import {
  accessibilityOverscanIndicesGetter,
  defaultOverscanIndicesGetter,
  type OverscanIndicesGetter,
  type RenderedSection
} from "react-virtualized";
import { AutoSizer } from "react-virtualized-auto-sizer";
import GridOverscanIndicesGetterJson from "../../../public/generated/examples/GridOverscanIndicesGetter.json";
import OverscanDemoJson from "../../../public/generated/examples/OverscanDemo.json";
import { Link } from "../../components/Link";
import { overscanIndicesGetter as symmetricOverscanIndicesGetter } from "./examples/GridOverscanIndicesGetter";
import { OverscanDemo } from "./examples/OverscanDemo";

type GetterName = "accessibility" | "default" | "symmetric";

const GETTER_OPTIONS: Option<GetterName>[] = [
  { label: "defaultOverscanIndicesGetter", value: "default" },
  {
    label: "accessibilityOverscanIndicesGetter",
    value: "accessibility"
  },
  { label: "Custom (both directions)", value: "symmetric" }
];

const GETTERS: Record<GetterName, OverscanIndicesGetter> = {
  accessibility: accessibilityOverscanIndicesGetter,
  default: defaultOverscanIndicesGetter,
  symmetric: symmetricOverscanIndicesGetter
};

export default function OverscanRoute() {
  const [getter, setGetter] = useState<Option<GetterName>>(GETTER_OPTIONS[0]);
  const [overscanText, setOverscanText] = useState("10");
  const [section, setSection] = useState<RenderedSection | null>(null);

  const parsed = parseInt(overscanText, 10);
  const overscanRowCount = isNaN(parsed) ? 0 : Math.max(0, parsed);

  const onSectionRendered = useCallback(
    (section: RenderedSection) => setSection(section),
    []
  );

  return (
    <Box direction="column" gap={4}>
      <Header section="Grid" title="Overscan" />
      <div>
        Virtualized components only render the rows and columns that are
        visible. &quot;Overscanning&quot; means rendering a few additional rows
        or columns just outside of the visible area, so that they are already in
        place when the user scrolls to them. This reduces the chance of a user
        scrolling faster than virtualized content can be rendered, which would
        briefly show empty space (or cause flickering on certain browsers and
        devices). See{" "}
        <ExternalLink href="https://bvaughn.github.io/forward-js-2017/#/23/1">
          this slide
        </ExternalLink>{" "}
        for a visual example of why overscanning exists.
      </div>
      <div>
        <Link to="/grid">Grid</Link> (and the components built on top of it,
        like <Link to="/list">List</Link> and <Link to="/table">Table</Link>)
        supports two overscan props:
      </div>
      <ul className="list-disc pl-6">
        <li>
          <code>overscanRowCount</code>: the number of rows to render
          above/below the visible rows; defaults to 10
        </li>
        <li>
          <code>overscanColumnCount</code>: the number of columns to render
          before/after the visible columns; defaults to 0
        </li>
      </ul>
      <div>
        By default, extra cells are only rendered in the direction the user is
        scrolling (e.g. below the visible rows when scrolling down), since that
        is where content will be needed next. Scroll the grid below to see the
        range of rendered rows change:
      </div>
      <Box direction="row" gap={4} wrap>
        <Input
          className="flex-1"
          min={0}
          onChange={setOverscanText}
          placeholder="overscanRowCount"
          type="number"
          value={overscanText}
        />
        <Select
          className="flex-1"
          onChange={setGetter}
          options={GETTER_OPTIONS}
          value={getter}
        />
      </Box>
      <Block className="h-[214px]">
        <AutoSizer
          renderProp={({ width }) =>
            width !== undefined ? (
              <OverscanDemo
                onSectionRendered={onSectionRendered}
                overscanIndicesGetter={GETTERS[getter.value]}
                overscanRowCount={overscanRowCount}
                width={width}
              />
            ) : null
          }
        />
      </Block>
      {section && (
        // Rendered after the grid reports its section, so whether a crawl sees it is timing-dependent
        <div className="text-sm" data-search-ignore>
          Visible rows:{" "}
          <strong>
            {section.rowStartIndex}–{section.rowStopIndex}
          </strong>
          , rendered rows:{" "}
          <strong>
            {section.rowOverscanStartIndex}–{section.rowOverscanStopIndex}
          </strong>{" "}
          (
          {section.rowStartIndex -
            section.rowOverscanStartIndex +
            section.rowOverscanStopIndex -
            section.rowStopIndex}{" "}
          overscanned)
        </div>
      )}
      <Code html={OverscanDemoJson.html} />
      <SectionHeader>Choosing a value</SectionHeader>
      <div>
        Overscanning has performance implications: the higher the value, the
        more cells need to be rendered in reaction to each scroll event. (See{" "}
        <ExternalLink href="https://bvaughn.github.io/forward-js-2017/#/12/4">
          this slide
        </ExternalLink>{" "}
        for a visual example of how windowing works.)
      </div>
      <Callout intent="warning">
        Setting an overscan value too high will erase the performance gains
        achieved by virtualization. Use the default value (10 rows) as a
        starting point and lower it if possible; aim for the lowest value that
        still generally avoids empty space appearing during normal scrolling.
      </Callout>
      <div>
        The same advice applies to <code>overscanColumnCount</code>.
      </div>
      <div>Consider tuning these values when:</div>
      <ul className="list-disc pl-6">
        <li>
          Cells are expensive to render: lower the overscan count so that less
          work is done per scroll event (and consider rendering a light-weight
          placeholder using the <code>isScrolling</code> parameter).
        </li>
        <li>
          Cells are cheap to render but blank space appears while scrolling
          quickly: raise the overscan count a little.
        </li>
        <li>
          A grid scrolls horizontally: <code>overscanColumnCount</code> defaults
          to 0, so a small value may help with horizontal scrolling.
        </li>
      </ul>
      <SectionHeader>Custom overscan behavior</SectionHeader>
      <div>
        Which cells are overscanned is determined by the{" "}
        <code>overscanIndicesGetter</code> prop, an advanced property that
        calculates the range of cells to render before and after the visible
        range, along one axis at a time (it is called once for rows and once for
        columns).
      </div>
      <div>
        By default (<code>defaultOverscanIndicesGetter</code>), cells are only
        overscanned in the direction the user is scrolling, which is where
        content will be needed next. The library also exports an{" "}
        <code>accessibilityOverscanIndicesGetter</code>, which always renders at
        least one extra cell in both directions. This is necessary to support
        keyboard navigation (<kbd>Tab</kbd> / <kbd>Shift+Tab</kbd>) between
        cells in some cases.
      </div>
      <div>
        You can also provide your own function; for example, this one overscans
        the same number of cells in both directions (it is the
        &quot;custom&quot; option in the demo above):
      </div>
      <Code html={GridOverscanIndicesGetterJson.html} />
      <div>
        The function returns an object with the (inclusive){" "}
        <code>overscanStartIndex</code> and <code>overscanStopIndex</code> of
        the cells to render. Make sure the returned range stays within{" "}
        <code>0</code> and <code>cellCount - 1</code>.
      </div>
    </Box>
  );
}
