import Section from './Section';

describe('Section', () => {
  function helper({height = 100, width = 200, x = 0, y = 0} = {}) {
    return new Section({
      height,
      width,
      x,
      y,
    });
  }

  it('should add a new cell index', () => {
    const section = helper();
    expect(section.getCellIndices()).toEqual([]);
    section.addCellIndex({index: 0});
    expect(section.getCellIndices()).toEqual([0]);
    section.addCellIndex({index: 1});
    expect(section.getCellIndices()).toEqual([0, 1]);
  });

  it('should not add a duplicate cell index', () => {
    const section = helper();
    section.addCellIndex({index: 0});
    section.addCellIndex({index: 1});
    section.addCellIndex({index: 0});
    section.addCellIndex({index: 1});
    section.addCellIndex({index: 2});
    expect(section.getCellIndices()).toEqual([0, 1, 2]);
  });

  it('should define a working toString() method for debugging', () => {
    const section = helper({
      height: 100,
      width: 200,
      x: 25,
      y: 50,
    });

    expect(section.toString()).toEqual('25,50 200x100');
  });
});
