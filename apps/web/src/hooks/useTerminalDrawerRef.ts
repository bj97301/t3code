import {
  parseScopedThreadKey,
  scopedProjectKey,
  scopeProjectRef,
} from "@t3tools/client-runtime/environment";
import { type ScopedThreadRef } from "@t3tools/contracts";
import { useMemo } from "react";

import { useComposerDraftStore } from "../composerDraftStore";
import {
  environmentTerminalPinKey,
  projectTerminalPinKey,
  resolveTerminalDrawer,
  type TerminalDrawerPinState,
} from "../lib/terminalDrawer";
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

function usePinnedThreadRef(pinKey: string | null): ScopedThreadRef | null {
  const pinnedThreadKey = useTerminalUiStateStore((state) =>
    selectPinnedTerminalThreadKey(state.pinnedTerminalThreadKeyByPinKey, pinKey),
  );
  return useMemo(
    () => (pinnedThreadKey ? parseScopedThreadKey(pinnedThreadKey) : null),
    [pinnedThreadKey],
  );
}

/**
 * Drawer `terminal.toggle` targets for `threadRef`, and which pin put it
 * there. Pins to threads that no longer exist, or that moved to another
 * project, are ignored. Stable while the inputs are.
 */
export function useTerminalDrawerPin(threadRef: ScopedThreadRef | null): {
  drawerRef: ScopedThreadRef | null;
  pinState: TerminalDrawerPinState;
} {
  const projectKey = useThreadProjectKey(threadRef);
  const projectPinnedRef = usePinnedThreadRef(
    projectKey === null ? null : projectTerminalPinKey(projectKey),
  );
  const environmentPinnedRef = usePinnedThreadRef(
    threadRef === null ? null : environmentTerminalPinKey(threadRef.environmentId),
  );
  // A null project key means the pinned thread is gone.
  const projectPinnedProjectKey = useThreadProjectKey(projectPinnedRef);
  const environmentPinnedProjectKey = useThreadProjectKey(environmentPinnedRef);
  const projectPinValid =
    projectPinnedProjectKey !== null && projectPinnedProjectKey === projectKey;
  const environmentPinValid = environmentPinnedProjectKey !== null;
  return useMemo(
    () =>
      resolveTerminalDrawer({
        threadRef,
        projectPinnedThreadRef: projectPinValid ? projectPinnedRef : null,
        environmentPinnedThreadRef: environmentPinValid ? environmentPinnedRef : null,
      }),
    [environmentPinValid, environmentPinnedRef, projectPinValid, projectPinnedRef, threadRef],
  );
}

export function useTerminalDrawerRef(threadRef: ScopedThreadRef | null): ScopedThreadRef | null {
  return useTerminalDrawerPin(threadRef).drawerRef;
}
