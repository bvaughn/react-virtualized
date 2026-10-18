// @vitest-environment node

import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Grid } from "../../components/Grid/Grid";
import { List } from "../../components/List/List";
import { Column } from "../../components/Table/Column";
import { Table } from "../../components/Table/Table";

// Server rendering: the scroll element can't be measured, so the height prop is used as the viewport height
describe("scrollElement (server rendering)", () => {
  it("should render a List at its full height, with the first rows (within the fallback height)", () => {
    const html = renderToString(
      <List
        height={100}
        overscanRowCount={0}
        rowCount={1000}
        rowHeight={20}
        rowRenderer={({ index, key, style }) => (
          <div key={key} style={style}>
            {`Row ${index}`}
          </div>
        )}
        scrollElement="window"
        width={200}
      />
    );

    expect(html).toContain("height:auto");
    expect(html).not.toContain("height:100px");
    // The full height of the rows
    expect(html).toContain("height:20000px");
    expect(html).toContain("Row 0");
    expect(html).toContain("Row 4");
    // (List and Table overscan by at least one row, for accessibility)
    expect(html).not.toContain("Row 6<");
  });

  it("should render a Grid at its full height, with the first rows (within the fallback height)", () => {
    const html = renderToString(
      <Grid
        cellRenderer={({ columnIndex, key, rowIndex, style }) => (
          <div key={key} style={style}>
            {`${rowIndex}:${columnIndex}`}
          </div>
        )}
        columnCount={10}
        columnWidth={50}
        height={60}
        overscanColumnCount={0}
        overscanRowCount={0}
        rowCount={100}
        rowHeight={20}
        scrollElement="window"
        width={100}
      />
    );

    expect(html).toContain("height:auto");
    expect(html).toContain("0:0");
    expect(html).toContain("2:1");
    expect(html).not.toContain("3:0");
  });

  it("should render a Grid without a fallback height (with no rows)", () => {
    const html = renderToString(
      <Grid
        cellRenderer={({ key, rowIndex, style }) => (
          <div key={key} style={style}>
            {`Row ${rowIndex}`}
          </div>
        )}
        columnCount={1}
        columnWidth={50}
        rowCount={100}
        rowHeight={20}
        scrollElement="window"
        width={100}
      />
    );

    expect(html).toContain("height:auto");
    expect(html).not.toContain("Row 0");
  });

  it("should render a Table at its full height, with the first rows (within the fallback height)", () => {
    const html = renderToString(
      <Table
        headerHeight={20}
        height={100}
        overscanRowCount={0}
        rowCount={100}
        rowGetter={({ index }) => ({ name: `Name ${index}` })}
        rowHeight={20}
        scrollElement="window"
        width={200}
      >
        <Column dataKey="name" label="Name" width={100} />
      </Table>
    );

    expect(html).toContain("height:auto");
    // The rows may fill the whole viewport (since the header is scrolled along with them)
    expect(html).toContain("Name 4");
    expect(html).not.toContain("Name 6<");
  });
});
