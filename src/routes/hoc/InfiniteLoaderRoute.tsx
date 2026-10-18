import {
  Block,
  Box,
  Callout,
  Code,
  ComponentPropsSection,
  Header,
  SectionHeader,
  type ComponentMetadata
} from "react-lib-tools";
import json from "../../../public/generated/docs/InfiniteLoader.json";
import imperativeApiJson from "../../../public/generated/docs/InfiniteLoaderImperativeAPI.json";
import InfiniteLoaderBasicJson from "../../../public/generated/examples/InfiniteLoaderBasic.json";
import InfiniteLoaderGridJson from "../../../public/generated/examples/InfiniteLoaderGrid.json";
import InfiniteLoaderListJson from "../../../public/generated/examples/InfiniteLoaderList.json";
import InfiniteLoaderResetCacheJson from "../../../public/generated/examples/InfiniteLoaderResetCache.json";
import { Link } from "../../components/Link";
import { Methods } from "../../components/Methods";
import { InfiniteLoaderList } from "./examples/InfiniteLoaderList";

const props = Object.values((json as ComponentMetadata).props);

export default function InfiniteLoaderRoute() {
  return (
    <Box direction="column" gap={4}>
      <Header section="Higher-order components" title="InfiniteLoader" />
      <div>
        <code>InfiniteLoader</code> manages just-in-time fetching of data as a
        user scrolls up or down in a list. It ensures that all visible rows have
        been loaded, and uses a <code>threshold</code> to determine how early to
        pre-fetch rows (before a user scrolls to them).
      </div>
      <div>
        This component is intended to assist with row-loading, so it is best
        suited for use with <Link to="/list">List</Link> and{" "}
        <Link to="/table">Table</Link> (although it can also be used with{" "}
        <Link to="/grid">Grid</Link>).
      </div>
      <Block className="h-72">
        <InfiniteLoaderList />
      </Block>
      <Callout intent="warning">
        This is an advanced component and can be confusing in certain
        situations. See the edge cases and considerations section below for more
        information.
      </Callout>
      <SectionHeader>Usage</SectionHeader>
      <div>
        <code>InfiniteLoader</code> uses a render function as its child. That
        function receives two parameters, which should be passed to the
        virtualized component it renders:
      </div>
      <ul className="list-disc pl-6">
        <li>
          <code>onRowsRendered</code> should be passed as the child&apos;s{" "}
          <code>onRowsRendered</code> prop. It informs the loader when the user
          is scrolling.
        </li>
        <li>
          <code>registerChild</code> should be set as the child&apos;s{" "}
          <code>ref</code>. It enables a set of rows to be refreshed once their
          data has finished loading.
        </li>
      </ul>
      <div>
        The <code>isRowLoaded</code> prop tells the loader which rows have
        already been loaded, and <code>loadMoreRows</code> is called to load
        rows that haven&apos;t been. <code>loadMoreRows</code> should return a
        Promise that resolves once the data has finished loading; it is used to
        determine when to refresh the list with the newly-loaded data.
      </div>
      <Code html={InfiniteLoaderBasicJson.html} />
      <div>
        The number of rows to load at a time can be tuned with the{" "}
        <code>minimumBatchSize</code> prop (e.g. to reduce the number of HTTP
        requests), and how early rows are pre-fetched with the{" "}
        <code>threshold</code> prop. To build a list that loads more items as
        the user reaches its end (e.g. a feed), see{" "}
        <Link to="/guides/infinite-loading-list">infinite-loading lists</Link>.
      </div>
      <SectionHeader>Using InfiniteLoader with Grid</SectionHeader>
      <div>
        It is not common to use <code>InfiniteLoader</code> and{" "}
        <code>Grid</code> together but it is possible, by mapping the range of
        rendered cells to a range of &quot;rows&quot; (one per cell):
      </div>
      <Code html={InfiniteLoaderGridJson.html} />
      <SectionHeader>Edge cases and considerations</SectionHeader>
      <div className="font-bold">Tracking loaded (and loading) rows</div>
      <div>
        <code>InfiniteLoader</code> is not a stateful component, meaning that it
        does not keep track of which rows it has requested to be loaded. Your
        component will need to track this information itself to avoid loading
        rows multiple times. One way to do this is to use a map to track the
        status of each row: rows with no entry have never been requested, and
        rows with an entry (either &quot;loading&quot; or &quot;loaded&quot;)
        can be treated as loaded as far as <code>InfiniteLoader</code> is
        concerned. The demo at the top of this page does this:
      </div>
      <Code html={InfiniteLoaderListJson.html} />
      <div className="font-bold">Memoization and data changes</div>
      <div>
        <code>InfiniteLoader</code> memoizes calls to <code>loadMoreRows</code>{" "}
        in order to avoid multiple calls with the same parameters while a user
        is scrolling. This can have an unexpected impact if the underlying data
        changes: <code>InfiniteLoader</code> may not know to call{" "}
        <code>loadMoreRows</code> again because, from its point of view, it
        already made that call for a given range of rows. (React Virtualized
        components know nothing about the underlying data, only the number of
        items in the collection.)
      </div>
      <div>
        To address this, call the{" "}
        <Link to="/infinite-loader#resetLoadMoreRowsCache">
          <code>resetLoadMoreRowsCache</code>
        </Link>{" "}
        method (through a <code>ref</code>) when the underlying data may have
        changed, e.g. a filtered list whose search criteria changes.
        (Alternately, your application can call its own{" "}
        <code>loadMoreRows</code> function again with the most recently
        requested range.)
      </div>
      <Code html={InfiniteLoaderResetCacheJson.html} />
      <Methods json={imperativeApiJson} />
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
