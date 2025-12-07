// apps/api/features/_shared/api/handle-api-error.ts

import { NextResponse } from "next/server";
import { DomainError } from "@myproj/domain/common/domain-error";
import { NotFoundError } from "../errors/not-found-error";
import { InfraError } from "@myproj/infra/errors/infra-error";
import { formatMessage } from "@myproj/messages/std/messages";

type ApiResponseBody = {
  status: number;
  message: string | null;
  result: unknown;
};

export function handleApiError(err: unknown) {
  if (err instanceof DomainError || err instanceof NotFoundError) {
    const binds = err.params ? Object.values(err.params) : [];
    const message = formatMessage(err.code, ...binds);

    const body: ApiResponseBody = {
      status: 500, // 設計書に合わせて 500 固定
      message,
      result: null,
    };

    return NextResponse.json(body, { status: 500 });
  }

  if (err instanceof InfraError) {
    console.error("[InfraError]", err.message, err.detail);

    const body: ApiResponseBody = {
      status: 500,
      message: "システムエラーが発生しました。",
      result: null,
    };

    return NextResponse.json(body, { status: 500 });
  }

  console.error("[UnexpectedError]", err);

  const body: ApiResponseBody = {
    status: 500,
    message: "システムエラーが発生しました。",
    result: null,
  };

  return NextResponse.json(body, { status: 500 });
}

