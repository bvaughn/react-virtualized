import type { ReactNode } from "react";
import type { ListProps } from "react-virtualized";

declare const rowCount: number;
declare const rowRenderer: ListProps["rowRenderer"];
declare const width: number;

// The 9.x APIs, which no longer exist
declare function WindowScroller(props: {
  children: (params: {
    height: number;
    isScrolling: boolean;
    onChildScroll: (params: { scrollTop: number }) => void;
    registerChild: (element: Element | null) => void;
    scrollTop: number;
  }) => ReactNode;
}): ReactNode;
declare function List(props: Record<string, unknown>): ReactNode;

// <begin>

// react-virtualized 9.x
function Example() {
  return (
    <WindowScroller>
      {({ height, isScrolling, onChildScroll, registerChild, scrollTop }) => (
        <div ref={registerChild}>
          <List
            autoHeight
            height={height}
            isScrolling={isScrolling}
            onScroll={onChildScroll}
            rowCount={rowCount}
            rowHeight={30}
            rowRenderer={rowRenderer}
            scrollTop={scrollTop}
            width={width}
          />
        </div>
      )}
    </WindowScroller>
  );
}

// <end>

export { Example };
