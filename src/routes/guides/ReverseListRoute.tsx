import { useState } from "react";
import { Block, Box, Checkbox, Code, Header } from "react-lib-tools";
import ReverseListJson from "../../../public/generated/examples/ReverseList.json";
import { Link } from "../../components/Link";
import { ReverseList } from "./examples/ReverseList";

export default function ReverseListRoute() {
  const [paused, setPaused] = useState(false);

  return (
    <Box direction="column" gap={4}>
      <Header section="Guides" title="Displaying items in reverse order" />
      <div>
        Sometimes it is desirable to display a list in reverse order, with the
        newest items at the top (like a feed of incoming messages). The simplest
        way to do this is to add new items to the front of the array (like{" "}
        <code>unshift</code>) instead of the end (like <code>push</code>
        ). The <Link to="/list">List</Link> below has a new item added to it
        every half second:
      </div>
      <Checkbox checked={paused} onChange={setPaused}>
        Pause new items
      </Checkbox>
      <Block className="h-72">
        <ReverseList paused={paused} />
      </Block>
      <div>
        Here is a template for doing this. It also shows how to scroll back to
        the top of the list (using the{" "}
        <Link to="/list/methods#scrollToRow">
          <code>scrollToRow</code>
        </Link>{" "}
        method) when new items are added:
      </div>
      <Code html={ReverseListJson.html} />
    </Box>
  );
}
