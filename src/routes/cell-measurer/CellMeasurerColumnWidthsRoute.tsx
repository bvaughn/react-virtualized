import { Block, Box, Code, Header, SectionHeader } from "react-lib-tools";
import CellMeasurerDynamicWidthGridJson from "../../../public/generated/examples/CellMeasurerDynamicWidthGrid.json";
import CellMeasurerDynamicWidthMultiGridJson from "../../../public/generated/examples/CellMeasurerDynamicWidthMultiGrid.json";
import { Link } from "../../components/Link";
import { LIST } from "../../utils/data";
import { Example as DynamicWidthGridExample } from "./examples/CellMeasurerDynamicWidthGrid";

export default function CellMeasurerColumnWidthsRoute() {
  return (
    <Box direction="column" gap={4}>
      <Header section="Measuring content" title="Dynamic column widths" />
      <div>
        The approach used for{" "}
        <Link to="/cell-measurer">dynamic row heights</Link> also works in the
        other direction. This <code>Grid</code> has fixed row heights and
        columns whose width is determined by their (non-wrapping) content; the
        cache is configured with <code>fixedHeight: true</code> and its{" "}
        <code>columnWidth</code> method is used as the <code>columnWidth</code>{" "}
        prop.
      </div>
      <Block className="h-80">
        <DynamicWidthGridExample items={LIST} />
      </Block>
      <Code html={CellMeasurerDynamicWidthGridJson.html} />
      <SectionHeader>MultiGrid</SectionHeader>
      <div>
        A <code>MultiGrid</code> (with a fixed first column) whose columns have
        dynamic widths:
      </div>
      <Code html={CellMeasurerDynamicWidthMultiGridJson.html} />
    </Box>
  );
}
