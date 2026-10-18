import Immutable from "immutable";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { defaultCellDataGetter } from "./defaultCellDataGetter";
import { defaultCellRenderer } from "./defaultCellRenderer";
import { defaultHeaderRenderer } from "./defaultHeaderRenderer";
import type { TableCellProps } from "./types";

describe("Column", () => {
  const rowData = Immutable.Map({
    foo: "Foo",
    bar: 1
  });

  describe("defaultCellDataGetter", () => {
    it("should return a value for specified attributes", () => {
      expect(
        defaultCellDataGetter({
          dataKey: "foo",
          rowData
        })
      ).toEqual("Foo");
      expect(
        defaultCellDataGetter({
          dataKey: "bar",
          rowData
        })
      ).toEqual(1);
    });

    it("should return undefined for missing attributes", () => {
      expect(
        defaultCellDataGetter({
          dataKey: "baz",
          rowData
        })
      ).toEqual(undefined);
    });
  });

  describe("defaultCellRenderer", () => {
    it("should render a value for specified attributes", () => {
      expect(
        defaultCellRenderer({
          cellData: "Foo",
          dataKey: "foo",
          rowData,
          rowIndex: 0
        } as TableCellProps)
      ).toEqual("Foo");
      expect(
        defaultCellRenderer({
          cellData: 1,
          dataKey: "bar",
          rowData,
          rowIndex: 0
        } as TableCellProps)
      ).toEqual("1");
    });

    it("should render empty string for null or missing attributes", () => {
      expect(
        defaultCellRenderer({
          cellData: null,
          dataKey: "baz",
          rowData,
          rowIndex: 0
        } as TableCellProps)
      ).toEqual("");
      expect(
        defaultCellRenderer({
          cellData: undefined,
          dataKey: "baz",
          rowData,
          rowIndex: 0
        } as TableCellProps)
      ).toEqual("");
    });
  });

  describe("defaultHeaderRenderer", () => {
    it("should render a value for specified attributes", () => {
      expect(
        (
          defaultHeaderRenderer({
            dataKey: "foo",
            label: "squirrel"
          })[0].props as { children?: ReactNode }
        ).children
      ).toEqual("squirrel");

      const label = <div className="rabbit">Rabbit</div>;
      expect(
        (
          defaultHeaderRenderer({
            dataKey: "bar",
            label: label
          })[0].props as { children?: ReactNode }
        ).children
      ).toEqual(label);
    });

    it("should render empty string for null or missing attributes", () => {
      expect(
        (
          defaultHeaderRenderer({
            dataKey: "foo",
            label: null
          })[0].props as { children?: ReactNode }
        ).children
      ).toBeNull();
      expect(
        (
          defaultHeaderRenderer({
            dataKey: "bar",
            label: undefined
          })[0].props as { children?: ReactNode }
        ).children
      ).toBeUndefined();
    });
  });
});
