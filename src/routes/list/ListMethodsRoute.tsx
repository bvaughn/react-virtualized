import {
  Block,
  Box,
  Code,
  ImperativeHandle,
  SectionHeader,
  type ImperativeHandleMetadata
} from "react-lib-tools";
import json from "../../../public/generated/docs/ListImperativeAPI.json";
import ListMethodsJson from "../../../public/generated/examples/ListMethods.json";
import ListRecomputeRowHeightsJson from "../../../public/generated/examples/ListRecomputeRowHeights.json";
import { Link } from "../../components/Link";
import { ListMethods } from "./examples/ListMethods";

export default function ListMethodsRoute() {
  return (
    <Box direction="column" gap={4}>
      <ImperativeHandle
        json={{ ...(json as ImperativeHandleMetadata), name: "List methods" }}
        section="List"
      />
      <SectionHeader>Calling methods</SectionHeader>
      <div>
        <code>List</code>&apos;s methods can be called through a{" "}
        <code>ref</code>. The example below uses <code>scrollToRow</code> to
        scroll the list. In version 10, these methods replace the{" "}
        <code>scrollToIndex</code>, <code>scrollToAlignment</code> and{" "}
        <code>scrollTop</code> props; see{" "}
        <Link to="/list/scroll-to-row">scrolling to a row</Link>:
      </div>
      <Block className="h-72">
        <ListMethods />
      </Block>
      <Code html={ListMethodsJson.html} />
      <div>
        To compute the offset of a row without scrolling to it, use{" "}
        <code>getOffsetForRow</code>; it accepts the same <code>align</code>{" "}
        parameter as <code>scrollToRow</code> (e.g.{" "}
        <code>getOffsetForRow({'{ align: "center", index: 500 }'})</code>). The{" "}
        <code>alignment</code> parameter of earlier versions is deprecated but
        still supported.
      </div>
      <SectionHeader>Recomputing row heights</SectionHeader>
      <div>
        When a <code>rowHeight</code> function is used and the data behind it
        changes, call <code>recomputeRowHeights</code> so that the list
        re-measures its rows:
      </div>
      <Code html={ListRecomputeRowHeightsJson.html} />
    </Box>
  );
}
