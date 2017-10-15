/**
 * Window Sections are used to group nearby cells.
 * This enables us to more quickly determine which cells to display in a given region of the Window.
 * @flow
 */
import Section from './Section';
import type {Index, SizeAndPositionInfo} from './types';

const SECTION_SIZE = 100;

type RegisterCellParams = {
  cellMetadatum: SizeAndPositionInfo,
  index: number,
};

/**
 * Contains 0 to many Sections.
 * Grows (and adds Sections) dynamically as cells are registered.
 * Automatically adds cells to the appropriate Section(s).
 */
export default class SectionManager {
  constructor(sectionSize = SECTION_SIZE) {
    this._sectionSize = sectionSize;

    this._cellMetadata = [];
    this._sections = {};
  }

  /**
   * Gets all cell indices contained in the specified region.
   * A region may encompass 1 or more Sections.
   */
  getCellIndices({height, width, x, y}: SizeAndPositionInfo): Array<number> {
    const indices = {};

    this.getSections({height, width, x, y}).forEach(section =>
      section.getCellIndices().forEach(index => {
        indices[index] = index;
      }),
    );

    // Object keys are strings; this function returns numbers
    return Object.keys(indices).map(index => indices[index]);
  }

  /** Get size and position information for the cell specified. */
  getCellMetadata({index}: Index): SizeAndPositionInfo {
    return this._cellMetadata[index];
  }

  /** Get all Sections overlapping the specified region. */
  getSections({height, width, x, y}: SizeAndPositionInfo): Array<Section> {
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

  /** Total number of Sections based on the currently registered cells. */
  getTotalSectionCount() {
    return Object.keys(this._sections).length;
  }

  /** Intended for debugger/test purposes only */
  toString() {
    return Object.keys(this._sections).map(index =>
      this._sections[index].toString(),
    );
  }

  /** Adds a cell to the appropriate Sections and registers it metadata for later retrievable. */
  registerCell({cellMetadatum, index}: RegisterCellParams) {
    this._cellMetadata[index] = cellMetadatum;

    this.getSections(cellMetadatum).forEach(section =>
      section.addCellIndex({index}),
    );
  }
}
