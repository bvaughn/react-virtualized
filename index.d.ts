import * as React from "react";

export interface MultiGridProps {
    fixedColumnCount: number;
    fixedRowCount: number;
    style: React.CSSProperties;
    styleBottomLeftGrid: React.CSSProperties;
    styleBottomRightGrid: React.CSSProperties;
    styleTopLeftGrid: React.CSSProperties;
    styleTopRightGrid: React.CSSProperties;
}
export const MultiGrid: React.ComponentClass<MultiGridProps>;

export type DefaultCellRangeRendererParams = {
    cellCache: Object,
    cellRenderer: Function,
    columnSizeAndPositionManager: Object,
    columnStartIndex: number,
    columnStopIndex: number,
    horizontalOffsetAdjustment: number,
    isScrolling: boolean,
    rowSizeAndPositionManager: Object,
    rowStartIndex: number,
    rowStopIndex: number,
    scrollLeft: number,
    scrollTop: number,
    styleCache: Object,
    verticalOffsetAdjustment: number,
    visibleColumnIndices: Object,
    visibleRowIndices: Object
};

export default function defaultCellRangeRenderer(params: DefaultCellRangeRendererParams): React.ReactElement<any>;
/*
 * Components
 */

export interface VirtualScrollProps {
    className?: string;
    autoHeight?: boolean;
    estimatedRowSize?: number;
    height: number;
    noRowsRenderer?: Function;
    onRowsRendered?: (info: { overscanStartIndex: number, overscanStopIndex: number, startIndex: number, stopIndex: number }) => void;
    onScroll?: (info: { clientHeight: number, scrollHeight: number, scrollTop: number }) => void;
    overscanRowCount?: number;
    rowHeight: number | ((info: { index: number }) => number);
    rowRenderer: RowRenderer;
    rowClassName?: string | ((info: { index: number }) => string);
    rowCount: number;
    rowStyle?: React.CSSProperties | ((info: { index: number }) => React.CSSProperties);
    scrollToAlignment?: string;
    scrollToIndex?: number;
    scrollTop?: number;
    style?: React.CSSProperties;
    tabIndex?: number;
    width: number;
}
export class VirtualScroll extends React.Component<VirtualScrollProps, {}> { }
// TODO 
export type CollectionProps = any;
export class Collection extends React.Component<CollectionProps, {}> { }
// TODO 
export type FlexTableProps = any;
export class FlexTable extends React.Component<FlexTableProps, {}> { }
// TODO 
export type FlexColumnProps = any;
export class FlexColumn extends React.Component<FlexColumnProps, {}> { }
// TODO 
export type SortDirectionProps = any;
export class SortDirection extends React.Component<SortDirectionProps, {}> { }
// TODO 
export type GridProps = any;
export class Grid extends React.Component<GridProps, {}> { }

export interface ListProps {
    className?: string;
    autoHeight?: boolean;
    estimatedRowSize?: number;
    height: number;
    noRowsRenderer?: Function;
    onRowsRendered?: (info: { overscanStartIndex: number, overscanStopIndex: number, startIndex: number, stopIndex: number }) => void;
    onScroll?: (info: { clientHeight: number, scrollHeight: number, scrollTop: number }) => void;
    overscanRowCount?: number;
    rowHeight: number | ((info: { index: number }) => number);
    rowRenderer: RowRenderer;
    rowCount: number;
    scrollToAlignment?: string;
    scrollToIndex?: number;
    scrollTop?: number;
    style?: React.CSSProperties;
    tabIndex?: number;
    width: number;
}
export class List extends React.Component<ListProps, {}> { }

export type CellDataGetterParams = {
    columnData?: any,
    dataKey: string,
    rowData: any
};
export type CellRendererParams = {
    cellData?: any,
    columnData?: any,
    dataKey: string,
    rowData: any,
    rowIndex: number
};

export type HeaderRendererParams = {
    columnData?: any,
    dataKey: string,
    disableSort?: boolean,
    label?: string,
    sortBy?: string,
    sortDirection?: SortDirectionType
};

