import z from "zod";

import type { UUID } from "../types/shared.js";

export const UUIDSchema = z.uuid().transform((value): UUID => value as UUID);
