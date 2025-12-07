// apps/api/features/_shared/api/create-api-handler.ts

import type { NextRequest } from "next/server";
import { handleApiError } from "./handle-api-error";

type Handler<Params = Record<string, string>> = (
  req: NextRequest,
  ctx: { params: Params },
) => Promise<Response>;

export function createApiHandler<Params = Record<string, string>>(
  handler: Handler<Params>,
): Handler<Params> {
  return async (req, ctx) => {
    try {
      return await handler(req, ctx);
    } catch (err) {
      return handleApiError(err);
    }
  };
}

