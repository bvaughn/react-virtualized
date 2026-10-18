import { Block, Box, Callout, Code, Header } from "react-lib-tools";
import ListVariableRowHeightsJson from "../../../public/generated/examples/ListVariableRowHeights.json";
import { Link } from "../../components/Link";
import { ListVariableRowHeights } from "./examples/ListVariableRowHeights";

export default function ListVariableRowHeightsRoute() {
  return (
    <Box direction="column" gap={4}>
      <Header section="List" title="Variable row heights" />
      <div>
        Rows don&apos;t all need to be the same height. Instead of a number,{" "}
        <code>rowHeight</code> can be a function that returns the height of a
        row given its index. In that case, also specify an{" "}
        <code>estimatedRowSize</code>; it is used to estimate the total height
        of the list before all of its rows have been measured, which makes
        scrolling more consistent.
      </div>
      <Block className="h-80">
        <ListVariableRowHeights />
      </Block>
      <Code html={ListVariableRowHeightsJson.html} />
      <Callout intent="primary">
        <code>List</code> has no way of knowing when the data behind a{" "}
        <code>rowHeight</code> function changes. If row heights change, call the{" "}
        <Link to="/list/methods#recomputeRowHeights">
          <code>recomputeRowHeights</code>
        </Link>{" "}
        method. For row heights that depend on the rendered content, see{" "}
        <Link to="/cell-measurer">CellMeasurer</Link>.
      </Callout>
    </Box>
  );
}
