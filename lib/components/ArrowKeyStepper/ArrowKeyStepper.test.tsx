import { fireEvent } from "@testing-library/react";
import { act, StrictMode } from "react";
import { describe, expect, it, vi } from "vitest";
import { findDOMNode, render } from "../../utils/test/render";
import { ArrowKeyStepper } from "./ArrowKeyStepper";
import { defaultArrowKeyStepperProps } from "./defaultArrowKeyStepperProps";
import type {
  ArrowKeyStepperChild,
  ArrowKeyStepperChildProps,
  ArrowKeyStepperImperativeAPI,
  ArrowKeyStepperProps,
  ArrowKeyStepperRenderedSection
} from "./types";

function renderTextContent(scrollToColumn: number, scrollToRow: number) {
  return `scrollToColumn:${scrollToColumn}, scrollToRow:${scrollToRow}`;
}

function ChildComponent({
  scrollToColumn,
  scrollToRow
}: Pick<ArrowKeyStepperChildProps, "scrollToColumn" | "scrollToRow">) {
  return <div>{renderTextContent(scrollToColumn, scrollToRow)}</div>;
}

describe("ArrowKeyStepper", () => {
  function renderHelper(
    props: Partial<ArrowKeyStepperProps> & { node?: HTMLElement } = {}
  ) {
    let onSectionRenderedCallback:
      | ((params: ArrowKeyStepperRenderedSection) => void)
      | undefined;

    const component = render<ArrowKeyStepperImperativeAPI>(
      <ArrowKeyStepper columnCount={10} mode="edges" rowCount={10} {...props}>
        {({ onSectionRendered, scrollToColumn, scrollToRow }) => {
          onSectionRenderedCallback = onSectionRendered;

          return (
            <ChildComponent
              scrollToColumn={scrollToColumn}
              scrollToRow={scrollToRow}
            />
          );
        }}
      </ArrowKeyStepper>
    );
    const node = findDOMNode(component) as HTMLElement;

    return {
      component,
      node,
      onSectionRendered: onSectionRenderedCallback!
    };
  }

  function assertCurrentScrollTo(
    node: HTMLElement,
    scrollToColumn: number,
    scrollToRow: number
  ) {
    expect(node.textContent).toEqual(
      renderTextContent(scrollToColumn, scrollToRow)
    );
  }

  it("should use a custom :className if one is specified", () => {
    const { node } = renderHelper({ className: "foo" });
    expect(node.className).toEqual("foo");
  });

  it("should update :scrollToColumn and :scrollToRow in response to arrow keys", () => {
    const { node } = renderHelper();
    assertCurrentScrollTo(node, 0, 0);
    fireEvent.keyDown(node, { key: "ArrowDown" });
    assertCurrentScrollTo(node, 0, 1);
    fireEvent.keyDown(node, { key: "ArrowRight" });
    assertCurrentScrollTo(node, 1, 1);
    fireEvent.keyDown(node, { key: "ArrowUp" });
    assertCurrentScrollTo(node, 1, 0);
    fireEvent.keyDown(node, { key: "ArrowLeft" });
    assertCurrentScrollTo(node, 0, 0);
  });

  it("should not scroll past the row and column boundaries provided", () => {
    const { node } = renderHelper({
      columnCount: 2,
      rowCount: 2
    });
    fireEvent.keyDown(node, { key: "ArrowDown" });
    fireEvent.keyDown(node, { key: "ArrowDown" });
    fireEvent.keyDown(node, { key: "ArrowDown" });
    assertCurrentScrollTo(node, 0, 1);
    fireEvent.keyDown(node, { key: "ArrowUp" });
    fireEvent.keyDown(node, { key: "ArrowUp" });
    fireEvent.keyDown(node, { key: "ArrowUp" });
    assertCurrentScrollTo(node, 0, 0);
    fireEvent.keyDown(node, { key: "ArrowRight" });
    fireEvent.keyDown(node, { key: "ArrowRight" });
    fireEvent.keyDown(node, { key: "ArrowRight" });
    assertCurrentScrollTo(node, 1, 0);
    fireEvent.keyDown(node, { key: "ArrowLeft" });
    fireEvent.keyDown(node, { key: "ArrowLeft" });
    fireEvent.keyDown(node, { key: "ArrowLeft" });
    assertCurrentScrollTo(node, 0, 0);
  });

  it("should accept initial :scrollToColumn and :scrollToRow values via props", () => {
    const { node } = renderHelper({
      mode: "cells",
      scrollToColumn: 2,
      scrollToRow: 4
    });
    assertCurrentScrollTo(node, 2, 4);
    fireEvent.keyDown(node, { key: "ArrowDown" });
    assertCurrentScrollTo(node, 2, 5);
    fireEvent.keyDown(node, { key: "ArrowRight" });
    assertCurrentScrollTo(node, 3, 5);
  });

  it("should accept updated :scrollToColumn and :scrollToRow values via props", () => {
    const { node } = renderHelper({
      mode: "cells",
      scrollToColumn: 2,
      scrollToRow: 4
    });
    fireEvent.keyDown(node, { key: "ArrowDown" });
    assertCurrentScrollTo(node, 2, 5);
    renderHelper({
      mode: "cells",
      scrollToColumn: 1,
      scrollToRow: 1
    });
    fireEvent.keyDown(node, { key: "ArrowRight" });
    assertCurrentScrollTo(node, 2, 1);
    fireEvent.keyDown(node, { key: "ArrowDown" });
    assertCurrentScrollTo(node, 2, 2);
  });

  it("should accept updated :scrollToColumn and :scrollToRow values via setScrollIndexes()", () => {
    const { component, node } = renderHelper({
      mode: "cells",
      scrollToColumn: 2,
      scrollToRow: 4
    });
    fireEvent.keyDown(node, { key: "ArrowDown" });
    assertCurrentScrollTo(node, 2, 5);
    act(() => {
      component.setScrollIndexes({
        scrollToColumn: 1,
        scrollToRow: 1
      });
    });
    fireEvent.keyDown(node, { key: "ArrowRight" });
    assertCurrentScrollTo(node, 2, 1);
    fireEvent.keyDown(node, { key: "ArrowDown" });
    assertCurrentScrollTo(node, 2, 2);
  });

  it("should not update :scrollToColumn or :scrollToRow when :disabled", () => {
    const { node } = renderHelper({
      disabled: true
    });
    assertCurrentScrollTo(node, 0, 0);
    fireEvent.keyDown(node, { key: "ArrowDown" });
    assertCurrentScrollTo(node, 0, 0);
    fireEvent.keyDown(node, { key: "ArrowRight" });
    assertCurrentScrollTo(node, 0, 0);
  });

  it("should call :onScrollToChange for key down", () => {
    [true, false].forEach(() => {
      const onScrollToChange = vi.fn();
      const { node } = renderHelper({
        isControlled: true,
        onScrollToChange
      });

      expect(onScrollToChange.mock.calls).toHaveLength(0);

      fireEvent.keyDown(node, { key: "ArrowDown" });

      expect(onScrollToChange.mock.calls).toHaveLength(1);

      const { scrollToColumn, scrollToRow } = onScrollToChange.mock.calls[0][0];
      expect(scrollToColumn).toEqual(0);
      expect(scrollToRow).toEqual(1);
    });
  });

  it("should not call :onScrollToChange for prop update", () => {
    let numCalls = 0;
    const onScrollToChange = () => {
      numCalls++;
    };
    const { node } = renderHelper({
      onScrollToChange,
      scrollToColumn: 0,
      scrollToRow: 0
    });

    renderHelper({
      isControlled: true,
      onScrollToChange,
      node,
      scrollToColumn: 0,
      scrollToRow: 1
    });
    expect(numCalls).toEqual(0);
  });

  describe('mode === "edges"', () => {
    it("should update :scrollToColumn and :scrollToRow relative to the most recent :onSectionRendered event", () => {
      const { node, onSectionRendered } = renderHelper();
      act(() => {
        onSectionRendered({
          // Simulate a scroll
          columnStartIndex: 0,
          columnStopIndex: 4,
          rowStartIndex: 4,
          rowStopIndex: 6
        });
      });
      fireEvent.keyDown(node, { key: "ArrowDown" });
      assertCurrentScrollTo(node, 0, 7);

      act(() => {
        onSectionRendered({
          // Simulate a scroll
          columnStartIndex: 5,
          columnStopIndex: 10,
          rowStartIndex: 2,
          rowStopIndex: 4
        });
      });
      fireEvent.keyDown(node, { key: "ArrowUp" });
      assertCurrentScrollTo(node, 0, 1);

      act(() => {
        onSectionRendered({
          // Simulate a scroll
          columnStartIndex: 4,
          columnStopIndex: 8,
          rowStartIndex: 5,
          rowStopIndex: 10
        });
      });
      fireEvent.keyDown(node, { key: "ArrowRight" });
      assertCurrentScrollTo(node, 9, 1);

      act(() => {
        onSectionRendered({
          // Simulate a scroll
          columnStartIndex: 2,
          columnStopIndex: 4,
          rowStartIndex: 2,
          rowStopIndex: 4
        });
      });
      fireEvent.keyDown(node, { key: "ArrowLeft" });
      assertCurrentScrollTo(node, 1, 1);
    });
  });

  describe('mode === "cells"', () => {
    it("should update :scrollToColumn and :scrollToRow relative to the most recent :onSectionRendered event", () => {
      const { node, onSectionRendered } = renderHelper({
        mode: "cells",
        scrollToColumn: 5,
        scrollToRow: 5
      });

      act(() => {
        onSectionRendered({
          // Simulate a scroll
          columnStartIndex: 10,
          columnStopIndex: 10,
          rowStartIndex: 15,
          rowStopIndex: 15
        });
      });
      fireEvent.keyDown(node, { key: "ArrowUp" });
      assertCurrentScrollTo(node, 5, 4);
      fireEvent.keyDown(node, { key: "ArrowDown" });
      assertCurrentScrollTo(node, 5, 5);

      act(() => {
        onSectionRendered({
          // Simulate a scroll
          columnStartIndex: 10,
          columnStopIndex: 10,
          rowStartIndex: 15,
          rowStopIndex: 15
        });
      });
      fireEvent.keyDown(node, { key: "ArrowRight" });
      assertCurrentScrollTo(node, 6, 5);
      fireEvent.keyDown(node, { key: "ArrowLeft" });
      assertCurrentScrollTo(node, 5, 5);
    });
  });
  describe("registerChild", () => {
    function renderWithChild(
      props: Partial<ArrowKeyStepperProps> = {},
      child: ArrowKeyStepperChild = { scrollToCell: vi.fn() }
    ) {
      let registerChildCallback:
        | ArrowKeyStepperChildProps["registerChild"]
        | undefined;
      let onSectionRenderedCallback:
        | ((params: ArrowKeyStepperRenderedSection) => void)
        | undefined;

      const component = render<ArrowKeyStepperImperativeAPI>(
        <ArrowKeyStepper columnCount={10} mode="cells" rowCount={10} {...props}>
          {({
            onSectionRendered,
            registerChild,
            scrollToColumn,
            scrollToRow
          }) => {
            registerChildCallback = registerChild;
            onSectionRenderedCallback = onSectionRendered;

            return (
              <RegisteredChild
                child={child}
                registerChild={registerChild}
                scrollToColumn={scrollToColumn}
                scrollToRow={scrollToRow}
              />
            );
          }}
        </ArrowKeyStepper>
      );

      return {
        child,
        component,
        node: findDOMNode(component) as HTMLElement,
        onSectionRendered: onSectionRenderedCallback!,
        registerChild: registerChildCallback!
      };
    }

    function RegisteredChild({
      child,
      registerChild,
      scrollToColumn,
      scrollToRow
    }: Pick<
      ArrowKeyStepperChildProps,
      "registerChild" | "scrollToColumn" | "scrollToRow"
    > & { child: ArrowKeyStepperChild }) {
      return (
        <div
          ref={(element) => {
            registerChild(element ? child : null);
          }}
        >
          {renderTextContent(scrollToColumn, scrollToRow)}
        </div>
      );
    }

    it("should scroll the registered child to the initial active cell", () => {
      const { child } = renderWithChild({ scrollToColumn: 2, scrollToRow: 4 });
      expect(child.scrollToCell).toHaveBeenCalledTimes(1);
      expect(child.scrollToCell).toHaveBeenLastCalledWith({
        columnIndex: 2,
        rowIndex: 4
      });
    });

    it("should scroll the registered child when arrow keys change the active cell", () => {
      const { child, node } = renderWithChild();
      vi.mocked(child.scrollToCell).mockClear();

      fireEvent.keyDown(node, { key: "ArrowDown" });
      expect(child.scrollToCell).toHaveBeenCalledTimes(1);
      expect(child.scrollToCell).toHaveBeenLastCalledWith({
        columnIndex: 0,
        rowIndex: 1
      });

      fireEvent.keyDown(node, { key: "ArrowRight" });
      expect(child.scrollToCell).toHaveBeenCalledTimes(2);
      expect(child.scrollToCell).toHaveBeenLastCalledWith({
        columnIndex: 1,
        rowIndex: 1
      });

      // No change at the boundary, so no scroll
      fireEvent.keyDown(node, { key: "ArrowUp" });
      fireEvent.keyDown(node, { key: "ArrowUp" });
      expect(child.scrollToCell).toHaveBeenCalledTimes(3);
      expect(child.scrollToCell).toHaveBeenLastCalledWith({
        columnIndex: 1,
        rowIndex: 0
      });
    });

    it("should scroll the registered child in edges mode", () => {
      const { child, node, onSectionRendered } = renderWithChild({
        mode: "edges"
      });
      act(() => {
        onSectionRendered({
          columnStartIndex: 0,
          columnStopIndex: 4,
          rowStartIndex: 0,
          rowStopIndex: 5
        });
      });
      fireEvent.keyDown(node, { key: "ArrowDown" });
      expect(child.scrollToCell).toHaveBeenLastCalledWith({
        columnIndex: 0,
        rowIndex: 6
      });
    });

    it("should scroll the registered child when setScrollIndexes() is called", () => {
      const { child, component } = renderWithChild();
      act(() => {
        component.setScrollIndexes({ scrollToColumn: 3, scrollToRow: 7 });
      });
      expect(child.scrollToCell).toHaveBeenLastCalledWith({
        columnIndex: 3,
        rowIndex: 7
      });
    });

    it("should scroll the registered child when controlled props change", () => {
      const onScrollToChange = vi.fn();
      const { child, node } = renderWithChild({
        isControlled: true,
        onScrollToChange,
        scrollToColumn: 1,
        scrollToRow: 1
      });
      vi.mocked(child.scrollToCell).mockClear();

      // A controlled stepper only reports the change
      fireEvent.keyDown(node, { key: "ArrowDown" });
      expect(onScrollToChange).toHaveBeenLastCalledWith({
        scrollToColumn: 1,
        scrollToRow: 2
      });
      expect(child.scrollToCell).not.toHaveBeenCalled();
      assertCurrentScrollTo(node, 1, 1);

      renderWithChild(
        {
          isControlled: true,
          onScrollToChange,
          scrollToColumn: 1,
          scrollToRow: 2
        },
        child
      );
      expect(child.scrollToCell).toHaveBeenCalledTimes(1);
      expect(child.scrollToCell).toHaveBeenLastCalledWith({
        columnIndex: 1,
        rowIndex: 2
      });
      assertCurrentScrollTo(node, 1, 2);
    });

    it("should scroll a newly registered child to the active cell", () => {
      const { child, node } = renderWithChild();
      fireEvent.keyDown(node, { key: "ArrowDown" });
      fireEvent.keyDown(node, { key: "ArrowRight" });

      const nextChild: ArrowKeyStepperChild = { scrollToCell: vi.fn() };
      renderWithChild({}, nextChild);
      expect(nextChild.scrollToCell).toHaveBeenCalledTimes(1);
      expect(nextChild.scrollToCell).toHaveBeenLastCalledWith({
        columnIndex: 1,
        rowIndex: 1
      });
      expect(child.scrollToCell).toHaveBeenCalledTimes(3);
    });

    it("should not scroll a child after it has been unregistered", () => {
      const child: ArrowKeyStepperChild = { scrollToCell: vi.fn() };
      const { node } = renderWithChild({}, child);
      vi.mocked(child.scrollToCell).mockClear();

      // Unmounting the child calls registerChild(null)
      const component = render<ArrowKeyStepperImperativeAPI>(
        <ArrowKeyStepper columnCount={10} mode="cells" rowCount={10}>
          {({ scrollToColumn, scrollToRow }) => (
            <div>{renderTextContent(scrollToColumn, scrollToRow)}</div>
          )}
        </ArrowKeyStepper>
      );
      expect(findDOMNode(component)).toBe(node);

      fireEvent.keyDown(node, { key: "ArrowDown" });
      assertCurrentScrollTo(node, 0, 1);
      expect(child.scrollToCell).not.toHaveBeenCalled();
    });

    it("should pass a stable registerChild and onSectionRendered", () => {
      const first = renderWithChild();
      fireEvent.keyDown(first.node, { key: "ArrowDown" });
      const second = renderWithChild();
      expect(second.registerChild).toBe(first.registerChild);
      expect(second.onSectionRendered).toBe(first.onSectionRendered);
    });
  });

  it("should work in StrictMode", () => {
    const child: ArrowKeyStepperChild = { scrollToCell: vi.fn() };
    let component: ArrowKeyStepperImperativeAPI | null = null;

    render(
      <StrictMode>
        <ArrowKeyStepper
          columnCount={10}
          mode="cells"
          ref={(value) => {
            component = value;
          }}
          rowCount={10}
          scrollToColumn={2}
          scrollToRow={3}
        >
          {({ registerChild, scrollToColumn, scrollToRow }) => (
            <div
              ref={(element) => {
                registerChild(element ? child : null);
              }}
            >
              {renderTextContent(scrollToColumn, scrollToRow)}
            </div>
          )}
        </ArrowKeyStepper>
      </StrictMode>
    );

    const node = document.body.querySelector("div > div > div")!
      .parentElement as HTMLElement;
    assertCurrentScrollTo(node, 2, 3);
    expect(child.scrollToCell).toHaveBeenCalledTimes(1);
    expect(child.scrollToCell).toHaveBeenLastCalledWith({
      columnIndex: 2,
      rowIndex: 3
    });

    fireEvent.keyDown(node, { key: "ArrowDown" });
    assertCurrentScrollTo(node, 2, 4);
    expect(child.scrollToCell).toHaveBeenCalledTimes(2);
    expect(child.scrollToCell).toHaveBeenLastCalledWith({
      columnIndex: 2,
      rowIndex: 4
    });

    act(() => {
      component!.setScrollIndexes({ scrollToColumn: 5, scrollToRow: 5 });
    });
    assertCurrentScrollTo(node, 5, 5);
    fireEvent.keyDown(node, { key: "ArrowRight" });
    assertCurrentScrollTo(node, 6, 5);
  });

  it("should export its default prop values", () => {
    expect(defaultArrowKeyStepperProps).toEqual({
      disabled: false,
      isControlled: false,
      mode: "edges",
      scrollToColumn: 0,
      scrollToRow: 0
    });
    expect(Object.isFrozen(defaultArrowKeyStepperProps)).toBe(true);
  });
});
