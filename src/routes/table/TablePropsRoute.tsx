import { Box, ComponentProps, type ComponentMetadata } from "react-lib-tools";
import json from "../../../public/generated/docs/Table.json";

export default function TablePropsRoute() {
  return (
    <Box direction="column" gap={4}>
      <ComponentProps json={json as ComponentMetadata} section="Table" />
    </Box>
  );
}
