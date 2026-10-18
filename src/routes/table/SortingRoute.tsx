import {
  Block,
  Box,
  Callout,
  Code,
  Header,
  SectionHeader
} from "react-lib-tools";
import SortIndicatorHeaderJson from "../../../public/generated/examples/SortIndicatorHeader.json";
import SortTableBasicJson from "../../../public/generated/examples/SortTableBasic.json";
import { Link } from "../../components/Link";
import { SortTableBasic } from "./examples/SortTableBasic";

export default function SortingRoute() {
  return (
    <Box direction="column" gap={4}>
      <Header section="Table" title="Sorting" />
      <div>
        <code>Table</code> headers can be made sortable. Click a column header
        below to sort by it; click it again to reverse the sort direction.
      </div>
      <Block className="p-0!" data-focus-within="bold">
        <div>
          <SortTableBasic />
        </div>
      </Block>
      <div>
        <code>Table</code> does not sort data itself. Instead, it tells you how
        the data should be sorted, and renders the current sort state:
      </div>
      <ul className="list-disc pl-6 flex flex-col gap-1">
        <li>
          <code>sort</code> is called when a sortable header is clicked (or
          activated with the ENTER or SPACE key). It is passed the{" "}
          <code>sortBy</code> (the clicked column's <code>dataKey</code>) and
          the suggested <code>sortDirection</code>, as well as the column's{" "}
          <code>defaultSortDirection</code> and the DOM <code>event</code>. Sort
          your data accordingly, and update your state to re-render the table.
        </li>
        <li>
          <code>sortBy</code> is the <code>dataKey</code> that data is currently
          sorted by (if it is sorted at all).
        </li>
        <li>
          <code>sortDirection</code> is the direction data is currently sorted
          in (if it is sorted at all).
        </li>
      </ul>
      <Code html={SortTableBasicJson.html} />
      <div>
        Headers are only sortable if a <code>sort</code> function is provided.
        Individual columns can opt out with the <code>disableSort</code> prop. A
        column's <code>defaultSortDirection</code> (<code>"ASC"</code> by
        default) controls the suggested direction when it is first clicked;
        clicking it again suggests the opposite direction. See{" "}
        <Link to="/table/column-props">Column props</Link> for more.
      </div>
      <SectionHeader>SortDirection</SectionHeader>
      <div>
        The <code>SortDirection</code> constant specifies which direction data
        is sorted in:
      </div>
      <ul className="list-disc pl-6 flex flex-col gap-1">
        <li>
          <code>SortDirection.ASC</code> (<code>"ASC"</code>) sorts items in
          ascending order, from the lowest value to the highest (e.g. a-z, 0-9).
        </li>
        <li>
          <code>SortDirection.DESC</code> (<code>"DESC"</code>) sorts items in
          descending order, from the highest value to the lowest (e.g. z-a,
          9-0).
        </li>
      </ul>
      <SectionHeader>SortIndicator</SectionHeader>
      <div>
        The default header renderer shows a <code>SortIndicator</code> (an arrow
        icon) beside the label of the column the table is sorted by. If you
        render custom headers, you can use <code>SortIndicator</code> to show
        the sort direction yourself:
      </div>
      <Code html={SortIndicatorHeaderJson.html} />
      <SectionHeader>Returning to the natural order</SectionHeader>
      <div>
        Once a <code>Table</code> has been sorted, the built-in sort directions
        only toggle between ascending and descending; there is no way to return
        to the unsorted, &ldquo;natural&rdquo; order. The{" "}
        <Link to="/guides/natural-sort-table">natural sort tables</Link> guide
        shows how to implement this in your application code.
      </div>
      <SectionHeader>Sorting by multiple columns</SectionHeader>
      <div>
        By default, <code>Table</code> assumes that its data will be sorted by a
        single attribute. The <code>createTableMultiSort</code> utility can be
        used to sort by multiple fields; see the{" "}
        <Link to="/guides/multi-column-sort-table">
          multi-column sort tables
        </Link>{" "}
        guide.
      </div>
      <Callout intent="primary">
        Sorting large data sets can be expensive; memoize the sorted data (e.g.
        with <code>useMemo</code>) so that it is only re-sorted when the sort
        criteria change.
      </Callout>
    </Box>
  );
}
