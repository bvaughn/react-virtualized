import React from 'react';
import ReactDOM, { findDOMNode } from 'react-dom';

const SortDirection = {
    ASC: 'ASC',
    DESC: 'DESC',
};

function toVal(mix) {
	var k, y, str='';
	if (mix) {
		if (typeof mix === 'object') {
			for (k in mix) {
				if (mix[k] && (y = toVal(!!mix.push ? mix[k] : k))) {
					str && (str += ' ');
					str += y;
				}
			}
		} else if (typeof mix !== 'boolean') {
			str && (str += ' ');
			str += mix;
		}
	}
	return str;
}

function clsx () {
	var i=0, x, str='';
	while (i < arguments.length) {
		if (x = toVal(arguments[i++])) {
			str && (str += ' ');
			str += x;
		}
	}
	return str;
}

function render(markup) {
    if (!render._mountNode) {
        render._mountNode = document.createElement('div');
        document.body.appendChild(render._mountNode);
        afterEach(render.unmount);
    }
    return ReactDOM.render(markup, render._mountNode);
}
render.unmount = function () {
    if (render._mountNode) {
        ReactDOM.unmountComponentAtNode(render._mountNode);
        document.body.removeChild(render._mountNode);
        render._mountNode = null;
    }
};
class ArrowKeyStepper extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            scrollToColumn: 0,
            scrollToRow: 0,
        };
        this._columnStartIndex = 0;
        this._columnStopIndex = 0;
        this._rowStartIndex = 0;
        this._rowStopIndex = 0;
        this._onKeyDown = event => {
            const { columnCount, disabled, mode, rowCount } = this.props;
            if (disabled) {
                return;
            }
            const { scrollToColumn: scrollToColumnPrevious, scrollToRow: scrollToRowPrevious, } = this._getScrollState();
            let { scrollToColumn, scrollToRow } = this._getScrollState();
            switch (event.key) {
                case 'ArrowDown':
                    scrollToRow =
                        mode === 'cells'
                            ? Math.min(scrollToRow + 1, rowCount - 1)
                            : Math.min(this._rowStopIndex + 1, rowCount - 1);
                    break;
                case 'ArrowLeft':
                    scrollToColumn =
                        mode === 'cells'
                            ? Math.max(scrollToColumn - 1, 0)
                            : Math.max(this._columnStartIndex - 1, 0);
                    break;
                case 'ArrowRight':
                    scrollToColumn =
                        mode === 'cells'
                            ? Math.min(scrollToColumn + 1, columnCount - 1)
                            : Math.min(this._columnStopIndex + 1, columnCount - 1);
                    break;
                case 'ArrowUp':
                    scrollToRow =
                        mode === 'cells'
                            ? Math.max(scrollToRow - 1, 0)
                            : Math.max(this._rowStartIndex - 1, 0);
                    break;
            }
            if (scrollToColumn !== scrollToColumnPrevious ||
                scrollToRow !== scrollToRowPrevious) {
                event.preventDefault();
                this._updateScrollState({ scrollToColumn, scrollToRow });
            }
        };
        this._onSectionRendered = ({ columnStartIndex, columnStopIndex, rowStartIndex, rowStopIndex }) => {
            this._columnStartIndex = columnStartIndex;
            this._columnStopIndex = columnStopIndex;
            this._rowStartIndex = rowStartIndex;
            this._rowStopIndex = rowStopIndex;
        };
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.isControlled) {
            return null;
        }
        if (nextProps.scrollToColumn !== prevState.scrollToColumn ||
            nextProps.scrollToRow !== prevState.scrollToRow) {
            return {
                scrollToColumn: nextProps.scrollToColumn,
                scrollToRow: nextProps.scrollToRow,
            };
        }
        return null;
    }
    setScrollIndexes({ scrollToColumn, scrollToRow }) {
        this.setState({
            scrollToRow,
            scrollToColumn,
        });
    }
    render() {
        const { className, children } = this.props;
        const { scrollToColumn, scrollToRow } = this._getScrollState();
        return (React.createElement("div", { className: className, onKeyDown: this._onKeyDown }, children({
            onSectionRendered: this._onSectionRendered,
            scrollToColumn,
            scrollToRow,
        })));
    }
    _getScrollState() {
        return this.props.isControlled ? this.props : this.state;
    }
    _updateScrollState({ scrollToColumn, scrollToRow }) {
        const { isControlled, onScrollToChange } = this.props;
        if (typeof onScrollToChange === 'function') {
            onScrollToChange({ scrollToColumn, scrollToRow });
        }
        if (!isControlled) {
            this.setState({ scrollToColumn, scrollToRow });
        }
    }
}
ArrowKeyStepper.defaultProps = {
    disabled: false,
    isControlled: false,
    mode: 'edges',
    scrollToColumn: 0,
    scrollToRow: 0,
};

class AutoSizer extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            height: this.props.defaultHeight || 0,
            width: this.props.defaultWidth || 0,
        };
        this._onResize = () => {
            const { disableHeight, disableWidth, onResize } = this.props;
            if (this._parentNode) {
                const height = this._parentNode.offsetHeight || 0;
                const width = this._parentNode.offsetWidth || 0;
                const style = window.getComputedStyle(this._parentNode) || {};
                const paddingLeft = parseInt(style.paddingLeft, 10) || 0;
                const paddingRight = parseInt(style.paddingRight, 10) || 0;
                const paddingTop = parseInt(style.paddingTop, 10) || 0;
                const paddingBottom = parseInt(style.paddingBottom, 10) || 0;
                const newHeight = height - paddingTop - paddingBottom;
                const newWidth = width - paddingLeft - paddingRight;
                if ((!disableHeight && this.state.height !== newHeight) ||
                    (!disableWidth && this.state.width !== newWidth)) {
                    this.setState({
                        height: height - paddingTop - paddingBottom,
                        width: width - paddingLeft - paddingRight,
                    });
                    onResize({ height, width });
                }
            }
        };
        this._setRef = autoSizer => {
            this._autoSizer = autoSizer;
        };
    }
    componentDidMount() {
        const { nonce } = this.props;
        if (this._autoSizer &&
            this._autoSizer.parentNode &&
            this._autoSizer.parentNode.ownerDocument &&
            this._autoSizer.parentNode.ownerDocument.defaultView &&
            this._autoSizer.parentNode instanceof
                this._autoSizer.parentNode.ownerDocument.defaultView.HTMLElement) {
            this._parentNode = this._autoSizer.parentNode;
            this._detectElementResize = createDetectElementResize(nonce);
            this._detectElementResize.addResizeListener(this._parentNode, this._onResize);
            this._onResize();
        }
    }
    componentWillUnmount() {
        if (this._detectElementResize && this._parentNode) {
            this._detectElementResize.removeResizeListener(this._parentNode, this._onResize);
        }
    }
    render() {
        const { children, className, disableHeight, disableWidth, style, } = this.props;
        const { height, width } = this.state;
        const outerStyle = { overflow: 'visible' };
        const childParams = {};
        if (!disableHeight) {
            outerStyle.height = 0;
            childParams.height = height;
        }
        if (!disableWidth) {
            outerStyle.width = 0;
            childParams.width = width;
        }
        return (React.createElement("div", { className: className, ref: this._setRef, style: {
                ...outerStyle,
                ...style,
            } }, children(childParams)));
    }
}
AutoSizer.defaultProps = {
    onResize: () => { },
    disableHeight: false,
    disableWidth: false,
    style: {},
};
class Collection extends React.PureComponent {
    constructor(props, context) {
        super(props, context);
        this.props = props;
        this.context = context;
        this._cellMetadata = [];
        this._lastRenderedCellIndices = [];
        this._cellCache = [];
        this._isScrollingChange = this._isScrollingChange.bind(this);
        this._setCollectionViewRef = this._setCollectionViewRef.bind(this);
    }
    forceUpdate() {
        if (this._collectionView !== undefined) {
            this._collectionView.forceUpdate();
        }
    }
    recomputeCellSizesAndPositions() {
        this._cellCache = [];
        this._collectionView.recomputeCellSizesAndPositions();
    }
    render() {
        const { ...props } = this.props;
        return (React.createElement(CollectionView, Object.assign({ cellLayoutManager: this, isScrollingChange: this._isScrollingChange, ref: this._setCollectionViewRef }, props)));
    }
    calculateSizeAndPositionData() {
        const { cellCount, cellSizeAndPositionGetter, sectionSize } = this.props;
        const data = calculateSizeAndPositionData({
            cellCount,
            cellSizeAndPositionGetter,
            sectionSize,
        });
        this._cellMetadata = data.cellMetadata;
        this._sectionManager = data.sectionManager;
        this._height = data.height;
        this._width = data.width;
    }
    getLastRenderedIndices() {
        return this._lastRenderedCellIndices;
    }
    getScrollPositionForCell({ align, cellIndex, height, scrollLeft, scrollTop, width }) {
        const { cellCount } = this.props;
        if (cellIndex >= 0 && cellIndex < cellCount) {
            const cellMetadata = this._cellMetadata[cellIndex];
            scrollLeft = getUpdatedOffsetForIndex({
                align,
                cellOffset: cellMetadata.x,
                cellSize: cellMetadata.width,
                containerSize: width,
                currentOffset: scrollLeft,
                targetIndex: cellIndex,
            });
            scrollTop = getUpdatedOffsetForIndex({
                align,
                cellOffset: cellMetadata.y,
                cellSize: cellMetadata.height,
                containerSize: height,
                currentOffset: scrollTop,
                targetIndex: cellIndex,
            });
        }
        return {
            scrollLeft,
            scrollTop,
        };
    }
    getTotalSize() {
        return {
            height: this._height,
            width: this._width,
        };
    }
    cellRenderers({ height, isScrolling, width, x, y }) {
        const { cellGroupRenderer, cellRenderer } = this.props;
        this._lastRenderedCellIndices = this._sectionManager.getCellIndices({
            height,
            width,
            x,
            y,
        });
        return cellGroupRenderer({
            cellCache: this._cellCache,
            cellRenderer,
            cellSizeAndPositionGetter: ({ index }) => this._sectionManager.getCellMetadata({ index }),
            indices: this._lastRenderedCellIndices,
            isScrolling,
        });
    }
    _isScrollingChange(isScrolling) {
        if (!isScrolling) {
            this._cellCache = [];
        }
    }
    _setCollectionViewRef(ref) {
        this._collectionView = ref;
    }
}
Collection.defaultProps = {
    'aria-label': 'grid',
    cellGroupRenderer: defaultCellGroupRenderer,
};
function defaultCellGroupRenderer({ cellCache, cellRenderer, cellSizeAndPositionGetter, indices, isScrolling }) {
    return indices
        .map(index => {
        const cellMetadata = cellSizeAndPositionGetter({ index });
        let cellRendererProps = {
            index,
            isScrolling,
            key: index,
            style: {
                height: cellMetadata.height,
                left: cellMetadata.x,
                position: 'absolute',
                top: cellMetadata.y,
                width: cellMetadata.width,
            },
        };
        if (isScrolling) {
            if (!(index in cellCache)) {
                cellCache[index] = cellRenderer(cellRendererProps);
            }
            return cellCache[index];
        }
        else {
            return cellRenderer(cellRendererProps);
        }
    })
        .filter(renderedCell => !!renderedCell);
}
const IS_SCROLLING_TIMEOUT = 150;
const SCROLL_POSITION_CHANGE_REASONS = {
    OBSERVED: 'observed',
    REQUESTED: 'requested',
};
class CollectionView extends React.PureComponent {
    constructor(...args) {
        super(...args);
        this.state = {
            isScrolling: false,
            scrollLeft: 0,
            scrollTop: 0,
        };
        this._calculateSizeAndPositionDataOnNextUpdate = false;
        this._onSectionRenderedMemoizer = createCallbackMemoizer();
        this._onScrollMemoizer = createCallbackMemoizer(false);
        this._invokeOnSectionRenderedHelper = () => {
            const { cellLayoutManager, onSectionRendered } = this.props;
            this._onSectionRenderedMemoizer({
                callback: onSectionRendered,
                indices: {
                    indices: cellLayoutManager.getLastRenderedIndices(),
                },
            });
        };
        this._setScrollingContainerRef = ref => {
            this._scrollingContainer = ref;
        };
        this._updateScrollPositionForScrollToCell = () => {
            const { cellLayoutManager, height, scrollToAlignment, scrollToCell, width, } = this.props;
            const { scrollLeft, scrollTop } = this.state;
            if (scrollToCell >= 0) {
                const scrollPosition = cellLayoutManager.getScrollPositionForCell({
                    align: scrollToAlignment,
                    cellIndex: scrollToCell,
                    height,
                    scrollLeft,
                    scrollTop,
                    width,
                });
                if (scrollPosition.scrollLeft !== scrollLeft ||
                    scrollPosition.scrollTop !== scrollTop) {
                    this._setScrollPosition(scrollPosition);
                }
            }
        };
        this._onScroll = event => {
            if (event.target !== this._scrollingContainer) {
                return;
            }
            this._enablePointerEventsAfterDelay();
            const { cellLayoutManager, height, isScrollingChange, width } = this.props;
            const scrollbarSize = this._scrollbarSize;
            const { height: totalHeight, width: totalWidth, } = cellLayoutManager.getTotalSize();
            const scrollLeft = Math.max(0, Math.min(totalWidth - width + scrollbarSize, event.target.scrollLeft));
            const scrollTop = Math.max(0, Math.min(totalHeight - height + scrollbarSize, event.target.scrollTop));
            if (this.state.scrollLeft !== scrollLeft ||
                this.state.scrollTop !== scrollTop) {
                const scrollPositionChangeReason = event.cancelable
                    ? SCROLL_POSITION_CHANGE_REASONS.OBSERVED
                    : SCROLL_POSITION_CHANGE_REASONS.REQUESTED;
                if (!this.state.isScrolling) {
                    isScrollingChange(true);
                }
                this.setState({
                    isScrolling: true,
                    scrollLeft,
                    scrollPositionChangeReason,
                    scrollTop,
                });
            }
            this._invokeOnScrollMemoizer({
                scrollLeft,
                scrollTop,
                totalWidth,
                totalHeight,
            });
        };
        this._scrollbarSize = scrollbarSize();
        if (this._scrollbarSize === undefined) {
            this._scrollbarSizeMeasured = false;
            this._scrollbarSize = 0;
        }
        else {
            this._scrollbarSizeMeasured = true;
        }
    }
    recomputeCellSizesAndPositions() {
        this._calculateSizeAndPositionDataOnNextUpdate = true;
        this.forceUpdate();
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.cellCount === 0 &&
            (prevState.scrollLeft !== 0 || prevState.scrollTop !== 0)) {
            return {
                scrollLeft: 0,
                scrollTop: 0,
            };
        }
        else if (nextProps.scrollLeft !== prevState.scrollLeft ||
            nextProps.scrollTop !== prevState.scrollTop) {
            return {
                scrollLeft: nextProps.scrollLeft != null
                    ? nextProps.scrollLeft
                    : prevState.scrollLeft,
                scrollTop: nextProps.scrollTop != null
                    ? nextProps.scrollTop
                    : prevState.scrollTop,
            };
        }
        return null;
    }
    componentDidMount() {
        const { cellLayoutManager, scrollLeft, scrollToCell, scrollTop } = this.props;
        if (!this._scrollbarSizeMeasured) {
            this._scrollbarSize = scrollbarSize();
            this._scrollbarSizeMeasured = true;
            this.setState({});
        }
        if (scrollToCell >= 0) {
            this._updateScrollPositionForScrollToCell();
        }
        else if (scrollLeft >= 0 || scrollTop >= 0) {
            this._setScrollPosition({ scrollLeft, scrollTop });
        }
        this._invokeOnSectionRenderedHelper();
        const { height: totalHeight, width: totalWidth, } = cellLayoutManager.getTotalSize();
        this._invokeOnScrollMemoizer({
            scrollLeft: scrollLeft || 0,
            scrollTop: scrollTop || 0,
            totalHeight,
            totalWidth,
        });
    }
    componentDidUpdate(prevProps, prevState) {
        const { height, scrollToAlignment, scrollToCell, width } = this.props;
        const { scrollLeft, scrollPositionChangeReason, scrollTop } = this.state;
        if (scrollPositionChangeReason === SCROLL_POSITION_CHANGE_REASONS.REQUESTED) {
            if (scrollLeft >= 0 &&
                scrollLeft !== prevState.scrollLeft &&
                scrollLeft !== this._scrollingContainer.scrollLeft) {
                this._scrollingContainer.scrollLeft = scrollLeft;
            }
            if (scrollTop >= 0 &&
                scrollTop !== prevState.scrollTop &&
                scrollTop !== this._scrollingContainer.scrollTop) {
                this._scrollingContainer.scrollTop = scrollTop;
            }
        }
        if (height !== prevProps.height ||
            scrollToAlignment !== prevProps.scrollToAlignment ||
            scrollToCell !== prevProps.scrollToCell ||
            width !== prevProps.width) {
            this._updateScrollPositionForScrollToCell();
        }
        this._invokeOnSectionRenderedHelper();
    }
    componentWillUnmount() {
        if (this._disablePointerEventsTimeoutId) {
            clearTimeout(this._disablePointerEventsTimeoutId);
        }
    }
    render() {
        const { autoHeight, cellCount, cellLayoutManager, className, height, horizontalOverscanSize, id, noContentRenderer, style, verticalOverscanSize, width, } = this.props;
        const { isScrolling, scrollLeft, scrollTop } = this.state;
        if (this._lastRenderedCellCount !== cellCount ||
            this._lastRenderedCellLayoutManager !== cellLayoutManager ||
            this._calculateSizeAndPositionDataOnNextUpdate) {
            this._lastRenderedCellCount = cellCount;
            this._lastRenderedCellLayoutManager = cellLayoutManager;
            this._calculateSizeAndPositionDataOnNextUpdate = false;
            cellLayoutManager.calculateSizeAndPositionData();
        }
        const { height: totalHeight, width: totalWidth, } = cellLayoutManager.getTotalSize();
        const left = Math.max(0, scrollLeft - horizontalOverscanSize);
        const top = Math.max(0, scrollTop - verticalOverscanSize);
        const right = Math.min(totalWidth, scrollLeft + width + horizontalOverscanSize);
        const bottom = Math.min(totalHeight, scrollTop + height + verticalOverscanSize);
        const childrenToDisplay = height > 0 && width > 0
            ? cellLayoutManager.cellRenderers({
                height: bottom - top,
                isScrolling,
                width: right - left,
                x: left,
                y: top,
            })
            : [];
        const collectionStyle = {
            boxSizing: 'border-box',
            direction: 'ltr',
            height: autoHeight ? 'auto' : height,
            position: 'relative',
            WebkitOverflowScrolling: 'touch',
            width,
            willChange: 'transform',
        };
        const verticalScrollBarSize = totalHeight > height ? this._scrollbarSize : 0;
        const horizontalScrollBarSize = totalWidth > width ? this._scrollbarSize : 0;
        collectionStyle.overflowX =
            totalWidth + verticalScrollBarSize <= width ? 'hidden' : 'auto';
        collectionStyle.overflowY =
            totalHeight + horizontalScrollBarSize <= height ? 'hidden' : 'auto';
        return (React.createElement("div", { ref: this._setScrollingContainerRef, "aria-label": this.props['aria-label'], className: clsx('ReactVirtualized__Collection', className), id: id, onScroll: this._onScroll, role: "grid", style: {
                ...collectionStyle,
                ...style,
            }, tabIndex: 0 }, cellCount > 0 && (React.createElement("div", { className: "ReactVirtualized__Collection__innerScrollContainer", style: {
                height: totalHeight,
                maxHeight: totalHeight,
                maxWidth: totalWidth,
                overflow: 'hidden',
                pointerEvents: isScrolling ? 'none' : '',
                width: totalWidth,
            } }, childrenToDisplay)), cellCount === 0 && noContentRenderer()));
    }
    _enablePointerEventsAfterDelay() {
        if (this._disablePointerEventsTimeoutId) {
            clearTimeout(this._disablePointerEventsTimeoutId);
        }
        this._disablePointerEventsTimeoutId = setTimeout(() => {
            const { isScrollingChange } = this.props;
            isScrollingChange(false);
            this._disablePointerEventsTimeoutId = null;
            this.setState({
                isScrolling: false,
            });
        }, IS_SCROLLING_TIMEOUT);
    }
    _invokeOnScrollMemoizer({ scrollLeft, scrollTop, totalHeight, totalWidth }) {
        this._onScrollMemoizer({
            callback: ({ scrollLeft, scrollTop }) => {
                const { height, onScroll, width } = this.props;
                onScroll({
                    clientHeight: height,
                    clientWidth: width,
                    scrollHeight: totalHeight,
                    scrollLeft,
                    scrollTop,
                    scrollWidth: totalWidth,
                });
            },
            indices: {
                scrollLeft,
                scrollTop,
            },
        });
    }
    _setScrollPosition({ scrollLeft, scrollTop }) {
        const newState = {
            scrollPositionChangeReason: SCROLL_POSITION_CHANGE_REASONS.REQUESTED,
        };
        if (scrollLeft >= 0) {
            newState.scrollLeft = scrollLeft;
        }
        if (scrollTop >= 0) {
            newState.scrollTop = scrollTop;
        }
        if ((scrollLeft >= 0 && scrollLeft !== this.state.scrollLeft) ||
            (scrollTop >= 0 && scrollTop !== this.state.scrollTop)) {
            this.setState(newState);
        }
    }
}
CollectionView.defaultProps = {
    'aria-label': 'grid',
    horizontalOverscanSize: 0,
    noContentRenderer: () => null,
    onScroll: () => null,
    onSectionRendered: () => null,
    scrollToAlignment: 'auto',
    scrollToCell: -1,
    style: {},
    verticalOverscanSize: 0,
};

