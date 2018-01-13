import createMultiSort from './createMultiSort';

describe('createMultiSort', () => {
  function simulate(
    sort,
    dataKey,
    eventModifier = '',
    defaultSortDirection = 'ASC',
  ) {
    sort({
      defaultSortDirection,
      event: {
        ctrlKey: eventModifier === 'control',
        shiftKey: eventModifier === 'shift',
      },
      sortBy: dataKey,
    });
  }

  it('errors if the user did not specify a sort callback', () => {
    expect(createMultiSort).toThrow();
  });

  it('sets the correct default values', () => {
    const multiSort = createMultiSort(jest.fn(), {
      defaultSortBy: ['a', 'b'],
      defaultSortDirection: {
        a: 'ASC',
        b: 'DESC',
      },
    });
    expect(multiSort.sortBy).toEqual(['a', 'b']);
    expect(multiSort.sortDirection.a).toBe('ASC');
    expect(multiSort.sortDirection.b).toBe('DESC');
  });

  it('sets the correct default sparse values', () => {
    const multiSort = createMultiSort(jest.fn(), {
      defaultSortBy: ['a', 'b'],
    });
    expect(multiSort.sortBy).toEqual(['a', 'b']);
    expect(multiSort.sortDirection.a).toBe('ASC');
    expect(multiSort.sortDirection.b).toBe('ASC');
  });

  describe('on click', () => {
    it('sets the correct default value for a field', () => {
      const multiSort = createMultiSort(jest.fn());

      simulate(multiSort.sort, 'a');
      expect(multiSort.sortBy).toEqual(['a']);
      expect(multiSort.sortDirection.a).toBe('ASC');

      simulate(multiSort.sort, 'b', '', 'DESC');
      expect(multiSort.sortBy).toEqual(['b']);
      expect(multiSort.sortDirection.b).toBe('DESC');
    });

    it('toggles a field value', () => {
      const multiSort = createMultiSort(jest.fn());

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
  });

  describe('on shift click', () => {
    it('appends a field to the sort by list', () => {
      const multiSort = createMultiSort(jest.fn());

      simulate(multiSort.sort, 'a');
      expect(multiSort.sortBy).toEqual(['a']);
      expect(multiSort.sortDirection.a).toBe('ASC');

      simulate(multiSort.sort, 'b', 'shift');
      expect(multiSort.sortBy).toEqual(['a', 'b']);
      expect(multiSort.sortDirection.a).toBe('ASC');
      expect(multiSort.sortDirection.b).toBe('ASC');
    });

    it('toggles an appended field value', () => {
      const multiSort = createMultiSort(jest.fn());

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
    });
  });

  describe('control click', () => {
    it('removes a field from the sort by list', () => {
      const multiSort = createMultiSort(jest.fn(), {
        defaultSortBy: ['a', 'b'],
      });
      expect(multiSort.sortBy).toEqual(['a', 'b']);

      simulate(multiSort.sort, 'a', 'control');
      expect(multiSort.sortBy).toEqual(['b']);

      simulate(multiSort.sort, 'b', 'control');
      expect(multiSort.sortBy).toEqual([]);
    });

    it('ignores fields not in the list on control click', () => {
      const multiSort = createMultiSort(jest.fn(), {
        defaultSortBy: ['a', 'b'],
      });
      expect(multiSort.sortBy).toEqual(['a', 'b']);

      simulate(multiSort.sort, 'c', 'control');
      expect(multiSort.sortBy).toEqual(['a', 'b']);
    });
  });
});
