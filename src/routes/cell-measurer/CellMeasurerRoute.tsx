import {
  Block,
  Box,
  Callout,
  Code,
  Header,
  SectionHeader
} from "react-lib-tools";
import CellMeasurerDynamicHeightGridJson from "../../../public/generated/examples/CellMeasurerDynamicHeightGrid.json";
import CellMeasurerDynamicHeightListJson from "../../../public/generated/examples/CellMeasurerDynamicHeightList.json";
import CellMeasurerDynamicHeightTableColumnJson from "../../../public/generated/examples/CellMeasurerDynamicHeightTableColumn.json";
import CellMeasurerFunctionComponentJson from "../../../public/generated/examples/CellMeasurerFunctionComponent.json";
import CellMeasurerImagesJson from "../../../public/generated/examples/CellMeasurerImages.json";
import { Link } from "../../components/Link";
import { LIST } from "../../utils/data";
import { Example as DynamicHeightListExample } from "./examples/CellMeasurerDynamicHeightList";
import { Example as DynamicHeightTableColumnExample } from "./examples/CellMeasurerDynamicHeightTableColumn";
import { Example as FunctionComponentExample } from "./examples/CellMeasurerFunctionComponent";

const FUNCTION_COMPONENT_ITEMS = LIST.map((item) => item.randomLong);

