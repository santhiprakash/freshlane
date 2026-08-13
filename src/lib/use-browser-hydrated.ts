"use client";

import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

export function useBrowserHydrated() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
