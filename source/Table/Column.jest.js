import * as React from 'react';
import Immutable from 'immutable';
import defaultTableCellDataGetter from './defaultTableCellDataGetter';
import defaultTableCellRenderer from './defaultTableCellRenderer';
import defaultTableHeaderRenderer from './defaultTableHeaderRenderer';

describe('Column', () => {
  const rowData = Immutable.Map({
    foo: 'Foo',
    bar: 1,
  });

  describe('defaultTableCellDataGetter', () => {
    it('should return a value for specified attributes', () => {
      expect(
        defaultTableCellDataGetter({
          dataKey: 'foo',
          rowData,
        }),
      ).toEqual('Foo');
      expect(
        defaultTableCellDataGetter({
          dataKey: 'bar',
          rowData,
        }),
      ).toEqual(1);
    });

    it('should return undefined for missing attributes', () => {
      expect(
        defaultTableCellDataGetter({
          dataKey: 'baz',
          rowData,
        }),
      ).toEqual(undefined);
    });
  });

  describe('defaultTableCellRenderer', () => {
    it('should render a value for specified attributes', () => {
      expect(
        defaultTableCellRenderer({
          cellData: 'Foo',
          dataKey: 'foo',
          rowData,
          rowIndex: 0,
        }),
      ).toEqual('Foo');
      expect(
        defaultTableCellRenderer({
          cellData: 1,
          dataKey: 'bar',
          rowData,
          rowIndex: 0,
        }),
      ).toEqual('1');
    });

    it('should render empty string for null or missing attributes', () => {
      expect(
        defaultTableCellRenderer({
          cellData: null,
          dataKey: 'baz',
          rowData,
          rowIndex: 0,
        }),
      ).toEqual('');
      expect(
        defaultTableCellRenderer({
          cellData: undefined,
          dataKey: 'baz',
          rowData,
          rowIndex: 0,
        }),
      ).toEqual('');
    });
  });

  describe('defaultTableHeaderRenderer', () => {
    it('should render a value for specified attributes', () => {
      expect(
        defaultTableHeaderRenderer({
          dataKey: 'foo',
          label: 'squirrel',
        })[0].props.children,
      ).toEqual('squirrel');

      const label = <div className="rabbit">Rabbit</div>;
      expect(
        defaultTableHeaderRenderer({
          dataKey: 'bar',
          label: label,
        })[0].props.children,
      ).toEqual(label);
    });

    it('should render empty string for null or missing attributes', () => {
      expect(
        defaultTableHeaderRenderer({
          dataKey: 'foo',
          label: null,
        })[0].props.children,
      ).toBeNull();
      expect(
        defaultTableHeaderRenderer({
          dataKey: 'bar',
          label: undefined,
        })[0].props.children,
      ).toBeUndefined();
    });
  });
});
