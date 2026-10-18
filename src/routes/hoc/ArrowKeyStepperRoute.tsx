import { useState } from "react";
import {
  Block,
  Box,
  Callout,
  Code,
  ComponentPropsSection,
  Header,
  Radio,
  SectionHeader,
  type ComponentMetadata
} from "react-lib-tools";
import { AutoSizer } from "react-virtualized-auto-sizer";
import json from "../../../public/generated/docs/ArrowKeyStepper.json";
import methodsJson from "../../../public/generated/docs/ArrowKeyStepperImperativeAPI.json";
import ArrowKeyStepperControlledJson from "../../../public/generated/examples/ArrowKeyStepperControlled.json";
import ArrowKeyStepperGridJson from "../../../public/generated/examples/ArrowKeyStepperGrid.json";
import { Link } from "../../components/Link";
import { Methods } from "../../components/Methods";
import { ArrowKeyStepperControlled } from "./examples/ArrowKeyStepperControlled";
import { ArrowKeyStepperGrid } from "./examples/ArrowKeyStepperGrid";

type Mode = "cells" | "edges";

const props = Object.values((json as ComponentMetadata).props);

export default function ArrowKeyStepperRoute() {
  const [mode, setMode] = useState<Mode>("edges");

  return (
    <Box direction="column" gap={4}>
      <Header section="Higher-order components" title="ArrowKeyStepper" />
      <div>
        <code>ArrowKeyStepper</code> decorates a virtualized component (such as
        a <Link to="/grid">Grid</Link>, <Link to="/list">List</Link>, or{" "}
        <Link to="/table">Table</Link>) and responds to arrow-key events by
        scrolling one row or column at a time. This provides a snap-to behavior
        rather than the default browser scrolling behavior.
      </div>
      <div>
        Click inside the grid below to focus it, then use the up, down, left,
        and right arrow keys to move around:
      </div>
      <Box direction="row" gap={4}>
        <Radio
          checked={mode === "edges"}
          name="mode"
          onChange={setMode}
          value="edges"
        >
          mode: &quot;edges&quot; (default)
        </Radio>
        <Radio
          checked={mode === "cells"}
          name="mode"
          onChange={setMode}
          value="cells"
        >
          mode: &quot;cells&quot;
        </Radio>
      </Box>
      <Block className="h-[245px]">
        <AutoSizer
          renderProp={({ width }) =>
            width !== undefined ? (
              <ArrowKeyStepperGrid mode={mode} width={width} />
            ) : null
          }
        />
      </Block>
      <div>
        <code>ArrowKeyStepper</code> uses a render function as its children.
        Pass the <code>onSectionRendered</code> parameter through to the
        decorated component (it informs the stepper which range of cells is
        currently visible) and attach the <code>registerChild</code> parameter
        as its <code>ref</code>; whenever the active cell changes, the stepper
        scrolls it into view by calling the component&apos;s{" "}
        <code>scrollToCell</code> method. The <code>scrollToColumn</code> and{" "}
        <code>scrollToRow</code> parameters identify the active cell, e.g. to
        highlight it.
      </div>
      <Code html={ArrowKeyStepperGridJson.html} />
      <div>
        The <code>mode</code> prop controls how the stepper behaves when an
        arrow key is pressed: in <code>&quot;edges&quot;</code> mode (the
        default), the next row or column beyond the visible edge of the grid is
        scrolled into view; in <code>&quot;cells&quot;</code> mode, the current
        row or column index is only incremented or decremented by 1.
      </div>
      <Callout intent="warning">
        Unlike the other HOCs in react-virtualized, <code>ArrowKeyStepper</code>{" "}
        adds a <code>&lt;div&gt;</code> element around its children in order to
        attach a key-down event handler. The appearance of this wrapper element
        can be customized using the <code>className</code> property.
      </Callout>
      <SectionHeader>Controlled mode</SectionHeader>
      <div>
        By default, <code>ArrowKeyStepper</code> manages the current{" "}
        <code>scrollToColumn</code> and <code>scrollToRow</code> values itself
        (the props of the same name only set their initial values). To manage
        them yourself, e.g. to also select a cell by clicking it, set{" "}
        <code>isControlled</code> and update the values in response to{" "}
        <code>onScrollToChange</code>. The registered child is scrolled whenever
        the controlled values change. Click a cell below, then use the arrow
        keys:
      </div>
      <Block className="h-[214px]">
        <AutoSizer
          renderProp={({ width }) =>
            width !== undefined ? (
              <ArrowKeyStepperControlled width={width} />
            ) : null
          }
        />
      </Block>
      <Code html={ArrowKeyStepperControlledJson.html} />
      <div>
        Arrow-key stepping can be turned off with the <code>disabled</code>{" "}
        prop. An uncontrolled stepper&apos;s current values can also be
        overridden imperatively, through a <code>ref</code> (see{" "}
        <a href="#methods">methods</a> below).
      </div>
      <ComponentPropsSection
        header="Required props"
        props={props.filter((prop) => prop.required)}
      />
      <ComponentPropsSection
        header="Optional props"
        props={props.filter((prop) => !prop.required)}
      />
      <Methods json={methodsJson} />
    </Box>
  );
}
