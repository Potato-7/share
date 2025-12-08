import { ZodError } from "zod";
import { DomainError } from "@myproj/domain/errors/domain-error";

export function handleApiError(err: unknown) {
  if (err instanceof ZodError) {
    return Response.json(
      { status: 400, code: "INVALID_INPUT", message: err.issues },
      { status: 400 }
    );
  }

  if (err instanceof DomainError) {
    return Response.json(
      { status: 404, code: err.code, params: err.params },
      { status: 404 }
    );
  }

  console.error(err);

  return Response.json(
    { status: 500, code: "SERVER_ERROR", message: "内部エラーが発生しました" },
    { status: 500 }
  );
}

