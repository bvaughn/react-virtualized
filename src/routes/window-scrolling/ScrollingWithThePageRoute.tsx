import {
  Block,
  Box,
  Callout,
  Code,
  Header,
  SectionHeader
} from "react-lib-tools";
import WindowScrollingScrollToRowJson from "../../../public/generated/examples/WindowScrollingScrollToRow.json";
import WindowScrollingSmoothScrollJson from "../../../public/generated/examples/WindowScrollingSmoothScroll.json";
import WindowScrollingContentAboveJson from "../../../public/generated/examples/WindowScrollingContentAbove.json";
import WindowScrollingGridJson from "../../../public/generated/examples/WindowScrollingGrid.json";
import WindowScrollingListJson from "../../../public/generated/examples/WindowScrollingList.json";
import WindowScrollingMasonryJson from "../../../public/generated/examples/WindowScrollingMasonry.json";
import WindowScrollingMigrationAfterJson from "../../../public/generated/examples/WindowScrollingMigrationAfter.json";
import WindowScrollingMigrationBeforeJson from "../../../public/generated/examples/WindowScrollingMigrationBefore.json";
import WindowScrollingTableJson from "../../../public/generated/examples/WindowScrollingTable.json";
import { Link } from "../../components/Link";
import { LIST } from "../../utils/data";
import { Example as ScrollToRowExample } from "./examples/WindowScrollingScrollToRow";

