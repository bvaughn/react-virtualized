import {
  Block,
  Box,
  Code,
  ImperativeHandle,
  SectionHeader,
  type ImperativeHandleMetadata
} from "react-lib-tools";
import { AutoSizer } from "react-virtualized-auto-sizer";
import json from "../../../public/generated/docs/GridImperativeAPI.json";
import GridMethodsRefJson from "../../../public/generated/examples/GridMethodsRef.json";
import { Link } from "../../components/Link";
import { GridMethodsRef } from "./examples/GridMethodsRef";

export default function GridMethodsRoute() {
  return (
    <Box direction="column" gap={4}>
      <ImperativeHandle
        json={{ ...(json as ImperativeHandleMetadata), name: "Grid methods" }}
        section="Grid"
      />
      <SectionHeader>Calling methods</SectionHeader>
      <div>
        <code>Grid</code>&apos;s methods can be called through a{" "}
        <code>ref</code> (typed as <code>GridImperativeAPI</code>). In version
        10, these methods replace the <code>scrollToRow</code>,{" "}
        <code>scrollToColumn</code>, <code>scrollToAlignment</code>,{" "}
        <code>scrollTop</code> and <code>scrollLeft</code> props; see{" "}
        <Link to="/grid/scroll-to-cell">scrolling to a cell</Link>:
      </div>
      <Block className="h-[250px]">
        <AutoSizer
          renderProp={({ width }) =>
            width !== undefined ? <GridMethodsRef width={width} /> : null
          }
        />
      </Block>
      <Code html={GridMethodsRefJson.html} />
    </Box>
  );
}
