import { useEffect, useState } from "react";

// A header above the virtualized component.
// Its height is state of its own (changed through window.setHeaderHeight),
// so that changing it does not re-render the virtualized component.
export function Header({ initialHeight }: { initialHeight: number }) {
  const [height, setHeight] = useState(initialHeight);

  useEffect(() => {
    window.setHeaderHeight = setHeight;
    return () => {
      window.setHeaderHeight = null;
    };
  }, []);

  return (
    <div
      data-test-id="header"
      style={{ height, backgroundColor: "lightblue", flexShrink: 0 }}
    >
      Header
    </div>
  );
}
