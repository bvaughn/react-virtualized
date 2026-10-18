import { Block, Box, Callout, Code, Header } from "react-lib-tools";
import InfiniteLoadingListJson from "../../../public/generated/examples/InfiniteLoadingList.json";
import InfiniteLoadingListDemoJson from "../../../public/generated/examples/InfiniteLoadingListDemo.json";
import { Link } from "../../components/Link";
import { InfiniteLoadingListDemo } from "./examples/InfiniteLoadingListDemo";

export default function InfiniteLoadingListRoute() {
  return (
    <Box direction="column" gap={4}>
      <Header section="Guides" title="Infinite-loading lists" />
      <div>
        The <Link to="/infinite-loader">InfiniteLoader</Link> component was
        created to help break large data sets down into chunks that can be
        just-in-time loaded as they are scrolled into view. It can also be used
        to create an infinite-loading list (like a social media feed), where the
        total number of items isn&apos;t known up front and more items are
        loaded as the user reaches the end of the list.
      </div>
      <Block className="h-72">
        <InfiniteLoadingListDemo />
      </Block>
      <div>
        The trick is to render one extra row at the end of the list (as long as
        there are more items to load) to hold a loading indicator. That row is
        the only one that is not &quot;loaded&quot;, so when it scrolls into
        view (or within <code>InfiniteLoader</code>&apos;s{" "}
        <code>threshold</code>), <code>InfiniteLoader</code> asks for the next
        page to be loaded. Here&apos;s a basic example of how you might
        implement that:
      </div>
      <Code html={InfiniteLoadingListJson.html} />
      <div>
        The component above doesn&apos;t care where its data comes from. The
        demo on this page manages it with React state and simulates a network
        request for each page of items:
      </div>
      <Code html={InfiniteLoadingListDemoJson.html} />
      <Callout intent="primary">
        Only one page is loaded at a time: while a page is loading,{" "}
        <code>loadMoreRows</code> is a no-op, in case{" "}
        <code>InfiniteLoader</code> asks for more rows to be loaded more than
        once.
      </Callout>
    </Box>
  );
}
