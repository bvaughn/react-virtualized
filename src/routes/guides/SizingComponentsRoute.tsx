import {
  Block,
  Box,
  Callout,
  Code,
  ExternalLink,
  Header,
  SectionHeader
} from "react-lib-tools";
import type { RowRendererParams } from "react-virtualized";
import AutoSizerGridJson from "../../../public/generated/examples/AutoSizerGrid.json";
import AutoSizerListJson from "../../../public/generated/examples/AutoSizerList.json";
import AutoSizerTableJson from "../../../public/generated/examples/AutoSizerTable.json";
import UsingAutoSizerChildComponentJson from "../../../public/generated/examples/UsingAutoSizerChildComponent.json";
import UsingAutoSizerFlexContainerJson from "../../../public/generated/examples/UsingAutoSizerFlexContainer.json";
import UsingAutoSizerInfiniteLoaderJson from "../../../public/generated/examples/UsingAutoSizerInfiniteLoader.json";
import UsingAutoSizerWidthOnlyJson from "../../../public/generated/examples/UsingAutoSizerWidthOnly.json";
import { Link } from "../../components/Link";
import { LIST } from "../../utils/data";
import { Example as GridExample } from "./examples/AutoSizerGrid";
import { Example as ListExample } from "./examples/AutoSizerList";
import { Example as TableExample } from "./examples/AutoSizerTable";
import { Example as ChildComponentExample } from "./examples/UsingAutoSizerChildComponent";
import { Example as WidthOnlyExample } from "./examples/UsingAutoSizerWidthOnly";

const AUTO_SIZER_NPM_URL =
  "https://www.npmjs.com/package/react-virtualized-auto-sizer";

function rowRenderer({ index, key, style }: RowRendererParams) {
  return (
    <div
      className={
        index % 2 ? "flex items-center px-2" : "flex items-center px-2 bg-ink/5"
      }
      key={key}
      style={style}
    >
      {LIST[index].name}
    </div>
  );
}