class Section {
    constructor({ height, width, x, y }) {
        this.height = height;
        this.width = width;
        this.x = x;
        this.y = y;
        this._indexMap = {};
        this._indices = [];
    }
    addCellIndex({ index }) {
        if (!this._indexMap[index]) {
            this._indexMap[index] = true;
            this._indices.push(index);
        }
    }
    getCellIndices() {
        return this._indices;
    }
    toString() {
        return `${this.x},${this.y} ${this.width}x${this.height}`;
    }
}
const SECTION_SIZE = 100;
class SectionManager {
    constructor(sectionSize = SECTION_SIZE) {
        this._sectionSize = sectionSize;
        this._cellMetadata = [];
        this._sections = {};
    }
    getCellIndices({ height, width, x, y }) {
        const indices = {};
        this.getSections({ height, width, x, y }).forEach(section => section.getCellIndices().forEach(index => {
            indices[index] = index;
        }));
        return Object.keys(indices).map(index => indices[index]);
    }
    getCellMetadata({ index }) {
        return this._cellMetadata[index];
    }
    getSections({ height, width, x, y }) {
        const sectionXStart = Math.floor(x / this._sectionSize);
        const sectionXStop = Math.floor((x + width - 1) / this._sectionSize);
        const sectionYStart = Math.floor(y / this._sectionSize);
        const sectionYStop = Math.floor((y + height - 1) / this._sectionSize);
        const sections = [];
        for (let sectionX = sectionXStart; sectionX <= sectionXStop; sectionX++) {
            for (let sectionY = sectionYStart; sectionY <= sectionYStop; sectionY++) {
                const key = `${sectionX}.${sectionY}`;
                if (!this._sections[key]) {
                    this._sections[key] = new Section({
                        height: this._sectionSize,
                        width: this._sectionSize,
                        x: sectionX * this._sectionSize,
                        y: sectionY * this._sectionSize,
                    });
                }
                sections.push(this._sections[key]);
            }
        }
        return sections;
    }
    getTotalSectionCount() {
        return Object.keys(this._sections).length;
    }
    toString() {
        return Object.keys(this._sections).map(index => this._sections[index].toString());
    }
    registerCell({ cellMetadatum, index }) {
        this._cellMetadata[index] = cellMetadatum;
        this.getSections(cellMetadatum).forEach(section => section.addCellIndex({ index }));
    }
}
class CellMeasurer extends React.PureComponent {
    constructor() {
        super(...arguments);
        this._measure = () => {
            const { cache, columnIndex = 0, parent, rowIndex = this.props.index || 0, } = this.props;
            const { height, width } = this._getCellMeasurements();
            if (height !== cache.getHeight(rowIndex, columnIndex) ||
                width !== cache.getWidth(rowIndex, columnIndex)) {
                cache.set(rowIndex, columnIndex, width, height);
                if (parent && typeof parent.recomputeGridSize === 'function') {
                    parent.recomputeGridSize({
                        columnIndex,
                        rowIndex,
                    });
                }
            }
        };
    }
    componentDidMount() {
        this._maybeMeasureCell();
    }
    componentDidUpdate() {
        this._maybeMeasureCell();
    }
    render() {
        const { children } = this.props;
        return typeof children === 'function'
            ? children({ measure: this._measure })
            : children;
    }
    _getCellMeasurements() {
        const { cache } = this.props;
        const node = findDOMNode(this);
        if (node &&
            node.ownerDocument &&
            node.ownerDocument.defaultView &&
            node instanceof node.ownerDocument.defaultView.HTMLElement) {
            const styleWidth = node.style.width;
            const styleHeight = node.style.height;
            if (!cache.hasFixedWidth()) {
                node.style.width = 'auto';
            }
            if (!cache.hasFixedHeight()) {
                node.style.height = 'auto';
            }
            const height = Math.ceil(node.offsetHeight);
            const width = Math.ceil(node.offsetWidth);
            if (styleWidth) {
                node.style.width = styleWidth;
            }
            if (styleHeight) {
                node.style.height = styleHeight;
            }
            return { height, width };
        }
        else {
            return { height: 0, width: 0 };
        }
    }
    _maybeMeasureCell() {
        const { cache, columnIndex = 0, parent, rowIndex = this.props.index || 0, } = this.props;
        if (!cache.has(rowIndex, columnIndex)) {
            const { height, width } = this._getCellMeasurements();
            cache.set(rowIndex, columnIndex, width, height);
            if (parent &&
                typeof parent.invalidateCellSizeAfterRender === 'function') {
                parent.invalidateCellSizeAfterRender({
                    columnIndex,
                    rowIndex,
                });
            }
        }
    }
}
CellMeasurer.__internalCellMeasurerFlag = false;
{
    CellMeasurer.__internalCellMeasurerFlag = true;
}
const DEFAULT_HEIGHT = 30;
const DEFAULT_WIDTH = 100;
class CellMeasurerCache {
    constructor(params = {}) {
        this._cellHeightCache = {};
        this._cellWidthCache = {};
        this._columnWidthCache = {};
        this._rowHeightCache = {};
        this._columnCount = 0;
        this._rowCount = 0;
        this.columnWidth = ({ index }) => {
            const key = this._keyMapper(0, index);
            return this._columnWidthCache.hasOwnProperty(key)
                ? this._columnWidthCache[key]
                : this._defaultWidth;
        };
        this.rowHeight = ({ index }) => {
            const key = this._keyMapper(index, 0);
            return this._rowHeightCache.hasOwnProperty(key)
                ? this._rowHeightCache[key]
                : this._defaultHeight;
        };
        const { defaultHeight, defaultWidth, fixedHeight, fixedWidth, keyMapper, minHeight, minWidth, } = params;
        this._hasFixedHeight = fixedHeight === true;
        this._hasFixedWidth = fixedWidth === true;
        this._minHeight = minHeight || 0;
        this._minWidth = minWidth || 0;
        this._keyMapper = keyMapper || defaultKeyMapper;
        this._defaultHeight = Math.max(this._minHeight, typeof defaultHeight === 'number' ? defaultHeight : DEFAULT_HEIGHT);
        this._defaultWidth = Math.max(this._minWidth, typeof defaultWidth === 'number' ? defaultWidth : DEFAULT_WIDTH);
        {
            if (this._hasFixedHeight === false && this._hasFixedWidth === false) {
                console.warn("CellMeasurerCache should only measure a cell's width or height. " +
                    'You have configured CellMeasurerCache to measure both. ' +
                    'This will result in poor performance.');
            }
            if (this._hasFixedHeight === false && this._defaultHeight === 0) {
                console.warn('Fixed height CellMeasurerCache should specify a :defaultHeight greater than 0. ' +
                    'Failing to do so will lead to unnecessary layout and poor performance.');
            }
            if (this._hasFixedWidth === false && this._defaultWidth === 0) {
                console.warn('Fixed width CellMeasurerCache should specify a :defaultWidth greater than 0. ' +
                    'Failing to do so will lead to unnecessary layout and poor performance.');
            }
        }
    }
    clear(rowIndex, columnIndex = 0) {
        const key = this._keyMapper(rowIndex, columnIndex);
        delete this._cellHeightCache[key];
        delete this._cellWidthCache[key];
        this._updateCachedColumnAndRowSizes(rowIndex, columnIndex);
    }
    clearAll() {
        this._cellHeightCache = {};
        this._cellWidthCache = {};
        this._columnWidthCache = {};
        this._rowHeightCache = {};
        this._rowCount = 0;
        this._columnCount = 0;
    }
    get defaultHeight() {
        return this._defaultHeight;
    }
    get defaultWidth() {
        return this._defaultWidth;
    }
    hasFixedHeight() {
        return this._hasFixedHeight;
    }
    hasFixedWidth() {
        return this._hasFixedWidth;
    }
    getHeight(rowIndex, columnIndex = 0) {
        if (this._hasFixedHeight) {
            return this._defaultHeight;
        }
        else {
            const key = this._keyMapper(rowIndex, columnIndex);
            return this._cellHeightCache.hasOwnProperty(key)
                ? Math.max(this._minHeight, this._cellHeightCache[key])
                : this._defaultHeight;
        }
    }
    getWidth(rowIndex, columnIndex = 0) {
        if (this._hasFixedWidth) {
            return this._defaultWidth;
        }
        else {
            const key = this._keyMapper(rowIndex, columnIndex);
            return this._cellWidthCache.hasOwnProperty(key)
                ? Math.max(this._minWidth, this._cellWidthCache[key])
                : this._defaultWidth;
        }
    }
    has(rowIndex, columnIndex = 0) {
        const key = this._keyMapper(rowIndex, columnIndex);
        return this._cellHeightCache.hasOwnProperty(key);
    }
    set(rowIndex, columnIndex, width, height) {
        const key = this._keyMapper(rowIndex, columnIndex);
        if (columnIndex >= this._columnCount) {
            this._columnCount = columnIndex + 1;
        }
        if (rowIndex >= this._rowCount) {
            this._rowCount = rowIndex + 1;
        }
        this._cellHeightCache[key] = height;
        this._cellWidthCache[key] = width;
        this._updateCachedColumnAndRowSizes(rowIndex, columnIndex);
    }
    _updateCachedColumnAndRowSizes(rowIndex, columnIndex) {
        if (!this._hasFixedWidth) {
            let columnWidth = 0;
            for (let i = 0; i < this._rowCount; i++) {
                columnWidth = Math.max(columnWidth, this.getWidth(i, columnIndex));
            }
            const columnKey = this._keyMapper(0, columnIndex);
            this._columnWidthCache[columnKey] = columnWidth;
        }
        if (!this._hasFixedHeight) {
            let rowHeight = 0;
            for (let i = 0; i < this._columnCount; i++) {
                rowHeight = Math.max(rowHeight, this.getHeight(rowIndex, i));
            }
            const rowKey = this._keyMapper(rowIndex, 0);
            this._rowHeightCache[rowKey] = rowHeight;
        }
    }
}
function defaultKeyMapper(rowIndex, columnIndex) {
    return `${rowIndex}-${columnIndex}`;
}
class ColumnSizer extends React.PureComponent {
    constructor(props, context) {
        super(props, context);
        this.props = props;
        this.context = context;
        this._registerChild = this._registerChild.bind(this);
    }
    componentDidUpdate(prevProps) {
        const { columnMaxWidth, columnMinWidth, columnCount, width } = this.props;
        if (columnMaxWidth !== prevProps.columnMaxWidth ||
            columnMinWidth !== prevProps.columnMinWidth ||
            columnCount !== prevProps.columnCount ||
            width !== prevProps.width) {
            if (this._registeredChild) {
                this._registeredChild.recomputeGridSize();
            }
        }
    }
    render() {
        const { children, columnMaxWidth, columnMinWidth, columnCount, width, } = this.props;
        const safeColumnMinWidth = columnMinWidth || 1;
        const safeColumnMaxWidth = columnMaxWidth
            ? Math.min(columnMaxWidth, width)
            : width;
        let columnWidth = width / columnCount;
        columnWidth = Math.max(safeColumnMinWidth, columnWidth);
        columnWidth = Math.min(safeColumnMaxWidth, columnWidth);
        columnWidth = Math.floor(columnWidth);
        let adjustedWidth = Math.min(width, columnWidth * columnCount);
        return children({
            adjustedWidth,
            columnWidth,
            getColumnWidth: () => columnWidth,
            registerChild: this._registerChild,
        });
    }
    _registerChild(child) {
        if (child && typeof child.recomputeGridSize !== 'function') {
            throw Error('Unexpected child type registered; only Grid/MultiGrid children are supported.');
        }
        this._registeredChild = child;
        if (this._registeredChild) {
            this._registeredChild.recomputeGridSize();
        }
    }
}
var size;
function scrollbarSize(recalc) {
    if (!size && size !== 0 || recalc) {
        if ("createElement" in self) {
            var scrollDiv = document.createElement('div');
            scrollDiv.style.position = 'absolute';
            scrollDiv.style.top = '-9999px';
            scrollDiv.style.width = '50px';
            scrollDiv.style.height = '50px';
            scrollDiv.style.overflow = 'scroll';
            document.body.appendChild(scrollDiv);
            size = scrollDiv.offsetWidth - scrollDiv.clientWidth;
            document.body.removeChild(scrollDiv);
        }
    }
    return size;
}
const SCROLL_DIRECTION_BACKWARD = -1;
const SCROLL_DIRECTION_FORWARD = 1;
const SCROLL_DIRECTION_HORIZONTAL = 'horizontal';
const SCROLL_DIRECTION_VERTICAL = 'vertical';
function defaultOverscanIndicesGetter({ cellCount, overscanCellsCount, scrollDirection, startIndex, stopIndex }) {
    overscanCellsCount = Math.max(1, overscanCellsCount);
    if (scrollDirection === SCROLL_DIRECTION_FORWARD) {
        return {
            overscanStartIndex: Math.max(0, startIndex - 1),
            overscanStopIndex: Math.min(cellCount - 1, stopIndex + overscanCellsCount),
        };
    }
    else {
        return {
            overscanStartIndex: Math.max(0, startIndex - overscanCellsCount),
            overscanStopIndex: Math.min(cellCount - 1, stopIndex + 1),
        };
    }
}
function defaultCellRangeRenderer({ cellCache, cellRenderer, columnSizeAndPositionManager, columnStartIndex, columnStopIndex, deferredMeasurementCache, horizontalOffsetAdjustment, isScrolling, isScrollingOptOut, parent, rowSizeAndPositionManager, rowStartIndex, rowStopIndex, styleCache, verticalOffsetAdjustment, visibleColumnIndices, visibleRowIndices }) {
    const renderedCells = [];
    const areOffsetsAdjusted = columnSizeAndPositionManager.areOffsetsAdjusted() ||
        rowSizeAndPositionManager.areOffsetsAdjusted();
    const canCacheStyle = !isScrolling && !areOffsetsAdjusted;
    for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
        let rowDatum = rowSizeAndPositionManager.getSizeAndPositionOfCell(rowIndex);
        for (let columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
            let columnDatum = columnSizeAndPositionManager.getSizeAndPositionOfCell(columnIndex);
            let isVisible = columnIndex >= visibleColumnIndices.start &&
                columnIndex <= visibleColumnIndices.stop &&
                rowIndex >= visibleRowIndices.start &&
                rowIndex <= visibleRowIndices.stop;
            let key = `${rowIndex}-${columnIndex}`;
            let style;
            if (canCacheStyle && styleCache[key]) {
                style = styleCache[key];
            }
            else {
                if (deferredMeasurementCache &&
                    !deferredMeasurementCache.has(rowIndex, columnIndex)) {
                    style = {
                        height: 'auto',
                        left: 0,
                        position: 'absolute',
                        top: 0,
                        width: 'auto',
                    };
                }
                else {
                    style = {
                        height: rowDatum.size,
                        left: columnDatum.offset + horizontalOffsetAdjustment,
                        position: 'absolute',
                        top: rowDatum.offset + verticalOffsetAdjustment,
                        width: columnDatum.size,
                    };
                    styleCache[key] = style;
                }
            }
            let cellRendererParams = {
                columnIndex,
                isScrolling,
                isVisible,
                key,
                parent,
                rowIndex,
                style,
            };
            let renderedCell;
            if ((isScrollingOptOut || isScrolling) &&
                !horizontalOffsetAdjustment &&
                !verticalOffsetAdjustment) {
                if (!cellCache[key]) {
                    cellCache[key] = cellRenderer(cellRendererParams);
                }
                renderedCell = cellCache[key];
            }
            else {
                renderedCell = cellRenderer(cellRendererParams);
            }
            if (renderedCell == null || renderedCell === false) {
                continue;
            }
            {
                warnAboutMissingStyle(parent, renderedCell);
            }
            renderedCells.push(renderedCell);
        }
    }
    return renderedCells;
}
function warnAboutMissingStyle(parent, renderedCell) {
    {
        if (renderedCell) {
            if (renderedCell.type && renderedCell.type.__internalCellMeasurerFlag) {
                renderedCell = renderedCell.props.children;
            }
            if (renderedCell &&
                renderedCell.props &&
                renderedCell.props.style === undefined &&
                parent.__warnedAboutMissingStyle !== true) {
                parent.__warnedAboutMissingStyle = true;
                console.warn('Rendered cell should include style property for positioning.');
            }
        }
    }
}
const DEFAULT_SCROLLING_RESET_TIME_INTERVAL = 150;
const renderNull = () => null;
class Grid extends React.PureComponent {
    constructor(props) {
        super(props);
        this._onGridRenderedMemoizer = createCallbackMemoizer();
        this._onScrollMemoizer = createCallbackMemoizer(false);
        this._deferredInvalidateColumnIndex = null;
        this._deferredInvalidateRowIndex = null;
        this._recomputeScrollLeftFlag = false;
        this._recomputeScrollTopFlag = false;
        this._horizontalScrollBarSize = 0;
        this._verticalScrollBarSize = 0;
        this._scrollbarPresenceChanged = false;
        this._renderedColumnStartIndex = 0;
        this._renderedColumnStopIndex = 0;
        this._renderedRowStartIndex = 0;
        this._renderedRowStopIndex = 0;
        this._styleCache = {};
        this._cellCache = {};
        this._debounceScrollEndedCallback = () => {
            this._disablePointerEventsTimeoutId = null;
            this.setState({
                isScrolling: false,
                needToResetStyleCache: false,
            });
        };
        this._invokeOnGridRenderedHelper = () => {
            const { onSectionRendered } = this.props;
            this._onGridRenderedMemoizer({
                callback: onSectionRendered,
                indices: {
                    columnOverscanStartIndex: this._columnStartIndex,
                    columnOverscanStopIndex: this._columnStopIndex,
                    columnStartIndex: this._renderedColumnStartIndex,
                    columnStopIndex: this._renderedColumnStopIndex,
                    rowOverscanStartIndex: this._rowStartIndex,
                    rowOverscanStopIndex: this._rowStopIndex,
                    rowStartIndex: this._renderedRowStartIndex,
                    rowStopIndex: this._renderedRowStopIndex,
                },
            });
        };
        this._setScrollingContainerRef = ref => {
            this._scrollingContainer = ref;
        };
        this._onScroll = event => {
            if (event.target === this._scrollingContainer) {
                this.handleScrollEvent(event.target);
            }
        };
        this.props = props;
        const columnSizeAndPositionManager = new ScalingCellSizeAndPositionManager({
            cellCount: props.columnCount,
            cellSizeGetter: params => Grid._wrapSizeGetter(props.columnWidth)(params),
            estimatedCellSize: Grid._getEstimatedColumnSize(props),
        });
        const rowSizeAndPositionManager = new ScalingCellSizeAndPositionManager({
            cellCount: props.rowCount,
            cellSizeGetter: params => Grid._wrapSizeGetter(props.rowHeight)(params),
            estimatedCellSize: Grid._getEstimatedRowSize(props),
        });
        this.state = {
            instanceProps: {
                columnSizeAndPositionManager,
                rowSizeAndPositionManager,
                prevColumnWidth: props.columnWidth,
                prevRowHeight: props.rowHeight,
                prevColumnCount: props.columnCount,
                prevRowCount: props.rowCount,
                prevIsScrolling: props.isScrolling === true,
                prevScrollToColumn: props.scrollToColumn,
                prevScrollToRow: props.scrollToRow,
                scrollbarSize: 0,
                scrollbarSizeMeasured: false,
            },
            isScrolling: false,
            scrollDirectionHorizontal: SCROLL_DIRECTION_FORWARD,
            scrollDirectionVertical: SCROLL_DIRECTION_FORWARD,
            scrollLeft: 0,
            scrollTop: 0,
            scrollPositionChangeReason: null,
            needToResetStyleCache: false,
        };
        if (props.scrollToRow > 0) {
            this._initialScrollTop = this._getCalculatedScrollTop(props, this.state);
        }
        if (props.scrollToColumn > 0) {
            this._initialScrollLeft = this._getCalculatedScrollLeft(props, this.state);
        }
    }
    getOffsetForCell({ alignment = this.props.scrollToAlignment, columnIndex = this.props.scrollToColumn, rowIndex = this.props.scrollToRow } = {}) {
        const offsetProps = {
            ...this.props,
            scrollToAlignment: alignment,
            scrollToColumn: columnIndex,
            scrollToRow: rowIndex,
        };
        return {
            scrollLeft: this._getCalculatedScrollLeft(offsetProps),
            scrollTop: this._getCalculatedScrollTop(offsetProps),
        };
    }
    getTotalRowsHeight() {
        return this.state.instanceProps.rowSizeAndPositionManager.getTotalSize();
    }
    getTotalColumnsWidth() {
        return this.state.instanceProps.columnSizeAndPositionManager.getTotalSize();
    }
    handleScrollEvent({ scrollLeft: scrollLeftParam = 0, scrollTop: scrollTopParam = 0 }) {
        if (scrollTopParam < 0) {
            return;
        }
        this._debounceScrollEnded();
        const { autoHeight, autoWidth, height, width } = this.props;
        const { instanceProps } = this.state;
        const scrollbarSize = instanceProps.scrollbarSize;
        const totalRowsHeight = instanceProps.rowSizeAndPositionManager.getTotalSize();
        const totalColumnsWidth = instanceProps.columnSizeAndPositionManager.getTotalSize();
        const scrollLeft = Math.min(Math.max(0, totalColumnsWidth - width + scrollbarSize), scrollLeftParam);
        const scrollTop = Math.min(Math.max(0, totalRowsHeight - height + scrollbarSize), scrollTopParam);
        if (this.state.scrollLeft !== scrollLeft ||
            this.state.scrollTop !== scrollTop) {
            const scrollDirectionHorizontal = scrollLeft !== this.state.scrollLeft
                ? scrollLeft > this.state.scrollLeft
                    ? SCROLL_DIRECTION_FORWARD
                    : SCROLL_DIRECTION_BACKWARD
                : this.state.scrollDirectionHorizontal;
            const scrollDirectionVertical = scrollTop !== this.state.scrollTop
                ? scrollTop > this.state.scrollTop
                    ? SCROLL_DIRECTION_FORWARD
                    : SCROLL_DIRECTION_BACKWARD
                : this.state.scrollDirectionVertical;
            const newState = {
                isScrolling: true,
                scrollDirectionHorizontal,
                scrollDirectionVertical,
                scrollPositionChangeReason: SCROLL_POSITION_CHANGE_REASONS.OBSERVED,
            };
            if (!autoHeight) {
                newState.scrollTop = scrollTop;
            }
            if (!autoWidth) {
                newState.scrollLeft = scrollLeft;
            }
            newState.needToResetStyleCache = false;
            this.setState(newState);
        }
        this._invokeOnScrollMemoizer({
            scrollLeft,
            scrollTop,
            totalColumnsWidth,
            totalRowsHeight,
        });
    }
    invalidateCellSizeAfterRender({ columnIndex, rowIndex }) {
        this._deferredInvalidateColumnIndex =
            typeof this._deferredInvalidateColumnIndex === 'number'
                ? Math.min(this._deferredInvalidateColumnIndex, columnIndex)
                : columnIndex;
        this._deferredInvalidateRowIndex =
            typeof this._deferredInvalidateRowIndex === 'number'
                ? Math.min(this._deferredInvalidateRowIndex, rowIndex)
                : rowIndex;
    }
    measureAllCells() {
        const { columnCount, rowCount } = this.props;
        const { instanceProps } = this.state;
        instanceProps.columnSizeAndPositionManager.getSizeAndPositionOfCell(columnCount - 1);
        instanceProps.rowSizeAndPositionManager.getSizeAndPositionOfCell(rowCount - 1);
    }
    recomputeGridSize({ columnIndex = 0, rowIndex = 0 } = {}) {
        const { scrollToColumn, scrollToRow } = this.props;
        const { instanceProps } = this.state;
        instanceProps.columnSizeAndPositionManager.resetCell(columnIndex);
        instanceProps.rowSizeAndPositionManager.resetCell(rowIndex);
        this._recomputeScrollLeftFlag =
            scrollToColumn >= 0 &&
                (this.state.scrollDirectionHorizontal === SCROLL_DIRECTION_FORWARD
                    ? columnIndex <= scrollToColumn
                    : columnIndex >= scrollToColumn);
        this._recomputeScrollTopFlag =
            scrollToRow >= 0 &&
                (this.state.scrollDirectionVertical === SCROLL_DIRECTION_FORWARD
                    ? rowIndex <= scrollToRow
                    : rowIndex >= scrollToRow);
        this._styleCache = {};
        this._cellCache = {};
        this.forceUpdate();
    }
    scrollToCell({ columnIndex, rowIndex }) {
        const { columnCount } = this.props;
        const props = this.props;
        if (columnCount > 1 && columnIndex !== undefined) {
            this._updateScrollLeftForScrollToColumn({
                ...props,
                scrollToColumn: columnIndex,
            });
        }
        if (rowIndex !== undefined) {
            this._updateScrollTopForScrollToRow({
                ...props,
                scrollToRow: rowIndex,
            });
        }
    }
    componentDidMount() {
        const { getScrollbarSize, height, scrollLeft, scrollToColumn, scrollTop, scrollToRow, width, } = this.props;
        const { instanceProps } = this.state;
        this._initialScrollTop = 0;
        this._initialScrollLeft = 0;
        this._handleInvalidatedGridSize();
        if (!instanceProps.scrollbarSizeMeasured) {
            this.setState(prevState => {
                const stateUpdate = { ...prevState, needToResetStyleCache: false };
                stateUpdate.instanceProps.scrollbarSize = getScrollbarSize();
                stateUpdate.instanceProps.scrollbarSizeMeasured = true;
                return stateUpdate;
            });
        }
        if ((typeof scrollLeft === 'number' && scrollLeft >= 0) ||
            (typeof scrollTop === 'number' && scrollTop >= 0)) {
            const stateUpdate = Grid._getScrollToPositionStateUpdate({
                prevState: this.state,
                scrollLeft,
                scrollTop,
            });
            if (stateUpdate) {
                stateUpdate.needToResetStyleCache = false;
                this.setState(stateUpdate);
            }
        }
        if (this._scrollingContainer) {
            if (this._scrollingContainer.scrollLeft !== this.state.scrollLeft) {
                this._scrollingContainer.scrollLeft = this.state.scrollLeft;
            }
            if (this._scrollingContainer.scrollTop !== this.state.scrollTop) {
                this._scrollingContainer.scrollTop = this.state.scrollTop;
            }
        }
        const sizeIsBiggerThanZero = height > 0 && width > 0;
        if (scrollToColumn >= 0 && sizeIsBiggerThanZero) {
            this._updateScrollLeftForScrollToColumn();
        }
        if (scrollToRow >= 0 && sizeIsBiggerThanZero) {
            this._updateScrollTopForScrollToRow();
        }
        this._invokeOnGridRenderedHelper();
        this._invokeOnScrollMemoizer({
            scrollLeft: scrollLeft || 0,
            scrollTop: scrollTop || 0,
            totalColumnsWidth: instanceProps.columnSizeAndPositionManager.getTotalSize(),
            totalRowsHeight: instanceProps.rowSizeAndPositionManager.getTotalSize(),
        });
        this._maybeCallOnScrollbarPresenceChange();
    }
    componentDidUpdate(prevProps, prevState) {
        const { autoHeight, autoWidth, columnCount, height, rowCount, scrollToAlignment, scrollToColumn, scrollToRow, width, } = this.props;
        const { scrollLeft, scrollPositionChangeReason, scrollTop, instanceProps, } = this.state;
        this._handleInvalidatedGridSize();
        const columnOrRowCountJustIncreasedFromZero = (columnCount > 0 && prevProps.columnCount === 0) ||
            (rowCount > 0 && prevProps.rowCount === 0);
        if (scrollPositionChangeReason === SCROLL_POSITION_CHANGE_REASONS.REQUESTED) {
            if (!autoWidth &&
                scrollLeft >= 0 &&
                (scrollLeft !== this._scrollingContainer.scrollLeft ||
                    columnOrRowCountJustIncreasedFromZero)) {
                this._scrollingContainer.scrollLeft = scrollLeft;
            }
            if (!autoHeight &&
                scrollTop >= 0 &&
                (scrollTop !== this._scrollingContainer.scrollTop ||
                    columnOrRowCountJustIncreasedFromZero)) {
                this._scrollingContainer.scrollTop = scrollTop;
            }
        }
        const sizeJustIncreasedFromZero = (prevProps.width === 0 || prevProps.height === 0) &&
            (height > 0 && width > 0);
        if (this._recomputeScrollLeftFlag) {
            this._recomputeScrollLeftFlag = false;
            this._updateScrollLeftForScrollToColumn(this.props);
        }
        else {
            updateScrollIndexHelper({
                cellSizeAndPositionManager: instanceProps.columnSizeAndPositionManager,
                previousCellsCount: prevProps.columnCount,
                previousCellSize: prevProps.columnWidth,
                previousScrollToAlignment: prevProps.scrollToAlignment,
                previousScrollToIndex: prevProps.scrollToColumn,
                previousSize: prevProps.width,
                scrollOffset: scrollLeft,
                scrollToAlignment,
                scrollToIndex: scrollToColumn,
                size: width,
                sizeJustIncreasedFromZero,
                updateScrollIndexCallback: () => this._updateScrollLeftForScrollToColumn(this.props),
            });
        }
        if (this._recomputeScrollTopFlag) {
            this._recomputeScrollTopFlag = false;
            this._updateScrollTopForScrollToRow(this.props);
        }
        else {
            updateScrollIndexHelper({
                cellSizeAndPositionManager: instanceProps.rowSizeAndPositionManager,
                previousCellsCount: prevProps.rowCount,
                previousCellSize: prevProps.rowHeight,
                previousScrollToAlignment: prevProps.scrollToAlignment,
                previousScrollToIndex: prevProps.scrollToRow,
                previousSize: prevProps.height,
                scrollOffset: scrollTop,
                scrollToAlignment,
                scrollToIndex: scrollToRow,
                size: height,
                sizeJustIncreasedFromZero,
                updateScrollIndexCallback: () => this._updateScrollTopForScrollToRow(this.props),
            });
        }
        this._invokeOnGridRenderedHelper();
        if (scrollLeft !== prevState.scrollLeft ||
            scrollTop !== prevState.scrollTop) {
            const totalRowsHeight = instanceProps.rowSizeAndPositionManager.getTotalSize();
            const totalColumnsWidth = instanceProps.columnSizeAndPositionManager.getTotalSize();
            this._invokeOnScrollMemoizer({
                scrollLeft,
                scrollTop,
                totalColumnsWidth,
                totalRowsHeight,
            });
        }
        this._maybeCallOnScrollbarPresenceChange();
    }
    componentWillUnmount() {
        if (this._disablePointerEventsTimeoutId) {
            cancelAnimationTimeout(this._disablePointerEventsTimeoutId);
        }
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        const newState = {};
        if ((nextProps.columnCount === 0 && prevState.scrollLeft !== 0) ||
            (nextProps.rowCount === 0 && prevState.scrollTop !== 0)) {
            newState.scrollLeft = 0;
            newState.scrollTop = 0;
        }
        else if ((nextProps.scrollLeft !== prevState.scrollLeft &&
            nextProps.scrollToColumn < 0) ||
            (nextProps.scrollTop !== prevState.scrollTop && nextProps.scrollToRow < 0)) {
            Object.assign(newState, Grid._getScrollToPositionStateUpdate({
                prevState,
                scrollLeft: nextProps.scrollLeft,
                scrollTop: nextProps.scrollTop,
            }));
        }
        let { instanceProps } = prevState;
        newState.needToResetStyleCache = false;
        if (nextProps.columnWidth !== instanceProps.prevColumnWidth ||
            nextProps.rowHeight !== instanceProps.prevRowHeight) {
            newState.needToResetStyleCache = true;
        }
        instanceProps.columnSizeAndPositionManager.configure({
            cellCount: nextProps.columnCount,
            estimatedCellSize: Grid._getEstimatedColumnSize(nextProps),
            cellSizeGetter: Grid._wrapSizeGetter(nextProps.columnWidth),
        });
        instanceProps.rowSizeAndPositionManager.configure({
            cellCount: nextProps.rowCount,
            estimatedCellSize: Grid._getEstimatedRowSize(nextProps),
            cellSizeGetter: Grid._wrapSizeGetter(nextProps.rowHeight),
        });
        if (instanceProps.prevColumnCount === 0 ||
            instanceProps.prevRowCount === 0) {
            instanceProps.prevColumnCount = 0;
            instanceProps.prevRowCount = 0;
        }
        if (nextProps.autoHeight &&
            nextProps.isScrolling === false &&
            instanceProps.prevIsScrolling === true) {
            Object.assign(newState, {
                isScrolling: false,
            });
        }
        let maybeStateA;
        let maybeStateB;
        calculateSizeAndPositionDataAndUpdateScrollOffset({
            cellCount: instanceProps.prevColumnCount,
            cellSize: typeof instanceProps.prevColumnWidth === 'number'
                ? instanceProps.prevColumnWidth
                : null,
            computeMetadataCallback: () => instanceProps.columnSizeAndPositionManager.resetCell(0),
            computeMetadataCallbackProps: nextProps,
            nextCellsCount: nextProps.columnCount,
            nextCellSize: typeof nextProps.columnWidth === 'number'
                ? nextProps.columnWidth
                : null,
            nextScrollToIndex: nextProps.scrollToColumn,
            scrollToIndex: instanceProps.prevScrollToColumn,
            updateScrollOffsetForScrollToIndex: () => {
                maybeStateA = Grid._getScrollLeftForScrollToColumnStateUpdate(nextProps, prevState);
            },
        });
        calculateSizeAndPositionDataAndUpdateScrollOffset({
            cellCount: instanceProps.prevRowCount,
            cellSize: typeof instanceProps.prevRowHeight === 'number'
                ? instanceProps.prevRowHeight
                : null,
            computeMetadataCallback: () => instanceProps.rowSizeAndPositionManager.resetCell(0),
            computeMetadataCallbackProps: nextProps,
            nextCellsCount: nextProps.rowCount,
            nextCellSize: typeof nextProps.rowHeight === 'number' ? nextProps.rowHeight : null,
            nextScrollToIndex: nextProps.scrollToRow,
            scrollToIndex: instanceProps.prevScrollToRow,
            updateScrollOffsetForScrollToIndex: () => {
                maybeStateB = Grid._getScrollTopForScrollToRowStateUpdate(nextProps, prevState);
            },
        });
        instanceProps.prevColumnCount = nextProps.columnCount;
        instanceProps.prevColumnWidth = nextProps.columnWidth;
        instanceProps.prevIsScrolling = nextProps.isScrolling === true;
        instanceProps.prevRowCount = nextProps.rowCount;
        instanceProps.prevRowHeight = nextProps.rowHeight;
        instanceProps.prevScrollToColumn = nextProps.scrollToColumn;
        instanceProps.prevScrollToRow = nextProps.scrollToRow;
        instanceProps.scrollbarSize = nextProps.getScrollbarSize();
        if (instanceProps.scrollbarSize === undefined) {
            instanceProps.scrollbarSizeMeasured = false;
            instanceProps.scrollbarSize = 0;
        }
        else {
            instanceProps.scrollbarSizeMeasured = true;
        }
        newState.instanceProps = instanceProps;
        return { ...newState, ...maybeStateA, ...maybeStateB };
    }
    render() {
        const { autoContainerWidth, autoHeight, autoWidth, className, containerProps, containerRole, containerStyle, height, id, noContentRenderer, role, style, tabIndex, width, } = this.props;
        const { instanceProps, needToResetStyleCache } = this.state;
        const isScrolling = this._isScrolling();
        const gridStyle = {
            boxSizing: 'border-box',
            direction: 'ltr',
            height: autoHeight ? 'auto' : height,
            position: 'relative',
            width: autoWidth ? 'auto' : width,
            WebkitOverflowScrolling: 'touch',
            willChange: 'transform',
        };
        if (needToResetStyleCache) {
            this._styleCache = {};
        }
        if (!this.state.isScrolling) {
            this._resetStyleCache();
        }
        this._calculateChildrenToRender(this.props, this.state);
        const totalColumnsWidth = instanceProps.columnSizeAndPositionManager.getTotalSize();
        const totalRowsHeight = instanceProps.rowSizeAndPositionManager.getTotalSize();
        const verticalScrollBarSize = totalRowsHeight > height ? instanceProps.scrollbarSize : 0;
        const horizontalScrollBarSize = totalColumnsWidth > width ? instanceProps.scrollbarSize : 0;
        if (horizontalScrollBarSize !== this._horizontalScrollBarSize ||
            verticalScrollBarSize !== this._verticalScrollBarSize) {
            this._horizontalScrollBarSize = horizontalScrollBarSize;
            this._verticalScrollBarSize = verticalScrollBarSize;
            this._scrollbarPresenceChanged = true;
        }
        gridStyle.overflowX =
            totalColumnsWidth + verticalScrollBarSize <= width ? 'hidden' : 'auto';
        gridStyle.overflowY =
            totalRowsHeight + horizontalScrollBarSize <= height ? 'hidden' : 'auto';
        const childrenToDisplay = this._childrenToDisplay;
        const showNoContentRenderer = childrenToDisplay.length === 0 && height > 0 && width > 0;
        return (React.createElement("div", Object.assign({ ref: this._setScrollingContainerRef }, containerProps, { "aria-label": this.props['aria-label'], "aria-readonly": this.props['aria-readonly'], className: clsx('ReactVirtualized__Grid', className), id: id, onScroll: this._onScroll, role: role, style: {
                ...gridStyle,
                ...style,
            }, tabIndex: tabIndex }), childrenToDisplay.length > 0 && (React.createElement("div", { className: "ReactVirtualized__Grid__innerScrollContainer", role: containerRole, style: {
                width: autoContainerWidth ? 'auto' : totalColumnsWidth,
                height: totalRowsHeight,
                maxWidth: totalColumnsWidth,
                maxHeight: totalRowsHeight,
                overflow: 'hidden',
                pointerEvents: isScrolling ? 'none' : '',
                position: 'relative',
                ...containerStyle,
            } }, childrenToDisplay)), showNoContentRenderer && noContentRenderer()));
    }
    _calculateChildrenToRender(props = this.props, state = this.state) {
        const { cellRenderer, cellRangeRenderer, columnCount, deferredMeasurementCache, height, overscanColumnCount, overscanIndicesGetter, overscanRowCount, rowCount, width, isScrollingOptOut, } = props;
        const { scrollDirectionHorizontal, scrollDirectionVertical, instanceProps, } = state;
        const scrollTop = this._initialScrollTop > 0 ? this._initialScrollTop : state.scrollTop;
        const scrollLeft = this._initialScrollLeft > 0 ? this._initialScrollLeft : state.scrollLeft;
        const isScrolling = this._isScrolling(props, state);
        this._childrenToDisplay = [];
        if (height > 0 && width > 0) {
            const visibleColumnIndices = instanceProps.columnSizeAndPositionManager.getVisibleCellRange({
                containerSize: width,
                offset: scrollLeft,
            });
            const visibleRowIndices = instanceProps.rowSizeAndPositionManager.getVisibleCellRange({
                containerSize: height,
                offset: scrollTop,
            });
            const horizontalOffsetAdjustment = instanceProps.columnSizeAndPositionManager.getOffsetAdjustment({
                containerSize: width,
                offset: scrollLeft,
            });
            const verticalOffsetAdjustment = instanceProps.rowSizeAndPositionManager.getOffsetAdjustment({
                containerSize: height,
                offset: scrollTop,
            });
            this._renderedColumnStartIndex = visibleColumnIndices.start;
            this._renderedColumnStopIndex = visibleColumnIndices.stop;
            this._renderedRowStartIndex = visibleRowIndices.start;
            this._renderedRowStopIndex = visibleRowIndices.stop;
            const overscanColumnIndices = overscanIndicesGetter({
                direction: 'horizontal',
                cellCount: columnCount,
                overscanCellsCount: overscanColumnCount,
                scrollDirection: scrollDirectionHorizontal,
                startIndex: typeof visibleColumnIndices.start === 'number'
                    ? visibleColumnIndices.start
                    : 0,
                stopIndex: typeof visibleColumnIndices.stop === 'number'
                    ? visibleColumnIndices.stop
                    : -1,
            });
            const overscanRowIndices = overscanIndicesGetter({
                direction: 'vertical',
                cellCount: rowCount,
                overscanCellsCount: overscanRowCount,
                scrollDirection: scrollDirectionVertical,
                startIndex: typeof visibleRowIndices.start === 'number'
                    ? visibleRowIndices.start
                    : 0,
                stopIndex: typeof visibleRowIndices.stop === 'number'
                    ? visibleRowIndices.stop
                    : -1,
            });
            let columnStartIndex = overscanColumnIndices.overscanStartIndex;
            let columnStopIndex = overscanColumnIndices.overscanStopIndex;
            let rowStartIndex = overscanRowIndices.overscanStartIndex;
            let rowStopIndex = overscanRowIndices.overscanStopIndex;
            if (deferredMeasurementCache) {
                if (!deferredMeasurementCache.hasFixedHeight()) {
                    for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
                        if (!deferredMeasurementCache.has(rowIndex, 0)) {
                            columnStartIndex = 0;
                            columnStopIndex = columnCount - 1;
                            break;
                        }
                    }
                }
                if (!deferredMeasurementCache.hasFixedWidth()) {
                    for (let columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
                        if (!deferredMeasurementCache.has(0, columnIndex)) {
                            rowStartIndex = 0;
                            rowStopIndex = rowCount - 1;
                            break;
                        }
                    }
                }
            }
            this._childrenToDisplay = cellRangeRenderer({
                cellCache: this._cellCache,
                cellRenderer,
                columnSizeAndPositionManager: instanceProps.columnSizeAndPositionManager,
                columnStartIndex,
                columnStopIndex,
                deferredMeasurementCache,
                horizontalOffsetAdjustment,
                isScrolling,
                isScrollingOptOut,
                parent: this,
                rowSizeAndPositionManager: instanceProps.rowSizeAndPositionManager,
                rowStartIndex,
                rowStopIndex,
                scrollLeft,
                scrollTop,
                styleCache: this._styleCache,
                verticalOffsetAdjustment,
                visibleColumnIndices,
                visibleRowIndices,
            });
            this._columnStartIndex = columnStartIndex;
            this._columnStopIndex = columnStopIndex;
            this._rowStartIndex = rowStartIndex;
            this._rowStopIndex = rowStopIndex;
        }
    }
    _debounceScrollEnded() {
        const { scrollingResetTimeInterval } = this.props;
        if (this._disablePointerEventsTimeoutId) {
            cancelAnimationTimeout(this._disablePointerEventsTimeoutId);
        }
        this._disablePointerEventsTimeoutId = requestAnimationTimeout(this._debounceScrollEndedCallback, scrollingResetTimeInterval);
    }
    static _getEstimatedColumnSize(props) {
        return typeof props.columnWidth === 'number'
            ? props.columnWidth
            : props.estimatedColumnSize;
    }
    static _getEstimatedRowSize(props) {
        return typeof props.rowHeight === 'number'
            ? props.rowHeight
            : props.estimatedRowSize;
    }
    _handleInvalidatedGridSize() {
        if (typeof this._deferredInvalidateColumnIndex === 'number' &&
            typeof this._deferredInvalidateRowIndex === 'number') {
            const columnIndex = this._deferredInvalidateColumnIndex;
            const rowIndex = this._deferredInvalidateRowIndex;
            this._deferredInvalidateColumnIndex = null;
            this._deferredInvalidateRowIndex = null;
            this.recomputeGridSize({ columnIndex, rowIndex });
        }
    }
    _invokeOnScrollMemoizer({ scrollLeft, scrollTop, totalColumnsWidth, totalRowsHeight }) {
        this._onScrollMemoizer({
            callback: ({ scrollLeft, scrollTop }) => {
                const { height, onScroll, width } = this.props;
                onScroll({
                    clientHeight: height,
                    clientWidth: width,
                    scrollHeight: totalRowsHeight,
                    scrollLeft,
                    scrollTop,
                    scrollWidth: totalColumnsWidth,
                });
            },
            indices: {
                scrollLeft,
                scrollTop,
            },
        });
    }
    _isScrolling(props = this.props, state = this.state) {
        return Object.hasOwnProperty.call(props, 'isScrolling')
            ? Boolean(props.isScrolling)
            : Boolean(state.isScrolling);
    }
    _maybeCallOnScrollbarPresenceChange() {
        if (this._scrollbarPresenceChanged) {
            const { onScrollbarPresenceChange } = this.props;
            this._scrollbarPresenceChanged = false;
            onScrollbarPresenceChange({
                horizontal: this._horizontalScrollBarSize > 0,
                size: this.state.instanceProps.scrollbarSize,
                vertical: this._verticalScrollBarSize > 0,
            });
        }
    }
    static _getScrollToPositionStateUpdate({ prevState, scrollLeft, scrollTop }) {
        const newState = {
            scrollPositionChangeReason: SCROLL_POSITION_CHANGE_REASONS.REQUESTED,
        };
        if (typeof scrollLeft === 'number' && scrollLeft >= 0) {
            newState.scrollDirectionHorizontal =
                scrollLeft > prevState.scrollLeft
                    ? SCROLL_DIRECTION_FORWARD
                    : SCROLL_DIRECTION_BACKWARD;
            newState.scrollLeft = scrollLeft;
        }
        if (typeof scrollTop === 'number' && scrollTop >= 0) {
            newState.scrollDirectionVertical =
                scrollTop > prevState.scrollTop
                    ? SCROLL_DIRECTION_FORWARD
                    : SCROLL_DIRECTION_BACKWARD;
            newState.scrollTop = scrollTop;
        }
        if ((typeof scrollLeft === 'number' &&
            scrollLeft >= 0 &&
            scrollLeft !== prevState.scrollLeft) ||
            (typeof scrollTop === 'number' &&
                scrollTop >= 0 &&
                scrollTop !== prevState.scrollTop)) {
            return newState;
        }
        return null;
    }
    scrollToPosition({ scrollLeft, scrollTop }) {
        const stateUpdate = Grid._getScrollToPositionStateUpdate({
            prevState: this.state,
            scrollLeft,
            scrollTop,
        });
        if (stateUpdate) {
            stateUpdate.needToResetStyleCache = false;
            this.setState(stateUpdate);
        }
    }
    static _wrapSizeGetter(value) {
        return typeof value === 'function' ? value : () => value;
    }
    static _getCalculatedScrollLeft(nextProps, prevState) {
        const { columnCount, height, scrollToAlignment, scrollToColumn, width, } = nextProps;
        const { scrollLeft, instanceProps } = prevState;
        if (columnCount > 0) {
            const finalColumn = columnCount - 1;
            const targetIndex = scrollToColumn < 0
                ? finalColumn
                : Math.min(finalColumn, scrollToColumn);
            const totalRowsHeight = instanceProps.rowSizeAndPositionManager.getTotalSize();
            const scrollBarSize = instanceProps.scrollbarSizeMeasured && totalRowsHeight > height
                ? instanceProps.scrollbarSize
                : 0;
            return instanceProps.columnSizeAndPositionManager.getUpdatedOffsetForIndex({
                align: scrollToAlignment,
                containerSize: width - scrollBarSize,
                currentOffset: scrollLeft,
                targetIndex,
            });
        }
        return 0;
    }
    _getCalculatedScrollLeft(props = this.props, state = this.state) {
        return Grid._getCalculatedScrollLeft(props, state);
    }
    static _getScrollLeftForScrollToColumnStateUpdate(nextProps, prevState) {
        const { scrollLeft } = prevState;
        const calculatedScrollLeft = Grid._getCalculatedScrollLeft(nextProps, prevState);
        if (typeof calculatedScrollLeft === 'number' &&
            calculatedScrollLeft >= 0 &&
            scrollLeft !== calculatedScrollLeft) {
            return Grid._getScrollToPositionStateUpdate({
                prevState,
                scrollLeft: calculatedScrollLeft,
                scrollTop: -1,
            });
        }
        return null;
    }
    _updateScrollLeftForScrollToColumn(props = this.props, state = this.state) {
        const stateUpdate = Grid._getScrollLeftForScrollToColumnStateUpdate(props, state);
        if (stateUpdate) {
            stateUpdate.needToResetStyleCache = false;
            this.setState(stateUpdate);
        }
    }
    static _getCalculatedScrollTop(nextProps, prevState) {
        const { height, rowCount, scrollToAlignment, scrollToRow, width } = nextProps;
        const { scrollTop, instanceProps } = prevState;
        if (rowCount > 0) {
            const finalRow = rowCount - 1;
            const targetIndex = scrollToRow < 0 ? finalRow : Math.min(finalRow, scrollToRow);
            const totalColumnsWidth = instanceProps.columnSizeAndPositionManager.getTotalSize();
            const scrollBarSize = instanceProps.scrollbarSizeMeasured && totalColumnsWidth > width
                ? instanceProps.scrollbarSize
                : 0;
            return instanceProps.rowSizeAndPositionManager.getUpdatedOffsetForIndex({
                align: scrollToAlignment,
                containerSize: height - scrollBarSize,
                currentOffset: scrollTop,
                targetIndex,
            });
        }
        return 0;
    }
    _getCalculatedScrollTop(props = this.props, state = this.state) {
        return Grid._getCalculatedScrollTop(props, state);
    }
    _resetStyleCache() {
        const styleCache = this._styleCache;
        const cellCache = this._cellCache;
        const { isScrollingOptOut } = this.props;
        this._cellCache = {};
        this._styleCache = {};
        for (let rowIndex = this._rowStartIndex; rowIndex <= this._rowStopIndex; rowIndex++) {
            for (let columnIndex = this._columnStartIndex; columnIndex <= this._columnStopIndex; columnIndex++) {
                let key = `${rowIndex}-${columnIndex}`;
                this._styleCache[key] = styleCache[key];
                if (isScrollingOptOut) {
                    this._cellCache[key] = cellCache[key];
                }
            }
        }
    }
    static _getScrollTopForScrollToRowStateUpdate(nextProps, prevState) {
        const { scrollTop } = prevState;
        const calculatedScrollTop = Grid._getCalculatedScrollTop(nextProps, prevState);
        if (typeof calculatedScrollTop === 'number' &&
            calculatedScrollTop >= 0 &&
            scrollTop !== calculatedScrollTop) {
            return Grid._getScrollToPositionStateUpdate({
                prevState,
                scrollLeft: -1,
                scrollTop: calculatedScrollTop,
            });
        }
        return null;
    }
    _updateScrollTopForScrollToRow(props = this.props, state = this.state) {
        const stateUpdate = Grid._getScrollTopForScrollToRowStateUpdate(props, state);
        if (stateUpdate) {
            stateUpdate.needToResetStyleCache = false;
            this.setState(stateUpdate);
        }
    }
}
Grid.defaultProps = {
    'aria-label': 'grid',
    'aria-readonly': true,
    autoContainerWidth: false,
    autoHeight: false,
    autoWidth: false,
    cellRangeRenderer: defaultCellRangeRenderer,
    containerRole: 'rowgroup',
    containerStyle: {},
    estimatedColumnSize: 100,
    estimatedRowSize: 30,
    getScrollbarSize: scrollbarSize,
    noContentRenderer: renderNull,
    onScroll: () => { },
    onScrollbarPresenceChange: () => { },
    onSectionRendered: () => { },
    overscanColumnCount: 0,
    overscanIndicesGetter: defaultOverscanIndicesGetter,
    overscanRowCount: 10,
    role: 'grid',
    scrollingResetTimeInterval: DEFAULT_SCROLLING_RESET_TIME_INTERVAL,
    scrollToAlignment: 'auto',
    scrollToColumn: -1,
    scrollToRow: -1,
    style: {},
    tabIndex: 0,
    isScrollingOptOut: false,
};