export default function CellMeasurerRoute() {
  return (
    <Box direction="column" gap={4}>
      <Header section="Measuring content" title="Measuring cells" />
      <div>
        <code>CellMeasurer</code> is a higher-order component that automatically
        measures a cell&apos;s contents just-in-time, e.g. for messages in a
        chat interface whose size isn&apos;t known until they&apos;ve been
        rendered. Specify a fixed width to measure dynamic height (or vice
        versa).
      </div>
      <div>
        <code>CellMeasurer</code> can be used with <code>Grid</code>,{" "}
        <code>List</code>, <code>Table</code>, <code>MultiGrid</code>, and{" "}
        <code>Masonry</code>.
      </div>
      <div>
        If sizes can be determined ahead of time (e.g. from the data), it&apos;s
        simpler and more efficient to pass a <code>rowHeight</code> or{" "}
        <code>columnWidth</code> function than to measure cells; see{" "}
        <Link to="/list/variable-row-heights">variable row heights</Link> and{" "}
        <Link to="/grid/variable-sizes">variable sizes</Link>. Use{" "}
        <code>CellMeasurer</code> when a cell&apos;s size depends on its
        rendered content (e.g. wrapping text or images).
      </div>
      <Callout intent="warning">
        This is an advanced component, with some limitations and performance
        considerations; see{" "}
        <Link to="/cell-measurer/limitations">limitations and performance</Link>
        .
      </Callout>
      <SectionHeader>Dynamic row heights</SectionHeader>
      <div>
        The most common use case is a <code>List</code> whose rows contain
        wrapping text. Each row is rendered at the width of the list and its
        height is measured:
      </div>
      <Block className="h-80">
        <DynamicHeightListExample items={LIST} />
      </Block>
      <div>Three pieces work together to make this work:</div>
      <ul className="list-disc pl-6">
        <li>
          A <Link to="/cell-measurer/cache">CellMeasurerCache</Link> stores the
          measurements. It&apos;s configured with <code>fixedWidth: true</code>{" "}
          since only heights are measured.
        </li>
        <li>
          Each row is wrapped in a <code>CellMeasurer</code>, which is passed
          the cache along with the row&apos;s index and the <code>parent</code>{" "}
          provided to the row renderer.
        </li>
        <li>
          The cache is passed to the <code>List</code> as{" "}
          <code>deferredMeasurementCache</code>, and its <code>rowHeight</code>{" "}
          method is used as the <code>rowHeight</code> prop.
        </li>
      </ul>
      <Code html={CellMeasurerDynamicHeightListJson.html} />
      <Callout intent="primary">
        <Box direction="column" gap={2}>
          <div>
            <code>CellMeasurer</code> attaches a <code>ref</code> to its child
            in order to find the DOM element to measure, so the child should be
            a DOM element (or a component that passes its <code>ref</code> along
            to one; see{" "}
            <Link to="/cell-measurer#child-requirements">
              child requirements
            </Link>
            ).
          </div>
          <div>
            The <code>style</code> passed to the row (or cell) renderer must
            still be applied to the element, in order to position it.
          </div>
        </Box>
      </Callout>
      <Callout intent="primary">
        Measurements depend on the available width when text wraps. When the
        width changes (e.g. on window resize), call{" "}
        <code>cache.clearAll()</code> so that cells get re-measured, as the
        examples on this page do in the <code>AutoSizer</code>{" "}
        <code>onResize</code> callback.
      </Callout>
      <SectionHeader>Dynamic height Table column</SectionHeader>
      <div>
        A <code>Table</code> can mix fixed and dynamic content. Here only the
        last column is measured (with a <code>Column</code>{" "}
        <code>cellRenderer</code>); the height of each row is determined by that
        cell.
      </div>
      <Block className="h-80">
        <DynamicHeightTableColumnExample items={LIST} />
      </Block>
      <Code html={CellMeasurerDynamicHeightTableColumnJson.html} />
      <SectionHeader>Dynamic row heights in a Grid</SectionHeader>
      <div>
        A <code>Grid</code> with fixed-width columns and dynamic row heights;
        each row is as tall as its tallest cell:
      </div>
      <Code html={CellMeasurerDynamicHeightGridJson.html} />
      <SectionHeader id="function-children">
        Function children: measure and registerChild
      </SectionHeader>
      <div>
        Instead of an element, <code>CellMeasurer</code> also accepts a function
        child. The function receives two parameters:
      </div>
      <ul className="list-disc pl-6">
        <li>
          <code>measure</code>: re-measures the cell. Call this when the
          cell&apos;s content is ready, or has changed size, after the initial
          render (for example when an image finishes loading). Calling it after
          the cell has unmounted (e.g. it scrolled out of view before the image
          loaded) does nothing. Both functions are stable.
        </li>
        <li>
          <code>registerChild</code>: specifies the DOM element to measure; it
          can be used as a <code>ref</code>. A registered element takes
          precedence over the element returned by the function.
        </li>
      </ul>
      <div>
        This example shows a <code>List</code> of images whose row heights
        can&apos;t be known until the image data has loaded:
      </div>
      <Code html={CellMeasurerImagesJson.html} />
      <SectionHeader id="child-requirements">Child requirements</SectionHeader>
      <div>
        <code>CellMeasurer</code> measures the DOM element its <code>ref</code>{" "}
        is attached to. (If the child element has a <code>ref</code> of its own,
        that <code>ref</code> still receives the element.) The child can be:
      </div>
      <ul className="list-disc pl-6">
        <li>
          A DOM element, e.g. <code>&lt;div style=&#123;style&#125;&gt;</code>.
        </li>
        <li>
          A function component that passes its <code>ref</code> along to a DOM
          element. In React 19, <code>ref</code> is a regular prop that can be
          passed to the element; in React 18, the component must use{" "}
          <code>forwardRef</code>.
        </li>
        <li>
          Anything else (e.g. a component that doesn&apos;t pass its{" "}
          <code>ref</code> along, a class component, or a fragment), as long as
          a function child passes <code>registerChild</code> to the element to
          be measured. An element registered with <code>registerChild</code>{" "}
          takes precedence over the child element, so it can also be used to
          measure an element nested within the child.
        </li>
      </ul>
      <Block className="h-80">
        <FunctionComponentExample items={FUNCTION_COMPONENT_ITEMS} />
      </Block>
      <Code html={CellMeasurerFunctionComponentJson.html} />
      <Callout intent="warning">
        If there is no DOM element to measure (e.g. the child is text, an array
        or a fragment, or a component that doesn&apos;t pass its{" "}
        <code>ref</code> along), the child is rendered as-is, the cell keeps the
        cache&apos;s default size, and a warning is logged in development mode.
      </Callout>
    </Box>
  );
}
