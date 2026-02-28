import "@testing-library/jest-dom/vitest";
import { beforeEach, vi } from "vitest";
import { resetStore } from "@/lib/store";

beforeEach(() => {
  window.localStorage.clear();
  resetStore();

  if (!URL.createObjectURL) {
    Object.defineProperty(URL, "createObjectURL", {
      writable: true,
      value: vi.fn(() => "blob:mock-download"),
    });
  } else {
    vi.spyOn(URL, "createObjectURL").mockImplementation(() => "blob:mock-download");
  }

  if (!URL.revokeObjectURL) {
    Object.defineProperty(URL, "revokeObjectURL", {
      writable: true,
      value: vi.fn(),
    });
  } else {
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => undefined);
  }
});