class InfiniteLoader extends React.PureComponent {
    constructor(props, context) {
        super(props, context);
        this.props = props;
        this.context = context;
        this._loadMoreRowsMemoizer = createCallbackMemoizer();
        this._onRowsRendered = this._onRowsRendered.bind(this);
        this._registerChild = this._registerChild.bind(this);
    }
    resetLoadMoreRowsCache(autoReload) {
        this._loadMoreRowsMemoizer = createCallbackMemoizer();
        if (autoReload) {
            this._doStuff(this._lastRenderedStartIndex, this._lastRenderedStopIndex);
        }
    }
    render() {
        const { children } = this.props;
        return children({
            onRowsRendered: this._onRowsRendered,
            registerChild: this._registerChild,
        });
    }
    _loadUnloadedRanges(unloadedRanges) {
        const { loadMoreRows } = this.props;
        unloadedRanges.forEach(unloadedRange => {
            let promise = loadMoreRows(unloadedRange);
            if (promise) {
                promise.then(() => {
                    if (isRangeVisible({
                        lastRenderedStartIndex: this._lastRenderedStartIndex,
                        lastRenderedStopIndex: this._lastRenderedStopIndex,
                        startIndex: unloadedRange.startIndex,
                        stopIndex: unloadedRange.stopIndex,
                    })) {
                        if (this._registeredChild) {
                            forceUpdateReactVirtualizedComponent(this._registeredChild, this._lastRenderedStartIndex);
                        }
                    }
                });
            }
        });
    }
    _onRowsRendered({ startIndex, stopIndex }) {
        this._lastRenderedStartIndex = startIndex;
        this._lastRenderedStopIndex = stopIndex;
        this._doStuff(startIndex, stopIndex);
    }
    _doStuff(startIndex, stopIndex) {
        const { isRowLoaded, minimumBatchSize, rowCount, threshold } = this.props;
        const unloadedRanges = scanForUnloadedRanges({
            isRowLoaded,
            minimumBatchSize,
            rowCount,
            startIndex: Math.max(0, startIndex - threshold),
            stopIndex: Math.min(rowCount - 1, stopIndex + threshold),
        });
        const squashedUnloadedRanges = [].concat(...unloadedRanges.map(({ startIndex, stopIndex }) => [
            startIndex,
            stopIndex,
        ]));
        this._loadMoreRowsMemoizer({
            callback: () => {
                this._loadUnloadedRanges(unloadedRanges);
            },
            indices: { squashedUnloadedRanges },
        });
    }
    _registerChild(registeredChild) {
        this._registeredChild = registeredChild;
    }
}
InfiniteLoader.defaultProps = {
    minimumBatchSize: 10,
    rowCount: 0,
    threshold: 15,
};
function isRangeVisible({ lastRenderedStartIndex, lastRenderedStopIndex, startIndex, stopIndex }) {
    return !(startIndex > lastRenderedStopIndex || stopIndex < lastRenderedStartIndex);
}
function scanForUnloadedRanges({ isRowLoaded, minimumBatchSize, rowCount, startIndex, stopIndex }) {
    const unloadedRanges = [];
    let rangeStartIndex = null;
    let rangeStopIndex = null;
    for (let index = startIndex; index <= stopIndex; index++) {
        let loaded = isRowLoaded({ index });
        if (!loaded) {
            rangeStopIndex = index;
            if (rangeStartIndex === null) {
                rangeStartIndex = index;
            }
        }
        else if (rangeStopIndex !== null) {
            unloadedRanges.push({
                startIndex: rangeStartIndex,
                stopIndex: rangeStopIndex,
            });
            rangeStartIndex = rangeStopIndex = null;
        }
    }
    if (rangeStopIndex !== null) {
        const potentialStopIndex = Math.min(Math.max(rangeStopIndex, rangeStartIndex + minimumBatchSize - 1), rowCount - 1);
        for (let index = rangeStopIndex + 1; index <= potentialStopIndex; index++) {
            if (!isRowLoaded({ index })) {
                rangeStopIndex = index;
            }
            else {
                break;
            }
        }
        unloadedRanges.push({
            startIndex: rangeStartIndex,
            stopIndex: rangeStopIndex,
        });
    }
    if (unloadedRanges.length) {
        const firstUnloadedRange = unloadedRanges[0];
        while (firstUnloadedRange.stopIndex - firstUnloadedRange.startIndex + 1 <
            minimumBatchSize &&
            firstUnloadedRange.startIndex > 0) {
            let index = firstUnloadedRange.startIndex - 1;
            if (!isRowLoaded({ index })) {
                firstUnloadedRange.startIndex = index;
            }
            else {
                break;
            }
        }
    }
    return unloadedRanges;
}
function forceUpdateReactVirtualizedComponent(component, currentIndex = 0) {
    const recomputeSize = typeof component.recomputeGridSize === 'function'
        ? component.recomputeGridSize
        : component.recomputeRowHeights;
    if (recomputeSize) {
        recomputeSize.call(component, currentIndex);
    }
    else {
        component.forceUpdate();
    }
}
class List extends React.PureComponent {
    constructor() {
        super(...arguments);
        this._cellRenderer = ({ parent, rowIndex, style, isScrolling, isVisible, key }) => {
            const { rowRenderer } = this.props;
            const { writable } = Object.getOwnPropertyDescriptor(style, 'width');
            if (writable) {
                style.width = '100%';
            }
            return rowRenderer({
                index: rowIndex,
                style,
                isScrolling,
                isVisible,
                key,
                parent,
            });
        };
        this._setRef = ref => {
            this.Grid = ref;
        };
        this._onScroll = ({ clientHeight, scrollHeight, scrollTop }) => {
            const { onScroll } = this.props;
            onScroll({ clientHeight, scrollHeight, scrollTop });
        };
        this._onSectionRendered = ({ rowOverscanStartIndex, rowOverscanStopIndex, rowStartIndex, rowStopIndex }) => {
            const { onRowsRendered } = this.props;
            onRowsRendered({
                overscanStartIndex: rowOverscanStartIndex,
                overscanStopIndex: rowOverscanStopIndex,
                startIndex: rowStartIndex,
                stopIndex: rowStopIndex,
            });
        };
    }
    forceUpdateGrid() {
        if (this.Grid) {
            this.Grid.forceUpdate();
        }
    }
    getOffsetForRow({ alignment, index }) {
        if (this.Grid) {
            const { scrollTop } = this.Grid.getOffsetForCell({
                alignment,
                rowIndex: index,
                columnIndex: 0,
            });
            return scrollTop;
        }
        return 0;
    }
    invalidateCellSizeAfterRender({ columnIndex, rowIndex }) {
        if (this.Grid) {
            this.Grid.invalidateCellSizeAfterRender({
                rowIndex,
                columnIndex,
            });
        }
    }
    measureAllRows() {
        if (this.Grid) {
            this.Grid.measureAllCells();
        }
    }
    recomputeGridSize({ columnIndex = 0, rowIndex = 0 } = {}) {
        if (this.Grid) {
            this.Grid.recomputeGridSize({
                rowIndex,
                columnIndex,
            });
        }
    }
    recomputeRowHeights(index = 0) {
        if (this.Grid) {
            this.Grid.recomputeGridSize({
                rowIndex: index,
                columnIndex: 0,
            });
        }
    }
    scrollToPosition(scrollTop = 0) {
        if (this.Grid) {
            this.Grid.scrollToPosition({ scrollTop });
        }
    }
    scrollToRow(index = 0) {
        if (this.Grid) {
            this.Grid.scrollToCell({
                columnIndex: 0,
                rowIndex: index,
            });
        }
    }
    render() {
        const { className, noRowsRenderer, scrollToIndex, width } = this.props;
        const classNames = clsx('ReactVirtualized__List', className);
        return (React.createElement(Grid, Object.assign({}, this.props, { autoContainerWidth: true, cellRenderer: this._cellRenderer, className: classNames, columnWidth: width, columnCount: 1, noContentRenderer: noRowsRenderer, onScroll: this._onScroll, onSectionRendered: this._onSectionRendered, ref: this._setRef, scrollToRow: scrollToIndex })));
    }
}
List.defaultProps = {
    autoHeight: false,
    estimatedRowSize: 30,
    onScroll: () => { },
    noRowsRenderer: () => null,
    onRowsRendered: () => { },
    overscanIndicesGetter: defaultOverscanIndicesGetter,
    overscanRowCount: 10,
    scrollToAlignment: 'auto',
    scrollToIndex: -1,
    style: {},
};
class CellMeasurerCacheDecorator {
    constructor(params = {}) {
        this.columnWidth = ({ index }) => {
            this._cellMeasurerCache.columnWidth({
                index: index + this._columnIndexOffset,
            });
        };
        this.rowHeight = ({ index }) => {
            this._cellMeasurerCache.rowHeight({
                index: index + this._rowIndexOffset,
            });
        };
        const { cellMeasurerCache, columnIndexOffset = 0, rowIndexOffset = 0, } = params;
        this._cellMeasurerCache = cellMeasurerCache;
        this._columnIndexOffset = columnIndexOffset;
        this._rowIndexOffset = rowIndexOffset;
    }
    clear(rowIndex, columnIndex) {
        this._cellMeasurerCache.clear(rowIndex + this._rowIndexOffset, columnIndex + this._columnIndexOffset);
    }
    clearAll() {
        this._cellMeasurerCache.clearAll();
    }
    get defaultHeight() {
        return this._cellMeasurerCache.defaultHeight;
    }
    get defaultWidth() {
        return this._cellMeasurerCache.defaultWidth;
    }
    hasFixedHeight() {
        return this._cellMeasurerCache.hasFixedHeight();
    }
    hasFixedWidth() {
        return this._cellMeasurerCache.hasFixedWidth();
    }
    getHeight(rowIndex, columnIndex = 0) {
        return this._cellMeasurerCache.getHeight(rowIndex + this._rowIndexOffset, columnIndex + this._columnIndexOffset);
    }
    getWidth(rowIndex, columnIndex = 0) {
        return this._cellMeasurerCache.getWidth(rowIndex + this._rowIndexOffset, columnIndex + this._columnIndexOffset);
    }
    has(rowIndex, columnIndex = 0) {
        return this._cellMeasurerCache.has(rowIndex + this._rowIndexOffset, columnIndex + this._columnIndexOffset);
    }
    set(rowIndex, columnIndex, width, height) {
        this._cellMeasurerCache.set(rowIndex + this._rowIndexOffset, columnIndex + this._columnIndexOffset, width, height);
    }
}
const SCROLLBAR_SIZE_BUFFER = 20;
class MultiGrid extends React.PureComponent {
    constructor(props, context) {
        super(props, context);
        this.state = {
            scrollLeft: 0,
            scrollTop: 0,
            scrollbarSize: 0,
            showHorizontalScrollbar: false,
            showVerticalScrollbar: false,
        };
        this._deferredInvalidateColumnIndex = null;
        this._deferredInvalidateRowIndex = null;
        this._bottomLeftGridRef = ref => {
            this._bottomLeftGrid = ref;
        };
        this._bottomRightGridRef = ref => {
            this._bottomRightGrid = ref;
        };
        this._cellRendererBottomLeftGrid = ({ rowIndex, ...rest }) => {
            const { cellRenderer, fixedRowCount, rowCount } = this.props;
            if (rowIndex === rowCount - fixedRowCount) {
                return (React.createElement("div", { key: rest.key, style: {
                        ...rest.style,
                        height: SCROLLBAR_SIZE_BUFFER,
                    } }));
            }
            else {
                return cellRenderer({
                    ...rest,
                    parent: this,
                    rowIndex: rowIndex + fixedRowCount,
                });
            }
        };
        this._cellRendererBottomRightGrid = ({ columnIndex, rowIndex, ...rest }) => {
            const { cellRenderer, fixedColumnCount, fixedRowCount } = this.props;
            return cellRenderer({
                ...rest,
                columnIndex: columnIndex + fixedColumnCount,
                parent: this,
                rowIndex: rowIndex + fixedRowCount,
            });
        };
        this._cellRendererTopRightGrid = ({ columnIndex, ...rest }) => {
            const { cellRenderer, columnCount, fixedColumnCount } = this.props;
            if (columnIndex === columnCount - fixedColumnCount) {
                return (React.createElement("div", { key: rest.key, style: {
                        ...rest.style,
                        width: SCROLLBAR_SIZE_BUFFER,
                    } }));
            }
            else {
                return cellRenderer({
                    ...rest,
                    columnIndex: columnIndex + fixedColumnCount,
                    parent: this,
                });
            }
        };
        this._columnWidthRightGrid = ({ index }) => {
            const { columnCount, fixedColumnCount, columnWidth } = this.props;
            const { scrollbarSize, showHorizontalScrollbar } = this.state;
            if (showHorizontalScrollbar && index === columnCount - fixedColumnCount) {
                return scrollbarSize;
            }
            return typeof columnWidth === 'function'
                ? columnWidth({ index: index + fixedColumnCount })
                : columnWidth;
        };
        this._onScroll = scrollInfo => {
            const { scrollLeft, scrollTop } = scrollInfo;
            this.setState({
                scrollLeft,
                scrollTop,
            });
            const onScroll = this.props.onScroll;
            if (onScroll) {
                onScroll(scrollInfo);
            }
        };
        this._onScrollbarPresenceChange = ({ horizontal, size, vertical }) => {
            const { showHorizontalScrollbar, showVerticalScrollbar } = this.state;
            if (horizontal !== showHorizontalScrollbar ||
                vertical !== showVerticalScrollbar) {
                this.setState({
                    scrollbarSize: size,
                    showHorizontalScrollbar: horizontal,
                    showVerticalScrollbar: vertical,
                });
                const { onScrollbarPresenceChange } = this.props;
                if (typeof onScrollbarPresenceChange === 'function') {
                    onScrollbarPresenceChange({
                        horizontal,
                        size,
                        vertical,
                    });
                }
            }
        };
        this._onScrollLeft = scrollInfo => {
            const { scrollLeft } = scrollInfo;
            this._onScroll({
                scrollLeft,
                scrollTop: this.state.scrollTop,
            });
        };
        this._onScrollTop = scrollInfo => {
            const { scrollTop } = scrollInfo;
            this._onScroll({
                scrollTop,
                scrollLeft: this.state.scrollLeft,
            });
        };
        this._rowHeightBottomGrid = ({ index }) => {
            const { fixedRowCount, rowCount, rowHeight } = this.props;
            const { scrollbarSize, showVerticalScrollbar } = this.state;
            if (showVerticalScrollbar && index === rowCount - fixedRowCount) {
                return scrollbarSize;
            }
            return typeof rowHeight === 'function'
                ? rowHeight({ index: index + fixedRowCount })
                : rowHeight;
        };
        this._topLeftGridRef = ref => {
            this._topLeftGrid = ref;
        };
        this._topRightGridRef = ref => {
            this._topRightGrid = ref;
        };
        this.props = props;
        this.context = context;
        const { deferredMeasurementCache, fixedColumnCount, fixedRowCount } = props;
        this._maybeCalculateCachedStyles(true);
        if (deferredMeasurementCache) {
            this._deferredMeasurementCacheBottomLeftGrid =
                fixedRowCount > 0
                    ? new CellMeasurerCacheDecorator({
                        cellMeasurerCache: deferredMeasurementCache,
                        columnIndexOffset: 0,
                        rowIndexOffset: fixedRowCount,
                    })
                    : deferredMeasurementCache;
            this._deferredMeasurementCacheBottomRightGrid =
                fixedColumnCount > 0 || fixedRowCount > 0
                    ? new CellMeasurerCacheDecorator({
                        cellMeasurerCache: deferredMeasurementCache,
                        columnIndexOffset: fixedColumnCount,
                        rowIndexOffset: fixedRowCount,
                    })
                    : deferredMeasurementCache;
            this._deferredMeasurementCacheTopRightGrid =
                fixedColumnCount > 0
                    ? new CellMeasurerCacheDecorator({
                        cellMeasurerCache: deferredMeasurementCache,
                        columnIndexOffset: fixedColumnCount,
                        rowIndexOffset: 0,
                    })
                    : deferredMeasurementCache;
        }
    }
    forceUpdateGrids() {
        this._bottomLeftGrid && this._bottomLeftGrid.forceUpdate();
        this._bottomRightGrid && this._bottomRightGrid.forceUpdate();
        this._topLeftGrid && this._topLeftGrid.forceUpdate();
        this._topRightGrid && this._topRightGrid.forceUpdate();
    }
    invalidateCellSizeAfterRender({ columnIndex = 0, rowIndex = 0 } = {}) {
        this._deferredInvalidateColumnIndex =
            typeof this._deferredInvalidateColumnIndex === 'number'
                ? Math.min(this._deferredInvalidateColumnIndex, columnIndex)
                : columnIndex;
        this._deferredInvalidateRowIndex =
            typeof this._deferredInvalidateRowIndex === 'number'
                ? Math.min(this._deferredInvalidateRowIndex, rowIndex)
                : rowIndex;
    }
    measureAllCells() {
        this._bottomLeftGrid && this._bottomLeftGrid.measureAllCells();
        this._bottomRightGrid && this._bottomRightGrid.measureAllCells();
        this._topLeftGrid && this._topLeftGrid.measureAllCells();
        this._topRightGrid && this._topRightGrid.measureAllCells();
    }
    recomputeGridSize({ columnIndex = 0, rowIndex = 0 } = {}) {
        const { fixedColumnCount, fixedRowCount } = this.props;
        const adjustedColumnIndex = Math.max(0, columnIndex - fixedColumnCount);
        const adjustedRowIndex = Math.max(0, rowIndex - fixedRowCount);
        this._bottomLeftGrid &&
            this._bottomLeftGrid.recomputeGridSize({
                columnIndex,
                rowIndex: adjustedRowIndex,
            });
        this._bottomRightGrid &&
            this._bottomRightGrid.recomputeGridSize({
                columnIndex: adjustedColumnIndex,
                rowIndex: adjustedRowIndex,
            });
        this._topLeftGrid &&
            this._topLeftGrid.recomputeGridSize({
                columnIndex,
                rowIndex,
            });
        this._topRightGrid &&
            this._topRightGrid.recomputeGridSize({
                columnIndex: adjustedColumnIndex,
                rowIndex,
            });
        this._leftGridWidth = null;
        this._topGridHeight = null;
        this._maybeCalculateCachedStyles(true);
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.scrollLeft !== prevState.scrollLeft ||
            nextProps.scrollTop !== prevState.scrollTop) {
            return {
                scrollLeft: nextProps.scrollLeft != null && nextProps.scrollLeft >= 0
                    ? nextProps.scrollLeft
                    : prevState.scrollLeft,
                scrollTop: nextProps.scrollTop != null && nextProps.scrollTop >= 0
                    ? nextProps.scrollTop
                    : prevState.scrollTop,
            };
        }
        return null;
    }
    componentDidMount() {
        const { scrollLeft, scrollTop } = this.props;
        if (scrollLeft > 0 || scrollTop > 0) {
            const newState = {};
            if (scrollLeft > 0) {
                newState.scrollLeft = scrollLeft;
            }
            if (scrollTop > 0) {
                newState.scrollTop = scrollTop;
            }
            this.setState(newState);
        }
        this._handleInvalidatedGridSize();
    }
    componentDidUpdate() {
        this._handleInvalidatedGridSize();
    }
    render() {
        const { onScroll, onSectionRendered, onScrollbarPresenceChange, scrollLeft: scrollLeftProp, scrollToColumn, scrollTop: scrollTopProp, scrollToRow, ...rest } = this.props;
        this._prepareForRender();
        if (this.props.width === 0 || this.props.height === 0) {
            return null;
        }
        const { scrollLeft, scrollTop } = this.state;
        return (React.createElement("div", { style: this._containerOuterStyle }, React.createElement("div", { style: this._containerTopStyle }, this._renderTopLeftGrid(rest), this._renderTopRightGrid({
            ...rest,
            onScroll,
            scrollLeft,
        })), React.createElement("div", { style: this._containerBottomStyle }, this._renderBottomLeftGrid({
            ...rest,
            onScroll,
            scrollTop,
        }), this._renderBottomRightGrid({
            ...rest,
            onScroll,
            onSectionRendered,
            scrollLeft,
            scrollToColumn,
            scrollToRow,
            scrollTop,
        }))));
    }
    _getBottomGridHeight(props) {
        const { height } = props;
        let topGridHeight = this._getTopGridHeight(props);
        return height - topGridHeight;
    }
    _getLeftGridWidth(props) {
        const { fixedColumnCount, columnWidth } = props;
        if (this._leftGridWidth == null) {
            if (typeof columnWidth === 'function') {
                let leftGridWidth = 0;
                for (let index = 0; index < fixedColumnCount; index++) {
                    leftGridWidth += columnWidth({ index });
                }
                this._leftGridWidth = leftGridWidth;
            }
            else {
                this._leftGridWidth = columnWidth * fixedColumnCount;
            }
        }
        return this._leftGridWidth;
    }
    _getRightGridWidth(props) {
        const { width } = props;
        let leftGridWidth = this._getLeftGridWidth(props);
        return width - leftGridWidth;
    }
    _getTopGridHeight(props) {
        const { fixedRowCount, rowHeight } = props;
        if (this._topGridHeight == null) {
            if (typeof rowHeight === 'function') {
                let topGridHeight = 0;
                for (let index = 0; index < fixedRowCount; index++) {
                    topGridHeight += rowHeight({ index });
                }
                this._topGridHeight = topGridHeight;
            }
            else {
                this._topGridHeight = rowHeight * fixedRowCount;
            }
        }
        return this._topGridHeight;
    }
    _handleInvalidatedGridSize() {
        if (typeof this._deferredInvalidateColumnIndex === 'number') {
            const columnIndex = this._deferredInvalidateColumnIndex;
            const rowIndex = this._deferredInvalidateRowIndex;
            this._deferredInvalidateColumnIndex = null;
            this._deferredInvalidateRowIndex = null;
            this.recomputeGridSize({
                columnIndex,
                rowIndex,
            });
            this.forceUpdate();
        }
    }
    _maybeCalculateCachedStyles(resetAll) {
        const { columnWidth, enableFixedColumnScroll, enableFixedRowScroll, height, fixedColumnCount, fixedRowCount, rowHeight, style, styleBottomLeftGrid, styleBottomRightGrid, styleTopLeftGrid, styleTopRightGrid, width, } = this.props;
        const sizeChange = resetAll ||
            height !== this._lastRenderedHeight ||
            width !== this._lastRenderedWidth;
        const leftSizeChange = resetAll ||
            columnWidth !== this._lastRenderedColumnWidth ||
            fixedColumnCount !== this._lastRenderedFixedColumnCount;
        const topSizeChange = resetAll ||
            fixedRowCount !== this._lastRenderedFixedRowCount ||
            rowHeight !== this._lastRenderedRowHeight;
        if (resetAll || sizeChange || style !== this._lastRenderedStyle) {
            this._containerOuterStyle = {
                height,
                overflow: 'visible',
                width,
                ...style,
            };
        }
        if (resetAll || sizeChange || topSizeChange) {
            this._containerTopStyle = {
                height: this._getTopGridHeight(this.props),
                position: 'relative',
                width,
            };
            this._containerBottomStyle = {
                height: height - this._getTopGridHeight(this.props),
                overflow: 'visible',
                position: 'relative',
                width,
            };
        }
        if (resetAll ||
            styleBottomLeftGrid !== this._lastRenderedStyleBottomLeftGrid) {
            this._bottomLeftGridStyle = {
                left: 0,
                overflowX: 'hidden',
                overflowY: enableFixedColumnScroll ? 'auto' : 'hidden',
                position: 'absolute',
                ...styleBottomLeftGrid,
            };
        }
        if (resetAll ||
            leftSizeChange ||
            styleBottomRightGrid !== this._lastRenderedStyleBottomRightGrid) {
            this._bottomRightGridStyle = {
                left: this._getLeftGridWidth(this.props),
                position: 'absolute',
                ...styleBottomRightGrid,
            };
        }
        if (resetAll || styleTopLeftGrid !== this._lastRenderedStyleTopLeftGrid) {
            this._topLeftGridStyle = {
                left: 0,
                overflowX: 'hidden',
                overflowY: 'hidden',
                position: 'absolute',
                top: 0,
                ...styleTopLeftGrid,
            };
        }
        if (resetAll ||
            leftSizeChange ||
            styleTopRightGrid !== this._lastRenderedStyleTopRightGrid) {
            this._topRightGridStyle = {
                left: this._getLeftGridWidth(this.props),
                overflowX: enableFixedRowScroll ? 'auto' : 'hidden',
                overflowY: 'hidden',
                position: 'absolute',
                top: 0,
                ...styleTopRightGrid,
            };
        }
        this._lastRenderedColumnWidth = columnWidth;
        this._lastRenderedFixedColumnCount = fixedColumnCount;
        this._lastRenderedFixedRowCount = fixedRowCount;
        this._lastRenderedHeight = height;
        this._lastRenderedRowHeight = rowHeight;
        this._lastRenderedStyle = style;
        this._lastRenderedStyleBottomLeftGrid = styleBottomLeftGrid;
        this._lastRenderedStyleBottomRightGrid = styleBottomRightGrid;
        this._lastRenderedStyleTopLeftGrid = styleTopLeftGrid;
        this._lastRenderedStyleTopRightGrid = styleTopRightGrid;
        this._lastRenderedWidth = width;
    }
    _prepareForRender() {
        if (this._lastRenderedColumnWidth !== this.props.columnWidth ||
            this._lastRenderedFixedColumnCount !== this.props.fixedColumnCount) {
            this._leftGridWidth = null;
        }
        if (this._lastRenderedFixedRowCount !== this.props.fixedRowCount ||
            this._lastRenderedRowHeight !== this.props.rowHeight) {
            this._topGridHeight = null;
        }
        this._maybeCalculateCachedStyles();
        this._lastRenderedColumnWidth = this.props.columnWidth;
        this._lastRenderedFixedColumnCount = this.props.fixedColumnCount;
        this._lastRenderedFixedRowCount = this.props.fixedRowCount;
        this._lastRenderedRowHeight = this.props.rowHeight;
    }
    _renderBottomLeftGrid(props) {
        const { enableFixedColumnScroll, fixedColumnCount, fixedRowCount, rowCount, hideBottomLeftGridScrollbar, } = props;
        const { showVerticalScrollbar } = this.state;
        if (!fixedColumnCount) {
            return null;
        }
        const additionalRowCount = showVerticalScrollbar ? 1 : 0, height = this._getBottomGridHeight(props), width = this._getLeftGridWidth(props), scrollbarSize = this.state.showVerticalScrollbar
            ? this.state.scrollbarSize
            : 0, gridWidth = hideBottomLeftGridScrollbar ? width + scrollbarSize : width;
        const bottomLeftGrid = (React.createElement(Grid, Object.assign({}, props, { cellRenderer: this._cellRendererBottomLeftGrid, className: this.props.classNameBottomLeftGrid, columnCount: fixedColumnCount, deferredMeasurementCache: this._deferredMeasurementCacheBottomLeftGrid, height: height, onScroll: enableFixedColumnScroll ? this._onScrollTop : undefined, ref: this._bottomLeftGridRef, rowCount: Math.max(0, rowCount - fixedRowCount) + additionalRowCount, rowHeight: this._rowHeightBottomGrid, style: this._bottomLeftGridStyle, tabIndex: null, width: gridWidth })));
        if (hideBottomLeftGridScrollbar) {
            return (React.createElement("div", { className: "BottomLeftGrid_ScrollWrapper", style: {
                    ...this._bottomLeftGridStyle,
                    height,
                    width,
                    overflowY: 'hidden',
                } }, bottomLeftGrid));
        }
        return bottomLeftGrid;
    }
    _renderBottomRightGrid(props) {
        const { columnCount, fixedColumnCount, fixedRowCount, rowCount, scrollToColumn, scrollToRow, } = props;
        return (React.createElement(Grid, Object.assign({}, props, { cellRenderer: this._cellRendererBottomRightGrid, className: this.props.classNameBottomRightGrid, columnCount: Math.max(0, columnCount - fixedColumnCount), columnWidth: this._columnWidthRightGrid, deferredMeasurementCache: this._deferredMeasurementCacheBottomRightGrid, height: this._getBottomGridHeight(props), onScroll: this._onScroll, onScrollbarPresenceChange: this._onScrollbarPresenceChange, ref: this._bottomRightGridRef, rowCount: Math.max(0, rowCount - fixedRowCount), rowHeight: this._rowHeightBottomGrid, scrollToColumn: scrollToColumn - fixedColumnCount, scrollToRow: scrollToRow - fixedRowCount, style: this._bottomRightGridStyle, width: this._getRightGridWidth(props) })));
    }
    _renderTopLeftGrid(props) {
        const { fixedColumnCount, fixedRowCount } = props;
        if (!fixedColumnCount || !fixedRowCount) {
            return null;
        }
        return (React.createElement(Grid, Object.assign({}, props, { className: this.props.classNameTopLeftGrid, columnCount: fixedColumnCount, height: this._getTopGridHeight(props), ref: this._topLeftGridRef, rowCount: fixedRowCount, style: this._topLeftGridStyle, tabIndex: null, width: this._getLeftGridWidth(props) })));
    }
    _renderTopRightGrid(props) {
        const { columnCount, enableFixedRowScroll, fixedColumnCount, fixedRowCount, scrollLeft, hideTopRightGridScrollbar, } = props;
        const { showHorizontalScrollbar, scrollbarSize } = this.state;
        if (!fixedRowCount) {
            return null;
        }
        const additionalColumnCount = showHorizontalScrollbar ? 1 : 0, height = this._getTopGridHeight(props), width = this._getRightGridWidth(props), additionalHeight = showHorizontalScrollbar ? scrollbarSize : 0;
        let gridHeight = height, style = this._topRightGridStyle;
        if (hideTopRightGridScrollbar) {
            gridHeight = height + additionalHeight;
            style = {
                ...this._topRightGridStyle,
                left: 0,
            };
        }
        const topRightGrid = (React.createElement(Grid, Object.assign({}, props, { cellRenderer: this._cellRendererTopRightGrid, className: this.props.classNameTopRightGrid, columnCount: Math.max(0, columnCount - fixedColumnCount) + additionalColumnCount, columnWidth: this._columnWidthRightGrid, deferredMeasurementCache: this._deferredMeasurementCacheTopRightGrid, height: gridHeight, onScroll: enableFixedRowScroll ? this._onScrollLeft : undefined, ref: this._topRightGridRef, rowCount: fixedRowCount, scrollLeft: scrollLeft, style: style, tabIndex: null, width: width })));
        if (hideTopRightGridScrollbar) {
            return (React.createElement("div", { className: "TopRightGrid_ScrollWrapper", style: {
                    ...this._topRightGridStyle,
                    height,
                    width,
                    overflowX: 'hidden',
                } }, topRightGrid));
        }
        return topRightGrid;
    }
}
MultiGrid.defaultProps = {
    classNameBottomLeftGrid: '',
    classNameBottomRightGrid: '',
    classNameTopLeftGrid: '',
    classNameTopRightGrid: '',
    enableFixedColumnScroll: false,
    enableFixedRowScroll: false,
    fixedColumnCount: 0,
    fixedRowCount: 0,
    scrollToColumn: -1,
    scrollToRow: -1,
    style: {},
    styleBottomLeftGrid: {},
    styleBottomRightGrid: {},
    styleTopLeftGrid: {},
    styleTopRightGrid: {},
    hideTopRightGridScrollbar: false,
    hideBottomLeftGridScrollbar: false,
};

