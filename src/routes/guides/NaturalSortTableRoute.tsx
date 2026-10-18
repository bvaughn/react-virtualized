import { Block, Box, Code, Header } from "react-lib-tools";
import NaturalSortTableJson from "../../../public/generated/examples/NaturalSortTable.json";
import { Link } from "../../components/Link";
import { NaturalSortTable } from "./examples/NaturalSortTable";

export default function NaturalSortTableRoute() {
  return (
    <Box direction="column" gap={4}>
      <Header section="Guides" title="Natural sort tables" />
      <div>
        By default, <code>Table</code> assumes that sortable rows can be sorted
        in ascending or descending order. Clicking a column header the first
        time calls the <code>sort</code> callback with a suggested ordering of{" "}
        <em>ascending</em>. Clicking it a second time suggests{" "}
        <em>descending</em>, and clicking a third time suggests{" "}
        <em>ascending</em> again.
      </div>
      <div>
        This is often desirable, but it has a subtle side effect: once a{" "}
        <code>Table</code> has been sorted, there is no way to return to the
        unsorted, &ldquo;natural&rdquo; order.
      </div>
      <div>
        Fortunately this is easy to implement in your application code. In the
        table below, clicking a column header a third time returns the rows to
        their natural order:
      </div>
      <Block className="p-0!" data-focus-within="bold">
        <div>
          <NaturalSortTable />
        </div>
      </Block>
      <div>
        Rather than always applying the suggested direction, the{" "}
        <code>sort</code> callback checks whether the table was already sorted
        in descending order by the clicked column. If it was, it clears the sort
        state (so that <code>sortBy</code> and <code>sortDirection</code> are{" "}
        <code>undefined</code>) and the unsorted list is rendered:
      </div>
      <Code html={NaturalSortTableJson.html} />
      <div>
        See <Link to="/table/sorting">sorting</Link> for more about how{" "}
        <code>Table</code> sorting works.
      </div>
    </Box>
  );
}
