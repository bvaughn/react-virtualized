import createMultiSort from './createMultiSort';
describe('createMultiSort', function () {
  function simulate(sort, dataKey) {
    var eventModifier = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    var defaultSortDirection = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'ASC';
    sort({
      defaultSortDirection: defaultSortDirection,
      event: {
        ctrlKey: eventModifier === 'control',
        metaKey: eventModifier === 'meta',
        shiftKey: eventModifier === 'shift'
      },
      sortBy: dataKey
    });
  }

  it('errors if the user did not specify a sort callback', function () {
    expect(createMultiSort).toThrow();
  });
  it('sets the correct default values', function () {
    var multiSort = createMultiSort(jest.fn(), {
      defaultSortBy: ['a', 'b'],
      defaultSortDirection: {
        a: 'ASC',
        b: 'DESC'
      }
    });
    expect(multiSort.sortBy).toEqual(['a', 'b']);
    expect(multiSort.sortDirection.a).toBe('ASC');
    expect(multiSort.sortDirection.b).toBe('DESC');
  });
  it('sets the correct default sparse values', function () {
    var multiSort = createMultiSort(jest.fn(), {
      defaultSortBy: ['a', 'b']
    });
    expect(multiSort.sortBy).toEqual(['a', 'b']);
    expect(multiSort.sortDirection.a).toBe('ASC');
    expect(multiSort.sortDirection.b).toBe('ASC');
  });
  describe('on click', function () {
    it('sets the correct default value for a field', function () {
      var multiSort = createMultiSort(jest.fn());
      simulate(multiSort.sort, 'a');
      expect(multiSort.sortBy).toEqual(['a']);
      expect(multiSort.sortDirection.a).toBe('ASC');
      simulate(multiSort.sort, 'b', '', 'DESC');
      expect(multiSort.sortBy).toEqual(['b']);
      expect(multiSort.sortDirection.b).toBe('DESC');
    });
    it('toggles a field value', function () {
      var multiSort = createMultiSort(jest.fn());
      simulate(multiSort.sort, 'a');
      expect(multiSort.sortBy).toEqual(['a']);
      expect(multiSort.sortDirection.a).toBe('ASC');
      simulate(multiSort.sort, 'a');
      expect(multiSort.sortBy).toEqual(['a']);
      expect(multiSort.sortDirection.a).toBe('DESC');
      simulate(multiSort.sort, 'b', '', 'DESC');
      expect(multiSort.sortBy).toEqual(['b']);
      expect(multiSort.sortDirection.b).toBe('DESC');
      simulate(multiSort.sort, 'b', '', 'DESC');
      expect(multiSort.sortBy).toEqual(['b']);
      expect(multiSort.sortDirection.b).toBe('ASC');
    });
    it('resets sort-by fields', function () {
      var multiSort = createMultiSort(jest.fn(), {
        defaultSortBy: ['a', 'b']
      });
      expect(multiSort.sortBy).toEqual(['a', 'b']);
      simulate(multiSort.sort, 'a');
      expect(multiSort.sortBy).toEqual(['a']);
    });
    it('resets sort-direction fields', function () {
      var multiSort = createMultiSort(jest.fn(), {
        defaultSortBy: ['a', 'b'],
        defaultSortDirection: {
          a: 'DESC',
          b: 'ASC'
        }
      });
      expect(multiSort.sortBy).toEqual(['a', 'b']);
      expect(multiSort.sortDirection.a).toEqual('DESC');
      expect(multiSort.sortDirection.b).toEqual('ASC');
      simulate(multiSort.sort, 'a');
      expect(multiSort.sortBy).toEqual(['a']);
      expect(multiSort.sortDirection.a).toEqual('ASC');
      expect(multiSort.sortDirection.b).toEqual(undefined);
      simulate(multiSort.sort, 'b');
      expect(multiSort.sortBy).toEqual(['b']);
      expect(multiSort.sortDirection.a).toEqual(undefined);
      expect(multiSort.sortDirection.b).toEqual('ASC');
    });
  });
  describe('on shift click', function () {
    it('appends a field to the sort by list', function () {
      var multiSort = createMultiSort(jest.fn());
      simulate(multiSort.sort, 'a');
      expect(multiSort.sortBy).toEqual(['a']);
      expect(multiSort.sortDirection.a).toBe('ASC');
      simulate(multiSort.sort, 'b', 'shift');
      expect(multiSort.sortBy).toEqual(['a', 'b']);
      expect(multiSort.sortDirection.a).toBe('ASC');
      expect(multiSort.sortDirection.b).toBe('ASC');
    });
    it('toggles an appended field value', function () {
      var multiSort = createMultiSort(jest.fn());
      simulate(multiSort.sort, 'a');
      expect(multiSort.sortBy).toEqual(['a']);
      expect(multiSort.sortDirection.a).toBe('ASC');
      simulate(multiSort.sort, 'b', 'shift');
      expect(multiSort.sortBy).toEqual(['a', 'b']);
      expect(multiSort.sortDirection.a).toBe('ASC');
      expect(multiSort.sortDirection.b).toBe('ASC');
      simulate(multiSort.sort, 'a', 'shift');
      expect(multiSort.sortBy).toEqual(['a', 'b']);
      expect(multiSort.sortDirection.a).toBe('DESC');
      expect(multiSort.sortDirection.b).toBe('ASC');
      simulate(multiSort.sort, 'a', 'shift');
      expect(multiSort.sortBy).toEqual(['a', 'b']);
      expect(multiSort.sortDirection.a).toBe('ASC');
      expect(multiSort.sortDirection.b).toBe('ASC');
    });
    it('able to shift+click more than once', function () {
      var multiSort = createMultiSort(jest.fn());
      simulate(multiSort.sort, 'a');
      expect(multiSort.sortBy).toEqual(['a']);
      expect(multiSort.sortDirection.a).toBe('ASC');
      simulate(multiSort.sort, 'b', 'shift');
      expect(multiSort.sortBy).toEqual(['a', 'b']);
      expect(multiSort.sortDirection.a).toBe('ASC');
      expect(multiSort.sortDirection.b).toBe('ASC');
      simulate(multiSort.sort, 'b');
      expect(multiSort.sortBy).toEqual(['b']);
      expect(multiSort.sortDirection.b).toBe('DESC');
      simulate(multiSort.sort, 'a', 'shift');
      expect(multiSort.sortBy).toEqual(['b', 'a']);
      expect(multiSort.sortDirection.a).toBe('ASC');
      expect(multiSort.sortDirection.b).toBe('DESC');
    });
  });
  ['control', 'meta'].forEach(function (modifier) {
    describe("".concat(modifier, " click"), function () {
      it('removes a field from the sort by list', function () {
        var multiSort = createMultiSort(jest.fn(), {
          defaultSortBy: ['a', 'b']
        });
        expect(multiSort.sortBy).toEqual(['a', 'b']);
        simulate(multiSort.sort, 'a', modifier);
        expect(multiSort.sortBy).toEqual(['b']);
        simulate(multiSort.sort, 'b', modifier);
        expect(multiSort.sortBy).toEqual([]);
      });
      it('ignores fields not in the list on control click', function () {
        var multiSort = createMultiSort(jest.fn(), {
          defaultSortBy: ['a', 'b']
        });
        expect(multiSort.sortBy).toEqual(['a', 'b']);
        simulate(multiSort.sort, 'c', modifier);
        expect(multiSort.sortBy).toEqual(['a', 'b']);
      });
    });
  });
});