class ScrollSync extends React.PureComponent {
    constructor(props, context) {
        super(props, context);
        this.props = props;
        this.context = context;
        this.state = {
            clientHeight: 0,
            clientWidth: 0,
            scrollHeight: 0,
            scrollLeft: 0,
            scrollTop: 0,
            scrollWidth: 0,
        };
        this._onScroll = this._onScroll.bind(this);
    }
    render() {
        const { children } = this.props;
        const { clientHeight, clientWidth, scrollHeight, scrollLeft, scrollTop, scrollWidth, } = this.state;
        return children({
            clientHeight,
            clientWidth,
            onScroll: this._onScroll,
            scrollHeight,
            scrollLeft,
            scrollTop,
            scrollWidth,
        });
    }
    _onScroll({ clientHeight, clientWidth, scrollHeight, scrollLeft, scrollTop, scrollWidth }) {
        this.setState({
            clientHeight,
            clientWidth,
            scrollHeight,
            scrollLeft,
            scrollTop,
            scrollWidth,
        });
    }
}
function createCellPositioner({ cellMeasurerCache, columnCount, columnWidth, spacer = 0 }) {
    let columnHeights;
    initOrResetDerivedValues();
    function cellPositioner(index) {
        let columnIndex = 0;
        for (let i = 1; i < columnHeights.length; i++) {
            if (columnHeights[i] < columnHeights[columnIndex]) {
                columnIndex = i;
            }
        }
        const left = columnIndex * (columnWidth + spacer);
        const top = columnHeights[columnIndex] || 0;
        columnHeights[columnIndex] =
            top + cellMeasurerCache.getHeight(index) + spacer;
        return {
            left,
            top,
        };
    }
    function initOrResetDerivedValues() {
        columnHeights = [];
        for (let i = 0; i < columnCount; i++) {
            columnHeights[i] = 0;
        }
    }
    function reset(params) {
        columnCount = params.columnCount;
        columnWidth = params.columnWidth;
        spacer = params.spacer;
        initOrResetDerivedValues();
    }
    cellPositioner.reset = reset;
    return cellPositioner;
}
const emptyObject = {};
class Masonry extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            isScrolling: false,
            scrollTop: 0,
        };
        this._invalidateOnUpdateStartIndex = null;
        this._invalidateOnUpdateStopIndex = null;
        this._positionCache = new PositionCache();
        this._startIndex = null;
        this._startIndexMemoized = null;
        this._stopIndex = null;
        this._stopIndexMemoized = null;
        this._debounceResetIsScrollingCallback = () => {
            this.setState({
                isScrolling: false,
            });
        };
        this._setScrollingContainerRef = ref => {
            this._scrollingContainer = ref;
        };
        this._onScroll = event => {
            const { height } = this.props;
            const eventScrollTop = event.target.scrollTop;
            const scrollTop = Math.min(Math.max(0, this._getEstimatedTotalHeight() - height), eventScrollTop);
            if (eventScrollTop !== scrollTop) {
                return;
            }
            this._debounceResetIsScrolling();
            if (this.state.scrollTop !== scrollTop) {
                this.setState({
                    isScrolling: true,
                    scrollTop,
                });
            }
        };
    }
    clearCellPositions() {
        this._positionCache = new PositionCache();
        this.forceUpdate();
    }
    invalidateCellSizeAfterRender({ rowIndex: index }) {
        if (this._invalidateOnUpdateStartIndex === null) {
            this._invalidateOnUpdateStartIndex = index;
            this._invalidateOnUpdateStopIndex = index;
        }
        else {
            this._invalidateOnUpdateStartIndex = Math.min(this._invalidateOnUpdateStartIndex, index);
            this._invalidateOnUpdateStopIndex = Math.max(this._invalidateOnUpdateStopIndex, index);
        }
    }
    recomputeCellPositions() {
        const stopIndex = this._positionCache.count - 1;
        this._positionCache = new PositionCache();
        this._populatePositionCache(0, stopIndex);
        this.forceUpdate();
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.scrollTop !== undefined &&
            prevState.scrollTop !== nextProps.scrollTop) {
            return {
                isScrolling: true,
                scrollTop: nextProps.scrollTop,
            };
        }
        return null;
    }
    componentDidMount() {
        this._checkInvalidateOnUpdate();
        this._invokeOnScrollCallback();
        this._invokeOnCellsRenderedCallback();
    }
    componentDidUpdate(prevProps, prevState) {
        this._checkInvalidateOnUpdate();
        this._invokeOnScrollCallback();
        this._invokeOnCellsRenderedCallback();
        if (this.props.scrollTop !== prevProps.scrollTop) {
            this._debounceResetIsScrolling();
        }
    }
    componentWillUnmount() {
        if (this._debounceResetIsScrollingId) {
            cancelAnimationTimeout(this._debounceResetIsScrollingId);
        }
    }
    render() {
        const { autoHeight, cellCount, cellMeasurerCache, cellRenderer, className, height, id, keyMapper, overscanByPixels, role, style, tabIndex, width, rowDirection, } = this.props;
        const { isScrolling, scrollTop } = this.state;
        const children = [];
        const estimateTotalHeight = this._getEstimatedTotalHeight();
        const shortestColumnSize = this._positionCache.shortestColumnSize;
        const measuredCellCount = this._positionCache.count;
        let startIndex = 0;
        let stopIndex;
        this._positionCache.range(Math.max(0, scrollTop - overscanByPixels), height + overscanByPixels * 2, (index, left, top) => {
            if (typeof stopIndex === 'undefined') {
                startIndex = index;
                stopIndex = index;
            }
            else {
                startIndex = Math.min(startIndex, index);
                stopIndex = Math.max(stopIndex, index);
            }
            children.push(cellRenderer({
                index,
                isScrolling,
                key: keyMapper(index),
                parent: this,
                style: {
                    height: cellMeasurerCache.getHeight(index),
                    [rowDirection === 'ltr' ? 'left' : 'right']: left,
                    position: 'absolute',
                    top,
                    width: cellMeasurerCache.getWidth(index),
                },
            }));
        });
        if (shortestColumnSize < scrollTop + height + overscanByPixels &&
            measuredCellCount < cellCount) {
            const batchSize = Math.min(cellCount - measuredCellCount, Math.ceil((scrollTop + height + overscanByPixels - shortestColumnSize) /
                cellMeasurerCache.defaultHeight *
                width /
                cellMeasurerCache.defaultWidth));
            for (let index = measuredCellCount; index < measuredCellCount + batchSize; index++) {
                stopIndex = index;
                children.push(cellRenderer({
                    index: index,
                    isScrolling,
                    key: keyMapper(index),
                    parent: this,
                    style: {
                        width: cellMeasurerCache.getWidth(index),
                    },
                }));
            }
        }
        this._startIndex = startIndex;
        this._stopIndex = stopIndex;
        return (React.createElement("div", { ref: this._setScrollingContainerRef, "aria-label": this.props['aria-label'], className: clsx('ReactVirtualized__Masonry', className), id: id, onScroll: this._onScroll, role: role, style: {
                boxSizing: 'border-box',
                direction: 'ltr',
                height: autoHeight ? 'auto' : height,
                overflowX: 'hidden',
                overflowY: estimateTotalHeight < height ? 'hidden' : 'auto',
                position: 'relative',
                width,
                WebkitOverflowScrolling: 'touch',
                willChange: 'transform',
                ...style,
            }, tabIndex: tabIndex }, React.createElement("div", { className: "ReactVirtualized__Masonry__innerScrollContainer", style: {
                width: '100%',
                height: estimateTotalHeight,
                maxWidth: '100%',
                maxHeight: estimateTotalHeight,
                overflow: 'hidden',
                pointerEvents: isScrolling ? 'none' : '',
                position: 'relative',
            } }, children)));
    }
    _checkInvalidateOnUpdate() {
        if (typeof this._invalidateOnUpdateStartIndex === 'number') {
            const startIndex = this._invalidateOnUpdateStartIndex;
            const stopIndex = this._invalidateOnUpdateStopIndex;
            this._invalidateOnUpdateStartIndex = null;
            this._invalidateOnUpdateStopIndex = null;
            this._populatePositionCache(startIndex, stopIndex);
            this.forceUpdate();
        }
    }
    _debounceResetIsScrolling() {
        const { scrollingResetTimeInterval } = this.props;
        if (this._debounceResetIsScrollingId) {
            cancelAnimationTimeout(this._debounceResetIsScrollingId);
        }
        this._debounceResetIsScrollingId = requestAnimationTimeout(this._debounceResetIsScrollingCallback, scrollingResetTimeInterval);
    }
    _getEstimatedTotalHeight() {
        const { cellCount, cellMeasurerCache, width } = this.props;
        const estimatedColumnCount = Math.max(1, Math.floor(width / cellMeasurerCache.defaultWidth));
        return this._positionCache.estimateTotalHeight(cellCount, estimatedColumnCount, cellMeasurerCache.defaultHeight);
    }
    _invokeOnScrollCallback() {
        const { height, onScroll } = this.props;
        const { scrollTop } = this.state;
        if (this._onScrollMemoized !== scrollTop) {
            onScroll({
                clientHeight: height,
                scrollHeight: this._getEstimatedTotalHeight(),
                scrollTop,
            });
            this._onScrollMemoized = scrollTop;
        }
    }
    _invokeOnCellsRenderedCallback() {
        if (this._startIndexMemoized !== this._startIndex ||
            this._stopIndexMemoized !== this._stopIndex) {
            const { onCellsRendered } = this.props;
            onCellsRendered({
                startIndex: this._startIndex,
                stopIndex: this._stopIndex,
            });
            this._startIndexMemoized = this._startIndex;
            this._stopIndexMemoized = this._stopIndex;
        }
    }
    _populatePositionCache(startIndex, stopIndex) {
        const { cellMeasurerCache, cellPositioner } = this.props;
        for (let index = startIndex; index <= stopIndex; index++) {
            const { left, top } = cellPositioner(index);
            this._positionCache.setPosition(index, left, top, cellMeasurerCache.getHeight(index));
        }
    }
}
Masonry.defaultProps = {
    autoHeight: false,
    keyMapper: identity,
    onCellsRendered: noop,
    onScroll: noop,
    overscanByPixels: 20,
    role: 'grid',
    scrollingResetTimeInterval: DEFAULT_SCROLLING_RESET_TIME_INTERVAL,
    style: emptyObject,
    tabIndex: 0,
    rowDirection: 'ltr',
};

