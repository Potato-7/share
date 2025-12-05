// 共通 try/catch ラッパー
import { handleApiError } from "./handleApiError";

type ApiHandler<Ctx = any> = (req: Request, ctx: Ctx) => Promise<Response>;

export function createApiHandler<Ctx = any>(handler: ApiHandler<Ctx>) {
  return async (req: Request, ctx: Ctx): Promise<Response> => {
    try {
      return await handler(req, ctx);
    } catch (err) {
      return handleApiError(err);
    }
  };
}