export type HeaderRowRendererParams = {
  className: string,
  columns: React.ReactNode[],
  style: React.CSSProperties,
  scrollbarWidth: number,
  height: number,
  width: number
};

export type RowRendererParams = {
    className: string,
    columns: Array<any>,
    index: number,
    isScrolling: boolean,
    onRowClick?: Function,
    onRowDoubleClick?: Function,
    onRowMouseOver?: Function,
    onRowMouseOut?: Function,
    rowData: any,
    style: any
};

export type CellDataGetter = (params: CellDataGetterParams) => React.ReactNode;
export type CellRenderer = (params: CellRendererParams) => React.ReactNode;
export type HeaderRenderer = (params: HeaderRendererParams) => React.ReactNode;
export type HeaderRowRenderer = (params: HeaderRowRendererParams) => React.ReactNode;
export type RowRenderer = (params: RowRendererParams) => React.ReactNode;

// https://github.com/bvaughn/react-virtualized/blob/master/docs/Column.md
export interface ColumnProps {
    cellDataGetter?: CellDataGetter;
    cellRenderer?: CellRenderer;
    className?: string;
    columnData?: any;
    dataKey: any;
    disableSort?: boolean;
    flexGrow?: number;
    flexShrink?: number;
    headerClassName?: string;
    headerRenderer?: HeaderRenderer;
    label?: string;
    maxWidth?: number;
    minWidth?: number;
    style?: React.CSSProperties;
    width: number;
}

export class Column extends React.Component<ColumnProps, {}> { }

// ref: https://github.com/bvaughn/react-virtualized/blob/master/docs/Table.md
export interface TableProps {
    autoHeight?: boolean;
    children?: React.ReactNode;
    className?: string;
    disableHeader?: boolean;
    estimatedRowSize?: number;
    gridClassName?: string;
    gridStyle?: any;
    headerClassName?: string;
    headerHeight: number;
    headerStyle?: any;
    height: number;
    id?: string;
    noRowsRender?: () => void;
    onHeaderClick?: (dataKey: string, columnData: any) => void;
    onRowClick?: (info: { index: number }) => void;
    onRowDoubleClick?: (info: { index: number }) => void;
    onRowMouseOut?: (info: { index: number }) => void;
    onRowMouseOver?: (info: { index: number }) => void;
    onRowsRendered?: (info: { index: number }) => void;
    overscanRowCount?: number;
    onScroll?: (info: { clientHeight: number, scrollHeight: number, scrollTop: number }) => void;
    rowClassName?: string | ((info: { index: number }) => string);
    rowCount: number;
    rowGetter?: (info: { index: number }) => any;
    rowHeight: number | ((info: { index: number }) => number);
    rowRenderer?: RowRenderer;
    rowStyle?: React.CSSProperties | ((info: { index: number }) => React.CSSProperties);
    scrollToAlignment?: string;
    scrollToIndex?: number;
    scrollTop?: number;
    sort?: (info: { sortBy: string, sortDirection: SortDirectionType }) => void;
    sortBy?: string;
    sortDirection?: SortDirectionType;
    style?: React.CSSProperties;
    tabIndex?: number;
    width: number;
}

export class Table extends React.Component<TableProps, {}> { }

/*
 * Higher-Order Components
 */

export interface AutoSizerProps {
    disableHeight?: boolean;
    disableWidth?: boolean;
    onResize?: (info: { height: number, width: number }) => any;
}
export class AutoSizer extends React.Component<AutoSizerProps, {}> { }

export interface ArrowKeyStepperProps {
    children?: React.StatelessComponent<{
        onSectionRendered: Function,
        scrollToColumn: number,
        scrollToRow: number
    }>;
    className?: string;
    columnCount: number;
    rowCount: number;
}
export class ArrowKeyStepper extends React.Component<ArrowKeyStepperProps, {}> { }

