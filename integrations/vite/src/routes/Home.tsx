import { Link } from "react-router";

export function HomeRoute() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <Link to="/scroll-element/list?scrollElement=window">
        List: scrolled by the window
      </Link>
      <Link to="/scroll-element/list?scrollElement=container">
        List: scrolled by a container
      </Link>
      <Link to="/scroll-element/list?scrollElement=deferred">
        List: scrollElement initially null (call window.linkScrollElement())
      </Link>
      <Link to="/scroll-element/list?scrollElement=window&headerHeight=400&overscan=0">
        List: header resize (call window.setHeaderHeight(height))
      </Link>
      <Link to="/scroll-element/grid?scrollElement=container">
        Grid: scrolled by a container
      </Link>
      <Link to="/scroll-element/table">Table: scrolled by the window</Link>
      <Link to="/scroll-element/masonry">Masonry: scrolled by the window</Link>
    </div>
  );
}
