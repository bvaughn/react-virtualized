import {
  Block,
  Box,
  Callout,
  Code,
  ComponentPropsSection,
  Header,
  type ComponentMetadata
} from "react-lib-tools";
import { AutoSizer } from "react-virtualized-auto-sizer";
import json from "../../../public/generated/docs/ScrollSync.json";
import ScrollSyncSpreadsheetJson from "../../../public/generated/examples/ScrollSyncSpreadsheet.json";
import { Link } from "../../components/Link";
import { ScrollSyncSpreadsheet } from "./examples/ScrollSyncSpreadsheet";

const props = Object.values((json as ComponentMetadata).props);

export default function ScrollSyncRoute() {
  return (
    <Box direction="column" gap={4}>
      <Header section="Higher-order components" title="ScrollSync" />
      <div>
        <code>ScrollSync</code> simplifies the process of synchronizing
        scrolling between two or more virtualized components.
      </div>
      <div>
        The example below uses three <Link to="/grid">Grid</Link>s to mimic a
        spreadsheet with a fixed header row and a fixed first column. Scroll the
        body of the spreadsheet; the header and first column follow along. It
        also shows how the scroll values can be used to control other UI, such
        as background colors.
      </div>
      <Block className="h-[354px]">
        <AutoSizer
          renderProp={({ width }) =>
            width !== undefined ? <ScrollSyncSpreadsheet width={width} /> : null
          }
        />
      </Block>
      <div>
        <code>ScrollSync</code> uses a render function as its children. Use the{" "}
        <code>registerChild</code> parameter to register each virtualized
        component that should be kept in sync (e.g.{" "}
        <code>{'<Grid ref={registerChild("header")} />'}</code>), and pass the{" "}
        <code>onScroll</code> parameter to the component(s) the user scrolls.
        Whenever a scroll offset is reported through <code>onScroll</code>,{" "}
        <code>ScrollSync</code> scrolls the other registered components to match
        it (only the axes that changed are synced) and calls the render function
        again with the updated values. The render function receives:
      </div>
      <ul className="list-disc pl-6">
        <li>
          <code>registerChild(key)</code>: returns a ref callback that registers
          a component (such as a <Link to="/grid">Grid</Link>) under a unique
          key
        </li>
        <li>
          <code>onScroll</code>: pass this to the scrollable component(s)
        </li>
        <li>
          <code>scrollLeft</code>, <code>scrollTop</code>: the current scroll
          offsets (e.g. for custom rendering)
        </li>
        <li>
          <code>clientHeight</code>, <code>clientWidth</code>: the size of the
          visible portion of the scrolled component
        </li>
        <li>
          <code>scrollHeight</code>, <code>scrollWidth</code>: the total size of
          all rows and columns in the scrolled component
        </li>
      </ul>
      <Callout intent="warning">
        Version 10 removed the <code>scrollLeft</code> and{" "}
        <code>scrollTop</code> props from <code>Grid</code>; register the
        components with <code>registerChild</code> instead of passing the scroll
        offsets to them.
      </Callout>
      <Code html={ScrollSyncSpreadsheetJson.html} />
      <Callout intent="primary">
        For the common case of fixed header rows and/or columns, also take a
        look at <Link to="/grid/fixed-rows-and-columns">MultiGrid</Link>, which
        handles this layout for you.
      </Callout>
      <ComponentPropsSection
        header="Required props"
        props={props.filter((prop) => prop.required)}
      />
      <ComponentPropsSection
        header="Optional props"
        props={props.filter((prop) => !prop.required)}
      />
    </Box>
  );
}
