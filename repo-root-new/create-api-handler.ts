import { handleApiError } from "./handle-api-error";

export function createApiHandler(handler: Function) {
  return async (...args: any[]) => {
    try {
      return await handler(...args);
    } catch (err) {
      return handleApiError(err);
    }
  };
}

