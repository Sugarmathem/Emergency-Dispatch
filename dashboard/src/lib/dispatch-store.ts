"use client";

import { create } from "zustand";

export interface Operator {
  name: string;
  callsign: string;
  id: string;
  position: string;
}

interface DispatchState {
  operator: Operator;
  /** Currently focused call for the dispatch board. Set via ⌘K palette or board. */
  activeCallId: string | null;
  setActiveCall: (id: string | null) => void;
}

/**
 * Local UI-only store. Mock operator identity until Better Auth session
 * data is mapped into `operator`.
 */
export const useDispatchStore = create<DispatchState>((set) => ({
  operator: { name: "R. HALE", callsign: "DISPATCH-1", id: "OP-114", position: "PRIMARY" },
  activeCallId: null,
  setActiveCall: (id) => set({ activeCallId: id }),
}));
