import {
  AppRoot,
  ExternalLink,
  type CommonQuestion,
  type DefaultPath,
  type NavConfig
} from "react-lib-tools";
import { repository } from "../package.json";
import Logo from "../public/favicon.svg?react";
import { Link } from "./components/Link";
import { cellMeasurerNav } from "./routes/cell-measurer/routes";
import { gridNav } from "./routes/grid/routes";
import { listNav } from "./routes/list/routes";
import { masonryNav } from "./routes/masonry/routes";
import { tableNav } from "./routes/table/routes";
import { windowScrollingNav } from "./routes/window-scrolling/routes";
import { routes, type Path } from "./routes";

export default function App() {
  return (
    <AppRoot
      collapseNavSections
      commonQuestions={commonQuestions}
      enableSiteSearch
      nav={nav}
      packageDescription="render large lists and tabular data"
      packageLogo={<Logo className="rv-logo w-8 h-8" />}
      packageName="react-virtualized"
      repositoryUrl={repository.url}
      routes={routes}
      overview={
        <>
          <div>
            <strong>react-virtualized</strong> is a collection of React
            components for efficiently rendering large lists and tabular data.
            Only the rows and columns visible within the viewport are rendered,
            which keeps the number of DOM elements small no matter how much data
            there is.
          </div>
          <div>
            If you're starting a new project, also take a look at{" "}
            <ExternalLink href="https://github.com/bvaughn/react-window">
              react-window
            </ExternalLink>{" "}
            as a lighter-weight alternative.
          </div>
        </>
      }
    />
  );
}

const nav: NavConfig<Path | DefaultPath> = [
  { path: "/", title: "Getting started" },
  listNav,
  gridNav,
  tableNav,
  masonryNav,
  cellMeasurerNav,
  windowScrollingNav,
  {
    title: "Higher-order components",
    links: [
      { path: "/arrow-key-stepper", title: "ArrowKeyStepper" },
      { path: "/column-sizer", title: "ColumnSizer" },
      { path: "/infinite-loader", title: "InfiniteLoader" },
      { path: "/scroll-sync", title: "ScrollSync" }
    ]
  },
  {
    title: "Guides",
    links: [
      { path: "/guides/customizing-styles", title: "Customizing styles" },
      { path: "/guides/sizing-components", title: "Sizing components" },
      { path: "/guides/server-rendering", title: "Server rendering" },
      { path: "/guides/reverse-list", title: "Reverse order lists" },
      { path: "/guides/infinite-loading-list", title: "Infinite loading" },
      { path: "/guides/natural-sort-table", title: "Natural sort tables" },
      { path: "/guides/multi-column-sort-table", title: "Multi-column sort" }
    ]
  },
  { path: "/common-questions", title: "Common questions" },
  { path: "/support", title: "Support" }
];

const CHANGELOG_URL =
  "https://github.com/bvaughn/react-virtualized/blob/master/CHANGELOG.md";

