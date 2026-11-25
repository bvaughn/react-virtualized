import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Tell React that tests wrap updates in act()
// https://react.dev/reference/react/act
(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock("./lib/utils/getScrollbarSize", () => ({
  getScrollbarSize: function getScrollbarSize() {
    return 20;
  }
}));
