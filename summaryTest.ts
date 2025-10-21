// src/test.ts
import dayjs from "dayjs";

type ViewType = "daily" | "weekly" | "monthly";
type DailyData = { date: string; totalMinutes: number };
type GraphData = { label: string; totalMinutes: number };

// 週開始日を算出する補助関数（0=日〜6=土）
function getWeekStartDate(date: string | Date, anchorWeekday: number): dayjs.Dayjs {
  const d = dayjs(date);
  const diff = (d.day() - anchorWeekday + 7) % 7;
  return d.subtract(diff, "day").startOf("day");
}

function groupByViewType(
  viewType: ViewType,
  dailyList: DailyData[],
  anchorWeekday: number // 週起点（例: 月曜=1）
): GraphData[] {
  switch (viewType) {
    case "daily":
      // ① 日別：そのまま（日付ラベルをMM/DD表示）
      return dailyList
        .sort((a, b) => a.date.localeCompare(b.date))
        .map(d => ({
          label: dayjs(d.date).format("MM/DD"),
          totalMinutes: d.totalMinutes,
        }));

    case "weekly":
      // ② 週別：週開始日キーで合算
      return Object.values(
        dailyList.reduce((acc, d) => {
          const weekStart = getWeekStartDate(d.date, anchorWeekday).format("YYYY-MM-DD");
          if (!acc[weekStart]) acc[weekStart] = { label: weekStart, totalMinutes: 0 };
          acc[weekStart].totalMinutes += d.totalMinutes;
          return acc;
        }, {} as Record<string, GraphData>)
      ).sort((a, b) => a.label.localeCompare(b.label));

    case "monthly":
      // ③ 月別：YYYY-MM キーで合算
      return Object.values(
        dailyList.reduce((acc, d) => {
          const monthKey = dayjs(d.date).format("YYYY-MM");
          if (!acc[monthKey]) acc[monthKey] = { label: monthKey, totalMinutes: 0 };
          acc[monthKey].totalMinutes += d.totalMinutes;
          return acc;
        }, {} as Record<string, GraphData>)
      ).sort((a, b) => a.label.localeCompare(b.label));

    default:
      throw new Error(`Unsupported viewType: ${viewType}`);
  }
}

// ====== サンプル日別データ（欠損日があってもOK） ======
const dailyList: DailyData[] = [
  { date: "2025-10-01", totalMinutes: 60 },
  { date: "2025-10-02", totalMinutes: 120 },
  { date: "2025-10-08", totalMinutes: 90 },
  { date: "2025-10-09", totalMinutes: 30 },
  { date: "2025-10-15", totalMinutes: 45 },
  { date: "2025-10-21", totalMinutes: 190 },
];

// ====== 実行（週起点：水曜=3） ======
const anchorWeekday = 3;

console.log("=== DAILY ===");
console.log(groupByViewType("daily", dailyList, anchorWeekday));

console.log("=== WEEKLY (anchor=Wed=3) ===");
console.log(groupByViewType("weekly", dailyList, anchorWeekday));

console.log("=== MONTHLY ===");
console.log(groupByViewType("monthly", dailyList, anchorWeekday));

// 補助：分→「H時間Mm」表記（必要なら）
const formatHM = (m: number) => `${Math.floor(m / 60)}時間${m % 60}分`;
console.log("=== WEEKLY (with H:M) ===");
console.log(
  groupByViewType("weekly", dailyList, anchorWeekday).map(x => ({
    ...x,
    display: formatHM(x.totalMinutes),
  }))
);

