import { useEffect, useState } from "react";
import { List, type RowRendererParams } from "react-virtualized";
import { ROW_COUNT, ROW_HEIGHT, WIDTH } from "../../../tests";
import { Header } from "../components/Header";
import { ScrollContainer } from "../components/ScrollContainer";
import { useRouteParams } from "../utils/searchParams";

// Defined outside of the component so that the List's props are stable
// (it does not re-render unless its scrollElement changes)
function rowRenderer({ index, key, style }: RowRendererParams) {
  return (
    <div data-row-index={index} key={key} style={style}>
      Row {index}
    </div>
  );
}

function setListRef(list: Window["list"]) {
  window.list = list;
}

// A List below a header, scrolled by the window, a scrollable container, or (initially null) a deferred scroll element
export function ListRoute() {
  const { headerHeight, overscanRowCount, scrollElementType } =
    useRouteParams();

  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [deferredLinked, setDeferredLinked] = useState(false);

  useEffect(() => {
    window.linkScrollElement = () => setDeferredLinked(true);
    return () => {
      window.linkScrollElement = null;
    };
  }, []);

  const scrollElement =
    scrollElementType === "container"
      ? container
      : scrollElementType === "deferred"
        ? deferredLinked
          ? "window"
          : null
        : "window";

  const content = (
    <>
      <Header initialHeight={headerHeight} />
      <List
        // Only used until the scroll element is available (i.e. while it is null)
        height={scrollElementType === "deferred" ? 300 : undefined}
        id="list"
        overscanRowCount={overscanRowCount}
        ref={setListRef}
        rowCount={ROW_COUNT}
        rowHeight={ROW_HEIGHT}
        rowRenderer={rowRenderer}
        scrollElement={scrollElement}
        width={WIDTH}
      />
    </>
  );

  return scrollElementType === "container" ? (
    <ScrollContainer ref={setContainer}>{content}</ScrollContainer>
  ) : (
    content
  );
}
