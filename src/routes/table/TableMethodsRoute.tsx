import {
  Block,
  Box,
  Code,
  ImperativeHandle,
  SectionHeader,
  type ImperativeHandleMetadata
} from "react-lib-tools";
import json from "../../../public/generated/docs/TableImperativeAPI.json";
import TableImperativeMethodsJson from "../../../public/generated/examples/TableImperativeMethods.json";
import { Link } from "../../components/Link";
import { TableImperativeMethods } from "./examples/TableImperativeMethods";

export default function TableMethodsRoute() {
  return (
    <Box direction="column" gap={4}>
      <ImperativeHandle
        json={{ ...(json as ImperativeHandleMetadata), name: "Table methods" }}
        section="Table"
      />
      <SectionHeader>Calling methods</SectionHeader>
      <div>
        <code>Table</code>&apos;s methods can be called through a{" "}
        <code>ref</code>. The example below uses <code>scrollToRow</code> (with
        an <code>align</code> parameter) and <code>scrollToPosition</code>. As
        with <Link to="/list/scroll-to-row">List</Link>, these are one-time
        scrolls (the row isn&apos;t kept in view if the table&apos;s size or row
        heights change afterwards). In version 10, these methods replace the{" "}
        <code>scrollToIndex</code>, <code>scrollToAlignment</code> and{" "}
        <code>scrollTop</code> props.
      </div>
      <Block className="p-2" data-focus-within="bold">
        <TableImperativeMethods />
      </Block>
      <Code html={TableImperativeMethodsJson.html} />
    </Box>
  );
}
