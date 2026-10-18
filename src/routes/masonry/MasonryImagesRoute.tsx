import { Box, Callout, ExternalLink, Header } from "react-lib-tools";
import { Link } from "../../components/Link";

export default function MasonryImagesRoute() {
  return (
    <Box direction="column" gap={4}>
      <Header section="Masonry" title="Images" />
      <div>
        Masonry layouts are often used to display images. Because{" "}
        <Link to="/masonry/measuring-and-layout">
          cell measurements must be synchronous
        </Link>
        , the size of each image must be known before its cell is rendered (eg
        by setting an explicit <code>height</code> and <code>width</code> on the{" "}
        <code>&lt;img&gt;</code>, using dimensions provided by the server).
        Otherwise the cell would be measured before the image loads, and the
        measurement would be wrong.
      </div>
      <div>
        In the <Link to="/masonry">basic example</Link>, colored blocks with a
        known height stand in for images; an image with known dimensions works
        the same way. Scale the height to the column width to preserve the
        image&apos;s aspect ratio, eg{" "}
        <code>columnWidth * (imageHeight / imageWidth)</code>.
      </div>
      <Callout intent="warning">
        Items can only be measured once; measurements are cached permanently
        (until the cache is cleared).
      </Callout>
      <div>
        If image sizes aren&apos;t known up front (eg the server can&apos;t
        provide them), they need to be pre-measured before they are passed to{" "}
        <code>Masonry</code>. To preserve a correct layout, images can only be
        displayed one by one in the order they appear in the list (not in the
        order they finish loading). The{" "}
        <ExternalLink href="https://github.com/kirill-konshin/react-virtualized-image-measurer">
          react-virtualized-image-measurer
        </ExternalLink>{" "}
        library handles this; it loads the images, then passes each item along
        with its size to a render function that renders the <code>Masonry</code>{" "}
        (
        <ExternalLink href="https://codesandbox.io/s/7y66p25qv6">
          live demo
        </ExternalLink>
        ).
      </div>
    </Box>
  );
}
