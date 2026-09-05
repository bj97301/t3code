import { type ScopedThreadRef } from "@t3tools/contracts";

/**
 * Thread ref whose drawer layout and shells `terminal.toggle` shows while
 * `threadRef` is active. A project can pin one thread's drawer; every thread
 * in that project then opens it instead of its own. Right-panel terminals
 * ignore the pin and stay on the thread.
 */
export function resolveTerminalDrawerRef(input: {
  threadRef: ScopedThreadRef | null;
  /** The project's pinned drawer thread, already checked to still exist. */
  pinnedThreadRef: ScopedThreadRef | null;
}): ScopedThreadRef | null {
  if (input.threadRef === null) {
    return null;
  }
  if (
    input.pinnedThreadRef === null ||
    input.pinnedThreadRef.environmentId !== input.threadRef.environmentId
  ) {
    return input.threadRef;
  }
  return input.pinnedThreadRef;
}
