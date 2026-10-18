import { lazy } from "react";
import type { NavSectionConfig } from "react-lib-tools";
import type { Route } from "../types";

export const windowScrollingRoutes = {
  "/window-scrolling": lazy(() => import("./ScrollingWithThePageRoute")),
  "/window-scrolling/scroll-element": lazy(
    () => import("./ScrollingAnElementRoute")
  )
} satisfies Record<string, Route>;

// Navigation titles should be 20 characters or fewer so they don't overflow the sidebar
export const windowScrollingNav: NavSectionConfig<
  keyof typeof windowScrollingRoutes
> = {
  title: "Window scrolling",
  links: [
    { path: "/window-scrolling", title: "Scroll with the page" },
    { path: "/window-scrolling/scroll-element", title: "Scrolling an element" }
  ]
};
