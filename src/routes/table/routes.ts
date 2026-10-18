import { lazy } from "react";
import type { NavSectionConfig } from "react-lib-tools";
import type { Route } from "../types";

export const tableRoutes = {
  "/table": lazy(() => import("./TableRoute")),
  "/table/row-styles": lazy(() => import("./TableRowStylesRoute")),
  "/table/cell-renderers": lazy(() => import("./TableCellRenderersRoute")),
  "/table/row-renderers": lazy(() => import("./TableRowRenderersRoute")),
  "/table/sorting": lazy(() => import("./SortingRoute")),
  "/table/props": lazy(() => import("./TablePropsRoute")),
  "/table/column-props": lazy(() => import("./ColumnPropsRoute")),
  "/table/methods": lazy(() => import("./TableMethodsRoute"))
} satisfies Record<string, Route>;

// Navigation titles should be 20 characters or fewer so they don't overflow the sidebar
export const tableNav: NavSectionConfig<keyof typeof tableRoutes> = {
  title: "Table",
  links: [
    { path: "/table", title: "Rendering a table" },
    { path: "/table/row-styles", title: "Row styles" },
    { path: "/table/cell-renderers", title: "Custom cells" },
    { path: "/table/row-renderers", title: "Custom rows" },
    { path: "/table/sorting", title: "Sorting" },
    { path: "/table/props", title: "Table props" },
    { path: "/table/column-props", title: "Column props" },
    { path: "/table/methods", title: "Table methods" }
  ]
};
