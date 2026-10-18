import type { ArrowKeyStepperProps } from "./types";

type DefaultedPropKeys =
  | "disabled"
  | "isControlled"
  | "mode"
  | "scrollToColumn"
  | "scrollToRow";

/**
 * Default values for `ArrowKeyStepper`'s optional props.
 */
export const defaultArrowKeyStepperProps: Readonly<
  Required<Pick<ArrowKeyStepperProps, DefaultedPropKeys>>
> = /* @__PURE__ */ Object.freeze({
  disabled: false,
  isControlled: false,
  mode: "edges",
  scrollToColumn: 0,
  scrollToRow: 0
});
