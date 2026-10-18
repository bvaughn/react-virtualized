import type { ListItem } from "../../../utils/data";

// <begin>

import { Column, Table } from "react-virtualized";
import styles from "./CustomizingStylesCssModules.module.css";

function Example({ items }: { items: ListItem[] }) {
  return (
    <Table
      className={styles.table}
      headerClassName={styles.headerColumn}
      headerHeight={30}
      height={300}
      rowClassName={styles.row}
      rowCount={items.length}
      rowGetter={({ index }) => items[index]}
      rowHeight={30}
      width={400}
    >
      <Column dataKey="name" label="Name" width={250} />
      <Column dataKey="color" label="Color" width={100} />
    </Table>
  );
}

// <end>

export { Example };
