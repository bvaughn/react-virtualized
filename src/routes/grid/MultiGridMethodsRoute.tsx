import {
  Box,
  ImperativeHandle,
  type ImperativeHandleMetadata
} from "react-lib-tools";
import json from "../../../public/generated/docs/MultiGridImperativeAPI.json";
import { Link } from "../../components/Link";

export default function MultiGridMethodsRoute() {
  return (
    <Box direction="column" gap={4}>
      <ImperativeHandle
        json={{
          ...(json as ImperativeHandleMetadata),
          name: "MultiGrid methods"
        }}
        section="Grid"
      />
      <div>
        <code>MultiGrid</code>&apos;s methods can be called through a{" "}
        <code>ref</code> (typed as <code>MultiGridImperativeAPI</code>). Indices
        passed to <code>scrollToCell</code> include the fixed rows and columns,
        and the fixed rows and columns are kept in sync with the scrollable
        section. (In version 10, these methods replace the{" "}
        <code>scrollToRow</code>, <code>scrollToColumn</code>,{" "}
        <code>scrollToAlignment</code>, <code>scrollTop</code> and{" "}
        <code>scrollLeft</code> props.) See{" "}
        <Link to="/grid/methods">Grid methods</Link> for more information about
        the underlying <code>Grid</code> methods.
      </div>
    </Box>
  );
}