export interface CellMeasurerProps {
    cellRenderer: (info: { columnIndex: number, rowIndex: number }) => React.ReactNode;
    cellSizeCache?: {
        clearAllColumnWidths(): void;
        clearAllRowHeights(): void;
        clearColumnWidth(index: number): void;
        clearRowHeight(index: number): void;
        getColumnWidth(index: number): number;
        getRowHeight(index: number): number;
        hasColumnWidth(index: number): boolean;
        hasRowHeight(index: number): boolean;
        setColumnWidth(index: number, width: number): void;
        setRowHeight(index: number, height: number): void;
    };
    children?: React.StatelessComponent<{
        getColumnWidth: () => number,
        getRowHeight: () => number,
        resetMeasurements: () => any,
        resetMeasurementsForColumn: (index: number) => any,
        resetMeasurementsForRow: (index: number) => any,
    }>;
    columnCount: number;
    container?: React.ReactType;
    height?: number;
    rowCount: number;
    width?: number;
}
export class CellMeasurer extends React.Component<CellMeasurerProps, {}> { }

export interface ColumnSizerProps {
    children?: React.StatelessComponent<{ adjustedWidth: number, getColumnWidth: () => number, registerChild: any }>;
    columnMaxWidth?: number;
    columnMinWidth?: number;
    columnCount?: number;
    width: number;
}
export class ColumnSizer extends React.Component<ColumnSizerProps, {}> { }

export type InfiniteLoaderProps = any;
export class InfiniteLoader extends React.Component<InfiniteLoaderProps, {}> { }

export type ScrollSyncProps = any;
export class ScrollSync extends React.Component<ScrollSyncProps, {}> { }

export module WindowScroller {
    export type OnResizeArg = {
        height: number;
    }
    export type OnScrollArg = {
        scrollTop: number;
    }
    export type RenderCallbackArg = {
        height: number;
        scrollTop: number;
        isScrolling: boolean;
    }
    export type Props = {
        onScroll?: (arg: OnScrollArg) => void;
        onResize?: (arg: OnResizeArg) => void;
        // TODO `children` should be typed here
    };
}
export class WindowScroller extends React.Component<WindowScroller.Props, {}> { }


declare class DefaultCellSizeCache {
    constructor({
        uniformRowHeight,
        uniformColumnWidth
    }?: { uniformColumnWidth: boolean, uniformRowHeight: boolean });

    clearAllColumnWidths(): void;

    clearAllRowHeights(): void;

    clearColumnWidth(index: any): void;

    clearRowHeight(index: any): void;

    getColumnWidth(index: any): number | undefined;

    getRowHeight(index: any): number | undefined;

    setColumnWidth(index: any, width: number): void;

    setRowHeight(index: any, height: number): void;
}

export type IdCellSizeCacheConstructorParams = {
    indexToIdMap: Function,
    uniformRowHeight?: boolean,
    uniformColumnWidth?: boolean
};
declare function idCellSizeCache({
    indexToIdMap,
    uniformColumnWidth,
    uniformRowHeight
}: IdCellSizeCacheConstructorParams): DefaultCellSizeCache;

export {
    DefaultCellSizeCache as defaultCellMeasurerCellSizeCache,
    DefaultCellSizeCache as uniformSizeCellMeasurerCellSizeCache, // 7.21 backwards compatible export
    idCellSizeCache as idCellMeasurerCellSizeCache
};

declare const defaultCellDataGetter: CellDataGetter;
declare const defaultCellRenderer: CellRenderer;
declare const defaultHeaderRowRenderer: HeaderRowRenderer;
declare const defaultHeaderRenderer: HeaderRenderer;
declare const defaultRowRenderer: RowRenderer;

export type SortDirectionType = 'ASC' | 'DESC'

declare function SortIndicator({ sortDirection }: { sortDirection: SortDirectionType }): React.StatelessComponent<{ sortDirection: SortDirectionType }>

export {
    defaultCellDataGetter as defaultTableCellDataGetter,
    defaultCellRenderer as defaultTableCellRenderer,
    defaultHeaderRenderer as defaultTableHeaderRenderer,
    defaultHeaderRowRenderer as defaultTableHeaderRowRenderer,
    defaultRowRenderer as defaultTableRowRenderer,
    SortIndicator
}