function identity(value) {
    return value;
}

function noop() { }


class PositionCache {
    constructor() {
        this._columnSizeMap = {};
        this._intervalTree = createIntervalTree();
        this._leftMap = {};
    }
    estimateTotalHeight(cellCount, columnCount, defaultCellHeight) {
        const unmeasuredCellCount = cellCount - this.count;
        return this.tallestColumnSize +
            Math.ceil(unmeasuredCellCount / columnCount) * defaultCellHeight;
    }
    range(scrollTop, clientHeight, renderCallback) {
        this._intervalTree.queryInterval(scrollTop, scrollTop + clientHeight, ([top, _, index]) => renderCallback(index, this._leftMap[index], top));
    }
    setPosition(index, left, top, height) {
        this._intervalTree.insert([top, top + height, index]);
        this._leftMap[index] = left;
        const columnSizeMap = this._columnSizeMap;
        const columnHeight = columnSizeMap[left];
        if (columnHeight === undefined) {
            columnSizeMap[left] = top + height;
        }
        else {
            columnSizeMap[left] = Math.max(columnHeight, top + height);
        }
    }
    get count() {
        return this._intervalTree.count;
    }
    get shortestColumnSize() {
        const columnSizeMap = this._columnSizeMap;
        let size = 0;
        for (let i in columnSizeMap) {
            let height = columnSizeMap[i];
            size = size === 0 ? height : Math.min(size, height);
        }
        return size;
    }
    get tallestColumnSize() {
        const columnSizeMap = this._columnSizeMap;
        let size = 0;
        for (let i in columnSizeMap) {
            let height = columnSizeMap[i];
            size = Math.max(size, height);
        }
        return size;
    }
}
let win;
if (typeof window !== 'undefined') {
    win = window;
}
else if (typeof self !== 'undefined') {
    win = self;
}
else {
    win = {};
}
const request = win.requestAnimationFrame ||
    win.webkitRequestAnimationFrame ||
    win.mozRequestAnimationFrame ||
    win.oRequestAnimationFrame ||
    win.msRequestAnimationFrame ||
    function (callback) {
        return win.setTimeout(callback, 1000 / 60);
    };
