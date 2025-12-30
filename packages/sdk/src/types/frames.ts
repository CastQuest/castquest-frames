export type FrameType = "mint" | "collect" | "game" | "tool" | "custom";

export interface FrameAuthor {
  address: string;
  handle: string;
}

export interface FrameUI {
  layout: string;
  components: any[];
  themeRef: string;
}

export interface FramePermissions {
  read: string[];
  write: string[];
  sign: string[];
  onchain: string[];
}

export interface Guard {
  type: "balance" | "hasCollected" | "role" | "risk";
  value: any;
}

export interface Effect {
  type: "emitEvent" | "enqueueJob" | "notify" | "redirect" | "updateState";
  payload: any;
}

export interface ActionTarget {
  contractAddress?: string;
  selector?: string;
  url?: string;
}

export interface Action {
  id: string;
  label: string;
  kind: "transaction" | "mutation" | "navigation" | "webhook";
  target: ActionTarget;
  params: any;
  requiresSignature: boolean;
  guards: Guard[];
  effects: Effect[];
}

export interface Frame {
  id: string;
  version: string;
  author: FrameAuthor;
  type: FrameType;
  ui: FrameUI;
  actions: Action[];
  dataSchema: any;
  permissions: FramePermissions;
}
