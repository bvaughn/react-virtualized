import SectionManager from '../SectionManager';

export default function calculateSizeAndPositionData({
  cellCount,
  cellSizeAndPositionGetter,
  sectionSize,
}) {
  const cellMetadata = [];
  const sectionManager = new SectionManager(sectionSize);
  let height = 0;
  let width = 0;

  for (let index = 0; index < cellCount; index++) {
    const cellMetadatum = cellSizeAndPositionGetter({index});

    if (
      cellMetadatum.height == null ||
      isNaN(cellMetadatum.height) ||
      cellMetadatum.width == null ||
      isNaN(cellMetadatum.width) ||
      cellMetadatum.x == null ||
      isNaN(cellMetadatum.x) ||
      cellMetadatum.y == null ||
      isNaN(cellMetadatum.y)
    ) {
      throw Error(
        `Invalid metadata returned for cell ${index}:
        x:${cellMetadatum.x}, y:${cellMetadatum.y}, width:${
          cellMetadatum.width
        }, height:${cellMetadatum.height}`,
      );
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
