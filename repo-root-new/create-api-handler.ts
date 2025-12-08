// apps/shikakuruapi/src/app/api/_shared/create-api-handler.ts
import type { NextRequest } from "next/server";
import { ZodError } from "zod";
import { formatMessage } from "@myproj/messages/std";
import { DomainError } from "@myproj/domain/errors/domain-error";

type ApiResponse<T> = {
  status: number;
  message: string | null;
  result: T | null;
};

export function createApiHandler<
  T,
  P extends Record<string, string> = Record<string, string>,          // path
  Q = Record<string, string | string[]>,                              // query
  B = unknown                                                         // body
>(
  handler: (
    req: NextRequest,
    ctx: { params: P; query: Q; body: B }
  ) => Promise<T>
) {
  return async (req: NextRequest, ctx: { params: P }) => {
    try {
      // ===== ① query をオブジェクトに変換 =====
      const url = new URL(req.url);
      const query = Array.from(url.searchParams.entries()).reduce(
        (acc, [key, value]) => {
          const current = (acc as any)[key];
          if (current === undefined) {
            (acc as any)[key] = value; // 1個だけ → string
          } else if (Array.isArray(current)) {
            (acc as any)[key] = [...current, value]; // 2個目以降 → 既存配列に push
          } else {
            (acc as any)[key] = [current, value]; // 2個目で配列化
          }
          return acc;
        },
        {} as any as Q
      );

      // ===== ② body を JSON として読む（GET/HEAD 以外） =====
      let body: B = undefined as unknown as B;
      if (req.method !== "GET" && req.method !== "HEAD") {
        body = (await req.json().catch(() => undefined)) as unknown as B;
      }

      // ===== ③ 実際のハンドラ呼び出し =====
      const result = await handler(req, {
        params: ctx.params,
        query,
        body,
      });

      const responseBody: ApiResponse<T> = {
        status: 200,
        message: null,
        result,
      };

      return Response.json(responseBody, { status: 200 });
    } catch (err) {
      // ===== ④ エラー処理（今まで通り） =====

      // Zod バリデーションエラー
      if (err instanceof ZodError) {
        const message =
          err.issues[0]?.message ?? formatMessage("MSG_STD_0001");
        const body: ApiResponse<null> = {
          status: 400,
          message,
          result: null,
        };
        return Response.json(body, { status: 400 });
      }

      // ドメインエラー
      if (err instanceof DomainError) {
        const message = formatMessage(err.code, ...err.params);
        const body: ApiResponse<null> = {
          status: 400,
          message,
          result: null,
        };
        return Response.json(body, { status: 400 });
      }

      // 想定外エラー
      console.error(err);
      const body: ApiResponse<null> = {
        status: 500,
        message: formatMessage("MSG_STD_9999"),
        result: null,
      };
      return Response.json(body, { status: 500 });
    }
  };
}



// // apps/shikakuruapi/src/app/api/_shared/create-api-handler.ts
// import type { NextRequest } from "next/server";
// import { ZodError } from "zod";
// import { NotFoundError } from "@myproj/domain/errors/not-found-error";
// import { InfraError } from "@myproj/infrastructure/errors/infra-error";
// import { formatMessage } from "@myproj/messages/std";
//
// type Handler<T, P extends Record<string, string> = Record<string, string>> = (
//   req: NextRequest,
//   ctx: { params: P }
// ) => Promise<T>;
//
// type ApiResponse<T> = {
//   status: number;
//   message: string | null;
//   result: T | null;
// };
//
// export function createApiHandler<T, P extends Record<string, string>>(
//   handler: Handler<T, P>
// ) {
//   return async (req: NextRequest, ctx: { params: P }) => {
//     try {
//       const result = await handler(req, ctx);
//
//       const body: ApiResponse<T> = {
//         status: 200,
//         message: null,
//         result,
//       };
//       return Response.json(body, { status: 200 });
//     } catch (err) {
//       // Zod エラー（入力バリデーション）
//       if (err instanceof ZodError) {
//         const message =
//           err.issues[0]?.message ?? formatMessage("MSG_STD_0001");
//         const body: ApiResponse<null> = {
//           status: 400,
//           message,
//           result: null,
//         };
//         return Response.json(body, { status: 400 });
//       }
//
//       // 申込情報・テストなど「見つからない」系
//       if (err instanceof NotFoundError) {
//         const status = err.code === "ENROLLMENT_NOT_FOUND" ? 403 : 404;
//         const body: ApiResponse<null> = {
//           status,
//           message: formatMessage(`MSG_STD_${err.code}`, ...err.params),
//           result: null,
//         };
//         return Response.json(body, { status });
//       }
//
//       // DB 障害などインフラ系
//       if (err instanceof InfraError) {
//         const body: ApiResponse<null> = {
//           status: 500,
//           message: formatMessage("MSG_STD_SYSTEM_ERROR"),
//           result: null,
//         };
//         return Response.json(body, { status: 500 });
//       }
//
//       // 想定外
//       console.error(err);
//       const body: ApiResponse<null> = {
//         status: 500,
//         message: formatMessage("MSG_STD_SYSTEM_ERROR"),
//         result: null,
//       };
//       return Response.json(body, { status: 500 });
//     }
//   };
// }
//
