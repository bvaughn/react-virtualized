The `overscanRowCount` property renders additional rows in the direction the user is scrolling to reduce the chance of a user scrolling faster than virtualized content can be rendered. (See [here](https://bvaughn.github.io/forward-js-2017/#/23/1) for a visual example of why this property exists).

This property has performance implications though: the higher the value, the more work react-virtualized needs to do in reaction to each scroll event. (See [here](https://bvaughn.github.io/forward-js-2017/#/12/4) for a visual example of how windowing works.)

I suggest using the default value (10) as a starting point and lowering it if possible. Setting the value too high will erase the performance gains achieved by using react-virtualized. You should aim to use the lowest value as possible that still generally avoids any empty space from appearing during normal scrolling actions.

Note that the same advice applies to the `overscanColumnCount` as well.