const commonQuestions: CommonQuestion[] = [
  {
    id: "upgrading-from-9",
    question: "How do I upgrade from version 9?",
    answer: (
      <div>
        Version 10 requires React 18 or newer, removes a few components (
        <code>AutoSizer</code>, <code>Collection</code> and{" "}
        <code>WindowScroller</code>), and replaces the controlled scroll props
        (e.g. <code>scrollToIndex</code>) with methods. The{" "}
        <ExternalLink href={CHANGELOG_URL}>migration guide</ExternalLink> in the
        changelog covers each change, with before/after examples.
      </div>
    )
  },
  {
    id: "auto-sizer-zero-height",
    question:
      "Why is nothing rendered (or why does AutoSizer report a height of 0)?",
    answer: (
      <div>
        <code>List</code>, <code>Grid</code>, <code>Table</code>, and{" "}
        <code>Masonry</code> need an explicit <code>height</code> and{" "}
        <code>width</code> (only a <code>width</code> when they are{" "}
        <Link to="/window-scrolling">scrolled by the window</Link>).{" "}
        <Link to="/guides/sizing-components">AutoSizer</Link> (from the{" "}
        <code>react-virtualized-auto-sizer</code> package) can provide them, but
        it only <em>fills</em> its parent; it won&apos;t <em>stretch</em> it. If
        the parent (or one of its ancestors) has no height, AutoSizer reports 0
        and nothing is rendered. Give the parent a size (e.g.{" "}
        <code>height: 100%</code> or <code>flex: 1</code>); inside a flex
        container, wrap AutoSizer in a <code>div</code> with{" "}
        <code>flex: 1 1 auto</code>. See{" "}
        <Link to="/guides/sizing-components">sizing components</Link> for more.
      </div>
    )
  },
  {
    id: "scroll-to-row",
    question: "How do I scroll to a row (or cell)?",
    answer: (
      <div>
        Call <code>scrollToRow({"{ index, align }"})</code> on a{" "}
        <Link to="/list/scroll-to-row">List</Link> or{" "}
        <Link to="/table/methods">Table</Link>, or{" "}
        <code>scrollToCell({"{ columnIndex, rowIndex, align }"})</code> on a{" "}
        <Link to="/grid/scroll-to-cell">Grid</Link>, through a <code>ref</code>.
        In version 10, these methods replace the <code>scrollToIndex</code> and{" "}
        <code>scrollToRow</code> props. They scroll once: the row isn&apos;t
        kept in view if sizes change afterwards, so to scroll to a row that is
        being added, call them once it has rendered (e.g. in an effect). To
        render a list at a scroll position from the start (e.g. when restoring
        it), use the <code>initialScrollTop</code> prop instead.
      </div>
    )
  },
  {
    id: "window-scrolling",
    question: "How do I make a list scroll with the rest of the page?",
    answer: (
      <div>
        Set the <code>scrollElement</code> prop of a <code>List</code>,{" "}
        <code>Grid</code>, <code>Table</code> or <code>Masonry</code> to{" "}
        <code>&quot;window&quot;</code> (or to a scrollable element). The
        component then renders at its full height, renders only the rows visible
        within the window, and its scroll methods scroll the window; it only
        needs a <code>width</code>. In version 10, this replaces{" "}
        <code>WindowScroller</code>. See{" "}
        <Link to="/window-scrolling">window scrolling</Link>.
      </div>
    )
  },
  {
    id: "styles-css",
    question: "Why do my Table and other components look unstyled?",
    answer: (
      <div>
        react-virtualized ships a small set of default styles that must be
        imported once, e.g. when your application starts:{" "}
        <code>import &quot;react-virtualized/styles.css&quot;;</code>. You can
        also skip them and provide your own; see{" "}
        <Link to="/guides/customizing-styles">customizing styles</Link>.
      </div>
    )
  },
  {
    id: "data-changed-not-rerendering",
    question: "Why doesn't my list update when my data changes?",
    answer: (
      <div>
        The components only re-render when their props change (shallow
        comparison). If your data changes but props like <code>rowCount</code>{" "}
        don&apos;t (e.g. after re-sorting), either pass the changed value
        through as an extra prop (e.g. <code>sortBy={"{sortBy}"}</code>) or
        force an update: <code>forceUpdateGrid()</code> for{" "}
        <Link to="/list/methods">List</Link> and{" "}
        <Link to="/table/methods">Table</Link>, <code>forceUpdate()</code> for{" "}
        <Link to="/grid/methods">Grid</Link> and{" "}
        <Link to="/masonry/methods">Masonry</Link>.
      </div>
    )
  },
  {
    id: "row-sizes-changed",
    question:
      "My row heights (or column widths) changed. Why is the layout stale?",
    answer: (
      <div>
        Sizes are cached once they have been computed, because the components
        only know <code>rowCount</code>/<code>columnCount</code> and can&apos;t
        tell when the underlying data changes. Call{" "}
        <code>recomputeRowHeights(index)</code> on{" "}
        <Link to="/list/methods">List</Link> or{" "}
        <Link to="/table/methods">Table</Link>, or{" "}
        <code>recomputeGridSize({"{ columnIndex, rowIndex }"})</code> on{" "}
        <Link to="/grid/methods">Grid</Link>, starting from the first index
        whose size changed. (This is only needed when sizes come from a
        function; changes to a numeric <code>rowHeight</code> or{" "}
        <code>columnWidth</code> are applied automatically.)
      </div>
    )
  },
  {
    id: "cell-measurer-cache",
    question: "When should I clear a CellMeasurerCache?",
    answer: (
      <div>
        <Link to="/cell-measurer">CellMeasurer</Link> measures each cell once
        and caches the result. Call{" "}
        <code>cache.clear(rowIndex, columnIndex)</code> when a cell&apos;s
        content changes (e.g. a loading indicator is replaced with content), and{" "}
        <code>cache.clearAll()</code> when all cells need to reflow (e.g. the
        width changed and text wraps differently); then tell the parent to
        recompute its sizes (<code>recomputeRowHeights()</code> on a{" "}
        <code>List</code> or <code>Table</code>,{" "}
        <code>recomputeGridSize()</code> on a <code>Grid</code>). See{" "}
        <Link to="/cell-measurer/cache">CellMeasurerCache</Link>. If items can
        be added, removed, or re-ordered, pass a <code>keyMapper</code> (e.g.
        mapping indices to item IDs) so cached sizes follow the items rather
        than their indices.
      </div>
    )
  },
  {
    id: "cell-measurer-performance",
    question: "Can CellMeasurer measure both widths and heights?",
    answer: (
      <div>
        Not efficiently: a row&apos;s height is the tallest cell in that row
        (and a column&apos;s width is the widest cell in that column), so
        measuring requires rendering every cell in it. Use{" "}
        <code>fixedWidth</code> or <code>fixedHeight</code> on the{" "}
        <code>CellMeasurerCache</code> to measure only one dimension. Measuring
        can also be slow when users jump far ahead with the scrollbar, so
        provide sizes up front when you can.
      </div>
    )
  },
  {
    id: "react-window",
    question: "Should I use react-virtualized or react-window?",
    answer: (
      <div>
        <ExternalLink href="https://github.com/bvaughn/react-window">
          react-window
        </ExternalLink>{" "}
        is a smaller, lighter-weight library by the same author, with a simpler
        API, and is a good choice for new projects that need a list or grid.
        react-virtualized offers more components (e.g. <code>Table</code>,{" "}
        <code>Masonry</code>, <code>MultiGrid</code>, <code>CellMeasurer</code>,{" "}
        and <code>InfiniteLoader</code>), and version 10 keeps existing
        applications working on modern React.
      </div>
    )
  }
];