export default function SizingComponentsRoute() {
  return (
    <Box direction="column" gap={4}>
      <Header section="Guides" title="Sizing components" />
      <div>
        Many react-virtualized components (e.g. <code>List</code>,{" "}
        <code>Grid</code>, and <code>Table</code>) require explicit pixel
        dimensions, but sometimes you just want a component to grow to fill all
        of the available space. The{" "}
        <ExternalLink href={AUTO_SIZER_NPM_URL}>
          react-virtualized-auto-sizer
        </ExternalLink>{" "}
        package measures its parent element and passes the available{" "}
        <code>width</code> and <code>height</code> to its child. (A component
        that is <Link to="/window-scrolling">scrolled by the window</Link> only
        needs a <code>width</code>; see below.)
      </div>
      <Callout intent="primary">
        As of version 10, <code>AutoSizer</code> is no longer part of
        react-virtualized; use the{" "}
        <ExternalLink href={AUTO_SIZER_NPM_URL}>
          react-virtualized-auto-sizer
        </ExternalLink>{" "}
        package instead. It works with all react-virtualized components (and
        with react-window). See{" "}
        <a href="#migrating-from-react-virtualized-9x">
          migrating from react-virtualized 9.x
        </a>{" "}
        below.
      </Callout>
      <Code
        html={`<div>npm install <span class="tok-keyword">react-virtualized-auto-sizer</span></div>`}
      />
      <SectionHeader>Filling the available space</SectionHeader>
      <div>
        In the example below, the list fills its container. Drag the bottom edge
        of the container to resize it; the list will resize to match.
      </div>
      <Block className="h-80 min-h-20 resize-y overflow-hidden">
        <ListExample items={LIST} />
      </Block>
      <Code html={AutoSizerListJson.html} />
      <div>
        <code>Grid</code> and <code>Table</code> work the same way:
      </div>
      <Block className="h-60">
        <GridExample items={LIST} />
      </Block>
      <Code html={AutoSizerGridJson.html} />
      <Block className="h-60">
        <TableExample items={LIST} />
      </Block>
      <Code html={AutoSizerTableJson.html} />
      <SectionHeader>Why are width and height undefined?</SectionHeader>
      <div>
        <code>AutoSizer</code> can&apos;t know how much space is available until
        it has been mounted and has measured its parent, so the sizes are{" "}
        <code>undefined</code> during the first render. react-virtualized
        components require numbers, so render nothing (or a placeholder) until
        the values are defined. This can be done inside of a{" "}
        <code>renderProp</code> (as the other examples on this page do) or by
        passing a <code>ChildComponent</code>:
      </div>
      <Block className="h-60">
        <ChildComponentExample />
      </Block>
      <Code html={UsingAutoSizerChildComponentJson.html} />
      <SectionHeader>Why is my AutoSizer setting a height of 0?</SectionHeader>
      <div>
        <code>AutoSizer</code> expands to <em>fill</em> its parent but it will
        not <em>stretch</em> the parent. If <code>AutoSizer</code> is reporting
        a height (or width) of 0, then it&apos;s likely that the parent element
        (or one of its parents) has a height of 0.
      </div>
      <div>
        One easy way to test this is to temporarily add a style to the parent
        (e.g. <code>background-color: red</code>) to check that it is the size
        you expect. You may need to add <code>height: 100%</code> or{" "}
        <code>flex: 1</code> to the parent.
      </div>
      <SectionHeader>
        Can I use AutoSizer to manage only width or height (not both)?
      </SectionHeader>
      <div>
        Yes. Only use the dimension you need, and only wait for that one to be
        defined. For example, a fixed-height list that grows to fill the
        available width can be created like so:
      </div>
      <Block>
        <WidthOnlyExample rowCount={LIST.length} rowRenderer={rowRenderer} />
      </Block>
      <Code html={UsingAutoSizerWidthOnlyJson.html} />
      <div>
        A component that is{" "}
        <Link to="/window-scrolling">scrolled by the window</Link> (with the{" "}
        <code>scrollElement</code> prop) only needs the width, too: its height
        is that of the window&apos;s viewport.
      </div>
      <SectionHeader>
        Can I use AutoSizer within a flex container?
      </SectionHeader>
      <div>
        <code>AutoSizer</code> measures its parent element, so when the space to
        fill is a flex item, wrap <code>AutoSizer</code> in a <code>div</code>{" "}
        that grows to fill that space. Also set <code>min-height: 0</code> and{" "}
        <code>min-width: 0</code> on that <code>div</code>; otherwise flex items
        can&apos;t shrink below the size of their content (the list), so the
        list would grow but never shrink.
      </div>
      <Code html={UsingAutoSizerFlexContainerJson.html} />
      <Callout intent="primary">
        Don&apos;t make <code>AutoSizer</code>&apos;s parent size itself to its
        content (e.g. <code>height: auto</code> or{" "}
        <code>width: fit-content</code>); the size it reports would then depend
        on the size of the list, and nothing would be rendered.
      </Callout>
      <SectionHeader>
        Can I use AutoSizer with other HOCs like InfiniteLoader?
      </SectionHeader>
      <div>
        Yes. <code>AutoSizer</code> can be used within other react-virtualized
        HOCs such as <Link to="/infinite-loader">InfiniteLoader</Link> or{" "}
        <Link to="/scroll-sync">ScrollSync</Link> like so:
      </div>
      <Code html={UsingAutoSizerInfiniteLoaderJson.html} />
      <div>
        See the <Link to="/infinite-loader">InfiniteLoader</Link> page for a
        live example of this.
      </div>
      <SectionHeader>Responding to size changes</SectionHeader>
      <div>
        Use the <code>onResize</code> prop to be notified when the size changes,
        e.g. to clear a <Link to="/cell-measurer">CellMeasurer</Link> cache when
        the width changes and text wraps differently. See{" "}
        <ExternalLink href={AUTO_SIZER_NPM_URL}>
          react-virtualized-auto-sizer
        </ExternalLink>{" "}
        for its other props.
      </div>
      <SectionHeader id="migrating-from-react-virtualized-9x">
        Migrating from react-virtualized 9.x
      </SectionHeader>
      <div>
        Earlier versions of react-virtualized included an <code>AutoSizer</code>{" "}
        component. It has been removed in version 10. To migrate to{" "}
        <code>react-virtualized-auto-sizer</code> (version 2):
      </div>
      <ul className="list-disc pl-6 flex flex-col gap-1">
        <li>
          Import <code>AutoSizer</code> from{" "}
          <code>&quot;react-virtualized-auto-sizer&quot;</code> rather than{" "}
          <code>&quot;react-virtualized&quot;</code>.
        </li>
        <li>
          Replace the <code>children</code> render function with the{" "}
          <code>renderProp</code> prop (or with the <code>ChildComponent</code>{" "}
          prop; see below).
        </li>
        <li>
          Handle <code>undefined</code> sizes: <code>width</code> and{" "}
          <code>height</code> are <code>undefined</code> until the parent has
          been measured (including during server rendering).
        </li>
        <li>
          Remove <code>disableHeight</code> and <code>disableWidth</code>; just
          ignore the dimension that you don&apos;t need.
        </li>
        <li>
          Remove <code>defaultHeight</code> and <code>defaultWidth</code>;
          render a placeholder while the size is <code>undefined</code> instead.
        </li>
      </ul>
    </Box>
  );
}
