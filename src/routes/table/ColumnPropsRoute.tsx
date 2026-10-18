import {
  Box,
  Callout,
  ComponentProps,
  type ComponentMetadata
} from "react-lib-tools";
import json from "../../../public/generated/docs/Column.json";
import { Link } from "../../components/Link";

export default function ColumnPropsRoute() {
  return (
    <Box direction="column" gap={4}>
      <ComponentProps json={json as ComponentMetadata} section="Table" />
      <Callout intent="primary">
        <code>Table</code> reads these props from each of its children (with the
        defaults above, exported as <code>defaultColumnProps</code>, applied),
        so components that wrap <code>Column</code> work as columns too;
        subclassing <code>Column</code> is no longer supported. See{" "}
        <Link to="/table">column components</Link>.
      </Callout>
    </Box>
  );
}
