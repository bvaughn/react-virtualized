import {
  Box,
  ComponentPropsSection,
  Header,
  type ComponentMetadata
} from "react-lib-tools";
import gridJson from "../../../public/generated/docs/Grid.json";
import json from "../../../public/generated/docs/MultiGrid.json";
import { Link } from "../../components/Link";

const gridPropNames = new Set(Object.keys(gridJson.props));
const props = Object.values((json as ComponentMetadata).props);

// Props that are specific to MultiGrid (or that MultiGrid handles differently than Grid)
const multiGridProps = props.filter(
  (prop) => !gridPropNames.has(prop.name) || prop.name === "style"
);

export default function MultiGridPropsRoute() {
  return (
    <Box direction="column" gap={4}>
      <Header section="Grid" title="MultiGrid props" />
      <div>
        <code>MultiGrid</code> accepts most of the{" "}
        <Link to="/grid/props">Grid props</Link> (except{" "}
        <code>scrollElement</code>); see{" "}
        <Link to="/grid/fixed-rows-and-columns">fixed rows and columns</Link>.
        The props below are specific to <code>MultiGrid</code> (or are handled
        differently than by <code>Grid</code>).
      </div>
      <ComponentPropsSection
        header="Required props"
        props={props.filter((prop) => prop.required)}
      />
      <ComponentPropsSection
        header="MultiGrid props"
        props={multiGridProps.filter((prop) => !prop.required)}
      />
      <div>
        All other optional <Link to="/grid/props">Grid props</Link> are also
        supported.
      </div>
    </Box>
  );
}
