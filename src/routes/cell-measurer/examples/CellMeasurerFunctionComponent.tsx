// <begin>

import { forwardRef, useState, type CSSProperties, type Ref } from "react";
import {
  CellMeasurer,
  CellMeasurerCache,
  List,
  type RowRendererParams
} from "react-virtualized";

// React 19: "ref" is a regular prop; pass it along to the DOM element
function Row({
  ref,
  style,
  text
}: {
  ref?: Ref<HTMLDivElement>;
  style: CSSProperties;
  text: string;
}) {
  return (
    <div ref={ref} style={style}>
      {text}
    </div>
  );
}

// React 18: function components must use forwardRef to receive a ref
const ForwardRefRow = forwardRef<
  HTMLDivElement,
  { style: CSSProperties; text: string }
>(function ForwardRefRow({ style, text }, ref) {
  return (
    <div ref={ref} style={style}>
      {text}
    </div>
  );
});

// Either version: attach registerChild to the element to be measured
function RegisteredRow({
  registerChild,
  style,
  text
}: {
  registerChild: Ref<HTMLDivElement>;
  style: CSSProperties;
  text: string;
}) {
  return (
    <div ref={registerChild} style={style}>
      {text}
    </div>
  );
}

function Example({ items }: { items: string[] }) {
  const [cache] = useState(
    () => new CellMeasurerCache({ defaultHeight: 50, fixedWidth: true })
  );

  const rowRenderer = ({ index, key, parent, style }: RowRendererParams) => {
    const text = items[index];

    switch (index % 3) {
      case 0:
        return (
          <CellMeasurer
            key={key}
            cache={cache}
            parent={parent}
            rowIndex={index}
          >
            <Row style={style} text={text} />
          </CellMeasurer>
        );
      case 1:
        return (
          <CellMeasurer
            key={key}
            cache={cache}
            parent={parent}
            rowIndex={index}
          >
            <ForwardRefRow style={style} text={text} />
          </CellMeasurer>
        );
      default:
        return (
          <CellMeasurer
            key={key}
            cache={cache}
            parent={parent}
            rowIndex={index}
          >
            {({ registerChild }) => (
              <RegisteredRow
                registerChild={registerChild}
                style={style}
                text={text}
              />
            )}
          </CellMeasurer>
        );
    }
  };

  return (
    <List
      deferredMeasurementCache={cache}
      height={300}
      rowCount={items.length}
      rowHeight={cache.rowHeight}
      rowRenderer={rowRenderer}
      width={300}
    />
  );
}

// <end>

export { Example };
