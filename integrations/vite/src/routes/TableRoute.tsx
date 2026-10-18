import { Column, Table } from "react-virtualized";
import {
  ROW_COUNT,
  ROW_HEIGHT,
  TABLE_HEADER_HEIGHT,
  WIDTH
} from "../../../tests";
import { Header } from "../components/Header";
import { useRouteParams } from "../utils/searchParams";

function rowGetter({ index }: { index: number }) {
  return { index, name: `Row ${index}` };
}

function setTableRef(table: Window["table"]) {
  window.table = table;
}

// A Table (whose header row scrolls along with its rows) below a header, scrolled by the window
export function TableRoute() {
  const { headerHeight, overscanRowCount } = useRouteParams();

  return (
    <>
      <Header initialHeight={headerHeight} />
      <Table
        headerHeight={TABLE_HEADER_HEIGHT}
        id="table"
        overscanRowCount={overscanRowCount}
        ref={setTableRef}
        rowCount={ROW_COUNT}
        rowGetter={rowGetter}
        rowHeight={ROW_HEIGHT}
        scrollElement="window"
        width={WIDTH}
      >
        <Column dataKey="index" label="Index" width={100} />
        <Column dataKey="name" label="Name" width={300} />
      </Table>
    </>
  );
}
