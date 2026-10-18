import {
  Block,
  Box,
  Callout,
  Code,
  Header,
  SectionHeader
} from "react-lib-tools";
import MultiColumnSortTableJson from "../../../public/generated/examples/MultiColumnSortTable.json";
import MultiColumnSortTableCallbackJson from "../../../public/generated/examples/MultiColumnSortTableCallback.json";
import MultiColumnSortTableDefaultsJson from "../../../public/generated/examples/MultiColumnSortTableDefaults.json";
import { Link } from "../../components/Link";
import { MultiColumnSortTable } from "./examples/MultiColumnSortTable";

export default function MultiColumnSortTableRoute() {
  return (
    <Box direction="column" gap={4}>
      <Header section="Guides" title="Multi-column sort tables" />
      <div>
        By default, <code>Table</code> assumes that its data will be sorted by a
        single attribute, in either ascending or descending order. For advanced
        use cases, you may want to sort by multiple fields. This can be
        accomplished using the <code>createTableMultiSort</code> utility.
      </div>
      <Block className="p-0!" data-focus-within="bold">
        <div>
          <MultiColumnSortTable />
        </div>
      </Block>
      <div>Try it out in the table above:</div>
      <ul className="list-disc pl-6 flex flex-col gap-1">
        <li>
          Click a column header to sort by that column only (or to reverse its
          sort direction).
        </li>
        <li>
          SHIFT + click a column header to add it to the existing sort criteria
          (or to reverse its direction if it is already included).
        </li>
        <li>
          CONTROL + click (or META + click) a column header to remove it from
          the sort criteria.
        </li>
      </ul>
      <SectionHeader>How it works</SectionHeader>
      <div>
        <code>createTableMultiSort</code> is passed a callback function, which
        it calls whenever the sort criteria change. It returns an object with
        three properties:
      </div>
      <ul className="list-disc pl-6 flex flex-col gap-1">
        <li>
          <code>sort</code>: a function to pass to the <code>Table</code>{" "}
          <code>sort</code> prop; it updates the sort criteria in response to
          header clicks.
        </li>
        <li>
          <code>sortBy</code>: an ordered array of the fields data is sorted by,
          in order of importance.
        </li>
        <li>
          <code>sortDirection</code>: a map of field name to its sort direction
          (<code>"ASC"</code> or <code>"DESC"</code>).
        </li>
      </ul>
      <Code html={MultiColumnSortTableCallbackJson.html} />
      <div>
        Because the <code>Table</code> <code>sortBy</code> and{" "}
        <code>sortDirection</code> props only describe a single column, they
        should be left <code>undefined</code>. Instead, use a custom{" "}
        <code>headerRenderer</code> to show a{" "}
        <Link to="/table/sorting">
          <code>SortIndicator</code>
        </Link>{" "}
        for each of the sorted columns:
      </div>
      <Code html={MultiColumnSortTableJson.html} />
      <Callout intent="primary">
        New <code>sortBy</code> and <code>sortDirection</code> values are
        created each time the sort criteria change (previous values are never
        mutated), so they can be stored in React state as they are. In version
        9, they were mutated in place and had to be copied first.
      </Callout>
      <SectionHeader>Default sort criteria</SectionHeader>
      <div>
        <code>createTableMultiSort</code> also accepts default sort-by values.
        Fields without a default direction are sorted in ascending order.
      </div>
      <Code html={MultiColumnSortTableDefaultsJson.html} />
    </Box>
  );
}
