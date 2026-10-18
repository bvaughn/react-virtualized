import { Block, Box, Callout, Code, Header } from "react-lib-tools";
import WindowScrollingScrollElementJson from "../../../public/generated/examples/WindowScrollingScrollElement.json";
import { LIST } from "../../utils/data";
import { Example } from "./examples/WindowScrollingScrollElement";

export default function ScrollingAnElementRoute() {
  return (
    <Box direction="column" gap={4}>
      <Header section="Window scrolling" title="Scrolling an element" />
      <div>
        Instead of <code>&quot;window&quot;</code>, the{" "}
        <code>scrollElement</code> prop can be a scrollable element (e.g. a
        container with <code>overflow: auto</code> that the component is
        rendered within, along with other content). The component then scrolls
        along with the rest of that element&apos;s content, and renders only the
        rows visible within the element.
      </div>
      <div>
        The component needs the element itself (not a ref object), so store it
        in state with a <code>ref</code> callback; this re-renders the component
        once the element has been mounted. Until then, the{" "}
        <code>scrollElement</code> is <code>null</code>, and the component
        renders its top rows (at its full height).
      </div>
      <div>
        In the example below, the content above the list and the list itself
        share a single scrollbar (the container&apos;s); the list doesn&apos;t
        have a scrollbar of its own.
      </div>
      <Block className="h-80">
        <Example items={LIST} />
      </Block>
      <Code html={WindowScrollingScrollElementJson.html} />
      <Callout intent="primary">
        Size changes of the scroll element are detected with a{" "}
        <code>ResizeObserver</code>, and the component&apos;s position within it
        is measured again whenever it scrolls.
      </Callout>
    </Box>
  );
}