const cancel = win.cancelAnimationFrame ||
    win.webkitCancelAnimationFrame ||
    win.mozCancelAnimationFrame ||
    win.oCancelAnimationFrame ||
    win.msCancelAnimationFrame ||
    function (id) {
        win.clearTimeout(id);
    };
const raf = (request);
const caf = (cancel);
function createCallbackMemoizer(requireAllKeys = true) {
    let cachedIndices = {};
    return ({ callback, indices }) => {
        const keys = Object.keys(indices);
        const allInitialized = !requireAllKeys ||
            keys.every(key => {
                const value = indices[key];
                return Array.isArray(value) ? value.length > 0 : value >= 0;
            });
        const indexChanged = keys.length !== Object.keys(cachedIndices).length ||
            keys.some(key => {
                const cachedValue = cachedIndices[key];
                const value = indices[key];
                return Array.isArray(value)
                    ? cachedValue.join(',') !== value.join(',')
                    : cachedValue !== value;
            });
        cachedIndices = indices;
        if (allInitialized && indexChanged) {
            callback(indices);
        }
    };
}
function getUpdatedOffsetForIndex({ align = 'auto', cellOffset, cellSize, containerSize, currentOffset }) {
    const maxOffset = cellOffset;
    const minOffset = maxOffset - containerSize + cellSize;
    switch (align) {
        case 'start':
            return maxOffset;
        case 'end':
            return minOffset;
        case 'center':
            return maxOffset - (containerSize - cellSize) / 2;
        default:
            return Math.max(minOffset, Math.min(maxOffset, currentOffset));
    }
}
function initCellMetadata({ cellCount, size }) {
    const sizeGetter = typeof size === 'function' ? size : () => size;
    const cellMetadata = [];
    let offset = 0;
    for (var i = 0; i < cellCount; i++) {
        let size = sizeGetter({ index: i });
        if (size == null || isNaN(size)) {
            throw Error(`Invalid size returned for cell ${i} of value ${size}`);
        }
        cellMetadata[i] = {
            size,
            offset,
        };
        offset += size;
    }
    return cellMetadata;
}
const cancelAnimationTimeout = frame => caf(frame.id);
const requestAnimationTimeout = (callback, delay) => {
    let start;
    Promise.resolve().then(() => {
        start = Date.now();
    });
    const timeout = () => {
        if (Date.now() - start >= delay) {
            callback.call();
        }
        else {
            frame.id = raf(timeout);
        }
    };
    const frame = {
        id: raf(timeout),
    };
    return frame;
};
function getCellMetadata() {
    const cellSizes = [
        10,
        20,
        15,
        10,
        15,
        30,
        20,
        10,
        30,
    ];
    return initCellMetadata({
        cellCount: cellSizes.length,
        size: ({ index }) => cellSizes[index],
    });
}
class Column extends React.Component {
}
Column.defaultProps = {
    cellDataGetter: defaultCellDataGetter,
    cellRenderer: defaultCellRenderer,
    defaultSortDirection: SortDirection.ASC,
    flexGrow: 0,
    flexShrink: 1,
    headerRenderer: defaultHeaderRenderer,
    style: {},
};
function createMultiSort(sortCallback, { defaultSortBy, defaultSortDirection = {} } = {}) {
    if (!sortCallback) {
        throw Error(`Required parameter "sortCallback" not specified`);
    }
    const sortBy = defaultSortBy || [];
    const sortDirection = {};
    sortBy.forEach(dataKey => {
        sortDirection[dataKey] = defaultSortDirection.hasOwnProperty(dataKey)
            ? defaultSortDirection[dataKey]
            : 'ASC';
    });
    function sort({ defaultSortDirection, event, sortBy: dataKey }) {
        if (event.shiftKey) {
            if (sortDirection.hasOwnProperty(dataKey)) {
                sortDirection[dataKey] =
                    sortDirection[dataKey] === 'ASC' ? 'DESC' : 'ASC';
            }
            else {
                sortDirection[dataKey] = defaultSortDirection;
                sortBy.push(dataKey);
            }
        }
        else if (event.ctrlKey || event.metaKey) {
            const index = sortBy.indexOf(dataKey);
            if (index >= 0) {
                sortBy.splice(index, 1);
                delete sortDirection[dataKey];
            }
        }
        else {
            sortBy.length = 0;
            sortBy.push(dataKey);
            const sortDirectionKeys = Object.keys(sortDirection);
            sortDirectionKeys.forEach(key => {
                if (key !== dataKey)
                    delete sortDirection[key];
            });
            if (sortDirection.hasOwnProperty(dataKey)) {
                sortDirection[dataKey] =
                    sortDirection[dataKey] === 'ASC' ? 'DESC' : 'ASC';
            }
            else {
                sortDirection[dataKey] = defaultSortDirection;
            }
        }
        sortCallback({
            sortBy,
            sortDirection,
        });
    }
    return {
        sort,
        sortBy,
        sortDirection,
    };
}
function defaultCellDataGetter({ dataKey, rowData }) {
    if (typeof rowData.get === 'function') {
        return rowData.get(dataKey);
    }
    else {
        return rowData[dataKey];
    }
}
function defaultCellRenderer({ cellData }) {
    if (cellData == null) {
        return '';
    }
    else {
        return String(cellData);
    }
}
function defaultHeaderRenderer({ dataKey, label, sortBy, sortDirection }) {
    const showSortIndicator = sortBy === dataKey;
    const children = [
        React.createElement("span", { className: "ReactVirtualized__Table__headerTruncatedText", key: "label", title: typeof label === 'string' ? label : null }, label),
    ];
    if (showSortIndicator) {
        children.push(React.createElement(SortIndicator, { key: "SortIndicator", sortDirection: sortDirection }));
    }
    return children;
}
function defaultHeaderRowRenderer({ className, columns, style }) {
    return (React.createElement("div", { className: className, role: "row", style: style }, columns));
}
function defaultRowRenderer({ className, columns, index, key, onRowClick, onRowDoubleClick, onRowMouseOut, onRowMouseOver, onRowRightClick, rowData, style }) {
    const a11yProps = { 'aria-rowindex': index + 1 };
    if (onRowClick ||
        onRowDoubleClick ||
        onRowMouseOut ||
        onRowMouseOver ||
        onRowRightClick) {
        a11yProps['aria-label'] = 'row';
        a11yProps.tabIndex = 0;
        if (onRowClick) {
            a11yProps.onClick = event => onRowClick({ event, index, rowData });
        }
        if (onRowDoubleClick) {
            a11yProps.onDoubleClick = event => onRowDoubleClick({ event, index, rowData });
        }
        if (onRowMouseOut) {
            a11yProps.onMouseOut = event => onRowMouseOut({ event, index, rowData });
        }
        if (onRowMouseOver) {
            a11yProps.onMouseOver = event => onRowMouseOver({ event, index, rowData });
        }
        if (onRowRightClick) {
            a11yProps.onContextMenu = event => onRowRightClick({ event, index, rowData });
        }
    }
    return (React.createElement("div", Object.assign({}, a11yProps, { className: className, key: key, role: "row", style: style }), columns));
}

