import {
  Block,
  Box,
  Callout,
  Code,
  Header,
  SectionHeader
} from "react-lib-tools";
import ListRowRendererJson from "../../../public/generated/examples/ListRowRenderer.json";
import ListScrollingPlaceholderJson from "../../../public/generated/examples/ListScrollingPlaceholder.json";
import { ListScrollingPlaceholder } from "./examples/ListScrollingPlaceholder";

export default function ListRenderingRowsRoute() {
  return (
    <Box direction="column" gap={4}>
      <Header section="List" title="Rendering rows" />
      <div>
        The <code>rowRenderer</code> function is responsible for rendering a
        single row, given its index. It must return an element that applies the{" "}
        <code>style</code> parameter (which positions and sizes the row) and has
        a unique <code>key</code>, and whose content fits within the row&apos;s
        height:
      </div>
      <Code html={ListRowRendererJson.html} />
      <Callout intent="warning">
        It is very important that rows do not have vertical overflow. Overflow
        would make scrolling the list difficult (as individual rows would
        intercept the scroll events). For this reason it is recommended that
        rows use a style like <code>overflow-y: hidden</code>.
      </Callout>
      <SectionHeader>Scrolling placeholders</SectionHeader>
      <div>
        If row content is expensive to render, consider rendering a light-weight
        placeholder while the list is being scrolled. The{" "}
        <code>isScrolling</code> parameter passed to <code>rowRenderer</code>{" "}
        makes this possible:
      </div>
      <Block className="h-60">
        <ListScrollingPlaceholder />
      </Block>
      <Code html={ListScrollingPlaceholderJson.html} />
    </Box>
  );
}
