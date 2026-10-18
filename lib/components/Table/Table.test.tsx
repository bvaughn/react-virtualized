/* eslint-disable @typescript-eslint/no-explicit-any */
import Immutable from "immutable";
import { fireEvent } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import {
  act,
  createRef,
  StrictMode,
  useLayoutEffect,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode
} from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getObserverCount,
  mockResizeObserver
} from "../../utils/test/mockResizeObserver";
import { createScrollContainer } from "../../utils/test/scrollElement";
import {
  findDOMNode as findDOMNodeUntyped,
  render
} from "../../utils/test/render";
import { CellMeasurer } from "../CellMeasurer/CellMeasurer";
import { CellMeasurerCache } from "../CellMeasurer/CellMeasurerCache";
import type { OverscanIndicesGetterParams } from "../Grid/types";
import { Column } from "./Column";
import { createMultiSort } from "./createMultiSort";
import { SortDirection } from "./SortDirection";
import { Table } from "./Table";
import type {
  ColumnProps,
  MultiSortCallbackParams,
  TableImperativeAPI,
  SortDirectionType,
  TableCellProps,
  TableHeaderProps,
  TableRowsRenderedParams,
  TableScrollParams,
  TableProps
} from "./types";

function findDOMNode(instance: unknown): HTMLDivElement {
  return findDOMNodeUntyped(instance) as HTMLDivElement;
}

// The inner Grid's scrolling container (of the most recently rendered Table)
function getGridElement(): HTMLDivElement {
  return document.querySelector<HTMLDivElement>(".ReactVirtualized__Grid")!;
}

// The total height of the inner Grid's rows (of the most recently rendered Table)
function getTotalRowsHeight(): number {
  return Number.parseInt(
    document.querySelector<HTMLDivElement>(
      ".ReactVirtualized__Grid__innerScrollContainer"
    )!.style.height,
    10
  );
}

type GetMarkupParams = Partial<Omit<TableProps, "onRowClick">> & {
  cellDataGetter?: ColumnProps["cellDataGetter"];
  cellRenderer?: ColumnProps["cellRenderer"];
  columnData?: any;
  columnID?: string;
  columnStyle?: CSSProperties;
  columnHeaderStyle?: CSSProperties;
  defaultSortDirection?: SortDirectionType;
  disableSort?: boolean;
  headerRenderer?: ColumnProps["headerRenderer"];
  label?: ReactNode;
  maxWidth?: number;
  minWidth?: number;
  onRowClick?: TableProps["onRowClick"] | null;
};

