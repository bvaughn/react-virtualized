import {
  Block,
  Box,
  Callout,
  Code,
  Header,
  SectionHeader
} from "react-lib-tools";
import { List, type RowRendererParams } from "react-virtualized";
import { AutoSizer } from "react-virtualized-auto-sizer";
import ServerRenderingInitialScrollJson from "../../../public/generated/examples/ServerRenderingInitialScroll.json";
import ServerRenderingSizesJson from "../../../public/generated/examples/ServerRenderingSizes.json";
import { Link } from "../../components/Link";
import { LIST } from "../../utils/data";

function rowRenderer({ index, key, style }: RowRendererParams) {
  return (
    <div
      className="flex items-center gap-2 px-3 border-b border-ink/10"
      key={key}
      style={style}
    >
      <span className="w-10 text-right text-ink/60">{index}</span>
      {LIST[index].name}
    </div>
  );
}

export default function ServerRenderingRoute() {
  return (
    <Box direction="column" gap={4}>
      <Header section="Guides" title="Server rendering" />
      <div>
        react-virtualized components can be rendered on the server (e.g. with{" "}
        <code>renderToString</code> or a framework like Next.js) and hydrated on
        the client. The server renders the rows (or cells) that would be
        visible, so the page shows content before JavaScript has loaded. This
        guide covers the things to keep in mind.
      </div>
      <SectionHeader>Sizes</SectionHeader>
      <div>
        <code>List</code>, <code>Grid</code>, and <code>Table</code> need a{" "}
        <code>height</code> and <code>width</code> to know how many rows to
        render. <Link to="/guides/sizing-components">AutoSizer</Link> can&apos;t
        measure anything on the server, so the sizes it provides are{" "}
        <code>undefined</code> there (and during hydration). Render with
        fallback sizes until it has measured the available space; otherwise
        nothing is rendered on the server:
      </div>
      <Code html={ServerRenderingSizesJson.html} />
      <div>
        Once the page is hydrated, <code>AutoSizer</code> measures the available
        space and the list re-renders at its actual size. A component with a{" "}
        <Link to="/window-scrolling">
          <code>scrollElement</code>
        </Link>{" "}
        uses its <code>height</code> prop the same way: as the height of the
        viewport until the scroll element has been measured.
      </div>
      <SectionHeader>Rendering at an initial scroll position</SectionHeader>
      <div>
        To render a list scrolled to a position (e.g. one restored from the URL
        when the user navigates back), use the <code>initialScrollTop</code>{" "}
        prop (and <code>initialScrollLeft</code> for a <code>Grid</code> or{" "}
        <code>MultiGrid</code>). The rows at that offset are rendered on the
        server, and the list is scrolled to it when it mounts:
      </div>
      <Code html={ServerRenderingInitialScrollJson.html} />
      <div>
        For example, this list is rendered scrolled to row 500 (an{" "}
        <code>initialScrollTop</code> of 15,000 pixels):
      </div>
      <Block className="h-80">
        <AutoSizer
          renderProp={({ height, width }) =>
            height !== undefined && width !== undefined ? (
              <List
                height={height}
                initialScrollTop={15000}
                rowCount={LIST.length}
                rowHeight={30}
                rowRenderer={rowRenderer}
                width={width}
              />
            ) : null
          }
        />
      </Block>
      <div>
        The browser can&apos;t scroll an element before the page has been
        hydrated, so until then the server-rendered rows are shifted into view
        instead. After hydration the list is scrolled to the offset, and the
        rows stay in place. (Until then the scrollbar is shown at the top; if
        the user scrolls before the page has been hydrated, the rows they see
        stay in place as well.)
      </div>
      <Callout intent="primary">
        Use <code>initialScrollTop</code> rather than calling{" "}
        <code>scrollToRow</code> in an effect: the effect only runs after
        hydration, so the page would first show the top of the list and then
        jump. Changing <code>initialScrollTop</code> after mounting has no
        effect; use <code>scrollToPosition</code> or <code>scrollToRow</code> to
        scroll a list that has already been rendered.
      </Callout>
      <SectionHeader>Measured content</SectionHeader>
      <div>
        <Link to="/cell-measurer">CellMeasurer</Link> can only measure cells in
        the browser, so on the server (and during hydration) rows are rendered
        at the cache&apos;s default sizes, and they are re-positioned once they
        have been measured. Choose default sizes close to the typical size of
        your content to minimize the shift.
      </div>
      <SectionHeader>Limitations</SectionHeader>
      <ul className="list-disc pl-6 flex flex-col gap-1">
        <li>
          A component with a <code>scrollElement</code> is rendered from its top
          on the server, using its <code>height</code> prop as the height of the
          viewport; once hydrated, it renders the rows visible within the scroll
          element (e.g. the window). Its vertical position is determined by the
          scroll element, so <code>initialScrollTop</code> doesn&apos;t apply.
        </li>
        <li>
          <code>Masonry</code> doesn&apos;t support an initial scroll offset:
          cell positions are only known once the cells before them have been
          measured, which can&apos;t happen on the server.
        </li>
        <li>
          The scrollbar size is measured after hydration, so the space reserved
          for scrollbars may change slightly at that point.
        </li>
      </ul>
    </Box>
  );
}
