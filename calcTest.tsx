import dayjs from "dayjs";

// 週の起点を求める関数
function getWeekStartDate(date: string, anchorWeekday: number): dayjs.Dayjs {
  const target = dayjs(date);
  const dow = target.day(); // 0=日曜〜6=土曜
  const diff = (dow - anchorWeekday + 7) % 7;
  return target.subtract(diff, "day").startOf("day");
}

// 表示期間を計算するメイン関数
function calcDisplayRange(
  viewType: "daily" | "weekly" | "monthly",
  baseDate: string,
  anchorWeekday: number,
  barCount: number
): { startDate: string; endDate: string } {
  const base = dayjs(baseDate);

  switch (viewType) {
    case "daily": {
      const start = base.subtract(barCount - 1, "day").startOf("day");
      const end = base.endOf("day");
      return { startDate: start.format("YYYY-MM-DD"), endDate: end.format("YYYY-MM-DD") };
    }

    case "weekly": {
      const baseWeekStart = getWeekStartDate(baseDate, anchorWeekday);
      const start = dayjs(baseWeekStart).subtract(barCount - 1, "week");
      const end = dayjs(baseWeekStart).add(6, "day");
      return { startDate: start.format("YYYY-MM-DD"), endDate: end.format("YYYY-MM-DD") };
    }

    case "monthly": {
      const baseMonthStart = base.startOf("month");
      const start = baseMonthStart.subtract(barCount - 1, "month");
      const end = baseMonthStart.endOf("month");
      return { startDate: start.format("YYYY-MM-DD"), endDate: end.format("YYYY-MM-DD") };
    }

    default:
      throw new Error(`Unsupported viewType: ${viewType}`);
  }
}

// テスト出力
console.log("=== DAILY ===");
console.log(calcDisplayRange("daily", "2025-10-21", 3, 5));

console.log("=== WEEKLY (水曜起点) ===");
console.log(calcDisplayRange("weekly", "2025-10-20", 3, 5));

console.log("=== MONTHLY ===");
console.log(calcDisplayRange("monthly", "2025-10-20", 3, 5));

