export default function defaultKeyMapper (
  rowIndex: number,
  columnIndex: number
): any {
  return `${rowIndex}-${columnIndex}`
}
