import initCellMetadata from './initCellMetadata';

// Default cell sizes and offsets for use in below tests
export function getCellMetadata() {
  const cellSizes = [
    10, // 0: 0..0 (min)
    20, // 1: 0..10
    15, // 2: 0..30
    10, // 3: 5..45
    15, // 4: 20..55
    30, // 5: 50..70
    20, // 6: 70..100
    10, // 7: 80..110
    30, //  8: 110..110 (max)
  ];
  return initCellMetadata({
    cellCount: cellSizes.length,
    size: ({index}) => cellSizes[index],
  });
}