function SortIndicator({ sortDirection }) {
    const classNames = clsx('ReactVirtualized__Table__sortableHeaderIcon', {
        'ReactVirtualized__Table__sortableHeaderIcon--ASC': sortDirection === SortDirection.ASC,
        'ReactVirtualized__Table__sortableHeaderIcon--DESC': sortDirection === SortDirection.DESC,
    });
    return (React.createElement("svg", { className: classNames, width: 18, height: 18, viewBox: "0 0 24 24" }, sortDirection === SortDirection.ASC ? (React.createElement("path", { d: "M7 14l5-5 5 5z" })) : (React.createElement("path", { d: "M7 10l5 5 5-5z" })), React.createElement("path", { d: "M0 0h24v24H0z", fill: "none" })));
}
class Table extends React.PureComponent {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            scrollbarWidth: 0,
        };
        this._createColumn = this._createColumn.bind(this);
        this._createRow = this._createRow.bind(this);
        this._onScroll = this._onScroll.bind(this);
        this._onSectionRendered = this._onSectionRendered.bind(this);
        this._setRef = this._setRef.bind(this);
    }
    forceUpdateGrid() {
        if (this.Grid) {
            this.Grid.forceUpdate();
        }
    }
    getOffsetForRow({ alignment, index }) {
        if (this.Grid) {
            const { scrollTop } = this.Grid.getOffsetForCell({
                alignment,
                rowIndex: index,
            });
            return scrollTop;
        }
        return 0;
    }
    invalidateCellSizeAfterRender({ columnIndex, rowIndex }) {
        if (this.Grid) {
            this.Grid.invalidateCellSizeAfterRender({
                rowIndex,
                columnIndex,
            });
        }
    }
    measureAllRows() {
        if (this.Grid) {
            this.Grid.measureAllCells();
        }
    }
    recomputeGridSize({ columnIndex = 0, rowIndex = 0 } = {}) {
        if (this.Grid) {
            this.Grid.recomputeGridSize({
                rowIndex,
                columnIndex,
            });
        }
    }
    recomputeRowHeights(index = 0) {
        if (this.Grid) {
            this.Grid.recomputeGridSize({
                rowIndex: index,
            });
        }
    }
    scrollToPosition(scrollTop = 0) {
        if (this.Grid) {
            this.Grid.scrollToPosition({ scrollTop });
        }
    }
    scrollToRow(index = 0) {
        if (this.Grid) {
            this.Grid.scrollToCell({
                columnIndex: 0,
                rowIndex: index,
            });
        }
    }
    componentDidMount() {
        this._setScrollbarWidth();
    }
    componentDidUpdate() {
        this._setScrollbarWidth();
    }
    render() {
        const { children, className, disableHeader, gridClassName, gridStyle, headerHeight, headerRowRenderer, height, id, noRowsRenderer, rowClassName, rowStyle, scrollToIndex, style, width, } = this.props;
        const { scrollbarWidth } = this.state;
        const availableRowsHeight = disableHeader ? height : height - headerHeight;
        const rowClass = typeof rowClassName === 'function'
            ? rowClassName({ index: -1 })
            : rowClassName;
        const rowStyleObject = typeof rowStyle === 'function' ? rowStyle({ index: -1 }) : rowStyle;
        this._cachedColumnStyles = [];
        React.Children.toArray(children).forEach((column, index) => {
            const flexStyles = this._getFlexStyleForColumn(column, column.props.style);
            this._cachedColumnStyles[index] = {
                ...flexStyles,
                overflow: 'hidden',
            };
        });
        return (React.createElement("div", { "aria-label": this.props['aria-label'], "aria-labelledby": this.props['aria-labelledby'], "aria-colcount": React.Children.toArray(children).length, "aria-rowcount": this.props.rowCount, className: clsx('ReactVirtualized__Table', className), id: id, role: "grid", style: style }, !disableHeader &&
            headerRowRenderer({
                className: clsx('ReactVirtualized__Table__headerRow', rowClass),
                columns: this._getHeaderColumns(),
                style: {
                    height: headerHeight,
                    overflow: 'hidden',
                    paddingRight: scrollbarWidth,
                    width: width,
                    ...rowStyleObject,
                },
            }), React.createElement(Grid, Object.assign({}, this.props, { autoContainerWidth: true, className: clsx('ReactVirtualized__Table__Grid', gridClassName), cellRenderer: this._createRow, columnWidth: width, columnCount: 1, height: availableRowsHeight, id: undefined, noContentRenderer: noRowsRenderer, onScroll: this._onScroll, onSectionRendered: this._onSectionRendered, ref: this._setRef, role: "rowgroup", scrollbarWidth: scrollbarWidth, scrollToRow: scrollToIndex, style: {
                ...gridStyle,
                overflowX: 'hidden',
            } }))));
    }
    _createColumn({ column, columnIndex, isScrolling, parent, rowData, rowIndex }) {
        const { onColumnClick } = this.props;
        const { cellDataGetter, cellRenderer, className, columnData, dataKey, id, } = column.props;
        const cellData = cellDataGetter({ columnData, dataKey, rowData });
        const renderedCell = cellRenderer({
            cellData,
            columnData,
            columnIndex,
            dataKey,
            isScrolling,
            parent,
            rowData,
            rowIndex,
        });
        const onClick = event => {
            onColumnClick && onColumnClick({ columnData, dataKey, event });
        };
        const style = this._cachedColumnStyles[columnIndex];
        const title = typeof renderedCell === 'string' ? renderedCell : null;
        return (React.createElement("div", { "aria-colindex": columnIndex + 1, "aria-describedby": id, className: clsx('ReactVirtualized__Table__rowColumn', className), key: 'Row' + rowIndex + '-' + 'Col' + columnIndex, onClick: onClick, role: "gridcell", style: style, title: title }, renderedCell));
    }
    _createHeader({ column, index }) {
        const { headerClassName, headerStyle, onHeaderClick, sort, sortBy, sortDirection, } = this.props;
        const { columnData, dataKey, defaultSortDirection, disableSort, headerRenderer, id, label, } = column.props;
        const sortEnabled = !disableSort && sort;
        const classNames = clsx('ReactVirtualized__Table__headerColumn', headerClassName, column.props.headerClassName, {
            ReactVirtualized__Table__sortableHeaderColumn: sortEnabled,
        });
        const style = this._getFlexStyleForColumn(column, {
            ...headerStyle,
            ...column.props.headerStyle,
        });
        const renderedHeader = headerRenderer({
            columnData,
            dataKey,
            disableSort,
            label,
            sortBy,
            sortDirection,
        });
        let headerOnClick, headerOnKeyDown, headerTabIndex, headerAriaSort, headerAriaLabel;
        if (sortEnabled || onHeaderClick) {
            const isFirstTimeSort = sortBy !== dataKey;
            const newSortDirection = isFirstTimeSort
                ? defaultSortDirection
                : sortDirection === SortDirection.DESC
                    ? SortDirection.ASC
                    : SortDirection.DESC;
            const onClick = event => {
                sortEnabled &&
                    sort({
                        defaultSortDirection,
                        event,
                        sortBy: dataKey,
                        sortDirection: newSortDirection,
                    });
                onHeaderClick && onHeaderClick({ columnData, dataKey, event });
            };
            const onKeyDown = event => {
                if (event.key === 'Enter' || event.key === ' ') {
                    onClick(event);
                }
            };
            headerAriaLabel = column.props['aria-label'] || label || dataKey;
            headerAriaSort = 'none';
            headerTabIndex = 0;
            headerOnClick = onClick;
            headerOnKeyDown = onKeyDown;
        }
        if (sortBy === dataKey) {
            headerAriaSort =
                sortDirection === SortDirection.ASC ? 'ascending' : 'descending';
        }
        return (React.createElement("div", { "aria-label": headerAriaLabel, "aria-sort": headerAriaSort, className: classNames, id: id, key: 'Header-Col' + index, onClick: headerOnClick, onKeyDown: headerOnKeyDown, role: "columnheader", style: style, tabIndex: headerTabIndex }, renderedHeader));
    }
    _createRow({ rowIndex: index, isScrolling, key, parent, style }) {
        const { children, onRowClick, onRowDoubleClick, onRowRightClick, onRowMouseOver, onRowMouseOut, rowClassName, rowGetter, rowRenderer, rowStyle, } = this.props;
        const { scrollbarWidth } = this.state;
        const rowClass = typeof rowClassName === 'function' ? rowClassName({ index }) : rowClassName;
        const rowStyleObject = typeof rowStyle === 'function' ? rowStyle({ index }) : rowStyle;
        const rowData = rowGetter({ index });
        const columns = React.Children.toArray(children).map((column, columnIndex) => this._createColumn({
            column,
            columnIndex,
            isScrolling,
            parent,
            rowData,
            rowIndex: index,
            scrollbarWidth,
        }));
        const className = clsx('ReactVirtualized__Table__row', rowClass);
        const flattenedStyle = {
            ...style,
            height: this._getRowHeight(index),
            overflow: 'hidden',
            paddingRight: scrollbarWidth,
            ...rowStyleObject,
        };
        return rowRenderer({
            className,
            columns,
            index,
            isScrolling,
            key,
            onRowClick,
            onRowDoubleClick,
            onRowRightClick,
            onRowMouseOver,
            onRowMouseOut,
            rowData,
            style: flattenedStyle,
        });
    }
    _getFlexStyleForColumn(column, customStyle = {}) {
        const flexValue = `${column.props.flexGrow} ${column.props.flexShrink} ${column.props.width}px`;
        const style = {
            ...customStyle,
            flex: flexValue,
            msFlex: flexValue,
            WebkitFlex: flexValue,
        };
        if (column.props.maxWidth) {
            style.maxWidth = column.props.maxWidth;
        }
        if (column.props.minWidth) {
            style.minWidth = column.props.minWidth;
        }
        return style;
    }
    _getHeaderColumns() {
        const { children, disableHeader } = this.props;
        const items = disableHeader ? [] : React.Children.toArray(children);
        return items.map((column, index) => this._createHeader({ column, index }));
    }
    _getRowHeight(rowIndex) {
        const { rowHeight } = this.props;
        return typeof rowHeight === 'function'
            ? rowHeight({ index: rowIndex })
            : rowHeight;
    }
    _onScroll({ clientHeight, scrollHeight, scrollTop }) {
        const { onScroll } = this.props;
        onScroll({ clientHeight, scrollHeight, scrollTop });
    }
    _onSectionRendered({ rowOverscanStartIndex, rowOverscanStopIndex, rowStartIndex, rowStopIndex }) {
        const { onRowsRendered } = this.props;
        onRowsRendered({
            overscanStartIndex: rowOverscanStartIndex,
            overscanStopIndex: rowOverscanStopIndex,
            startIndex: rowStartIndex,
            stopIndex: rowStopIndex,
        });
    }
    _setRef(ref) {
        this.Grid = ref;
    }
    _setScrollbarWidth() {
        if (this.Grid) {
            const Grid = findDOMNode(this.Grid);
            const clientWidth = Grid.clientWidth || 0;
            const offsetWidth = Grid.offsetWidth || 0;
            const scrollbarWidth = offsetWidth - clientWidth;
            this.setState({ scrollbarWidth });
        }
    }
}
Table.defaultProps = {
    disableHeader: false,
    estimatedRowSize: 30,
    headerHeight: 0,
    headerStyle: {},
    noRowsRenderer: () => null,
    onRowsRendered: () => null,
    onScroll: () => null,
    overscanIndicesGetter: defaultOverscanIndicesGetter,
    overscanRowCount: 10,
    rowRenderer: defaultRowRenderer,
    headerRowRenderer: defaultHeaderRowRenderer,
    rowStyle: {},
    scrollToAlignment: 'auto',
    scrollToIndex: -1,
    style: {},
};
function _GEA(a, l, h, y) {
    var i = h + 1;
    while (l <= h) {
        var m = (l + h) >>> 1, x = a[m];
        if (x >= y) {
            i = m;
            h = m - 1;
        }
        else {
            l = m + 1;
        }
    }
    return i;
}
function _GEP(a, l, h, y, c) {
    var i = h + 1;
    while (l <= h) {
        var m = (l + h) >>> 1, x = a[m];
        if (c(x, y) >= 0) {
            i = m;
            h = m - 1;
        }
        else {
            l = m + 1;
        }
    }
    return i;
}
function dispatchBsearchGE(a, y, c, l, h) {
    if (typeof c === 'function') {
        return _GEP(a, l === void 0 ? 0 : l | 0, h === void 0 ? a.length - 1 : h | 0, y, c);
    }
    else {
        return _GEA(a, c === void 0 ? 0 : c | 0, l === void 0 ? a.length - 1 : l | 0, y);
    }
}
function _GTA(a, l, h, y) {
    var i = h + 1;
    while (l <= h) {
        var m = (l + h) >>> 1, x = a[m];
        if (x > y) {
            i = m;
            h = m - 1;
        }
        else {
            l = m + 1;
        }
    }
    return i;
}
function _GTP(a, l, h, y, c) {
    var i = h + 1;
    while (l <= h) {
        var m = (l + h) >>> 1, x = a[m];
        if (c(x, y) > 0) {
            i = m;
            h = m - 1;
        }
        else {
            l = m + 1;
        }
    }
    return i;
}
function dispatchBsearchGT(a, y, c, l, h) {
    if (typeof c === 'function') {
        return _GTP(a, l === void 0 ? 0 : l | 0, h === void 0 ? a.length - 1 : h | 0, y, c);
    }
    else {
        return _GTA(a, c === void 0 ? 0 : c | 0, l === void 0 ? a.length - 1 : l | 0, y);
    }
}
function _LTA(a, l, h, y) {
    var i = l - 1;
    while (l <= h) {
        var m = (l + h) >>> 1, x = a[m];
        if (x < y) {
            i = m;
            l = m + 1;
        }
        else {
            h = m - 1;
        }
    }
    return i;
}
function _LTP(a, l, h, y, c) {
    var i = l - 1;
    while (l <= h) {
        var m = (l + h) >>> 1, x = a[m];
        if (c(x, y) < 0) {
            i = m;
            l = m + 1;
        }
        else {
            h = m - 1;
        }
    }
    return i;
}
function dispatchBsearchLT(a, y, c, l, h) {
    if (typeof c === 'function') {
        return _LTP(a, l === void 0 ? 0 : l | 0, h === void 0 ? a.length - 1 : h | 0, y, c);
    }
    else {
        return _LTA(a, c === void 0 ? 0 : c | 0, l === void 0 ? a.length - 1 : l | 0, y);
    }
}
function _LEA(a, l, h, y) {
    var i = l - 1;
    while (l <= h) {
        var m = (l + h) >>> 1, x = a[m];
        if (x <= y) {
            i = m;
            l = m + 1;
        }
        else {
            h = m - 1;
        }
    }
    return i;
}
function _LEP(a, l, h, y, c) {
    var i = l - 1;
    while (l <= h) {
        var m = (l + h) >>> 1, x = a[m];
        if (c(x, y) <= 0) {
            i = m;
            l = m + 1;
        }
        else {
            h = m - 1;
        }
    }
    return i;
}
function dispatchBsearchLE(a, y, c, l, h) {
    if (typeof c === 'function') {
        return _LEP(a, l === void 0 ? 0 : l | 0, h === void 0 ? a.length - 1 : h | 0, y, c);
    }
    else {
        return _LEA(a, c === void 0 ? 0 : c | 0, l === void 0 ? a.length - 1 : l | 0, y);
    }
}
function _EQA(a, l, h, y) {
    while (l <= h) {
        var m = (l + h) >>> 1, x = a[m];
        if (x === y) {
            return m;
        }
        else if (x <= y) {
            l = m + 1;
        }
        else {
            h = m - 1;
        }
    }
    return -1;
}
function _EQP(a, l, h, y, c) {
    while (l <= h) {
        var m = (l + h) >>> 1, x = a[m];
        var p = c(x, y);
        if (p === 0) {
            return m;
        }
        else if (p <= 0) {
            l = m + 1;
        }
        else {
            h = m - 1;
        }
    }
    return -1;
}
function dispatchBsearchEQ(a, y, c, l, h) {
    if (typeof c === 'function') {
        return _EQP(a, l === void 0 ? 0 : l | 0, h === void 0 ? a.length - 1 : h | 0, y, c);
    }
    else {
        return _EQA(a, c === void 0 ? 0 : c | 0, l === void 0 ? a.length - 1 : l | 0, y);
    }
}
const binarySearchBounds = {
    ge: dispatchBsearchGE,
    gt: dispatchBsearchGT,
    lt: dispatchBsearchLT,
    le: dispatchBsearchLE,
    eq: dispatchBsearchEQ,
};
function createDetectElementResize(nonce) {
    var _window;
    if (typeof window !== 'undefined') {
        _window = window;
    }
    else if (typeof self !== 'undefined') {
        _window = self;
    }
    else {
        _window = global;
    }
    var attachEvent = typeof document !== 'undefined' && document.attachEvent;
    if (!attachEvent) {
        var requestFrame = function () {
            var raf = _window.requestAnimationFrame ||
                _window.mozRequestAnimationFrame ||
                _window.webkitRequestAnimationFrame ||
                function (fn) {
                    return _window.setTimeout(fn, 20);
                };
            return function (fn) {
                return raf(fn);
            };
        }();
        var cancelFrame = function () {
            var cancel = _window.cancelAnimationFrame ||
                _window.mozCancelAnimationFrame ||
                _window.webkitCancelAnimationFrame ||
                _window.clearTimeout;
            return function (id) {
                return cancel(id);
            };
        }();
        var resetTriggers = function (element) {
            var triggers = element.__resizeTriggers__, expand = triggers.firstElementChild, contract = triggers.lastElementChild, expandChild = expand.firstElementChild;
            contract.scrollLeft = contract.scrollWidth;
            contract.scrollTop = contract.scrollHeight;
            expandChild.style.width = expand.offsetWidth + 1 + 'px';
            expandChild.style.height = expand.offsetHeight + 1 + 'px';
            expand.scrollLeft = expand.scrollWidth;
            expand.scrollTop = expand.scrollHeight;
        };
        var checkTriggers = function (element) {
            return (element.offsetWidth != element.__resizeLast__.width ||
                element.offsetHeight != element.__resizeLast__.height);
        };
        var scrollListener = function (e) {
            if (e.target.className &&
                typeof e.target.className.indexOf === 'function' &&
                e.target.className.indexOf('contract-trigger') < 0 &&
                e.target.className.indexOf('expand-trigger') < 0) {
                return;
            }
            var element = this;
            resetTriggers(this);
            if (this.__resizeRAF__) {
                cancelFrame(this.__resizeRAF__);
            }
            this.__resizeRAF__ = requestFrame(function () {
                if (checkTriggers(element)) {
                    element.__resizeLast__.width = element.offsetWidth;
                    element.__resizeLast__.height = element.offsetHeight;
                    element.__resizeListeners__.forEach(function (fn) {
                        fn.call(element, e);
                    });
                }
            });
        };
        var animation = false, keyframeprefix = '', animationstartevent = 'animationstart', domPrefixes = 'Webkit Moz O ms'.split(' '), startEvents = 'webkitAnimationStart animationstart oAnimationStart MSAnimationStart'.split(' '), pfx = '';
        {
            var elm = document.createElement('fakeelement');
            if (elm.style.animationName !== undefined) {
                animation = true;
            }
            if (animation === false) {
                for (var i = 0; i < domPrefixes.length; i++) {
                    if (elm.style[domPrefixes[i] + 'AnimationName'] !== undefined) {
                        pfx = domPrefixes[i];
                        keyframeprefix = '-' + pfx.toLowerCase() + '-';
                        animationstartevent = startEvents[i];
                        animation = true;
                        break;
                    }
                }
            }
        }
        var animationName = 'resizeanim';
        var animationKeyframes = '@' +
            keyframeprefix +
            'keyframes ' +
            animationName +
            ' { from { opacity: 0; } to { opacity: 0; } } ';
        var animationStyle = keyframeprefix + 'animation: 1ms ' + animationName + '; ';
    }
    var createStyles = function (doc) {
        if (!doc.getElementById('detectElementResize')) {
            var css = (animationKeyframes ? animationKeyframes : '') +
                '.resize-triggers { ' +
                (animationStyle ? animationStyle : '') +
                'visibility: hidden; opacity: 0; } ' +
                '.resize-triggers, .resize-triggers > div, .contract-trigger:before { content: " "; display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; z-index: -1; } .resize-triggers > div { background: #eee; overflow: auto; } .contract-trigger:before { width: 200%; height: 200%; }', head = doc.head || doc.getElementsByTagName('head')[0], style = doc.createElement('style');
            style.id = 'detectElementResize';
            style.type = 'text/css';
            if (nonce != null) {
                style.setAttribute('nonce', nonce);
            }
            if (style.styleSheet) {
                style.styleSheet.cssText = css;
            }
            else {
                style.appendChild(doc.createTextNode(css));
            }
            head.appendChild(style);
        }
    };
    var addResizeListener = function (element, fn) {
        if (attachEvent) {
            element.attachEvent('onresize', fn);
        }
        else {
            if (!element.__resizeTriggers__) {
                var doc = element.ownerDocument;
                var elementStyle = _window.getComputedStyle(element);
                if (elementStyle && elementStyle.position == 'static') {
                    element.style.position = 'relative';
                }
                createStyles(doc);
                element.__resizeLast__ = {};
                element.__resizeListeners__ = [];
                (element.__resizeTriggers__ = doc.createElement('div')).className =
                    'resize-triggers';
                element.__resizeTriggers__.innerHTML =
                    '<div class="expand-trigger"><div></div></div>' +
                        '<div class="contract-trigger"></div>';
                element.appendChild(element.__resizeTriggers__);
                resetTriggers(element);
                element.addEventListener('scroll', scrollListener, true);
                if (animationstartevent) {
                    element.__resizeTriggers__.__animationListener__ = function animationListener(e) {
                        if (e.animationName == animationName) {
                            resetTriggers(element);
                        }
                    };
                    element.__resizeTriggers__.addEventListener(animationstartevent, element.__resizeTriggers__.__animationListener__);
                }
            }
            element.__resizeListeners__.push(fn);
        }
    };
    var removeResizeListener = function (element, fn) {
        if (attachEvent) {
            element.detachEvent('onresize', fn);
        }
        else {
            element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
            if (!element.__resizeListeners__.length) {
                element.removeEventListener('scroll', scrollListener, true);
                if (element.__resizeTriggers__.__animationListener__) {
                    element.__resizeTriggers__.removeEventListener(animationstartevent, element.__resizeTriggers__.__animationListener__);
                    element.__resizeTriggers__.__animationListener__ = null;
                }
                try {
                    element.__resizeTriggers__ = !element.removeChild(element.__resizeTriggers__);
                }
                catch (e) {
                }
            }
        }
    };
    return {
        addResizeListener,
        removeResizeListener,
    };
}
var NOT_FOUND = 0;
var SUCCESS = 1;
var EMPTY = 2;
function IntervalTreeNode(mid, left, right, leftPoints, rightPoints) {
    this.mid = mid;
    this.left = left;
    this.right = right;
    this.leftPoints = leftPoints;
    this.rightPoints = rightPoints;
    this.count =
        (left ? left.count : 0) + (right ? right.count : 0) + leftPoints.length;
}
var proto = IntervalTreeNode.prototype;
function copy(a, b) {
    a.mid = b.mid;
    a.left = b.left;
    a.right = b.right;
    a.leftPoints = b.leftPoints;
    a.rightPoints = b.rightPoints;
    a.count = b.count;
}
function rebuild(node, intervals) {
    var ntree = createIntervalTree(intervals);
    node.mid = ntree.mid;
    node.left = ntree.left;
    node.right = ntree.right;
    node.leftPoints = ntree.leftPoints;
    node.rightPoints = ntree.rightPoints;
    node.count = ntree.count;
}
function rebuildWithInterval(node, interval) {
    var intervals = node.intervals([]);
    intervals.push(interval);
    rebuild(node, intervals);
}
function rebuildWithoutInterval(node, interval) {
    var intervals = node.intervals([]);
    var idx = intervals.indexOf(interval);
    if (idx < 0) {
        return NOT_FOUND;
    }
    intervals.splice(idx, 1);
    rebuild(node, intervals);
    return SUCCESS;
}
proto.intervals = function (result) {
    result.push.apply(result, this.leftPoints);
    if (this.left) {
        this.left.intervals(result);
    }
    if (this.right) {
        this.right.intervals(result);
    }
    return result;
};
proto.insert = function (interval) {
    var weight = this.count - this.leftPoints.length;
    this.count += 1;
    if (interval[1] < this.mid) {
        if (this.left) {
            if (4 * (this.left.count + 1) > 3 * (weight + 1)) {
                rebuildWithInterval(this, interval);
            }
            else {
                this.left.insert(interval);
            }
        }
        else {
            this.left = createIntervalTree([interval]);
        }
    }
    else if (interval[0] > this.mid) {
        if (this.right) {
            if (4 * (this.right.count + 1) > 3 * (weight + 1)) {
                rebuildWithInterval(this, interval);
            }
            else {
                this.right.insert(interval);
            }
        }
        else {
            this.right = createIntervalTree([interval]);
        }
    }
    else {
        var l = bounds.ge(this.leftPoints, interval, compareBegin);
        var r = bounds.ge(this.rightPoints, interval, compareEnd);
        this.leftPoints.splice(l, 0, interval);
        this.rightPoints.splice(r, 0, interval);
    }
};
proto.remove = function (interval) {
    var weight = this.count - this.leftPoints;
    if (interval[1] < this.mid) {
        if (!this.left) {
            return NOT_FOUND;
        }
        var rw = this.right ? this.right.count : 0;
        if (4 * rw > 3 * (weight - 1)) {
            return rebuildWithoutInterval(this, interval);
        }
        var r = this.left.remove(interval);
        if (r === EMPTY) {
            this.left = null;
            this.count -= 1;
            return SUCCESS;
        }
        else if (r === SUCCESS) {
            this.count -= 1;
        }
        return r;
    }
    else if (interval[0] > this.mid) {
        if (!this.right) {
            return NOT_FOUND;
        }
        var lw = this.left ? this.left.count : 0;
        if (4 * lw > 3 * (weight - 1)) {
            return rebuildWithoutInterval(this, interval);
        }
        var r = this.right.remove(interval);
        if (r === EMPTY) {
            this.right = null;
            this.count -= 1;
            return SUCCESS;
        }
        else if (r === SUCCESS) {
            this.count -= 1;
        }
        return r;
    }
    else {
        if (this.count === 1) {
            if (this.leftPoints[0] === interval) {
                return EMPTY;
            }
            else {
                return NOT_FOUND;
            }
        }
        if (this.leftPoints.length === 1 && this.leftPoints[0] === interval) {
            if (this.left && this.right) {
                var p = this;
                var n = this.left;
                while (n.right) {
                    p = n;
                    n = n.right;
                }
                if (p === this) {
                    n.right = this.right;
                }
                else {
                    var l = this.left;
                    var r = this.right;
                    p.count -= n.count;
                    p.right = n.left;
                    n.left = l;
                    n.right = r;
                }
                copy(this, n);
                this.count =
                    (this.left ? this.left.count : 0) +
                        (this.right ? this.right.count : 0) +
                        this.leftPoints.length;
            }
            else if (this.left) {
                copy(this, this.left);
            }
            else {
                copy(this, this.right);
            }
            return SUCCESS;
        }
        for (var l = bounds.ge(this.leftPoints, interval, compareBegin); l < this.leftPoints.length; ++l) {
            if (this.leftPoints[l][0] !== interval[0]) {
                break;
            }
            if (this.leftPoints[l] === interval) {
                this.count -= 1;
                this.leftPoints.splice(l, 1);
                for (var r = bounds.ge(this.rightPoints, interval, compareEnd); r < this.rightPoints.length; ++r) {
                    if (this.rightPoints[r][1] !== interval[1]) {
                        break;
                    }
                    else if (this.rightPoints[r] === interval) {
                        this.rightPoints.splice(r, 1);
                        return SUCCESS;
                    }
                }
            }
        }
        return NOT_FOUND;
    }
};
function reportLeftRange(arr, hi, cb) {
    for (var i = 0; i < arr.length && arr[i][0] <= hi; ++i) {
        var r = cb(arr[i]);
        if (r) {
            return r;
        }
    }
}
function reportRightRange(arr, lo, cb) {
    for (var i = arr.length - 1; i >= 0 && arr[i][1] >= lo; --i) {
        var r = cb(arr[i]);
        if (r) {
            return r;
        }
    }
}
function reportRange(arr, cb) {
    for (var i = 0; i < arr.length; ++i) {
        var r = cb(arr[i]);
        if (r) {
            return r;
        }
    }
}
proto.queryPoint = function (x, cb) {
    if (x < this.mid) {
        if (this.left) {
            var r = this.left.queryPoint(x, cb);
            if (r) {
                return r;
            }
        }
        return reportLeftRange(this.leftPoints, x, cb);
    }
    else if (x > this.mid) {
        if (this.right) {
            var r = this.right.queryPoint(x, cb);
            if (r) {
                return r;
            }
        }
        return reportRightRange(this.rightPoints, x, cb);
    }
    else {
        return reportRange(this.leftPoints, cb);
    }
};
proto.queryInterval = function (lo, hi, cb) {
    if (lo < this.mid && this.left) {
        var r = this.left.queryInterval(lo, hi, cb);
        if (r) {
            return r;
        }
    }
    if (hi > this.mid && this.right) {
        var r = this.right.queryInterval(lo, hi, cb);
        if (r) {
            return r;
        }
    }
    if (hi < this.mid) {
        return reportLeftRange(this.leftPoints, hi, cb);
    }
    else if (lo > this.mid) {
        return reportRightRange(this.rightPoints, lo, cb);
    }
    else {
        return reportRange(this.leftPoints, cb);
    }
};
function compareNumbers(a, b) {
    return a - b;
}
function compareBegin(a, b) {
    var d = a[0] - b[0];
    if (d) {
        return d;
    }
    return a[1] - b[1];
}
function compareEnd(a, b) {
    var d = a[1] - b[1];
    if (d) {
        return d;
    }
    return a[0] - b[0];
}
function createIntervalTree(intervals) {
    if (intervals.length === 0) {
        return null;
    }
    var pts = [];
    for (var i = 0; i < intervals.length; ++i) {
        pts.push(intervals[i][0], intervals[i][1]);
    }
    pts.sort(compareNumbers);
    var mid = pts[pts.length >> 1];
    var leftIntervals = [];
    var rightIntervals = [];
    var centerIntervals = [];
    for (var i = 0; i < intervals.length; ++i) {
        var s = intervals[i];
        if (s[1] < mid) {
            leftIntervals.push(s);
        }
        else if (mid < s[0]) {
            rightIntervals.push(s);
        }
        else {
            centerIntervals.push(s);
        }
    }
    var leftPoints = centerIntervals;
    var rightPoints = centerIntervals.slice();
    leftPoints.sort(compareBegin);
    rightPoints.sort(compareEnd);
    return new IntervalTreeNode(mid, createIntervalTree(leftIntervals), createIntervalTree(rightIntervals), leftPoints, rightPoints);
}
function IntervalTree(root) {
    this.root = root;
}
var tproto = IntervalTree.prototype;
tproto.insert = function (interval) {
    if (this.root) {
        this.root.insert(interval);
    }
    else {
        this.root = new IntervalTreeNode(interval[0], null, null, [interval], [interval]);
    }
};
tproto.remove = function (interval) {
    if (this.root) {
        var r = this.root.remove(interval);
        if (r === EMPTY) {
            this.root = null;
        }
        return r !== NOT_FOUND;
    }
    return false;
};
tproto.queryPoint = function (p, cb) {
    if (this.root) {
        return this.root.queryPoint(p, cb);
    }
};
tproto.queryInterval = function (lo, hi, cb) {
    if (lo <= hi && this.root) {
        return this.root.queryInterval(lo, hi, cb);
    }
};
Object.defineProperty(tproto, 'count', {
    get: function () {
        if (this.root) {
            return this.root.count;
        }
        return 0;
    },
});
Object.defineProperty(tproto, 'intervals', {
    get: function () {
        if (this.root) {
            return this.root.intervals([]);
        }
        return [];
    },
});
function createWrapper(intervals) {
    if (!intervals || intervals.length === 0) {
        return new IntervalTree(null);
    }
    return new IntervalTree(createIntervalTree(intervals));
}
const getWindow = () => typeof window !== 'undefined' ? window : undefined;
class WindowScroller extends React.PureComponent {
    constructor() {
        super(...arguments);
        this._window = getWindow();
        this._isMounted = false;
        this._positionFromTop = 0;
        this._positionFromLeft = 0;
        this.state = {
            ...getDimensions(this.props.scrollElement, this.props),
            isScrolling: false,
            scrollLeft: 0,
            scrollTop: 0,
        };
        this._registerChild = element => {
            if (element && !(element instanceof Element)) {
                console.warn('WindowScroller registerChild expects to be passed Element or null');
            }
            this._child = element;
            this.updatePosition();
        };
        this._onChildScroll = ({ scrollTop }) => {
            if (this.state.scrollTop === scrollTop) {
                return;
            }
            const scrollElement = this.props.scrollElement;
            if (scrollElement) {
                if (typeof scrollElement.scrollTo === 'function') {
                    scrollElement.scrollTo(0, scrollTop + this._positionFromTop);
                }
                else {
                    scrollElement.scrollTop = scrollTop + this._positionFromTop;
                }
            }
        };
        this._registerResizeListener = element => {
            if (element === window) {
                window.addEventListener('resize', this._onResize, false);
            }
            else {
                this._detectElementResize.addResizeListener(element, this._onResize);
            }
        };
        this._unregisterResizeListener = element => {
            if (element === window) {
                window.removeEventListener('resize', this._onResize, false);
            }
            else if (element) {
                this._detectElementResize.removeResizeListener(element, this._onResize);
            }
        };
        this._onResize = () => {
            this.updatePosition();
        };
        this.__handleWindowScrollEvent = () => {
            if (!this._isMounted) {
                return;
            }
            const { onScroll } = this.props;
            const scrollElement = this.props.scrollElement;
            if (scrollElement) {
                const scrollOffset = getScrollOffset(scrollElement);
                const scrollLeft = Math.max(0, scrollOffset.left - this._positionFromLeft);
                const scrollTop = Math.max(0, scrollOffset.top - this._positionFromTop);
                this.setState({
                    isScrolling: true,
                    scrollLeft,
                    scrollTop,
                });
                onScroll({
                    scrollLeft,
                    scrollTop,
                });
            }
        };
        this.__resetIsScrolling = () => {
            this.setState({
                isScrolling: false,
            });
        };
    }
    updatePosition(scrollElement = this.props.scrollElement) {
        const { onResize } = this.props;
        const { height, width } = this.state;
        const thisNode = this._child || ReactDOM.findDOMNode(this);
        if (thisNode instanceof Element && scrollElement) {
            const offset = getPositionOffset(thisNode, scrollElement);
            this._positionFromTop = offset.top;
            this._positionFromLeft = offset.left;
        }
        const dimensions = getDimensions(scrollElement, this.props);
        if (height !== dimensions.height || width !== dimensions.width) {
            this.setState({
                height: dimensions.height,
                width: dimensions.width,
            });
            onResize({
                height: dimensions.height,
                width: dimensions.width,
            });
        }
    }
    componentDidMount() {
        const scrollElement = this.props.scrollElement;
        this._detectElementResize = createDetectElementResize();
        this.updatePosition(scrollElement);
        if (scrollElement) {
            registerScrollListener(this, scrollElement);
            this._registerResizeListener(scrollElement);
        }
        this._isMounted = true;
    }
    componentDidUpdate(prevProps, prevState) {
        const { scrollElement } = this.props;
        const { scrollElement: prevScrollElement } = prevProps;
        if (prevScrollElement !== scrollElement &&
            prevScrollElement != null &&
            scrollElement != null) {
            this.updatePosition(scrollElement);
            unregisterScrollListener(this, prevScrollElement);
            registerScrollListener(this, scrollElement);
            this._unregisterResizeListener(prevScrollElement);
            this._registerResizeListener(scrollElement);
        }
    }
    componentWillUnmount() {
        const scrollElement = this.props.scrollElement;
        if (scrollElement) {
            unregisterScrollListener(this, scrollElement);
            this._unregisterResizeListener(scrollElement);
        }
        this._isMounted = false;
    }
    render() {
        const { children } = this.props;
        const { isScrolling, scrollTop, scrollLeft, height, width } = this.state;
        return children({
            onChildScroll: this._onChildScroll,
            registerChild: this._registerChild,
            height,
            isScrolling,
            scrollLeft,
            scrollTop,
            width,
        });
    }
}
WindowScroller.defaultProps = {
    onResize: () => { },
    onScroll: () => { },
    scrollingResetTimeInterval: IS_SCROLLING_TIMEOUT,
    scrollElement: getWindow(),
    serverHeight: 0,
    serverWidth: 0,
};
function calculateSizeAndPositionData({ cellCount, cellSizeAndPositionGetter, sectionSize }) {
    const cellMetadata = [];
    const sectionManager = new SectionManager(sectionSize);
    let height = 0;
    let width = 0;
    for (let index = 0; index < cellCount; index++) {
        const cellMetadatum = cellSizeAndPositionGetter({ index });
        if (cellMetadatum.height == null ||
            isNaN(cellMetadatum.height) ||
            cellMetadatum.width == null ||
            isNaN(cellMetadatum.width) ||
            cellMetadatum.x == null ||
            isNaN(cellMetadatum.x) ||
            cellMetadatum.y == null ||
            isNaN(cellMetadatum.y)) {
            throw Error(`Invalid metadata returned for cell ${index}:
      x:${cellMetadatum.x}, y:${cellMetadatum.y}, width:${cellMetadatum.width}, height:${cellMetadatum.height}`);
        }
        height = Math.max(height, cellMetadatum.y + cellMetadatum.height);
        width = Math.max(width, cellMetadatum.x + cellMetadatum.width);
        cellMetadata[index] = cellMetadatum;
        sectionManager.registerCell({
            cellMetadatum,
            index,
        });
    }
    return {
        cellMetadata,
        height,
        sectionManager,
        width,
    };
}
function calculateSizeAndPositionDataAndUpdateScrollOffset({ cellCount, cellSize, computeMetadataCallback, computeMetadataCallbackProps, nextCellsCount, nextCellSize, nextScrollToIndex, scrollToIndex, updateScrollOffsetForScrollToIndex }) {
    if (cellCount !== nextCellsCount ||
        ((typeof cellSize === 'number' || typeof nextCellSize === 'number') &&
            cellSize !== nextCellSize)) {
        computeMetadataCallback(computeMetadataCallbackProps);
        if (scrollToIndex >= 0 && scrollToIndex === nextScrollToIndex) {
            updateScrollOffsetForScrollToIndex();
        }
    }
}
class CellSizeAndPositionManager {
    constructor({ cellCount, cellSizeGetter, estimatedCellSize }) {
        this._cellSizeAndPositionData = {};
        this._lastMeasuredIndex = -1;
        this._lastBatchedIndex = -1;
        this._cellSizeGetter = cellSizeGetter;
        this._cellCount = cellCount;
        this._estimatedCellSize = estimatedCellSize;
    }
    areOffsetsAdjusted() {
        return false;
    }
    configure({ cellCount, estimatedCellSize, cellSizeGetter }) {
        this._cellCount = cellCount;
        this._estimatedCellSize = estimatedCellSize;
        this._cellSizeGetter = cellSizeGetter;
    }
    getCellCount() {
        return this._cellCount;
    }
    getEstimatedCellSize() {
        return this._estimatedCellSize;
    }
    getLastMeasuredIndex() {
        return this._lastMeasuredIndex;
    }
    getOffsetAdjustment() {
        return 0;
    }
    getSizeAndPositionOfCell(index) {
        if (index < 0 || index >= this._cellCount) {
            throw Error(`Requested index ${index} is outside of range 0..${this._cellCount}`);
        }
        if (index > this._lastMeasuredIndex) {
            let lastMeasuredCellSizeAndPosition = this.getSizeAndPositionOfLastMeasuredCell();
            let offset = lastMeasuredCellSizeAndPosition.offset +
                lastMeasuredCellSizeAndPosition.size;
            for (var i = this._lastMeasuredIndex + 1; i <= index; i++) {
                let size = this._cellSizeGetter({ index: i });
                if (size === undefined || isNaN(size)) {
                    throw Error(`Invalid size returned for cell ${i} of value ${size}`);
                }
                else if (size === null) {
                    this._cellSizeAndPositionData[i] = {
                        offset,
                        size: 0,
                    };
                    this._lastBatchedIndex = index;
                }
                else {
                    this._cellSizeAndPositionData[i] = {
                        offset,
                        size,
                    };
                    offset += size;
                    this._lastMeasuredIndex = index;
                }
            }
        }
        return this._cellSizeAndPositionData[index];
    }
    getSizeAndPositionOfLastMeasuredCell() {
        return this._lastMeasuredIndex >= 0
            ? this._cellSizeAndPositionData[this._lastMeasuredIndex]
            : {
                offset: 0,
                size: 0,
            };
    }
    getTotalSize() {
        const lastMeasuredCellSizeAndPosition = this.getSizeAndPositionOfLastMeasuredCell();
        const totalSizeOfMeasuredCells = lastMeasuredCellSizeAndPosition.offset +
            lastMeasuredCellSizeAndPosition.size;
        const numUnmeasuredCells = this._cellCount - this._lastMeasuredIndex - 1;
        const totalSizeOfUnmeasuredCells = numUnmeasuredCells * this._estimatedCellSize;
        return totalSizeOfMeasuredCells + totalSizeOfUnmeasuredCells;
    }
    getUpdatedOffsetForIndex({ align = 'auto', containerSize, currentOffset, targetIndex }) {
        if (containerSize <= 0) {
            return 0;
        }
        const datum = this.getSizeAndPositionOfCell(targetIndex);
        const maxOffset = datum.offset;
        const minOffset = maxOffset - containerSize + datum.size;
        let idealOffset;
        switch (align) {
            case 'start':
                idealOffset = maxOffset;
                break;
            case 'end':
                idealOffset = minOffset;
                break;
            case 'center':
                idealOffset = maxOffset - (containerSize - datum.size) / 2;
                break;
            default:
                idealOffset = Math.max(minOffset, Math.min(maxOffset, currentOffset));
                break;
        }
        const totalSize = this.getTotalSize();
        return Math.max(0, Math.min(totalSize - containerSize, idealOffset));
    }
    getVisibleCellRange(params) {
        let { containerSize, offset } = params;
        const totalSize = this.getTotalSize();
        if (totalSize === 0) {
            return {};
        }
        const maxOffset = offset + containerSize;
        const start = this._findNearestCell(offset);
        const datum = this.getSizeAndPositionOfCell(start);
        offset = datum.offset + datum.size;
        let stop = start;
        while (offset < maxOffset && stop < this._cellCount - 1) {
            stop++;
            offset += this.getSizeAndPositionOfCell(stop).size;
        }
        return {
            start,
            stop,
        };
    }
    resetCell(index) {
        this._lastMeasuredIndex = Math.min(this._lastMeasuredIndex, index - 1);
    }
    _binarySearch(high, low, offset) {
        while (low <= high) {
            const middle = low + Math.floor((high - low) / 2);
            const currentOffset = this.getSizeAndPositionOfCell(middle).offset;
            if (currentOffset === offset) {
                return middle;
            }
            else if (currentOffset < offset) {
                low = middle + 1;
            }
            else if (currentOffset > offset) {
                high = middle - 1;
            }
        }
        if (low > 0) {
            return low - 1;
        }
        else {
            return 0;
        }
    }
    _exponentialSearch(index, offset) {
        let interval = 1;
        while (index < this._cellCount &&
            this.getSizeAndPositionOfCell(index).offset < offset) {
            index += interval;
            interval *= 2;
        }
        return this._binarySearch(Math.min(index, this._cellCount - 1), Math.floor(index / 2), offset);
    }
    _findNearestCell(offset) {
        if (isNaN(offset)) {
            throw Error(`Invalid offset ${offset} specified`);
        }
        offset = Math.max(0, offset);
        const lastMeasuredCellSizeAndPosition = this.getSizeAndPositionOfLastMeasuredCell();
        const lastMeasuredIndex = Math.max(0, this._lastMeasuredIndex);
        if (lastMeasuredCellSizeAndPosition.offset >= offset) {
            return this._binarySearch(lastMeasuredIndex, 0, offset);
        }
        else {
            return this._exponentialSearch(lastMeasuredIndex, offset);
        }
    }
}
const DEFAULT_MAX_ELEMENT_SIZE = 1500000;
const CHROME_MAX_ELEMENT_SIZE = 1.67771e7;
const isBrowser = () => typeof window !== 'undefined';
const isChrome = () => !!window.chrome && !!window.chrome.webstore;
const getMaxElementSize = () => {
    if (isBrowser()) {
        if (isChrome()) {
            return CHROME_MAX_ELEMENT_SIZE;
        }
    }
    return DEFAULT_MAX_ELEMENT_SIZE;
};
class ScalingCellSizeAndPositionManager {
    constructor({ maxScrollSize = getMaxElementSize(), ...params }) {
        this._cellSizeAndPositionManager = new CellSizeAndPositionManager(params);
        this._maxScrollSize = maxScrollSize;
    }
    areOffsetsAdjusted() {
        return this._cellSizeAndPositionManager.getTotalSize() > this._maxScrollSize;
    }
    configure(params) {
        this._cellSizeAndPositionManager.configure(params);
    }
    getCellCount() {
        return this._cellSizeAndPositionManager.getCellCount();
    }
    getEstimatedCellSize() {
        return this._cellSizeAndPositionManager.getEstimatedCellSize();
    }
    getLastMeasuredIndex() {
        return this._cellSizeAndPositionManager.getLastMeasuredIndex();
    }
    getOffsetAdjustment({ containerSize, offset }) {
        const totalSize = this._cellSizeAndPositionManager.getTotalSize();
        const safeTotalSize = this.getTotalSize();
        const offsetPercentage = this._getOffsetPercentage({
            containerSize,
            offset,
            totalSize: safeTotalSize,
        });
        return Math.round(offsetPercentage * (safeTotalSize - totalSize));
    }
    getSizeAndPositionOfCell(index) {
        return this._cellSizeAndPositionManager.getSizeAndPositionOfCell(index);
    }
    getSizeAndPositionOfLastMeasuredCell() {
        return this._cellSizeAndPositionManager.getSizeAndPositionOfLastMeasuredCell();
    }
    getTotalSize() {
        return Math.min(this._maxScrollSize, this._cellSizeAndPositionManager.getTotalSize());
    }
    getUpdatedOffsetForIndex({ align = 'auto', containerSize, currentOffset, targetIndex }) {
        currentOffset = this._safeOffsetToOffset({
            containerSize,
            offset: currentOffset,
        });
        const offset = this._cellSizeAndPositionManager.getUpdatedOffsetForIndex({
            align,
            containerSize,
            currentOffset,
            targetIndex,
        });
        return this._offsetToSafeOffset({
            containerSize,
            offset,
        });
    }
    getVisibleCellRange({ containerSize, offset }) {
        offset = this._safeOffsetToOffset({
            containerSize,
            offset,
        });
        return this._cellSizeAndPositionManager.getVisibleCellRange({
            containerSize,
            offset,
        });
    }
    resetCell(index) {
        this._cellSizeAndPositionManager.resetCell(index);
    }
    _getOffsetPercentage({ containerSize, offset, totalSize }) {
        return totalSize <= containerSize
            ? 0
            : offset / (totalSize - containerSize);
    }
    _offsetToSafeOffset({ containerSize, offset }) {
        const totalSize = this._cellSizeAndPositionManager.getTotalSize();
        const safeTotalSize = this.getTotalSize();
        if (totalSize === safeTotalSize) {
            return offset;
        }
        else {
            const offsetPercentage = this._getOffsetPercentage({
                containerSize,
                offset,
                totalSize,
            });
            return Math.round(offsetPercentage * (safeTotalSize - containerSize));
        }
    }
    _safeOffsetToOffset({ containerSize, offset }) {
        const totalSize = this._cellSizeAndPositionManager.getTotalSize();
        const safeTotalSize = this.getTotalSize();
        if (totalSize === safeTotalSize) {
            return offset;
        }
        else {
            const offsetPercentage = this._getOffsetPercentage({
                containerSize,
                offset,
                totalSize: safeTotalSize,
            });
            return Math.round(offsetPercentage * (totalSize - containerSize));
        }
    }
}
function updateScrollIndexHelper({ cellSize, cellSizeAndPositionManager, previousCellsCount, previousCellSize, previousScrollToAlignment, previousScrollToIndex, previousSize, scrollOffset, scrollToAlignment, scrollToIndex, size, sizeJustIncreasedFromZero, updateScrollIndexCallback }) {
    const cellCount = cellSizeAndPositionManager.getCellCount();
    const hasScrollToIndex = scrollToIndex >= 0 && scrollToIndex < cellCount;
    const sizeHasChanged = size !== previousSize ||
        sizeJustIncreasedFromZero ||
        !previousCellSize ||
        (typeof cellSize === 'number' && cellSize !== previousCellSize);
    if (hasScrollToIndex &&
        (sizeHasChanged ||
            scrollToAlignment !== previousScrollToAlignment ||
            scrollToIndex !== previousScrollToIndex)) {
        updateScrollIndexCallback(scrollToIndex);
    }
    else if (!hasScrollToIndex &&
        cellCount > 0 &&
        (size < previousSize || cellCount < previousCellsCount)) {
        if (scrollOffset > cellSizeAndPositionManager.getTotalSize() - size) {
            updateScrollIndexCallback(cellCount - 1);
        }
    }
}
const isWindow = element => element === window;
const getBoundingBox = element => element.getBoundingClientRect();
function getDimensions(scrollElement, props) {
    if (!scrollElement) {
        return {
            height: props.serverHeight,
            width: props.serverWidth,
        };
    }
    else if (isWindow(scrollElement)) {
        const { innerHeight, innerWidth } = window;
        return {
            height: typeof innerHeight === 'number' ? innerHeight : 0,
            width: typeof innerWidth === 'number' ? innerWidth : 0,
        };
    }
    else {
        return getBoundingBox(scrollElement);
    }
}
function getPositionOffset(element, container) {
    if (isWindow(container) && document.documentElement) {
        const containerElement = document.documentElement;
        const elementRect = getBoundingBox(element);
        const containerRect = getBoundingBox(containerElement);
        return {
            top: elementRect.top - containerRect.top,
            left: elementRect.left - containerRect.left,
        };
    }
    else {
        const scrollOffset = getScrollOffset(container);
        const elementRect = getBoundingBox(element);
        const containerRect = getBoundingBox(container);
        return {
            top: elementRect.top + scrollOffset.top - containerRect.top,
            left: elementRect.left + scrollOffset.left - containerRect.left,
        };
    }
}
function getScrollOffset(element) {
    if (isWindow(element) && document.documentElement) {
        return {
            top: 'scrollY' in window
                ? window.scrollY
                : document.documentElement.scrollTop,
            left: 'scrollX' in window
                ? window.scrollX
                : document.documentElement.scrollLeft,
        };
    }
    else {
        return {
            top: element.scrollTop,
            left: element.scrollLeft,
        };
    }
}
let mountedInstances = [];
let originalBodyPointerEvents = null;
let disablePointerEventsTimeoutId = null;
function enablePointerEventsIfDisabled() {
    if (disablePointerEventsTimeoutId) {
        disablePointerEventsTimeoutId = null;
        if (document.body && originalBodyPointerEvents != null) {
            document.body.style.pointerEvents = originalBodyPointerEvents;
        }
        originalBodyPointerEvents = null;
    }
}
function enablePointerEventsAfterDelayCallback() {
    enablePointerEventsIfDisabled();
    mountedInstances.forEach(instance => instance.__resetIsScrolling());
}
function enablePointerEventsAfterDelay() {
    if (disablePointerEventsTimeoutId) {
        cancelAnimationTimeout(disablePointerEventsTimeoutId);
    }
    var maximumTimeout = 0;
    mountedInstances.forEach(instance => {
        maximumTimeout = Math.max(maximumTimeout, instance.props.scrollingResetTimeInterval);
    });
    disablePointerEventsTimeoutId = requestAnimationTimeout(enablePointerEventsAfterDelayCallback, maximumTimeout);
}
function onScrollWindow(event) {
    if (event.currentTarget === window &&
        originalBodyPointerEvents == null &&
        document.body) {
        originalBodyPointerEvents = document.body.style.pointerEvents;
        document.body.style.pointerEvents = 'none';
    }
    enablePointerEventsAfterDelay();
    mountedInstances.forEach(instance => {
        if (instance.props.scrollElement === event.currentTarget) {
            instance.__handleWindowScrollEvent();
        }
    });
}
function registerScrollListener(component, element) {
    if (!mountedInstances.some(instance => instance.props.scrollElement === element)) {
        element.addEventListener('scroll', onScrollWindow);
    }
    mountedInstances.push(component);
}
function unregisterScrollListener(component, element) {
    mountedInstances = mountedInstances.filter(instance => instance !== component);
    if (!mountedInstances.length) {
        element.removeEventListener('scroll', onScrollWindow);
        if (disablePointerEventsTimeoutId) {
            cancelAnimationTimeout(disablePointerEventsTimeoutId);
            enablePointerEventsIfDisabled();
        }
    }
}

