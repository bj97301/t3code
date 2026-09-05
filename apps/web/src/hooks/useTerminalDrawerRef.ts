import {
  parseScopedThreadKey,
  scopedProjectKey,
  scopeProjectRef,
} from "@t3tools/client-runtime/environment";
import { type ScopedThreadRef } from "@t3tools/contracts";
import { useMemo } from "react";

import { useComposerDraftStore } from "../composerDraftStore";
import { resolveTerminalDrawerRef } from "../lib/terminalDrawer";
import { useThreadShell } from "../state/entities";
import { selectPinnedTerminalThreadKey, useTerminalUiStateStore } from "../terminalUiStateStore";

/** Project the thread belongs to, from the shell index or a local draft. Null when the thread is unknown. */
export function useThreadProjectKey(threadRef: ScopedThreadRef | null): string | null {
  const shell = useThreadShell(threadRef);
  const draftProjectId = useComposerDraftStore((store) =>
    threadRef ? (store.getDraftThreadByRef(threadRef)?.projectId ?? null) : null,
  );
  const projectId = shell?.projectId ?? draftProjectId;
  return threadRef && projectId
    ? scopedProjectKey(scopeProjectRef(threadRef.environmentId, projectId))
    : null;
}

/**
 * Drawer ref `terminal.toggle` targets for `threadRef`: the project's pinned
 * drawer when one is pinned and its thread still exists in that project,
 * otherwise the thread's own. Stable while the inputs are.
 */
export function useTerminalDrawerRef(threadRef: ScopedThreadRef | null): ScopedThreadRef | null {
  const projectKey = useThreadProjectKey(threadRef);
  const pinnedThreadKey = useTerminalUiStateStore((state) =>
    selectPinnedTerminalThreadKey(state.pinnedTerminalThreadKeyByProjectKey, projectKey),
  );
  const pinnedThreadRef = useMemo(
    () => (pinnedThreadKey ? parseScopedThreadKey(pinnedThreadKey) : null),
    [pinnedThreadKey],
  );
  // A deleted thread, or one moved to another project, no longer anchors the pin.
  const pinnedProjectKey = useThreadProjectKey(pinnedThreadRef);
  const pinnedThreadValid = pinnedProjectKey !== null && pinnedProjectKey === projectKey;
  return useMemo(
    () =>
      resolveTerminalDrawerRef({
        threadRef,
        pinnedThreadRef: pinnedThreadValid ? pinnedThreadRef : null,
      }),
    [pinnedThreadRef, pinnedThreadValid, threadRef],
  );
}
