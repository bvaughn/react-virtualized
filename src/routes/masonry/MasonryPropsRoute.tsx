import { Box, ComponentProps, type ComponentMetadata } from "react-lib-tools";
import json from "../../../public/generated/docs/Masonry.json";

export default function MasonryPropsRoute() {
  return (
    <Box direction="column" gap={4}>
      <ComponentProps json={json as ComponentMetadata} section="Masonry" />
    </Box>
  );
}
