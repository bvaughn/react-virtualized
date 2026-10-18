import { lazy } from "react";
import type { NavSectionConfig } from "react-lib-tools";
import type { Route } from "../types";

export const gridRoutes = {
  "/grid": lazy(() => import("./GridRoute")),
  "/grid/variable-sizes": lazy(() => import("./VariableSizesRoute")),
  "/grid/scroll-to-cell": lazy(() => import("./ScrollToCellRoute")),
  "/grid/overscan": lazy(() => import("./OverscanRoute")),
  "/grid/cell-range-renderer": lazy(() => import("./CellRangeRendererRoute")),
  "/grid/fixed-rows-and-columns": lazy(
    () => import("./FixedRowsAndColumnsRoute")
  ),
  "/grid/props": lazy(() => import("./GridPropsRoute")),
  "/grid/methods": lazy(() => import("./GridMethodsRoute")),
  "/grid/multi-grid-props": lazy(() => import("./MultiGridPropsRoute")),
  "/grid/multi-grid-methods": lazy(() => import("./MultiGridMethodsRoute"))
} satisfies Record<string, Route>;

// Navigation titles should be 20 characters or fewer so they don't overflow the sidebar
export const gridNav: NavSectionConfig<keyof typeof gridRoutes> = {
  title: "Grid",
  links: [
    { path: "/grid", title: "Rendering a grid" },
    { path: "/grid/variable-sizes", title: "Variable sizes" },
    { path: "/grid/scroll-to-cell", title: "Scrolling to a cell" },
    { path: "/grid/overscan", title: "Overscan" },
    { path: "/grid/cell-range-renderer", title: "Cell range renderer" },
    { path: "/grid/fixed-rows-and-columns", title: "Fixed rows & columns" },
    { path: "/grid/props", title: "Grid props" },
    { path: "/grid/methods", title: "Grid methods" },
    { path: "/grid/multi-grid-props", title: "MultiGrid props" },
    { path: "/grid/multi-grid-methods", title: "MultiGrid methods" }
  ]
};
