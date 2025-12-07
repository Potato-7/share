// apps/api/features/_shared/validation/validate-student-context.ts

import type { NextRequest } from "next/server";
import { DomainError } from "@myproj/domain/common/domain-error";
import { NotFoundError } from "../errors/not-found-error";
import { ApplyKeySchema } from "./schemas/apply";
import { findApplicationInfoByKey } from "../queries/find-application-info.query";

export type StudentContext = {
  jukoId: string;
  fiscalYear: string;
  courseCode: string;
};

/**
 * 受講生API共通バリデーション(1〜7)
 */
export async function validateStudentContext(
  req: NextRequest,
): Promise<StudentContext> {
  const session = await getStudentSession(req);

  const raw = {
    jukoId: session.jukoId ?? "",
    fiscalYear: session.fiscalYear ?? "",
    courseCode: session.courseCode ?? "",
  };

  // 1〜6: 形式・必須チェック
  const parsed = ApplyKeySchema.safeParse(raw);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const code = (issue.message || "MSG_STD_0000_001") as string;

    throw new DomainError(code, {
      target: issue.path.join(".") || "入力値",
    });
  }

  const ctx: StudentContext = parsed.data;

  // 7: 申込情報マスタ存在チェック
  const application = await findApplicationInfoByKey(ctx);
  if (!application) {
    throw new NotFoundError("MSG_STD_0000_019", {
      target: "申込情報",
      jukoId: ctx.jukoId,
      fiscalYear: ctx.fiscalYear,
      courseCode: ctx.courseCode,
    });
  }

  return ctx;
}

// 実装は実プロジェクトのセッション取得に合わせて書き換え
async function getStudentSession(_req: NextRequest) {
  return {
    jukoId: "12345678",
    fiscalYear: "2025",
    courseCode: "ABC001",
  };
}

