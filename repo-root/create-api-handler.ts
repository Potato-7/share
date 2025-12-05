import type { NextRequest } from "next/server";
import { handleApiError } from "./handle-api-errors";

type ApiHandler<TParams = unknown> = (
  req: NextRequest,
  context: { params: TParams },
) => Promise<Response>;

export function createApiHandler<TParams = unknown>(handler: ApiHandler<TParams>) {
  return async (req: NextRequest, context: { params: TParams }) => {
    try {
      return await handler(req, context);
    } catch (e) {
      return handleApiError(e);
    }
  };
}


