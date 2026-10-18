import type { HTMLAttributes } from "react";
import { Link as ExternalLink } from "react-lib-tools";
import type { Path } from "../routes";

export function Link({
  to,
  ...rest
}: HTMLAttributes<HTMLSpanElement> & {
  /** Path of the page to link to, optionally with a hash (e.g. "/grid/methods#scrollToCell") */
  to: Path | `${Path}#${string}`;
}) {
  return <ExternalLink to={to} {...rest} />;
}
