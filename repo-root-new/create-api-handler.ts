import { ZodError } from "zod";
import { formatMessage } from "@myproj/messages/std";

export function createApiHandler<T>(handler: Handler<T>) {
  return async (req: NextRequest, ctx: { params: Record<string, string> }) => {
    try {
      const result = await handler(req, ctx);

      const body: ApiResponse<T> = {
        status: 200,
        message: null,
        result,
      };

      return Response.json(body, { status: 200 });
    } catch (err) {
      // ---------------------------
      // 🔥 ZodError（入力バリデーション）
      // ---------------------------
      if (err instanceof ZodError) {
        // issues から最初の message を取得
        const message =
          err.issues?.[0]?.message ??
          formatMessage("MSG_STD_0001"); // フォールバック

        const body: ApiResponse<null> = {
          status: 400,
          message,
          result: null,
        };

        return Response.json(body, { status: 400 });
      }

      // ---------------------------
      // 🔥 DomainError（業務エラー）
      // ---------------------------
      if (err instanceof DomainError) {
        const body: ApiResponse<null> = {
          status: 400,
          message: err.message,
          result: null,
        };
        return Response.json(body, { status: 400 });
      }

      // ---------------------------
      // 🔥 NotFoundError（404）
      // ---------------------------
      if (err instanceof NotFoundError) {
        const body: ApiResponse<null> = {
          status: 404,
          message: err.message,
          result: null,
        };
        return Response.json(body, { status: 404 });
      }

      // ---------------------------
      // 🔥 予期しないエラー（500）
      // ---------------------------
      console.error(err);

      const body: ApiResponse<null> = {
        status: 500,
        message: "サーバーエラーが発生しました",
        result: null,
      };

      return Response.json(body, { status: 500 });
    }
  };
}

