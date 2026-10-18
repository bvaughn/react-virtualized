import { lazy } from "react";
import type { NavSectionConfig } from "react-lib-tools";
import type { Route } from "../types";

export const listRoutes = {
  "/list": lazy(() => import("./ListRoute")),
  "/list/rendering-rows": lazy(() => import("./ListRenderingRowsRoute")),
  "/list/variable-row-heights": lazy(
    () => import("./ListVariableRowHeightsRoute")
  ),
  "/list/scroll-to-row": lazy(() => import("./ListScrollToRowRoute")),
  "/list/props": lazy(() => import("./ListPropsRoute")),
  "/list/methods": lazy(() => import("./ListMethodsRoute"))
} satisfies Record<string, Route>;

// Navigation titles should be 20 characters or fewer so they don't overflow the sidebar
export const listNav: NavSectionConfig<keyof typeof listRoutes> = {
  title: "List",
  links: [
    { path: "/list", title: "Rendering a list" },
    { path: "/list/rendering-rows", title: "Rendering rows" },
    { path: "/list/variable-row-heights", title: "Variable row heights" },
    { path: "/list/scroll-to-row", title: "Scrolling to a row" },
    { path: "/list/props", title: "List props" },
    { path: "/list/methods", title: "List methods" }
  ]
};
