import { Box, ComponentProps, type ComponentMetadata } from "react-lib-tools";
import json from "../../../public/generated/docs/List.json";

export default function ListPropsRoute() {
  return (
    <Box direction="column" gap={4}>
      <ComponentProps json={json as ComponentMetadata} section="List" />
    </Box>
  );
}
