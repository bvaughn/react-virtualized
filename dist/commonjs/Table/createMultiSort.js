'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports['default'] = createMultiSort;

/*:: type SortDirection = 'ASC' | 'DESC';*/

/*:: type SortParams = {
  defaultSortDirection: SortDirection,
  event: MouseEvent,
  sortBy: string,
};*/

/*:: type SortDirectionMap = {[string]: SortDirection};*/

/*:: type MultiSortOptions = {
  defaultSortBy: ?Array<string>,
  defaultSortDirection: ?SortDirectionMap,
};*/

/*:: type MultiSortReturn = {
  /**
   * Sort property to be passed to the `Table` component.
   * This function updates `sortBy` and `sortDirection` values.
   *-/
  sort: (params: SortParams) => void,

  /**
   * Specifies the fields currently responsible for sorting data,
   * In order of importance.
   *-/
  sortBy: Array<string>,

  /**
   * Specifies the direction a specific field is being sorted in.
   *-/
  sortDirection: SortDirectionMap,
};*/
function createMultiSort(
  sortCallback,
  /*: Function*/
) {
  /*: MultiSortReturn*/
  var _ref =
      arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    defaultSortBy = _ref.defaultSortBy,
    _ref$defaultSortDirec = _ref.defaultSortDirection,
    defaultSortDirection =
      _ref$defaultSortDirec === void 0 ? {} : _ref$defaultSortDirec;

  if (!sortCallback) {
    throw Error('Required parameter "sortCallback" not specified');
  }

  var sortBy = defaultSortBy || [];
  var sortDirection = {};
  sortBy.forEach(function(dataKey) {
    sortDirection[dataKey] =
      defaultSortDirection[dataKey] !== undefined
        ? defaultSortDirection[dataKey]
        : 'ASC';
  });

  function sort(_ref2) {
    /*: void*/
    var defaultSortDirection = _ref2.defaultSortDirection,
      event = _ref2.event,
      dataKey = _ref2.sortBy;

    if (event.shiftKey) {
      // Shift + click appends a column to existing criteria
      if (sortDirection[dataKey] !== undefined) {
        sortDirection[dataKey] =
          sortDirection[dataKey] === 'ASC' ? 'DESC' : 'ASC';
      } else {
        sortDirection[dataKey] = defaultSortDirection;
        sortBy.push(dataKey);
      }
    } else if (event.ctrlKey || event.metaKey) {
      // Control + click removes column from sort (if pressent)
      var index = sortBy.indexOf(dataKey);

      if (index >= 0) {
        sortBy.splice(index, 1);
        delete sortDirection[dataKey];
      }
    } else {
      // Clear sortBy array of all non-selected keys
      sortBy.length = 0;
      sortBy.push(dataKey); // Clear sortDirection object of all non-selected keys

      var sortDirectionKeys = Object.keys(sortDirection);
      sortDirectionKeys.forEach(function(key) {
        if (key !== dataKey) delete sortDirection[key];
      }); // If key is already selected, reverse sort direction.
      // Else, set sort direction to default direction.

      if (sortDirection[dataKey] !== undefined) {
        sortDirection[dataKey] =
          sortDirection[dataKey] === 'ASC' ? 'DESC' : 'ASC';
      } else {
        sortDirection[dataKey] = defaultSortDirection;
      }
    } // Notify application code

    sortCallback({
      sortBy: sortBy,
      sortDirection: sortDirection,
    });
  }

  return {
    sort: sort,
    sortBy: sortBy,
    sortDirection: sortDirection,
  };
}
