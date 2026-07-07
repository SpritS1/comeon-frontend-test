import "@testing-library/jest-dom/vitest";
import React from "react";
import { vi } from "vitest";

vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    fill: _fill,
    priority: _priority,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & {
    src?: string | { src: string };
    fill?: boolean;
    priority?: boolean;
  }) =>
    React.createElement("img", {
      ...props,
      src: typeof src === "string" ? src : src?.src,
      alt,
    }),
}));