export { render, ArrowKeyStepper, AutoSizer, Collection, Section, SectionManager, CellMeasurer, DEFAULT_HEIGHT, DEFAULT_WIDTH, CellMeasurerCache, ColumnSizer, scrollbarSize, SCROLL_DIRECTION_BACKWARD, SCROLL_DIRECTION_FORWARD, SCROLL_DIRECTION_HORIZONTAL, SCROLL_DIRECTION_VERTICAL, defaultOverscanIndicesGetter, defaultCellRangeRenderer, DEFAULT_SCROLLING_RESET_TIME_INTERVAL, InfiniteLoader, isRangeVisible, scanForUnloadedRanges, forceUpdateReactVirtualizedComponent, List, CellMeasurerCacheDecorator, ScrollSync, createCellPositioner, PositionCache, raf, caf, createCallbackMemoizer, getUpdatedOffsetForIndex, initCellMetadata, cancelAnimationTimeout, requestAnimationTimeout, getCellMetadata, Column, createMultiSort, defaultCellDataGetter, defaultCellRenderer, defaultHeaderRenderer, defaultHeaderRowRenderer, defaultRowRenderer, SortIndicator, Table, binarySearchBounds, createDetectElementResize, createWrapper, WindowScroller, calculateSizeAndPositionData, calculateSizeAndPositionDataAndUpdateScrollOffset, CellSizeAndPositionManager, getMaxElementSize, ScalingCellSizeAndPositionManager, updateScrollIndexHelper, getDimensions, getPositionOffset, getScrollOffset, registerScrollListener, unregisterScrollListener };

//for node target, just change export to const ReactVirtualized = {..things} and then module.exports = ReactVirtualized . the current build is broken for node /electron