export default function ScrollingWithThePageRoute() {
  return (
    <Box direction="column" gap={4}>
      <Header
        section="Window scrolling"
        sourceCodePath="lib/utils/scrollElement/useScrollElementLink.ts"
        title="Scrolling with the page"
      />
      <div>
        A <Link to="/list">List</Link>, <Link to="/grid">Grid</Link>,{" "}
        <Link to="/table">Table</Link> or <Link to="/masonry">Masonry</Link> can
        be scrolled by the window (rather than having a scrollbar of its own) by
        setting its <code>scrollElement</code> prop to{" "}
        <code>&quot;window&quot;</code>. This can be used to create layouts
        similar to Facebook or Twitter news feeds, where the list scrolls along
        with the rest of the page.
      </div>
      <div>With a scroll element, the component:</div>
      <ul className="list-disc pl-6 flex flex-col gap-1">
        <li>
          renders at its full height (it doesn&apos;t scroll itself vertically),
        </li>
        <li>
          renders only the rows (or cells) visible within the window&apos;s
          viewport,
        </li>
        <li>
          and its scroll methods (<code>scrollToRow</code>,{" "}
          <code>scrollToCell</code> and <code>scrollToPosition</code>) scroll
          the window; see <a href="#scrolling-to-a-row">scrolling to a row</a>.
        </li>
      </ul>
      <div>
        A regular <code>ref</code> can be used to call its methods. Only the{" "}
        <code>width</code> needs to be provided, e.g. by{" "}
        <Link to="/guides/sizing-components">AutoSizer</Link>:
      </div>
      <Code html={WindowScrollingListJson.html} />
      <div>
        The window is the most common scroll element, but any scrollable element
        can be used instead; see{" "}
        <Link to="/window-scrolling/scroll-element">scrolling an element</Link>{" "}
        (which also has a live example).
      </div>
      <SectionHeader>Grid, Table and Masonry</SectionHeader>
      <div>
        The <code>scrollElement</code> prop works the same way for a{" "}
        <code>Grid</code>. The window only scrolls a <code>Grid</code>{" "}
        vertically; if its columns are wider than its <code>width</code>, it
        still scrolls horizontally itself:
      </div>
      <Code html={WindowScrollingGridJson.html} />
      <div>
        A <code>Table</code>&apos;s header row is scrolled along with its rows
        (it doesn&apos;t stay at the top of the window):
      </div>
      <Code html={WindowScrollingTableJson.html} />
      <div>
        For a <code>Masonry</code>, reset the{" "}
        <Link to="/masonry/cell-positioners">cell positioner</Link> when the
        available width changes (e.g. in <code>AutoSizer</code>&apos;s{" "}
        <code>onResize</code>), so that the number of columns fits the new
        width:
      </div>
      <Code html={WindowScrollingMasonryJson.html} />
      <Callout intent="primary">
        <code>MultiGrid</code> always scrolls itself, so it doesn&apos;t have a{" "}
        <code>scrollElement</code> prop.
      </Callout>
      <SectionHeader id="scrolling-to-a-row">Scrolling to a row</SectionHeader>
      <div>
        A component with a <code>scrollElement</code> is scrolled with its
        regular methods: the <Link to="/list/methods">List</Link> or{" "}
        <Link to="/table/methods">Table</Link>&apos;s <code>scrollToRow</code>{" "}
        and <code>scrollToPosition</code>, or the{" "}
        <Link to="/grid/methods">Grid</Link>&apos;s <code>scrollToCell</code>{" "}
        and <code>scrollToPosition</code>. They scroll the scroll element (e.g.
        the window) instead of the component itself, so a regular{" "}
        <code>ref</code> is all that&apos;s needed. (This page is itself part of
        a larger layout, so the example below scrolls a container; see{" "}
        <Link to="/window-scrolling/scroll-element">scrolling an element</Link>
        .)
      </div>
      <Block className="h-96">
        <ScrollToRowExample items={LIST} />
      </Block>
      <Code html={WindowScrollingScrollToRowJson.html} />
      <div>Things to keep in mind:</div>
      <ul className="list-disc pl-6 flex flex-col gap-1">
        <li>
          These are one-time scrolls: the row isn&apos;t kept in view if row
          heights change afterwards.
        </li>
        <li>
          Offsets passed to <code>scrollToPosition</code> (and returned by{" "}
          <code>getOffsetForRow</code>) are relative to the top of the list, not
          to the top of the page.
        </li>
        <li>
          To scroll to a row that is being added, call <code>scrollToRow</code>{" "}
          once the list has rendered it (e.g. in an effect).
        </li>
        <li>
          Rows that haven&apos;t been measured yet (e.g. by{" "}
          <Link to="/cell-measurer">CellMeasurer</Link>) are positioned using
          their estimated heights, so the row may not end up exactly aligned.
        </li>
        <li>
          The list&apos;s position within the scroll element is measured again
          each time it scrolls it, so content above the list that has changed
          size is taken into account.
        </li>
        <li>
          A <code>Grid</code> is only scrolled vertically by its scroll element;
          if it is wider than its <code>width</code>, it still scrolls
          horizontally itself.
        </li>
      </ul>
      <Callout intent="primary">
        <code>scrollToRow</code> scrolls immediately. For a smooth scroll,
        compute the row&apos;s offset on the page and scroll the window
        yourself:
      </Callout>
      <Code html={WindowScrollingSmoothScrollJson.html} />
      <SectionHeader>Height</SectionHeader>
      <div>
        The <code>height</code> prop is optional with a scroll element: the
        height of the scroll element&apos;s viewport (e.g. the window&apos;s) is
        used to determine which rows to render. If a <code>height</code> is
        passed, it is only used until the scroll element has been measured, e.g.
        during <Link to="/guides/server-rendering">server rendering</Link>, or
        while <code>scrollElement</code> is <code>null</code> because the
        element isn&apos;t available yet. (The component then renders its top
        rows, at its full height.)
      </div>
      <SectionHeader>Content above the component</SectionHeader>
      <div>
        The component&apos;s position within the scroll element (e.g. how far it
        is from the top of the page) is measured again whenever the scroll
        element scrolls or is resized, and whenever the component re-renders. If
        content above it changes size without the component re-rendering (e.g. a
        banner is dismissed, and the component&apos;s props don&apos;t change),
        re-render it with <code>forceUpdateGrid()</code> (<code>List</code> and{" "}
        <code>Table</code>) or <code>forceUpdate()</code> (<code>Grid</code> and{" "}
        <code>Masonry</code>):
      </div>
      <Code html={WindowScrollingContentAboveJson.html} />
      <Callout intent="warning">
        Until the component re-renders (or the scroll element scrolls), it
        renders the rows for its previous position, so part of the viewport may
        be left empty. How likely this is depends on the browser: while the page
        is scrolled, browsers that support scroll anchoring (e.g. Chrome and
        Firefox) adjust the scroll position when content above changes size,
        which re-measures the component; browsers without scroll anchoring (e.g.
        Safari) don&apos;t. The rows rendered beyond the viewport (see the{" "}
        <code>overscanRowCount</code> prop) hide small changes, but not content
        above the component growing. So call <code>forceUpdateGrid()</code> or{" "}
        <code>forceUpdate()</code> whenever content above the component may
        change size.
      </Callout>
      <SectionHeader>Migrating from WindowScroller</SectionHeader>
      <div>
        In version 10, the <code>WindowScroller</code> component has been
        replaced by the <code>scrollElement</code> prop. Instead of wrapping the
        component in a <code>WindowScroller</code> and wiring its render
        parameters to the <code>autoHeight</code>, <code>height</code>,{" "}
        <code>isScrolling</code>, <code>onScroll</code> and{" "}
        <code>scrollTop</code> props (all of which have been removed, except{" "}
        <code>height</code> and <code>onScroll</code>), pass{" "}
        <code>scrollElement</code> directly:
      </div>
      <Code html={WindowScrollingMigrationBeforeJson.html} />
      <Code html={WindowScrollingMigrationAfterJson.html} />
      <div>What replaced each part of the WindowScroller API:</div>
      <ul className="list-disc pl-6 flex flex-col gap-1">
        <li>
          <code>registerChild</code> (and the wrapper element it was attached
          to): not needed; the component measures its position from its own
          element. Use a regular <code>ref</code> to call its methods.
        </li>
        <li>
          <code>height</code> (and <code>width</code>): the viewport height is
          measured by the component itself. Use{" "}
          <Link to="/guides/sizing-components">AutoSizer</Link> for the width
          (the window&apos;s width usually isn&apos;t the width available to the
          component).
        </li>
        <li>
          <code>scrollTop</code>, <code>isScrolling</code> and{" "}
          <code>onChildScroll</code>: handled by the component.{" "}
          <code>isScrolling</code> is still passed to the{" "}
          <code>rowRenderer</code> (or <code>cellRenderer</code>).
        </li>
        <li>
          <code>scrollLeft</code>: horizontal window scrolling is no longer
          supported.
        </li>
        <li>
          The <code>scrollElement</code> prop: moved to the component, and
          accepts <code>&quot;window&quot;</code> (instead of the{" "}
          <code>window</code> object) or an element.
        </li>
        <li>
          <code>updatePosition()</code>: not needed; the position is measured
          again on every scroll, on resize, and whenever the component
          re-renders (see &quot;Content above the component&quot; above).{" "}
          <code>updateScrollTopOnUpdatePosition</code> is no longer needed
          either.
        </li>
        <li>
          <code>onScroll</code>: use the component&apos;s own{" "}
          <code>onScroll</code> prop, which reports how far the scroll element
          has been scrolled past the top of the component.
        </li>
        <li>
          <code>onResize</code>: use a <code>resize</code> event listener on the
          window (or a <code>ResizeObserver</code> on the scroll element).
        </li>
        <li>
          <code>serverHeight</code> and <code>serverWidth</code>: pass{" "}
          <code>height</code> (used until the scroll element has been measured)
          and <code>width</code> to the component.
        </li>
        <li>
          <code>scrollingResetTimeInterval</code>: use the{" "}
          <code>scrollingResetTimeInterval</code> prop of the <code>Grid</code>,{" "}
          <code>List</code> or <code>Masonry</code>.
        </li>
        <li>
          <code>IS_SCROLLING_TIMEOUT</code> and{" "}
          <code>defaultWindowScrollerProps</code>: removed.
        </li>
      </ul>
    </Box>
  );
}
