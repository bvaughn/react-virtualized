import { lazy } from "react";
import { cellMeasurerRoutes } from "./routes/cell-measurer/routes";
import { gridRoutes } from "./routes/grid/routes";
import { listRoutes } from "./routes/list/routes";
import { masonryRoutes } from "./routes/masonry/routes";
import { tableRoutes } from "./routes/table/routes";
import { windowScrollingRoutes } from "./routes/window-scrolling/routes";
import type { Route } from "./routes/types";

export type { Route };

export const routes = {
  ...listRoutes,
  ...gridRoutes,
  ...tableRoutes,
  ...masonryRoutes,
  ...cellMeasurerRoutes,
  ...windowScrollingRoutes,

  "/arrow-key-stepper": lazy(() => import("./routes/hoc/ArrowKeyStepperRoute")),
  "/column-sizer": lazy(() => import("./routes/hoc/ColumnSizerRoute")),
  "/infinite-loader": lazy(() => import("./routes/hoc/InfiniteLoaderRoute")),
  "/scroll-sync": lazy(() => import("./routes/hoc/ScrollSyncRoute")),

  "/guides/customizing-styles": lazy(
    () => import("./routes/guides/CustomizingStylesRoute")
  ),
  "/guides/reverse-list": lazy(
    () => import("./routes/guides/ReverseListRoute")
  ),
  "/guides/sizing-components": lazy(
    () => import("./routes/guides/SizingComponentsRoute")
  ),
  "/guides/server-rendering": lazy(
    () => import("./routes/guides/ServerRenderingRoute")
  ),
  "/guides/infinite-loading-list": lazy(
    () => import("./routes/guides/InfiniteLoadingListRoute")
  ),
  "/guides/natural-sort-table": lazy(
    () => import("./routes/guides/NaturalSortTableRoute")
  ),
  "/guides/multi-column-sort-table": lazy(
    () => import("./routes/guides/MultiColumnSortTableRoute")
  )
} satisfies Record<string, Route>;

export type Routes = Record<keyof typeof routes, Route>;
export type Path = keyof Routes;
