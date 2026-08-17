import { type Request } from "express";

import { type NoParams } from "../../shared/types.js";

export interface GroupData {
  id: string;
  name: string;
}

export type GetUserRequst = Request<NoParams, GroupData[]>;