describe("Table", () => {
  const array: { id: number; name: string; email: string }[] = [];
  for (let i = 0; i < 100; i++) {
    array.push({
      id: i,
      name: `Name ${i}`,
      email: `user-${i}@treasure-data.com`
    });
  }
  const list: any = Immutable.fromJS(array);

  // Works with an Immutable List of Maps
  function immutableRowGetter({ index }: { index: number }) {
    return list.get(index);
  }

  // Works with an Array of Objects
  function vanillaRowGetter({ index }: { index: number }) {
    return array[index];
  }

  // Override default behavior of overscanning by at least 1 (for accessibility)
  // Because it makes for simple tests below
  function overscanIndicesGetter({
    startIndex,
    stopIndex
  }: OverscanIndicesGetterParams) {
    return {
      overscanStartIndex: startIndex,
      overscanStopIndex: stopIndex
    };
  }

  function getMarkup({
    cellDataGetter,
    cellRenderer,
    columnData = { data: 123 },
    columnID,
    columnStyle,
    columnHeaderStyle,
    disableSort = false,
    headerRenderer,
    maxWidth,
    minWidth,
    defaultSortDirection,
    label,
    ...flexTableProps
  }: GetMarkupParams = {}) {
    return (
      <Table
        headerHeight={20}
        height={100}
        overscanRowCount={0}
        overscanIndicesGetter={overscanIndicesGetter}
        rowCount={list.size}
        rowGetter={immutableRowGetter}
        rowHeight={10}
        width={100}
        {...(flexTableProps as Partial<TableProps>)}
      >
        <Column
          label={label || "Name"}
          dataKey="name"
          columnData={columnData}
          width={50}
          cellRenderer={cellRenderer}
          cellDataGetter={cellDataGetter}
          headerRenderer={headerRenderer}
          disableSort={disableSort}
          defaultSortDirection={defaultSortDirection}
          style={columnStyle}
          headerStyle={columnHeaderStyle}
          id={columnID}
        />
        <Column
          label="Email"
          dataKey="email"
          maxWidth={maxWidth}
          minWidth={minWidth}
          width={50}
        />
        {false}
        {true}
        {null}
        {undefined}
      </Table>
    );
  }

  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Table no longer validates its children at runtime (propTypes were replaced by TypeScript types),
  // so these tests verify how children are rendered instead.
  describe("children", () => {
    function renderWithChildren(children: ReactNode) {
      return findDOMNode(
        render(
          <Table
            headerHeight={20}
            height={100}
            rowCount={1}
            rowGetter={vanillaRowGetter}
            rowHeight={10}
            width={100}
          >
            {children}
          </Table>
        )
      );
    }

    it("should accept Column children", () => {
      const children = [<Column key="foo" dataKey="name" width={100} />];
      const rendered = renderWithChildren(children);
      expect(rendered.getAttribute("aria-colcount")).toEqual("1");
      const cells = rendered.querySelectorAll<HTMLElement>(
        ".ReactVirtualized__Table__rowColumn"
      );
      expect(cells.length).toEqual(1);
      expect(cells[0].textContent).toEqual("Name 0");
    });

    it("should apply the Column defaults to a plain Column (without renderers)", () => {
      // Regression test for #1870/#1885 (React 19 no longer applies class defaultProps when creating elements)
      const rendered = renderWithChildren(
        <Column dataKey="name" label="Name" width={100} />
      );
      const header = rendered.querySelector<HTMLElement>(
        ".ReactVirtualized__Table__headerColumn"
      )!;
      expect(header.textContent).toEqual("Name");
      expect(header.style.flex).toEqual("0 1 100px");
      const cells = rendered.querySelectorAll<HTMLElement>(
        ".ReactVirtualized__Table__rowColumn"
      );
      expect(cells.length).toEqual(1);
      expect(cells[0].textContent).toEqual("Name 0");
      expect(cells[0].title).toEqual("Name 0");
    });

    it("should accept components that wrap Column as children", () => {
      const sort = vi.fn();
      const MyColumn = (props: ColumnProps) => <Column {...props} />;

      const rendered = findDOMNode(
        render(
          <Table
            headerHeight={20}
            height={100}
            rowCount={1}
            rowGetter={vanillaRowGetter}
            rowHeight={10}
            sort={sort}
            width={100}
          >
            <MyColumn dataKey="name" label="Name" width={60} />
            <MyColumn
              cellRenderer={({ cellData }) => `Email: ${cellData}`}
              dataKey="email"
              width={40}
            />
          </Table>
        )
      );
      expect(rendered.getAttribute("aria-colcount")).toEqual("2");
      const headers = rendered.querySelectorAll<HTMLElement>(
        ".ReactVirtualized__Table__headerColumn"
      );
      expect(headers.length).toEqual(2);
      expect(headers[0].textContent).toEqual("Name");
      expect(headers[0].style.flex).toEqual("0 1 60px");
      const cells = rendered.querySelectorAll<HTMLElement>(
        ".ReactVirtualized__Table__rowColumn"
      );
      expect(cells.length).toEqual(2);
      expect(cells[0].textContent).toEqual("Name 0");
      expect(cells[1].textContent).toEqual("Email: user-0@treasure-data.com");

      // The default sort direction applies too
      act(() => {
        headers[0].click();
      });
      expect(sort).toHaveBeenCalledTimes(1);
      expect(sort.mock.calls[0][0].sortBy).toEqual("name");
      expect(sort.mock.calls[0][0].sortDirection).toEqual(SortDirection.ASC);
    });

    it("should accept falsy children to allow easier dynamic showing/hiding of columns", () => {
      const children = [
        false,
        <Column key="foo" dataKey="name" width={100} />,
        null
      ];
      const rendered = renderWithChildren(children);
      expect(rendered.getAttribute("aria-colcount")).toEqual("1");
      expect(
        rendered.querySelectorAll<HTMLElement>(
          ".ReactVirtualized__Table__headerColumn"
        ).length
      ).toEqual(1);
    });
  });

  describe("height", () => {
    it("should subtract header row height from the inner Grid height if headers are enabled", () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            headerHeight: 10,
            overscanRowCount: 0,
            rowHeight: 20,
            height: 50
          })
        )
      );
      const rows = rendered.querySelectorAll<HTMLElement>(
        ".ReactVirtualized__Table__row"
      );
      expect(rows.length).toEqual(2);
    });

    it("should not subtract header row height from the inner Grid height if headers are disabled", () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            disableHeader: true,
            headerHeight: 10,
            overscanRowCount: 0,
            rowHeight: 20,
            height: 50
          })
        )
      );
      const rows = rendered.querySelectorAll<HTMLElement>(
        ".ReactVirtualized__Table__row"
      );
      expect(rows.length).toEqual(3);
    });
  });

  describe("initial rendering", () => {
    // Ensure that both Immutable Lists of Maps and Arrays of Objects are supported
    const useImmutable = [true, false];
    useImmutable.forEach((useImmutable) => {
      it("should render the correct number of rows", () => {
        const rendered = findDOMNode(
          render(
            getMarkup({
              rowGetter: useImmutable ? immutableRowGetter : vanillaRowGetter
            })
          )
        );
        // 100px height should fit 1 header (20px) and 8 rows (10px each) -
        expect(
          rendered.querySelectorAll<HTMLElement>(
            ".ReactVirtualized__Table__headerRow"
          ).length
        ).toEqual(1);
        expect(
          rendered.querySelectorAll<HTMLElement>(
            ".ReactVirtualized__Table__row"
          ).length
        ).toEqual(8);
      });

      it("should render the expected headers", () => {
        const rendered = findDOMNode(
          render(
            getMarkup({
              rowGetter: useImmutable ? immutableRowGetter : vanillaRowGetter
            })
          )
        );
        const columns = rendered.querySelectorAll<HTMLElement>(
          ".ReactVirtualized__Table__headerColumn"
        );
        expect(columns.length).toEqual(2);
        expect(columns[0].textContent).toEqual("Name");
        expect(columns[1].textContent).toEqual("Email");
      });

      it("should render the expected rows and columns", () => {
        const rendered = findDOMNode(
          render(
            getMarkup({
              rowGetter: useImmutable ? immutableRowGetter : vanillaRowGetter,
              headerHeight: 10,
              rowHeight: 20,
              height: 50
            })
          )
        );
        const rows = rendered.querySelectorAll<HTMLElement>(
          ".ReactVirtualized__Table__row"
        );
        expect(rows.length).toEqual(2);
        Array.from(rows).forEach((row, index) => {
          const rowData = list.get(index);
          const columns = row.querySelectorAll<HTMLElement>(
            ".ReactVirtualized__Table__rowColumn"
          );
          expect(columns.length).toEqual(2);
          expect(columns[0].textContent).toEqual(rowData.get("name"));
          expect(columns[1].textContent).toEqual(rowData.get("email"));
        });
      });
    });

    it("should support a :rowHeight function", () => {
      const rowHeight = ({ index }: { index: number }) => 10 + index * 10;
      const rendered = findDOMNode(
        render(
          getMarkup({
            rowHeight,
            rowCount: 3
          })
        )
      );
      const rows = rendered.querySelectorAll<HTMLElement>(
        ".ReactVirtualized__Table__row"
      );
      Array.from(rows).forEach((row, index) => {
        expect(Number.parseInt(row.style.height, 10)).toEqual(
          rowHeight({ index })
        );
      });
    });

    it("should support :minWidth and :maxWidth values for a column", () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            maxWidth: 75,
            minWidth: 25,
            rowCount: 1
          })
        )
      );
      const columns = rendered.querySelectorAll<HTMLElement>(
        ".ReactVirtualized__Table__rowColumn"
      );
      const emailColumn = columns[1];
      expect(Number.parseInt(emailColumn.style.maxWidth, 10)).toEqual(75);
      expect(Number.parseInt(emailColumn.style.minWidth, 10)).toEqual(25);
    });
  });

  describe("initialScrollTop", () => {
    function getRowIndices(element: Element) {
      return Array.from(
        element.querySelectorAll(".ReactVirtualized__Table__row")
      ).map((row) => Number(row.getAttribute("aria-rowindex")) - 1);
    }

    it("should render and scroll to the initial offset on mount", () => {
      const table = render<TableImperativeAPI>(
        getMarkup({ initialScrollTop: 200 })
      );
      const element = findDOMNode(table);
      expect(
        element.querySelector(".ReactVirtualized__Table__Grid")!.scrollTop
      ).toEqual(200);
      expect(getRowIndices(element)[0]).toEqual(20);
    });

    it("should render the rows at the initial offset on the server", () => {
      const container = document.createElement("div");
      container.innerHTML = renderToString(
        getMarkup({ initialScrollTop: 200 })
      );
      expect(getRowIndices(container)[0]).toEqual(20);
      expect(
        container.querySelector<HTMLElement>(
          ".ReactVirtualized__Grid__innerScrollContainer"
        )!.style.marginTop
      ).toEqual("-200px");
    });
  });

  describe("measureAllRows", () => {
    it("should measure any unmeasured rows", () => {
      const rendered = render(
        getMarkup({
          estimatedRowSize: 15,
          rowCount: 10,
          rowHeight: () => 20
        })
      );
      expect(getTotalRowsHeight()).toEqual(170);
      act(() => {
        rendered.measureAllRows();
      });
      act(() => {
        rendered.forceUpdateGrid();
      });
      expect(getTotalRowsHeight()).toEqual(200);
    });

    it("should not throw if there are no rows", () => {
      const rendered = render(getMarkup({ rowCount: 0 }));
      expect(() => {
        act(() => {
          rendered.measureAllRows();
        });
      }).not.toThrow();
    });
  });

  describe("recomputeRowHeights", () => {
    it("should recompute row heights and other values when called", () => {
      const indices: number[] = [];
      const rowHeight = ({ index }: { index: number }) => {
        indices.push(index);
        return 10;
      };
      const component = render(
        getMarkup({
          rowHeight,
          rowCount: 50
        })
      );

      indices.splice(0);
      act(() => {
        component.recomputeRowHeights();
      });

      // Only the rows required to fill the current viewport will be rendered
      expect(indices[0]).toEqual(0);
      expect(indices[indices.length - 1]).toEqual(7);

      indices.splice(0);
      act(() => {
        component.recomputeRowHeights(4);
      });

      expect(indices[0]).toEqual(4);
      expect(indices[indices.length - 1]).toEqual(7);
    });
  });

  describe("forceUpdateGrid", () => {
    it("should refresh inner Grid content when called", () => {
      let marker = "a";
      function cellRenderer({ rowIndex }: TableCellProps) {
        return `${rowIndex}${marker}`;
      }
      const component = render(getMarkup({ cellRenderer }));
      const node = findDOMNode(component);
      expect(node.textContent).toContain("1a");
      marker = "b";
      act(() => {
        component.forceUpdateGrid();
      });
      expect(node.textContent).toContain("1b");
    });
  });

  describe("custom getter functions", () => {
    it("should use a custom cellDataGetter if specified", () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            cellDataGetter: ({ dataKey, rowData }) =>
              `Custom ${dataKey} for row ${rowData.get("id")}`
          })
        )
      );
      const nameColumns = rendered.querySelectorAll<HTMLElement>(
        ".ReactVirtualized__Table__rowColumn:first-of-type"
      );
      Array.from(nameColumns).forEach((nameColumn, index) => {
        expect(nameColumn.textContent).toEqual(`Custom name for row ${index}`);
      });
    });

    it("should use a custom cellRenderer if specified", () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            cellRenderer: ({ cellData }) => `Custom ${cellData}`
          })
        )
      );
      const nameColumns = rendered.querySelectorAll<HTMLElement>(
        ".ReactVirtualized__Table__rowColumn:first-of-type"
      );
      Array.from(nameColumns).forEach((nameColumn, index) => {
        const rowData = list.get(index);
        expect(nameColumn.textContent).toEqual(`Custom ${rowData.get("name")}`);
      });
    });

    it("should set the rendered cell content as the cell :title if it is a string", () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            cellRenderer: () => "Custom"
          })
        )
      );
      const nameColumn = rendered.querySelector<HTMLElement>(
        ".ReactVirtualized__Table__rowColumn:first-of-type"
      )!;
      expect(nameColumn.getAttribute("title")).toContain("Custom");
    });

    it("should not set a cell :title if the rendered cell content is not a string", () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            cellRenderer: () => <div>Custom</div>
          })
        )
      );
      const nameColumn = rendered.querySelector<HTMLElement>(
        ".ReactVirtualized__Table__rowColumn:first-of-type"
      )!;
      expect(nameColumn.getAttribute("title")).toEqual(null);
    });

    it("should set the rendered header label as header :title if it is a string", () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            label: "Custom"
          })
        )
      );
      const nameColumn = rendered.querySelector<HTMLElement>(
        ".ReactVirtualized__Table__headerTruncatedText:first-of-type"
      )!;
      expect(nameColumn.getAttribute("title")).toContain("Custom");
    });

    it("should not set a header :title if the rendered header label is not a string", () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            label: <div>Custom</div>
          })
        )
      );
      const nameColumn = rendered.querySelector<HTMLElement>(
        ".ReactVirtualized__Table__headerTruncatedText:first-of-type"
      )!;
      expect(nameColumn.getAttribute("title")).toEqual(null);
    });
  });

  // #1725
  describe("column keys", () => {
    function Stateful({ value }: { value: string }) {
      // Keeps the value it was mounted with
      const [initialValue] = useState(value);
      return <span>{initialValue}</span>;
    }

    function getMarkupWithColumns(dataKeys: string[]) {
      const rows = [{ a: "A", b: "B" }];
      return (
        <Table
          headerHeight={20}
          height={100}
          rowCount={rows.length}
          rowGetter={({ index }) => rows[index]}
          rowHeight={20}
          width={200}
        >
          {dataKeys.map((dataKey) => (
            <Column
              cellRenderer={({ cellData }) => <Stateful value={cellData} />}
              dataKey={dataKey}
              key={dataKey}
              label={dataKey}
              width={100}
            />
          ))}
        </Table>
      );
    }

    it("should move the cells of a column with it when columns are reordered", () => {
      render(getMarkupWithColumns(["a", "b"]));
      const headers = Array.from(
        document.body.querySelectorAll(".ReactVirtualized__Table__headerColumn")
      );

      render(getMarkupWithColumns(["b", "a"]));
      const cells = Array.from(
        document.body.querySelectorAll(".ReactVirtualized__Table__rowColumn")
      ).map((cell) => cell.textContent);
      // (Keyed by index, each cell would keep the state of the column previously at its position: "A", "B")
      expect(cells).toEqual(["B", "A"]);

      // The header elements are moved (not re-created)
      const reorderedHeaders = Array.from(
        document.body.querySelectorAll(".ReactVirtualized__Table__headerColumn")
      );
      expect(reorderedHeaders[0]).toBe(headers[1]);
      expect(reorderedHeaders[1]).toBe(headers[0]);
    });

    it("should key columns without a key by their position", () => {
      const rows = [{ a: "A", b: "B" }];
      render(
        <Table
          headerHeight={20}
          height={100}
          rowCount={1}
          rowGetter={({ index }) => rows[index]}
          rowHeight={20}
          width={200}
        >
          <Column dataKey="a" width={100} />
          {null}
          <Column dataKey="b" width={100} />
        </Table>
      );
      const cells = Array.from(
        document.body.querySelectorAll(".ReactVirtualized__Table__rowColumn")
      ).map((cell) => cell.textContent);
      expect(cells).toEqual(["A", "B"]);
    });
  });

  describe("sorting", () => {
    // #1585
    it("should re-render when the sort criteria of createMultiSort are stored in React state", () => {
      function MultiSortTable() {
        // The sort criteria are stored in separate state values, as passed to the callback (not copied)
        const [sortBy, setSortBy] = useState<string[]>(["name"]);
        const [sortDirection, setSortDirection] = useState<
          MultiSortCallbackParams["sortDirection"]
        >({ name: "ASC" });
        const [multiSort] = useState(() =>
          createMultiSort(
            ({ sortBy, sortDirection }) => {
              setSortBy(sortBy);
              setSortDirection(sortDirection);
            },
            { defaultSortBy: ["name"] }
          )
        );
        const sortState = { sortBy, sortDirection };
        return (
          <Table
            headerHeight={20}
            height={100}
            rowCount={list.size}
            rowGetter={immutableRowGetter}
            rowHeight={10}
            sort={multiSort.sort}
            width={200}
          >
            {["name", "email"].map((dataKey) => (
              <Column
                dataKey={dataKey}
                headerRenderer={() =>
                  `${dataKey}:${sortState.sortDirection[dataKey] ?? "-"}:${
                    sortState.sortBy.indexOf(dataKey) + 1
                  }`
                }
                key={dataKey}
                width={100}
              />
            ))}
          </Table>
        );
      }

      render(<MultiSortTable />);
      const headers = () =>
        Array.from(
          document.body.querySelectorAll<HTMLElement>(
            ".ReactVirtualized__Table__headerColumn"
          )
        );
      const headerTexts = () => headers().map((header) => header.textContent);
      expect(headerTexts()).toEqual(["name:ASC:1", "email:-:0"]);

      fireEvent.click(headers()[0]);
      expect(headerTexts()).toEqual(["name:DESC:1", "email:-:0"]);

      fireEvent.click(headers()[1], { shiftKey: true });
      expect(headerTexts()).toEqual(["name:DESC:1", "email:ASC:2"]);

      fireEvent.click(headers()[0], { ctrlKey: true });
      expect(headerTexts()).toEqual(["name:-:0", "email:ASC:1"]);
    });

    it("should not render sort indicators if no sort function is provided", () => {
      const rendered = findDOMNode(render(getMarkup()));
      const nameColumn = rendered.querySelectorAll<HTMLElement>(
        ".ReactVirtualized__Table__headerColumn:first-of-type"
      );

      expect((nameColumn as any).className || "").not.toContain(
        "ReactVirtualized__Table__sortableHeaderColumn"
      );
    });

    it("should not render sort indicators for non-sortable columns", () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            disableSort: true,
            sort: () => {}
          })
        )
      );
      const nameColumn = rendered.querySelectorAll<HTMLElement>(
        ".ReactVirtualized__Table__headerColumn:first-of-type"
      );

      expect((nameColumn as any).className || "").not.toContain(
        "ReactVirtualized__Table__sortableHeaderColumn"
      );
      expect(
        rendered.querySelectorAll<HTMLElement>(
          ".ReactVirtualized__Table__sortableHeaderColumn"
        ).length
      ).toEqual(1); // Email only
    });

    it("should render sortable column headers as sortable", () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            sort: () => {}
          })
        )
      );
      const nameColumn = rendered.querySelector<HTMLElement>(
        ".ReactVirtualized__Table__headerColumn:first-of-type"
      )!;

      expect(nameColumn.className).toContain(
        "ReactVirtualized__Table__sortableHeaderColumn"
      );
      expect(
        rendered.querySelectorAll<HTMLElement>(
          ".ReactVirtualized__Table__sortableHeaderColumn"
        ).length
      ).toEqual(2); // Email and Name
    });

    it("should render the correct sort indicator by the current sort-by column", () => {
      const sortDirections = [SortDirection.ASC, SortDirection.DESC];
      sortDirections.forEach((sortDirection) => {
        const rendered = findDOMNode(
          render(
            getMarkup({
              sort: () => {},
              sortBy: "name",
              sortDirection
            })
          )
        );
        const nameColumn = rendered.querySelector<HTMLElement>(
          ".ReactVirtualized__Table__headerColumn:first-of-type"
        )!;

        expect(
          nameColumn.querySelector<HTMLElement>(
            ".ReactVirtualized__Table__sortableHeaderIcon"
          )!
        ).not.toEqual(null);
        expect(
          nameColumn.querySelector<HTMLElement>(
            `.ReactVirtualized__Table__sortableHeaderIcon--${sortDirection}`
          )!
        ).not.toEqual(null);
      });
    });

    it("should call sort with the correct arguments when the current sort-by column header is clicked", () => {
      const sortDirections = [SortDirection.ASC, SortDirection.DESC];
      sortDirections.forEach((sortDirection) => {
        const sortCalls: any[] = [];
        const rendered = findDOMNode(
          render(
            getMarkup({
              sort: ({ sortBy, sortDirection }) =>
                sortCalls.push({ sortBy, sortDirection }),
              sortBy: "name",
              sortDirection
            })
          )
        );
        const nameColumn = rendered.querySelector<HTMLElement>(
          ".ReactVirtualized__Table__headerColumn:first-of-type"
        )!;

        fireEvent.click(nameColumn);
        expect(sortCalls.length).toEqual(1);

        const { sortBy, sortDirection: newSortDirection } = sortCalls[0];
        const expectedSortDirection =
          sortDirection === SortDirection.ASC
            ? SortDirection.DESC
            : SortDirection.ASC;
        expect(sortBy).toEqual("name");
        expect(newSortDirection).toEqual(expectedSortDirection);
      });
    });

    it("should call sort with the correct arguments when a new sort-by column header is clicked", () => {
      const sortCalls: any[] = [];
      const rendered = findDOMNode(
        render(
          getMarkup({
            sort: ({ sortBy, sortDirection }) =>
              sortCalls.push({ sortBy, sortDirection }),
            sortBy: "email",
            sortDirection: SortDirection.ASC
          })
        )
      );
      const nameColumn = rendered.querySelector<HTMLElement>(
        ".ReactVirtualized__Table__headerColumn:first-of-type"
      )!;

      fireEvent.click(nameColumn);
      expect(sortCalls.length).toEqual(1);

      const { sortBy, sortDirection } = sortCalls[0];
      expect(sortBy).toEqual("name");
      expect(sortDirection).toEqual(SortDirection.ASC);
    });

    it("should call sort when a column header is activated via ENTER or SPACE key", () => {
      const sortCalls: any[] = [];
      const rendered = findDOMNode(
        render(
          getMarkup({
            sort: ({ sortBy, sortDirection }) =>
              sortCalls.push({ sortBy, sortDirection }),
            sortBy: "name"
          })
        )
      );
      const nameColumn = rendered.querySelector<HTMLElement>(
        ".ReactVirtualized__Table__headerColumn:first-of-type"
      )!;
      expect(sortCalls.length).toEqual(0);
      fireEvent.keyDown(nameColumn, { key: " " });
      expect(sortCalls.length).toEqual(1);
      fireEvent.keyDown(nameColumn, { key: "Enter" });
      expect(sortCalls.length).toEqual(2);
      fireEvent.keyDown(nameColumn, { key: "F" });
      expect(sortCalls.length).toEqual(2);
    });

    it("should honor the default sort order on first click of the column", () => {
      const sortDirections = [SortDirection.ASC, SortDirection.DESC];
      sortDirections.forEach((sortDirection) => {
        const sortCalls: any[] = [];
        const rendered = findDOMNode(
          render(
            getMarkup({
              sort: ({ sortBy, sortDirection }) =>
                sortCalls.push({ sortBy, sortDirection }),
              defaultSortDirection: sortDirection
            })
          )
        );
        const nameColumn = rendered.querySelector<HTMLElement>(
          ".ReactVirtualized__Table__headerColumn:first-of-type"
        )!;

        fireEvent.click(nameColumn);
        expect(sortCalls.length).toEqual(1);

        const { sortBy, sortDirection: newSortDirection } = sortCalls[0];
        expect(sortBy).toEqual("name");
        expect(newSortDirection).toEqual(sortDirection);
      });
    });
  });

  describe("headerRowRenderer", () => {
    it("should render a custom header row if one is provided", () => {
      const headerRowRenderer = vi.fn().mockReturnValue(<div>foo bar</div>);
      const rendered = findDOMNode(
        render(
          getMarkup({
            headerHeight: 33,
            headerRowRenderer,
            rowClassName: "someRowClass"
          })
        )
      );
      expect(rendered.textContent).toContain("foo bar");
      expect(headerRowRenderer).toHaveBeenCalled();
      const params = headerRowRenderer.mock.calls[0][0];
      expect(params.className).toContain("someRowClass");
      expect(params.columns).toHaveLength(2);
      expect(params.style.height).toBe(33);
    });
  });

  describe("headerRenderer", () => {
    it("should render a custom header if one is provided", () => {
      const columnData = { foo: "foo", bar: "bar" };
      const headerRendererCalls: TableHeaderProps[] = [];
      const rendered = findDOMNode(
        render(
          getMarkup({
            columnData,
            headerRenderer: (params) => {
              headerRendererCalls.push(params);
              return "custom header";
            },
            sortBy: "name",
            sortDirection: SortDirection.ASC
          })
        )
      );
      const nameColumn = rendered.querySelector<HTMLElement>(
        ".ReactVirtualized__Table__headerColumn:first-of-type"
      )!;

      expect(nameColumn.textContent).toContain("custom header");
      expect(headerRendererCalls.length).toBeTruthy();

      const headerRendererCall = headerRendererCalls[0];
      expect(headerRendererCall.columnData).toEqual(columnData);
      expect(headerRendererCall.dataKey).toEqual("name");
      expect(headerRendererCall.disableSort).toEqual(false);
      expect(headerRendererCall.label).toEqual("Name");
      expect(headerRendererCall.sortBy).toEqual("name");
      expect(headerRendererCall.sortDirection).toEqual(SortDirection.ASC);
    });

    it("should honor sort for custom headers", () => {
      const sortCalls: any[] = [];
      const rendered = findDOMNode(
        render(
          getMarkup({
            headerRenderer: () => "custom header",
            sort: ({ sortBy, sortDirection }) =>
              sortCalls.push([sortBy, sortDirection]),
            sortBy: "name",
            sortDirection: SortDirection.ASC
          })
        )
      );
      const nameColumn = rendered.querySelector<HTMLElement>(
        ".ReactVirtualized__Table__headerColumn:first-of-type"
      )!;

      fireEvent.click(nameColumn);

      expect(sortCalls.length).toEqual(1);
      const sortCall = sortCalls[0];
      expect(sortCall[0]).toEqual("name");
      expect(sortCall[1]).toEqual(SortDirection.DESC);
    });

    it("should honor :onHeaderClick for custom header", () => {
      const columnData = { foo: "foo", bar: "bar" };
      const onHeaderClick = vi.fn();
      const rendered = findDOMNode(
        render(
          getMarkup({
            columnData,
            headerRenderer: () => "custom header",
            onHeaderClick
          })
        )
      );
      const nameColumn = rendered.querySelector<HTMLElement>(
        ".ReactVirtualized__Table__headerColumn:first-of-type"
      )!;

      fireEvent.click(nameColumn);

      expect(onHeaderClick).toHaveBeenCalledTimes(1);
      const params = onHeaderClick.mock.calls[0][0];
      expect(params.dataKey).toEqual("name");
      expect(params.columnData).toEqual(columnData);
      expect(params.event.type).toEqual("click");
    });
  });

  describe("noRowsRenderer", () => {
    it("should call :noRowsRenderer if :rowCount is 0", () => {
      render(
        getMarkup({
          noRowsRenderer: () => <div>No rows!</div>,
          rowCount: 0
        })
      );
      const bodyDOMNode = getGridElement();
      expect(bodyDOMNode.textContent).toEqual("No rows!");
    });

    it("should render an empty body if :rowCount is 0 and there is no :noRowsRenderer", () => {
      render(
        getMarkup({
          rowCount: 0
        })
      );
      const bodyDOMNode = getGridElement();
      expect(bodyDOMNode.textContent).toEqual("");
    });
  });

  describe("onColumnClick", () => {
    it("should call :onColumnClick with the correct arguments when a column is clicked", () => {
      const onColumnClick = vi.fn();
      const rendered = findDOMNode(
        render(
          getMarkup({
            onColumnClick
          })
        )
      );
      const nameColumn = rendered.querySelector<HTMLElement>(
        ".ReactVirtualized__Table__rowColumn:first-of-type"
      )!;

      fireEvent.click(nameColumn);

      expect(onColumnClick).toHaveBeenCalledTimes(1);
      const params = onColumnClick.mock.calls[0][0];
      expect(params.dataKey).toEqual("name");
      expect(params.columnData.data).toEqual(123);
      expect(params.event.type).toEqual("click");
    });
  });

  describe("onHeaderClick", () => {
    it("should call :onHeaderClick with the correct arguments when a column header is clicked and sorting is disabled", () => {
      const onHeaderClick = vi.fn();
      const rendered = findDOMNode(
        render(
          getMarkup({
            disableSort: true,
            onHeaderClick
          })
        )
      );
      const nameColumn = rendered.querySelector<HTMLElement>(
        ".ReactVirtualized__Table__headerColumn:first-of-type"
      )!;

      fireEvent.click(nameColumn);

      expect(onHeaderClick).toHaveBeenCalledTimes(1);
      const params = onHeaderClick.mock.calls[0][0];
      expect(params.dataKey).toEqual("name");
      expect(params.columnData.data).toEqual(123);
      expect(params.event.type).toEqual("click");
    });

    it("should call :onHeaderClick with the correct arguments when a column header is clicked and sorting is enabled", () => {
      const onHeaderClick = vi.fn();
      const rendered = findDOMNode(
        render(
          getMarkup({
            disableSort: false,
            onHeaderClick
          })
        )
      );
      const nameColumn = rendered.querySelector<HTMLElement>(
        ".ReactVirtualized__Table__headerColumn:first-of-type"
      )!;

      fireEvent.click(nameColumn);

      expect(onHeaderClick).toHaveBeenCalledTimes(1);
      const params = onHeaderClick.mock.calls[0][0];
      expect(params.dataKey).toEqual("name");
      expect(params.columnData.data).toEqual(123);
      expect(params.event.type).toEqual("click");
    });
  });

  describe("onRowClick", () => {
    it("should call :onRowClick with the correct :rowIndex when a row is clicked", () => {
      const onRowClick = vi.fn();
      const rendered = findDOMNode(
        render(
          getMarkup({
            onRowClick
          })
        )
      );
      const rows = rendered.querySelectorAll<HTMLElement>(
        ".ReactVirtualized__Table__row"
      );
      fireEvent.click(rows[0]);
      fireEvent.click(rows[3]);
      expect(onRowClick).toHaveBeenCalledTimes(2);
      expect(onRowClick.mock.calls.map((call) => call[0].index)).toEqual([
        0, 3
      ]);
    });
  });

  describe("onRowDoubleClick", () => {
    it("should call :onRowDoubleClick with the correct :rowIndex when a row is clicked", () => {
      const onRowDoubleClick = vi.fn();
      const rendered = findDOMNode(
        render(
          getMarkup({
            onRowDoubleClick
          })
        )
      );
      const rows = rendered.querySelectorAll<HTMLElement>(
        ".ReactVirtualized__Table__row"
      );
      fireEvent.dblClick(rows[0]);
      fireEvent.dblClick(rows[3]);
      expect(onRowDoubleClick).toHaveBeenCalledTimes(2);
      expect(onRowDoubleClick.mock.calls.map((call) => call[0].index)).toEqual([
        0, 3
      ]);
    });
  });

  describe("onRowRightClick", () => {
    it("should call :onRowRightClick with the correct :rowIndex when a row is right-clicked", () => {
      const onRowRightClick = vi.fn();
      const rendered = findDOMNode(
        render(
          getMarkup({
            onRowRightClick
          })
        )
      );
      const rows = rendered.querySelectorAll<HTMLElement>(
        ".ReactVirtualized__Table__row"
      );
      fireEvent.contextMenu(rows[0]);
      fireEvent.contextMenu(rows[3]);
      expect(onRowRightClick).toHaveBeenCalledTimes(2);
      expect(onRowRightClick.mock.calls.map((call) => call[0].index)).toEqual([
        0, 3
      ]);
    });
  });

  describe("onRowMouseOver/Out", () => {
    it("should call :onRowMouseOver and :onRowMouseOut with the correct :rowIndex when the mouse is moved over rows", () => {
      const onRowMouseOver = vi.fn();
      const onRowMouseOut = vi.fn();
      const rendered = findDOMNode(
        render(
          getMarkup({
            onRowMouseOver,
            onRowMouseOut
          })
        )
      );

      const simulateMouseOver = (from: HTMLElement, to: HTMLElement) => {
        fireEvent.mouseOut(from, { relatedTarget: to });
        fireEvent.mouseOver(to, { relatedTarget: from });
      };

      const rows = rendered.querySelectorAll<HTMLElement>(
        ".ReactVirtualized__Table__row"
      );

      simulateMouseOver(rows[0], rows[1]);
      simulateMouseOver(rows[1], rows[2]);
      simulateMouseOver(rows[2], rows[3]);

      expect(onRowMouseOver).toHaveBeenCalled();
      expect(onRowMouseOut).toHaveBeenCalled();
      expect(onRowMouseOver.mock.calls.map((call) => call[0].index)).toEqual([
        1, 2, 3
      ]);
      expect(onRowMouseOut.mock.calls.map((call) => call[0].index)).toEqual([
        0, 1, 2
      ]);
    });
  });

  describe("rowClassName", () => {
    it("should render a static classname given :rowClassName as a string", () => {
      const staticClassName = "staticClass";
      const rendered = findDOMNode(
        render(
          getMarkup({
            rowClassName: staticClassName
          })
        )
      );
      const rows = rendered.querySelectorAll<HTMLElement>(
        ".ReactVirtualized__Table__row"
      );
      Array.from(rows).forEach((row) => {
        expect(row.className).toContain(staticClassName);
      });
    });

    it("should render dynamic classname given :rowClassName as a function", () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            rowClassName: ({ index }) => (index % 2 === 0 ? "even" : "odd")
          })
        )
      );
      const rows = rendered.querySelectorAll<HTMLElement>(
        ".ReactVirtualized__Table__row"
      );
      Array.from(rows).forEach((row, index) => {
        if (index % 2 === 0) {
          expect(row.className).toContain("even");
          expect(row.className).not.toContain("odd");
        } else {
          expect(row.className).toContain("odd");
          expect(row.className).not.toContain("even");
        }
      });
    });
  });

  describe("onRowsRendered", () => {
    it("should call :onRowsRendered at least one row is rendered", () => {
      let startIndex, stopIndex;
      render(
        getMarkup({
          onRowsRendered: (params) => ({ startIndex, stopIndex } = params)
        })
      );
      expect(startIndex).toEqual(0);
      expect(stopIndex).toEqual(7);
    });

    it("should not call :onRowsRendered unless the start or stop indices have changed", () => {
      let numCalls = 0;
      let startIndex;
      let stopIndex;
      const onRowsRendered = (params: TableRowsRenderedParams) => {
        startIndex = params.startIndex;
        stopIndex = params.stopIndex;
        numCalls++;
      };
      render(getMarkup({ onRowsRendered }));
      expect(numCalls).toEqual(1);
      expect(startIndex).toEqual(0);
      expect(stopIndex).toEqual(7);
      render(getMarkup({ onRowsRendered }));
      expect(numCalls).toEqual(1);
      expect(startIndex).toEqual(0);
      expect(stopIndex).toEqual(7);
    });

    it("should call :onRowsRendered if the start or stop indices have changed", () => {
      let numCalls = 0;
      let startIndex;
      let stopIndex;
      const onRowsRendered = (params: TableRowsRenderedParams) => {
        startIndex = params.startIndex;
        stopIndex = params.stopIndex;
        numCalls++;
      };
      render(getMarkup({ onRowsRendered }));
      expect(numCalls).toEqual(1);
      expect(startIndex).toEqual(0);
      expect(stopIndex).toEqual(7);
      render(
        getMarkup({
          height: 50,
          onRowsRendered
        })
      );
      expect(numCalls).toEqual(2);
      expect(startIndex).toEqual(0);
      expect(stopIndex).toEqual(2);
    });

    it("should not call :onRowsRendered if no rows are rendered", () => {
      let startIndex, stopIndex;
      render(
        getMarkup({
          height: 0,
          onRowsRendered: (params) => ({ startIndex, stopIndex } = params)
        })
      );
      expect(startIndex).toEqual(undefined);
      expect(stopIndex).toEqual(undefined);
    });
  });

  describe("with a scrollElement", () => {
    let unmockResizeObserver: () => void;
    beforeEach(() => {
      unmockResizeObserver = mockResizeObserver();
    });
    afterEach(() => {
      render.unmount();
      unmockResizeObserver();
    });

    // Renders the Table within a scroll container (with a 100px viewport), below `contentOffset` pixels of other content
    function renderInScrollContainer(
      props: GetMarkupParams = {},
      {
        contentOffset = 0,
        height = 100,
        scrollTop = 0
      }: { contentOffset?: number; height?: number; scrollTop?: number } = {}
    ) {
      const container = createScrollContainer({
        contentOffset,
        height,
        width: 100
      });
      container.element.scrollTop = scrollTop;
      const scrollTo = vi.spyOn(container.element, "scrollTo");
      const markup = (moreProps: GetMarkupParams = {}) =>
        getMarkup({ scrollElement: container.element, ...props, ...moreProps });
      const table = render<TableImperativeAPI>(markup());
      return { container, markup, scrollTo, table };
    }

    it("should render the rows within the viewport of the scroll element", () => {
      let startIndex, stopIndex;
      // The rows start below the header (20px)
      const { container } = renderInScrollContainer(
        { onRowsRendered: (params) => ({ startIndex, stopIndex } = params) },
        { scrollTop: 100 }
      );
      // The rows may fill the whole viewport (100px), since the header is scrolled along with them
      expect(startIndex).toEqual(8);
      expect(stopIndex).toEqual(17);
      expect(getGridElement().style.height).toEqual("auto");

      container.scroll(180);
      expect(startIndex).toEqual(16);
      expect(stopIndex).toEqual(25);
    });

    it("should measure its position from the inner Grid (below the header)", () => {
      let startIndex;
      const { container } = renderInScrollContainer(
        { onRowsRendered: (params) => ({ startIndex } = params) },
        { contentOffset: 50 }
      );
      expect(startIndex).toEqual(0);

      // The rows start 70px from the top of the content (50px + the 20px header)
      container.scroll(170);
      expect(startIndex).toEqual(10);

      // Without a header, the rows start right at the top of the Table
      render(
        getMarkup({
          disableHeader: true,
          onRowsRendered: (params) => ({ startIndex } = params),
          scrollElement: container.element
        })
      );
      expect(startIndex).toEqual(12);
    });

    it("should scroll the scroll element with scrollToRow, scrollToCell and scrollToPosition (#32)", () => {
      const { scrollTo, table } = renderInScrollContainer();

      act(() => {
        table.scrollToRow({ index: 49 });
      });
      expect(scrollTo).toHaveBeenLastCalledWith(0, 400 + 20);

      act(() => {
        table.scrollToCell({ align: "start", columnIndex: 0, rowIndex: 20 });
      });
      expect(scrollTo).toHaveBeenLastCalledWith(0, 200 + 20);

      act(() => {
        table.scrollToPosition({ scrollTop: 300 });
      });
      expect(scrollTo).toHaveBeenLastCalledWith(0, 300 + 20);
      expect(getGridElement().scrollTop).toEqual(0);
      expect(getGridElement().textContent).toContain("Name 30");
    });

    it("should use the height without the header once the scrollElement is removed", () => {
      let stopIndex;
      const { markup } = renderInScrollContainer({
        onRowsRendered: (params) => ({ stopIndex } = params)
      });
      expect(stopIndex).toEqual(9);
      render(markup({ scrollElement: undefined }));
      expect(stopIndex).toEqual(7);
      expect(getGridElement().style.height).toEqual("80px");
    });

    it("should use the viewport height of the scroll element (and the height prop until it is available)", () => {
      let stopIndex;
      const container = createScrollContainer({ height: 200 });
      render(
        getMarkup({
          onRowsRendered: (params) => ({ stopIndex } = params),
          scrollElement: null
        })
      );
      expect(stopIndex).toEqual(9);

      render(
        getMarkup({
          height: undefined,
          onRowsRendered: (params) => ({ stopIndex } = params),
          scrollElement: container.element
        })
      );
      expect(stopIndex).toEqual(19);
      expect(getObserverCount(container.element)).toBe(1);
    });

    it("should work in StrictMode", () => {
      let startIndex;
      const ref = createRef<TableImperativeAPI>();
      const container = createScrollContainer({ height: 100 });
      const scrollTo = vi.spyOn(container.element, "scrollTo");
      render(
        <StrictMode>
          <div>
            {getMarkup({
              onRowsRendered: (params) => ({ startIndex } = params),
              ref,
              scrollElement: container.element
            } as GetMarkupParams)}
          </div>
        </StrictMode>
      );
      container.scroll(220);
      expect(startIndex).toEqual(20);

      act(() => {
        ref.current!.scrollToRow({ align: "start", index: 50 });
      });
      expect(scrollTo).toHaveBeenLastCalledWith(0, 520);
      expect(startIndex).toEqual(50);
    });
  });

  describe("imperative scrolling", () => {
    it("should support scrollToRow()", () => {
      let startIndex, stopIndex;
      const table = render<TableImperativeAPI>(
        getMarkup({
          onRowsRendered: (params) => ({ startIndex, stopIndex } = params)
        })
      );
      act(() => {
        table.scrollToRow({ index: 49 });
      });
      // 80px (100px - 20px header) / 10px rows = 8 rows
      expect(getGridElement().scrollTop).toEqual(420);
      expect(stopIndex).toEqual(49);

      act(() => {
        table.scrollToRow({ align: "start", index: 20 });
      });
      expect(getGridElement().scrollTop).toEqual(200);
      expect(startIndex).toEqual(20);
    });

    it("should support scrollToCell() (e.g. for ArrowKeyStepper)", () => {
      const table = render<TableImperativeAPI>(getMarkup());
      act(() => {
        table.scrollToCell({ align: "center", columnIndex: 2, rowIndex: 50 });
      });
      expect(getGridElement().scrollLeft).toEqual(0);
      expect(getGridElement().scrollTop).toEqual(465);
    });

    it("should support scrollToPosition()", () => {
      const table = render<TableImperativeAPI>(getMarkup());
      act(() => {
        table.scrollToPosition({ scrollLeft: 50, scrollTop: 100 });
      });
      expect(getGridElement().scrollLeft).toEqual(0);
      expect(getGridElement().scrollTop).toEqual(100);
    });

    it("should support getOffsetForRow()", () => {
      const table = render<TableImperativeAPI>(getMarkup());
      expect(table.getOffsetForRow({ alignment: "start", index: 20 })).toEqual(
        200
      );
      expect(table.getOffsetForRow({ index: 49 })).toEqual(420);
      expect(table.getOffsetForRow({ align: "end", index: 20 })).toEqual(130);
      expect(table.getOffsetForRow({ align: "center", index: 20 })).toEqual(
        165
      );
    });

    it("should work in StrictMode", () => {
      const ref = createRef<TableImperativeAPI>();
      render(
        <StrictMode>
          <div>{getMarkup({ ref } as GetMarkupParams)}</div>
        </StrictMode>
      );
      act(() => {
        ref.current!.scrollToRow({ index: 49 });
      });
      expect(getGridElement().scrollTop).toEqual(420);
    });
  });

  it("should warn in DEV if there is neither a height nor a scrollElement", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(getMarkup({ height: undefined } as Partial<TableProps>));
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledWith(
      "Table requires a height prop (unless a scrollElement is specified)"
    );
    warn.mockRestore();
  });

  describe("styles, classNames, and ids", () => {
    it("should relay Grid props (e.g. containerStyle and containerProps) to the inner Grid", () => {
      const node = findDOMNode(
        render(
          getMarkup({
            containerProps: { title: "container" },
            containerStyle: { backgroundColor: "red" }
          })
        )
      );
      // containerProps are spread onto the Grid element, containerStyle onto its inner container
      const grid = node.querySelector<HTMLElement>(
        ".ReactVirtualized__Table__Grid"
      )!;
      expect(grid.getAttribute("title")).toEqual("container");
      const innerScrollContainer = node.querySelector<HTMLElement>(
        ".ReactVirtualized__Grid__innerScrollContainer"
      )!;
      expect(innerScrollContainer.style.backgroundColor).toEqual("red");
    });

    it("should use the expected global CSS classNames", () => {
      const node = findDOMNode(
        render(
          getMarkup({
            sort: () => {},
            sortBy: "name",
            sortDirection: SortDirection.ASC
          })
        )
      );
      expect(node.className).toEqual("ReactVirtualized__Table");
      expect(
        node.querySelector<HTMLElement>(".ReactVirtualized__Table__headerRow")!
      ).toBeTruthy();
      expect(
        node.querySelector<HTMLElement>(".ReactVirtualized__Table__rowColumn")!
      ).toBeTruthy();
      expect(
        node.querySelector<HTMLElement>(
          ".ReactVirtualized__Table__headerColumn"
        )!
      ).toBeTruthy();
      expect(
        node.querySelector<HTMLElement>(".ReactVirtualized__Table__row")!
      ).toBeTruthy();
      expect(
        node.querySelector<HTMLElement>(
          ".ReactVirtualized__Table__sortableHeaderColumn"
        )!
      ).toBeTruthy();
      expect(
        node.querySelector<HTMLElement>(
          ".ReactVirtualized__Table__sortableHeaderIcon"
        )!
      ).toBeTruthy();
    });

    it("should use a custom :className if specified", () => {
      const node = findDOMNode(
        render(
          getMarkup({
            className: "foo",
            headerClassName: "bar",
            rowClassName: "baz"
          })
        )
      );
      expect(node.className).toContain("foo");
      expect(node.querySelectorAll<HTMLElement>(".bar").length).toEqual(2);
      expect(node.querySelectorAll<HTMLElement>(".baz").length).toEqual(9);
    });

    it("should use a custom :id if specified", () => {
      const node = findDOMNode(render(getMarkup({ id: "bar" })));
      expect(node.getAttribute("id")).toEqual("bar");
    });

    it("should not set :id on the inner Grid", () => {
      const node = findDOMNode(render(getMarkup({ id: "bar" })));
      const grid = node.querySelector<HTMLElement>(".ReactVirtualized__Grid")!;
      expect(grid.getAttribute("id")).not.toEqual("bar");
    });

    it("should use custom :styles if specified", () => {
      const columnStyle = { backgroundColor: "red", overflow: "visible" };
      const headerStyle = { backgroundColor: "blue" };
      const columnHeaderStyle = { color: "yellow" };
      const rowStyle = { backgroundColor: "green" };
      const style = { backgroundColor: "orange" };
      const node = findDOMNode(
        render(
          getMarkup({
            columnStyle,
            headerStyle,
            columnHeaderStyle,
            rowStyle,
            style
          })
        )
      );
      expect(
        node.querySelector<HTMLElement>(".ReactVirtualized__Table__rowColumn")!
          .style.backgroundColor
      ).toEqual("red");
      expect(
        node.querySelector<HTMLElement>(".ReactVirtualized__Table__rowColumn")!
          .style.overflow
      ).toEqual("visible");
      expect(
        node.querySelector<HTMLElement>(
          ".ReactVirtualized__Table__headerColumn"
        )!.style.backgroundColor
      ).toEqual("blue");
      expect(
        node.querySelector<HTMLElement>(
          ".ReactVirtualized__Table__headerColumn"
        )!.style.color
      ).toEqual("yellow");
      expect(
        node.querySelector<HTMLElement>(".ReactVirtualized__Table__row")!.style
          .backgroundColor
      ).toEqual("green");
      expect(node.style.backgroundColor).toEqual("orange");
    });

    it("should render dynamic style given :rowStyle as a function", () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            rowStyle: ({ index }) =>
              index % 2 === 0
                ? { backgroundColor: "red" }
                : { backgroundColor: "green" }
          })
        )
      );
      const rows = rendered.querySelectorAll<HTMLElement>(
        ".ReactVirtualized__Table__row"
      );
      Array.from(rows).forEach((row, index) => {
        if (index % 2 === 0) {
          expect(row.style.backgroundColor).toEqual("red");
        } else {
          expect(row.style.backgroundColor).toEqual("green");
        }
      });
    });

    it("should pass :gridClassName and :gridStyle to the inner Grid", () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            gridClassName: "foo",
            gridStyle: { backgroundColor: "red" }
          })
        )
      );
      const grid = rendered.querySelector<HTMLElement>(
        ".ReactVirtualized__Grid"
      )!;
      expect(grid.className).toContain("foo");
      expect(grid.style.backgroundColor).toEqual("red");
    });
  });

  describe("overscanRowCount", () => {
    it("should not overscan by default", () => {
      const mock = vi.fn();
      mock.mockImplementation(overscanIndicesGetter);

      render(
        getMarkup({
          overscanIndicesGetter: mock
        })
      );
      expect(mock.mock.calls[0][0].overscanCellsCount).toEqual(0);
      expect(mock.mock.calls[1][0].overscanCellsCount).toEqual(0);
    });

    it("should overscan the specified amount", () => {
      const mock = vi.fn();
      mock.mockImplementation(overscanIndicesGetter);

      render(
        getMarkup({
          overscanIndicesGetter: mock,
          overscanRowCount: 10
        })
      );
      expect(mock.mock.calls[0][0].overscanCellsCount).toEqual(0);
      expect(mock.mock.calls[1][0].overscanCellsCount).toEqual(10);
    });
  });

  describe("onScroll", () => {
    it("should trigger callback when component initially mounts", () => {
      const onScrollCalls: TableScrollParams[] = [];
      render(
        getMarkup({
          onScroll: (params) => onScrollCalls.push(params)
        })
      );
      expect(onScrollCalls).toEqual([
        {
          clientHeight: 80,
          scrollHeight: 1000,
          scrollTop: 0
        }
      ]);
    });

    it("should trigger callback when component scrolls", () => {
      const onScrollCalls: TableScrollParams[] = [];
      render(
        getMarkup({
          onScroll: (params) => onScrollCalls.push(params)
        })
      );
      fireEvent.scroll(getGridElement(), {
        target: {
          scrollLeft: 0,
          scrollTop: 100
        }
      });
      expect(onScrollCalls.length).toEqual(2);
      expect(onScrollCalls[1]).toEqual({
        clientHeight: 80,
        scrollHeight: 1000,
        scrollTop: 100
      });
    });
  });

  describe("a11y properties", () => {
    it("should set aria role on the table", () => {
      const node = findDOMNode(render(getMarkup()));
      expect(node.getAttribute("role")).toEqual("grid");
    });

    it("should set aria col/row count on the table", () => {
      const node = findDOMNode(render(getMarkup()));
      expect(node.getAttribute("aria-colcount")).toEqual("2");
      expect(node.getAttribute("aria-rowcount")).toEqual(`${list.size}`);
    });

    it("should pass down aria labels on the table", () => {
      const node = findDOMNode(
        render(
          getMarkup({
            "aria-label": "my-table-label",
            "aria-labelledby": "my-table-label-id"
          })
        )
      );
      expect(node.getAttribute("aria-label")).toEqual("my-table-label");
      expect(node.getAttribute("aria-labelledby")).toEqual("my-table-label-id");
    });

    it("should set aria role on the header row", () => {
      const rendered = findDOMNode(render(getMarkup()));
      const row = rendered.querySelector<HTMLElement>(
        ".ReactVirtualized__Table__headerRow"
      )!;
      expect(row.getAttribute("role")).toEqual("row");
    });

    it("should set appropriate aria role on the grid", () => {
      const rendered = findDOMNode(render(getMarkup()));
      const grid = rendered.querySelector<HTMLElement>(
        ".ReactVirtualized__Table__Grid"
      )!;
      expect(grid.getAttribute("role")).toEqual("rowgroup");
    });

    it("should set aria role on a row", () => {
      const rendered = findDOMNode(render(getMarkup()));
      const row = rendered.querySelector<HTMLElement>(
        ".ReactVirtualized__Table__row"
      )!;
      expect(row.getAttribute("role")).toEqual("row");
    });

    it("should set aria rowindex on a row", () => {
      const rendered = findDOMNode(render(getMarkup()));
      const rows = rendered.querySelectorAll<HTMLElement>(
        ".ReactVirtualized__Table__row"
      );
      expect(rows[0].getAttribute("aria-rowindex")).toEqual("1");
      expect(rows[1].getAttribute("aria-rowindex")).toEqual("2");
    });

    it("should set aria role on a cell", () => {
      const rendered = findDOMNode(render(getMarkup()));
      const cell = rendered.querySelector<HTMLElement>(
        ".ReactVirtualized__Table__rowColumn"
      )!;
      expect(cell.getAttribute("role")).toEqual("gridcell");
    });

    it("should set aria colindex on a cell", () => {
      const rendered = findDOMNode(render(getMarkup()));
      const cells = rendered.querySelectorAll<HTMLElement>(
        ".ReactVirtualized__Table__rowColumn"
      );
      expect(cells[0].getAttribute("aria-colindex")).toEqual("1");
      expect(cells[1].getAttribute("aria-colindex")).toEqual("2");
    });

    it("should set aria-describedby on a cell when the column has an id", () => {
      const columnID = "column-header-test";
      const rendered = findDOMNode(
        render(
          getMarkup({
            columnID
          })
        )
      );
      const cell = rendered.querySelector<HTMLElement>(
        ".ReactVirtualized__Table__rowColumn"
      )!;
      expect(cell.getAttribute("aria-describedby")).toEqual(columnID);
    });

    it("should attach a11y properties to a row if :onRowClick is specified", () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            onRowClick: () => {}
          })
        )
      );
      const row = rendered.querySelector<HTMLElement>(
        ".ReactVirtualized__Table__row"
      )!;
      expect(row.getAttribute("aria-label")).toEqual("row");
      expect(row.tabIndex).toEqual(0);
    });

    it("should not attach a11y properties to a row if no :onRowClick is specified", () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            onRowClick: null
          })
        )
      );
      const row = rendered.querySelector<HTMLElement>(
        ".ReactVirtualized__Table__row"
      )!;
      expect(row.getAttribute("aria-label")).toEqual(null);
      expect(row.tabIndex).toEqual(-1);
    });

    it("should set aria role on a header column", () => {
      const rendered = findDOMNode(render(getMarkup()));
      const header = rendered.querySelector<HTMLElement>(
        ".ReactVirtualized__Table__headerColumn"
      )!;
      expect(header.getAttribute("role")).toEqual("columnheader");
    });

    it("should set aria-sort ascending on a header column if the column is sorted ascending", () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            sortBy: "name",
            sortDirection: SortDirection.ASC
          })
        )
      );
      const header = rendered.querySelector<HTMLElement>(
        ".ReactVirtualized__Table__headerColumn"
      )!;
      expect(header.getAttribute("aria-sort")).toEqual("ascending");
    });

    it("should set aria-sort descending on a header column if the column is sorted descending", () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            sortBy: "name",
            sortDirection: SortDirection.DESC
          })
        )
      );
      const header = rendered.querySelector<HTMLElement>(
        ".ReactVirtualized__Table__headerColumn"
      )!;
      expect(header.getAttribute("aria-sort")).toEqual("descending");
    });

    it('should set aria-sort to "none" if the column is sortable but not the current sort', () => {
      const rendered = findDOMNode(
        render(getMarkup({ disableSort: true, sort: vi.fn() }))
      );
      const headers = rendered.querySelectorAll<HTMLElement>(
        ".ReactVirtualized__Table__headerColumn"
      );
      // the first column is not sortable
      expect(headers[0].getAttribute("aria-sort")).toBe(null);
      // the second column is sortable
      expect(headers[1].getAttribute("aria-sort")).toEqual("none");
    });

    // #1291
    it("should not set aria-sort on a column that isn't sortable, even if it has an onHeaderClick handler", () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            disableSort: true,
            onHeaderClick: vi.fn(),
            sort: vi.fn()
          })
        )
      );
      const headers = rendered.querySelectorAll<HTMLElement>(
        ".ReactVirtualized__Table__headerColumn"
      );
      // The first column isn't sortable (but its header can still be clicked)
      expect(headers[0].getAttribute("aria-sort")).toBe(null);
      expect(headers[0].getAttribute("tabindex")).toEqual("0");
      // The second column is sortable
      expect(headers[1].getAttribute("aria-sort")).toEqual("none");
    });

    it("should set id on a header column when the column has an id", () => {
      const columnID = "column-header-test";
      const rendered = findDOMNode(
        render(
          getMarkup({
            columnID
          })
        )
      );
      const header = rendered.querySelector<HTMLElement>(
        ".ReactVirtualized__Table__headerColumn"
      )!;
      expect(header.getAttribute("id")).toEqual(columnID);
    });

    it("should attach a11y properties to a header column if sort is enabled", () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            disableSort: false,
            sort: () => {}
          })
        )
      );
      const row = rendered.querySelector<HTMLElement>(
        ".ReactVirtualized__Table__headerColumn"
      )!;
      expect(row.getAttribute("aria-label")).toEqual("Name");
      expect(row.tabIndex).toEqual(0);
    });

    it("should not attach a11y properties to a header column if sort is not enabled", () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            disableSort: true
          })
        )
      );
      const row = rendered.querySelector<HTMLElement>(
        ".ReactVirtualized__Table__headerColumn"
      )!;
      expect(row.getAttribute("aria-label")).toEqual(null);
      expect(row.tabIndex).toEqual(-1);
    });
  });

  describe("tabIndex", () => {
    it("should be focusable by default", () => {
      const rendered = findDOMNode(render(getMarkup()));
      expect(
        rendered.querySelector<HTMLElement>(".ReactVirtualized__Grid")!.tabIndex
      ).toEqual(0);
    });

    it("should allow tabIndex to be overridden", () => {
      const rendered = findDOMNode(
        render(
          getMarkup({
            tabIndex: -1
          })
        )
      );
      expect(
        rendered.querySelector<HTMLElement>(".ReactVirtualized__Grid")!.tabIndex
      ).toEqual(-1);
    });
  });

  describe("pure", () => {
    it("should not re-render unless props have changed", () => {
      let headerRendererCalled = false;
      let cellRendererCalled = false;
      function headerRenderer() {
        headerRendererCalled = true;
        return "foo";
      }
      function cellRenderer() {
        cellRendererCalled = true;
        return "foo";
      }
      const markup = getMarkup({
        headerRenderer,
        cellRenderer
      });
      render(markup);
      expect(headerRendererCalled).toEqual(true);
      expect(cellRendererCalled).toEqual(true);
      headerRendererCalled = false;
      cellRendererCalled = false;
      render(markup);
      expect(headerRendererCalled).toEqual(false);
      expect(cellRendererCalled).toEqual(false);
    });

    it("should re-render both the Table and the inner Grid whenever an external property changes", () => {
      let headerRendererCalled = false;
      let cellRendererCalled = false;
      function headerRenderer() {
        headerRendererCalled = true;
        return "foo";
      }
      function cellRenderer() {
        cellRendererCalled = true;
        return "foo";
      }
      const initialProperties: GetMarkupParams = {
        cellRenderer,
        estimatedRowSize: 15,
        headerRenderer,
        overscanRowCount: 1,
        rowHeight: 15,
        rowCount: 20,
        sortBy: "name",
        sortDirection: SortDirection.ASC,
        tabIndex: null
      };
      const changedProperties: GetMarkupParams = {
        estimatedRowSize: 10,
        overscanRowCount: 0,
        rowHeight: 10,
        rowCount: 10,
        sortBy: "email",
        sortDirection: SortDirection.DESC,
        tabIndex: 1
      };
      Object.entries(changedProperties).forEach(([key, value]) => {
        render.unmount(); // Reset
        render(getMarkup(initialProperties));
        headerRendererCalled = true;
        cellRendererCalled = false;
        render(
          getMarkup({
            ...initialProperties,
            [key]: value
          })
        );
        expect(headerRendererCalled).toEqual(true);
        expect(cellRendererCalled).toEqual(true);
      });
    });
  });

  it("should set the width of the single-column inner Grid to auto", () => {
    const rendered = findDOMNode(render(getMarkup()));
    expect(
      rendered.querySelector<HTMLElement>(
        ".ReactVirtualized__Grid__innerScrollContainer"
      )!.style.width
    ).toEqual("auto");
  });

  it("should pass the Table handle as the :parent param to the Column :cellRenderer", () => {
    const cellRenderer = vi.fn().mockReturnValue(null);
    const table = render<TableImperativeAPI>(getMarkup({ cellRenderer }));
    expect(cellRenderer.mock.calls[0][0].parent).toBe(table);
  });

  describe("CellMeasurer", () => {
    function renderWithCellMeasurer(
      cache: CellMeasurerCache,
      wrap: (markup: ReactElement) => ReactElement = (markup) => markup
    ) {
      // The cell's height is "measured" from its content (jsdom has no layout)
      vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockImplementation(
        function (this: HTMLElement) {
          return this.getAttribute("data-height")
            ? Number(this.getAttribute("data-height"))
            : 0;
        }
      );

      const ref = createRef<TableImperativeAPI>();
      render(
        wrap(
          <Table
            deferredMeasurementCache={cache}
            headerHeight={20}
            height={100}
            overscanRowCount={0}
            overscanIndicesGetter={overscanIndicesGetter}
            ref={ref}
            rowCount={list.size}
            rowGetter={vanillaRowGetter}
            rowHeight={cache.rowHeight}
            width={100}
          >
            <Column
              cellRenderer={({ dataKey, parent, rowIndex, cellData }) => (
                <CellMeasurer
                  cache={cache}
                  columnIndex={0}
                  key={dataKey}
                  parent={parent}
                  rowIndex={rowIndex}
                >
                  <div data-height={rowIndex === 0 ? 40 : 20}>{cellData}</div>
                </CellMeasurer>
              )}
              dataKey="name"
              width={100}
            />
          </Table>
        )
      );
      return ref;
    }

    it("should measure cells rendered by a CellMeasurer (the Table handle is the parent)", () => {
      const cache = new CellMeasurerCache({
        defaultHeight: 10,
        fixedWidth: true
      });
      const ref = renderWithCellMeasurer(cache);
      expect(cache.getHeight(0, 0)).toEqual(40);
      expect(cache.getHeight(1, 0)).toEqual(20);

      // The Grid has been updated with the measured sizes
      const rows = document.querySelectorAll<HTMLElement>(
        ".ReactVirtualized__Table__row"
      );
      expect(rows[0].style.height).toEqual("40px");
      expect(rows[1].style.height).toEqual("20px");
      expect(rows[1].style.top).toEqual("40px");
      expect(
        ref.current!.getOffsetForRow({ align: "start", index: 2 })
      ).toEqual(60);
    });

    it("should pass on a recomputeGridSize() call made by a cell while the Table is mounting", () => {
      // The first cell makes all rows taller as it mounts (before the Table's inner Grid ref has been attached)
      let rowHeight = 10;
      function GrowingCell({
        parent,
        rowIndex
      }: {
        parent: TableImperativeAPI;
        rowIndex: number;
      }) {
        useLayoutEffect(() => {
          if (rowIndex === 0 && rowHeight === 10) {
            rowHeight = 20;
            parent.recomputeGridSize({ rowIndex: 0 });
          }
        }, [parent, rowIndex]);
        return <span>{rowIndex}</span>;
      }

      render(
        <Table
          headerHeight={20}
          height={100}
          rowCount={list.size}
          rowGetter={immutableRowGetter}
          rowHeight={() => rowHeight}
          width={100}
        >
          <Column
            cellRenderer={({ parent, rowIndex }) => (
              <GrowingCell
                parent={parent as TableImperativeAPI}
                rowIndex={rowIndex}
              />
            )}
            dataKey="name"
            label="Name"
            width={50}
          />
        </Table>
      );
      const rows = document.body.querySelectorAll<HTMLElement>(
        ".ReactVirtualized__Table__row"
      );
      expect(rows[1].style.top).toEqual("20px");
      expect(rows[1].style.height).toEqual("20px");
    });

    it("should measure cells rendered by a CellMeasurer in StrictMode", () => {
      const cache = new CellMeasurerCache({
        defaultHeight: 10,
        fixedWidth: true
      });
      renderWithCellMeasurer(cache, (markup) => (
        <StrictMode>{markup}</StrictMode>
      ));
      const rows = document.querySelectorAll<HTMLElement>(
        ".ReactVirtualized__Table__row"
      );
      expect(rows[0].style.height).toEqual("40px");
      expect(rows[1].style.top).toEqual("40px");
    });
  });

  describe("StrictMode", () => {
    it("should render headers, rows, and handle sorting in StrictMode", () => {
      const sort = vi.fn();
      const ref = createRef<TableImperativeAPI>();
      render(
        <StrictMode>
          {getMarkup({
            ref,
            sort,
            sortBy: "name",
            sortDirection: SortDirection.ASC
          } as GetMarkupParams)}
        </StrictMode>
      );
      const headers = document.querySelectorAll<HTMLElement>(
        ".ReactVirtualized__Table__headerColumn"
      );
      expect(headers.length).toEqual(2);
      expect(headers[0].getAttribute("aria-sort")).toEqual("ascending");
      expect(
        document.querySelectorAll(".ReactVirtualized__Table__row").length
      ).toEqual(8);

      act(() => {
        headers[0].click();
      });
      expect(sort).toHaveBeenCalledTimes(1);
      expect(sort.mock.calls[0][0].sortDirection).toEqual(SortDirection.DESC);

      act(() => {
        ref.current!.scrollToRow({ align: "start", index: 10 });
      });
      expect(getGridElement().scrollTop).toEqual(100);
    });
  });
});
