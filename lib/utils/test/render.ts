import {
  act,
  cloneElement,
  type ReactElement,
  type Ref,
  type RefCallback
} from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach } from "vitest";

let mountNode: HTMLDivElement | null = null;
let root: Root | null = null;
let lastRendered: unknown = null;

// The ref attached to the rendered element is kept stable across render() calls (as long as the element's own ref doesn't change),
// so that re-rendering the same markup doesn't defeat memo() (which re-renders a component whenever its ref changes).
let stableRef: RefCallback<unknown> | null = null;
let stableRefOriginal: Ref<unknown> | undefined = undefined;
let currentInstance: unknown = null;

/**
 * Returns the node that `render()` renders into (creating it, if it doesn't exist yet).
 * By default, it is appended to the body; tests may move it elsewhere (e.g. into a scroll container, see scrollElement.ts).
 */
export function getMountNode(): HTMLDivElement {
  if (!mountNode) {
    mountNode = document.createElement("div");

    // Unless we attach the mount-node to body, getBoundingClientRect() won't work
    document.body.appendChild(mountNode);

    root = createRoot(mountNode);
  }
  return mountNode;
}

/**
 * Helper method for testing components that may use Portal and thus require cleanup.
 * This helper method renders components to a transient node that is destroyed after the test completes.
 * Note that rendering twice within the same test method will update the same element (rather than recreate it).
 *
 * Rendering is wrapped in `act()` so that it is applied synchronously.
 * Like the legacy `ReactDOM.render()` API, the rendered class component instance is returned
 * (or `null` for function components).
 *
 * Note that updates triggered outside of React (e.g. calling an instance method or dispatching a DOM event)
 * must also be wrapped in `act()` for them to be applied synchronously.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function render<Instance = any>(markup: ReactElement): Instance {
  getMountNode();

  const originalRef = (markup.props as { ref?: Ref<unknown> }).ref;
  if (stableRef === null || originalRef !== stableRefOriginal) {
    stableRefOriginal = originalRef;
    stableRef = (value: unknown) => {
      currentInstance = value;

      if (typeof originalRef === "function") {
        return originalRef(value);
      } else if (originalRef) {
        (originalRef as { current: unknown }).current = value;
      }
    };
  }
  const ref = stableRef;

  act(() => {
    root!.render(cloneElement(markup, { ref } as object));
  });

  lastRendered = currentInstance;

  return currentInstance as Instance;
}

/**
 * The render() method auto-unmounts components after each test has completed.
 * Use this method manually to test the componentWillUnmount() lifecycle method.
 */
render.unmount = function unmount() {
  if (mountNode) {
    act(() => {
      root!.unmount();
    });

    // (The mount node may have been moved, e.g. into a scroll container)
    mountNode.remove();

    mountNode = null;
    root = null;
    lastRendered = null;
    stableRef = null;
    stableRefOriginal = undefined;
    currentInstance = null;
  }
};

afterEach(render.unmount);

type Fiber = {
  child: Fiber | null;
  sibling: Fiber | null;
  stateNode: unknown;
};

/**
 * Test-only replacement for `ReactDOM.findDOMNode()`, which was removed in React 19.
 * Returns the first DOM node rendered by a class component instance (or the node itself, if passed a node).
 * Also accepts the value returned by the most recent `render()` call (e.g. the imperative handle of a function component),
 * in which case the first DOM node rendered into the test container is returned.
 */
export function findDOMNode(instance: unknown): HTMLElement | Text | null {
  if (instance == null) {
    return null;
  } else if (instance instanceof Node) {
    return instance as HTMLElement | Text;
  }

  const fiber = (instance as { _reactInternals?: Fiber })._reactInternals;
  if (!fiber && instance === lastRendered && mountNode) {
    return mountNode.firstChild as HTMLElement | Text | null;
  }
  if (!fiber) {
    throw Error(
      "findDOMNode() expects a mounted class component instance or the value returned by the most recent render() call"
    );
  }

  // Depth-first search for the first host (DOM) node
  const stack: Fiber[] = fiber.child ? [fiber.child] : [];
  while (stack.length > 0) {
    const current = stack.pop()!;
    if (current.stateNode instanceof Node) {
      return current.stateNode as HTMLElement | Text;
    }
    if (current.sibling) {
      stack.push(current.sibling);
    }
    if (current.child) {
      stack.push(current.child);
    }
  }

  return null;
}
