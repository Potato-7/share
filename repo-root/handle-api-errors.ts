import { ZodError } from "zod";
import { DomainError } from "@myproj/domain/errors/domain-error";
import { InfraError, DbError } from "@myproj/infrastructure/errors/infra-error";
import { formatMessage } from "@myproj/messages/std";

export function handleApiError(e: unknown): Response {
  console.error(e);

  // Zod バリデーションエラー
  if (e instanceof ZodError) {
    const message = formatMessage("VALIDATION_ERROR");
    return Response.json(
      { status: 400, message, result: null, details: e.flatten() },
      { status: 400 },
    );
  }

  // ドメインエラー
  if (e instanceof DomainError) {
    const message = formatMessage(e.code as any, e.params);
    return Response.json(
      { status: 400, message, result: null, code: e.code },
      { status: 400 },
    );
  }

  // インフラエラー
  if (e instanceof InfraError) {
    const message = formatMessage("DB_ERROR");
    return Response.json(
      { status: 500, message, result: null },
      { status: 500 },
    );
  }

  // 想定外
  return Response.json(
    { status: 500, message: "想定外のエラーが発生しました。", result: null },
    { status: 500 },
  );
}

