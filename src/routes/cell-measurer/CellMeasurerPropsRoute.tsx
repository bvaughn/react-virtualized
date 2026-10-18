import {
  Box,
  ComponentPropsSection,
  DocsSection,
  Header,
  type ComponentMetadata
} from "react-lib-tools";
import json from "../../../public/generated/docs/CellMeasurer.json";

const { description, filePath, props } = json as ComponentMetadata;
const propsList = Object.values(props).sort((a, b) =>
  a.name.localeCompare(b.name)
);

export default function CellMeasurerPropsRoute() {
  return (
    <Box direction="column" gap={4}>
      <Header
        section="Measuring content"
        sourceCodePath={filePath}
        title="CellMeasurer props"
      />
      <DocsSection sections={description} />
      <ComponentPropsSection
        header="Required props"
        props={propsList.filter((prop) => prop.required)}
      />
      <ComponentPropsSection
        header="Optional props"
        props={propsList.filter((prop) => !prop.required)}
      />
    </Box>
  );
}
