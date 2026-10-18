import { Block, Box, Callout, Code, Header } from "react-lib-tools";
import ListScrollToRowJson from "../../../public/generated/examples/ListScrollToRow.json";
import { Link } from "../../components/Link";
import { ListScrollToRow } from "./examples/ListScrollToRow";

export default function ListScrollToRowRoute() {
  return (
    <Box direction="column" gap={4}>
      <Header section="List" title="Scrolling to a row" />
      <div>
        The{" "}
        <Link to="/list/methods#scrollToRow">
          <code>scrollToRow</code>
        </Link>{" "}
        method ensures that a row is visible, scrolling the list if necessary.
        Call it through a <code>ref</code> to the list. By default (
        <code>&quot;auto&quot;</code>) the list scrolls the least amount
        possible to make the row fully visible (a row taller than the list is
        scrolled to its start); use the <code>align</code> parameter to align
        the row to the <code>&quot;start&quot;</code>,{" "}
        <code>&quot;center&quot;</code>, or <code>&quot;end&quot;</code> of the
        list instead.
      </div>
      <Block className="h-72">
        <ListScrollToRow />
      </Block>
      <Code html={ListScrollToRowJson.html} />
      <div>
        <code>scrollToRow</code> is a one-time scroll: the list doesn&apos;t
        remember the row, so it isn&apos;t kept in view if the list&apos;s size,
        its row heights or its row count change afterwards. To scroll to a row
        that is being added, call <code>scrollToRow</code> once the list has
        rendered it (e.g. in an effect). Rows that haven&apos;t been measured
        yet (e.g. by <Link to="/cell-measurer">CellMeasurer</Link>) are
        positioned using their estimated heights.
      </div>
      <Callout intent="primary">
        In version 10, the <code>scrollToIndex</code>,{" "}
        <code>scrollToAlignment</code> and <code>scrollTop</code> props were
        replaced by the <code>scrollToRow</code> and{" "}
        <code>scrollToPosition</code> <Link to="/list/methods">methods</Link>,
        and the <code>autoHeight</code> and <code>isScrolling</code> props were
        removed: to scroll a <code>List</code> with the window, set its{" "}
        <Link to="/window-scrolling">
          <code>scrollElement</code>
        </Link>{" "}
        prop to <code>&quot;window&quot;</code>, in which case{" "}
        <code>scrollToRow</code> scrolls the window. The same applies to{" "}
        <Link to="/table/methods">Table</Link>.
      </Callout>
    </Box>
  );
}
