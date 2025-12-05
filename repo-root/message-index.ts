import { ERROR_MESSAGES, type ErrorMessageKey } from "./messages";

export function formatMessage(key: ErrorMessageKey, params?: Record<string, unknown>): string {
  return ERROR_MESSAGES[key](params);
}

export { ERROR_MESSAGES };
export type { ErrorMessageKey };

