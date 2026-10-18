import { lazy } from "react";
import type { NavSectionConfig } from "react-lib-tools";
import type { Route } from "../types";

export const cellMeasurerRoutes = {
  "/cell-measurer": lazy(() => import("./CellMeasurerRoute")),
  "/cell-measurer/column-widths": lazy(
    () => import("./CellMeasurerColumnWidthsRoute")
  ),
  "/cell-measurer/cache": lazy(() => import("./CellMeasurerCacheRoute")),
  "/cell-measurer/limitations": lazy(
    () => import("./CellMeasurerLimitationsRoute")
  ),
  "/cell-measurer/props": lazy(() => import("./CellMeasurerPropsRoute"))
} satisfies Record<string, Route>;

// Navigation titles should be 20 characters or fewer so they don't overflow the sidebar
export const cellMeasurerNav: NavSectionConfig<
  keyof typeof cellMeasurerRoutes
> = {
  title: "Measuring content",
  links: [
    { path: "/cell-measurer", title: "Measuring cells" },
    {
      path: "/cell-measurer/column-widths",
      title: "Dynamic column widths",
      navTitle: "Column widths"
    },
    { path: "/cell-measurer/cache", title: "CellMeasurerCache" },
    {
      path: "/cell-measurer/limitations",
      title: "Limitations & performance",
      navTitle: "Limitations"
    },
    { path: "/cell-measurer/props", title: "CellMeasurer props" }
  ]
};
