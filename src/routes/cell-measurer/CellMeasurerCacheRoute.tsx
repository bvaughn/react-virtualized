import {
  Box,
  Callout,
  Code,
  ComponentPropsSection,
  Header,
  SectionHeader,
  type ComponentMetadata
} from "react-lib-tools";
import optionsJson from "../../../public/generated/docs/CellMeasurerCacheOptions.json";
import methodsJson from "../../../public/generated/docs/CellMeasurerCacheAPI.json";
import CellMeasurerCacheClearJson from "../../../public/generated/examples/CellMeasurerCacheClear.json";
import CellMeasurerKeyMapperJson from "../../../public/generated/examples/CellMeasurerKeyMapper.json";
import { Link } from "../../components/Link";
import { Methods } from "../../components/Methods";

const options = Object.values((optionsJson as ComponentMetadata).props);

export default function CellMeasurerCacheRoute() {
  return (
    <Box direction="column" gap={4}>
      <Header
        section="Measuring content"
        sourceCodePath={optionsJson.filePath}
        title="CellMeasurerCache"
      />
      <div>
        <code>CellMeasurerCache</code> stores <code>CellMeasurer</code>{" "}
        measurements and shares them with the parent <code>Grid</code> (or{" "}
        <code>List</code>, <code>Table</code>, etc.). Create one cache per
        virtualized component and keep it for the lifetime of that component
        (e.g. in <code>useState</code> or <code>useMemo</code>, or in a class
        instance field) rather than re-creating it on every render.
      </div>
      <div>
        It should be configured based on the type of measurements you need. The
        constructor accepts the following (optional) parameters:
      </div>
      <ComponentPropsSection header="Options" props={options} />
      <Callout intent="warning">
        While all of the parameters above are optional, you should specify
        either <code>fixedWidth</code> or <code>fixedHeight</code>.{" "}
        <code>CellMeasurerCache</code> is not meant to measure cells that are
        both dynamic width <em>and</em> height; it would be inefficient to do so
        since the size of a row (or column) is equal to the largest cell within
        that row. A warning is logged in development mode if neither is
        specified.
      </Callout>
      <div>
        A custom <code>keyMapper</code> can also speed things up when every cell
        is known to have the same (but not known ahead of time) size:
      </div>
      <Code html={CellMeasurerKeyMapperJson.html} />
      {/* (defaultHeight and defaultWidth are both options and properties) */}
      <Methods idPrefix="methods-" json={methodsJson} />
      <SectionHeader>Clearing measurements</SectionHeader>
      <div>
        For example, a row that can be expanded and collapsed should clear its
        cached measurement when it changes, and tell the <code>List</code> to
        recompute its layout (see <Link to="/list/methods">List methods</Link>):
      </div>
      <Code html={CellMeasurerCacheClearJson.html} />
    </Box>
  );
}
