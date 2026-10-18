import type { ComponentType, LazyExoticComponent } from "react";

export type Route = LazyExoticComponent<ComponentType<unknown>>;
