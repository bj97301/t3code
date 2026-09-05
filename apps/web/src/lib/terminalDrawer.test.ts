import { scopeThreadRef } from "@t3tools/client-runtime/environment";
import { EnvironmentId, ThreadId } from "@t3tools/contracts";
import { describe, expect, it } from "vite-plus/test";

import { resolveTerminalDrawerRef } from "./terminalDrawer";

const ENVIRONMENT_A = EnvironmentId.make("environment-a");
const THREAD_A1 = scopeThreadRef(ENVIRONMENT_A, ThreadId.make("thread-1"));
const THREAD_A2 = scopeThreadRef(ENVIRONMENT_A, ThreadId.make("thread-2"));
const THREAD_B1 = scopeThreadRef(EnvironmentId.make("environment-b"), ThreadId.make("thread-1"));

describe("resolveTerminalDrawerRef", () => {
  it("uses the thread's own drawer when nothing is pinned", () => {
    expect(resolveTerminalDrawerRef({ threadRef: THREAD_A1, pinnedThreadRef: null })).toBe(
      THREAD_A1,
    );
    expect(resolveTerminalDrawerRef({ threadRef: null, pinnedThreadRef: THREAD_A1 })).toBeNull();
  });

  it("points every thread at the pinned drawer", () => {
    expect(resolveTerminalDrawerRef({ threadRef: THREAD_A2, pinnedThreadRef: THREAD_A1 })).toBe(
      THREAD_A1,
    );
    expect(resolveTerminalDrawerRef({ threadRef: THREAD_A1, pinnedThreadRef: THREAD_A1 })).toBe(
      THREAD_A1,
    );
  });

  it("ignores a pin from another environment", () => {
    expect(resolveTerminalDrawerRef({ threadRef: THREAD_B1, pinnedThreadRef: THREAD_A1 })).toBe(
      THREAD_B1,
    );
  });
});
