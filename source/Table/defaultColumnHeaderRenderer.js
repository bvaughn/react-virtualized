/** @flow */

import type { ColumnHeaderRendererParams } from "./types";

import React from "react";

export default function defaultColumnHeaderRenderer({
  a11yProps,
  className,
  headerContent,
  key,
  style
}) {
  return (
    <div
      {...a11yProps}
      key={key}
      className={className} 
      style={style}
    >
      {headerContent}
    </div>
  );
}
