import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { GridRoute } from "./routes/GridRoute";
import { HomeRoute } from "./routes/Home";
import { ListRoute } from "./routes/ListRoute";
import { MasonryRoute } from "./routes/MasonryRoute";
import { TableRoute } from "./routes/TableRoute";

// Note that StrictMode is intentionally not used;
// it would double-invoke mount effects in development mode (linking and unlinking each scroll element twice).
createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomeRoute />} />
      <Route path="/scroll-element/grid" element={<GridRoute />} />
      <Route path="/scroll-element/list" element={<ListRoute />} />
      <Route path="/scroll-element/masonry" element={<MasonryRoute />} />
      <Route path="/scroll-element/table" element={<TableRoute />} />
    </Routes>
  </BrowserRouter>
);
