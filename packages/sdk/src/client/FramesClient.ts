import { Frame, Action } from "../types/frames";

export class FramesClient {
  constructor(private opts: { chainId: number }) {}

  validateFrame(frame: Frame) {
    if (!frame.id) throw new Error("Frame missing id");
    if (!frame.actions?.length) throw new Error("Frame missing actions");
    return true;
  }

  validateAction(action: Action) {
    if (!action.id) throw new Error("Action missing id");
    if (!action.kind) throw new Error("Action missing kind");
    return true;
  }

  simulateAction(frame: Frame, action: Action, params: any) {
    this.validateFrame(frame);
    this.validateAction(action);
    return { frameId: frame.id, actionId: action.id, params, simulated: true };
  }

  buildTransactionRequest(action: Action, params: any) {
    if (action.kind !== "transaction") throw new Error("Not a transaction action");
    return {
      to: action.target.contractAddress,
      data: this.encodeCall(action.target.selector || "", params),
      chainId: this.opts.chainId
    };
  }

  encodeCall(selector: string, params: any) {
    return selector + JSON.stringify(params);
  }
}
