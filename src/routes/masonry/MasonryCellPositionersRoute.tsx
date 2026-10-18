import { Box, Callout, Code, Header, SectionHeader } from "react-lib-tools";
import MasonryCellPositionerJson from "../../../public/generated/examples/MasonryCellPositioner.json";
import MasonryCellPositionerResetJson from "../../../public/generated/examples/MasonryCellPositionerReset.json";
import MasonryCustomPositionerJson from "../../../public/generated/examples/MasonryCustomPositioner.json";
import { Link } from "../../components/Link";

export default function MasonryCellPositionersRoute() {
  return (
    <Box direction="column" gap={4}>
      <Header section="Masonry" title="Cell positioners" />
      <div>
        A cell positioner is a function that is given a cell index and returns
        the cell&apos;s position: <code>{"(index) => ({ left, top })"}</code>.
        It is called in index order, once for each cell, after that cell has
        been measured; so it can read the cell&apos;s height (and the heights of
        all earlier cells) from the <code>CellMeasurerCache</code>. The
        positions it returns are cached by <code>Masonry</code>.
      </div>
      <SectionHeader>createMasonryCellPositioner</SectionHeader>
      <div>
        <code>Masonry</code> provides a built-in positioner,{" "}
        <code>createMasonryCellPositioner</code>, for a simple column layout. It
        places each cell into the column that is currently the shortest. It
        requires a few configuration settings:
      </div>
      <Code html={MasonryCellPositionerJson.html} />
      <SectionHeader>Updating the layout</SectionHeader>
      <div>
        If any of these settings change due to external changes (eg a window
        resize event), update them using the positioner&apos;s{" "}
        <code>reset</code> method and then tell <code>Masonry</code> to
        re-position its cells using{" "}
        <Link to="/masonry/methods#recomputeCellPositions">
          <code>recomputeCellPositions()</code>
        </Link>
        :
      </div>
      <Code html={MasonryCellPositionerResetJson.html} />
      <Callout intent="warning">
        Unlike <code>createMasonryCellPositioner</code>, <code>reset</code> does
        not default <code>spacer</code> to 0; always specify it.
      </Callout>
      <SectionHeader>Custom positioners</SectionHeader>
      <div>
        Custom layouts can be implemented with a custom positioner. Because the
        positioner tracks layout state as it goes (eg the height of each
        column), it needs a way to be reset before <code>Masonry</code>{" "}
        re-positions its cells:
      </div>
      <Code html={MasonryCustomPositionerJson.html} />
    </Box>
  );
}
