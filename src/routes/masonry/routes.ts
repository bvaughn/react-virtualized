import { lazy } from "react";
import type { NavSectionConfig } from "react-lib-tools";
import type { Route } from "../types";

export const masonryRoutes = {
  "/masonry": lazy(() => import("./MasonryRoute")),
  "/masonry/measuring-and-layout": lazy(
    () => import("./MasonryMeasuringRoute")
  ),
  "/masonry/cell-positioners": lazy(
    () => import("./MasonryCellPositionersRoute")
  ),
  "/masonry/images": lazy(() => import("./MasonryImagesRoute")),
  "/masonry/props": lazy(() => import("./MasonryPropsRoute")),
  "/masonry/methods": lazy(() => import("./MasonryMethodsRoute"))
} satisfies Record<string, Route>;

// Navigation titles should be 20 characters or fewer so they don't overflow the sidebar
export const masonryNav: NavSectionConfig<keyof typeof masonryRoutes> = {
  title: "Masonry",
  links: [
    { path: "/masonry", title: "Rendering a masonry layout" },
    { path: "/masonry/measuring-and-layout", title: "Measuring & layout" },
    { path: "/masonry/cell-positioners", title: "Cell positioners" },
    { path: "/masonry/images", title: "Images" },
    { path: "/masonry/props", title: "Masonry props" },
    { path: "/masonry/methods", title: "Masonry methods" }
  ]
};
