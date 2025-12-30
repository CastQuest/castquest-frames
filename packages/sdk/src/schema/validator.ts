import { Frame, Action } from "../types/frames";

/**
 * Schema validator for CastQuest frames and actions.
 * 
 * @category Schema
 */
export class FrameValidator {
  /**
   * Validates a frame schema against CastQuest specifications.
   * 
   * @param frame - The frame to validate
   * @returns True if valid, throws error otherwise
   * @throws {Error} If frame is invalid
   * 
   * @example
   * ```typescript
   * const validator = new FrameValidator();
   * const isValid = validator.validateFrame(myFrame);
   * ```
   */
  validateFrame(frame: Frame): boolean {
    if (!frame.id) {
      throw new Error("Frame missing required field: id");
    }
    if (!frame.version) {
      throw new Error("Frame missing required field: version");
    }
    if (!frame.author) {
      throw new Error("Frame missing required field: author");
    }
    if (!frame.actions || frame.actions.length === 0) {
      throw new Error("Frame must have at least one action");
    }
    
    // Validate each action
    frame.actions.forEach(action => this.validateAction(action));
    
    return true;
  }

  /**
   * Validates an action schema.
   * 
   * @param action - The action to validate
   * @returns True if valid, throws error otherwise
   * @throws {Error} If action is invalid
   */
  validateAction(action: Action): boolean {
    if (!action.id) {
      throw new Error("Action missing required field: id");
    }
    if (!action.kind) {
      throw new Error("Action missing required field: kind");
    }
    if (!action.target) {
      throw new Error("Action missing required field: target");
    }
    
    return true;
  }
}
