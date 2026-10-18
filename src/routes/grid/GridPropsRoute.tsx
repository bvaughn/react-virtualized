import { Box, ComponentProps, type ComponentMetadata } from "react-lib-tools";
import json from "../../../public/generated/docs/Grid.json";

export default function GridPropsRoute() {
  return (
    <Box direction="column" gap={4}>
      <ComponentProps json={json as ComponentMetadata} section="Grid" />
    </Box>
  );
}
