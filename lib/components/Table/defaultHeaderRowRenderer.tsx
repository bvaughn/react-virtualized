import type { TableHeaderRowProps } from "./types";

/**
 * Default table header row renderer.
 */
export function defaultHeaderRowRenderer({
  className,
  columns,
  style
}: TableHeaderRowProps) {
  return (
    <div className={className} role="row" style={style}>
      {columns}
    </div>
  );
}
