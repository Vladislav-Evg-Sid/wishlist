import type { UUID } from "./shared.ts";

declare global {
  namespace Express {
    interface Request {
      userId?: UUID;
    }
  }
}

export {};
