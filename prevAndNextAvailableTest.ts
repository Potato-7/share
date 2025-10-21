// prevnext.sample.min.ts
import dayjs from "dayjs";

/* ===== 型 ===== */
type ViewType = "daily" | "weekly" | "monthly";

/* ===== ユーティリティ（最小限） ===== */
const fmt = (d: dayjs.Dayjs | string | Date, f = "YYYY-MM-DD") =>
  (dayjs.isDayjs(d) ? d : dayjs(d)).format(f);

function getWeekStart(date: string | Date, anchorWeekday: number) {
  const d = dayjs(date);
  const diff = (d.day() - anchorWeekday + 7) % 7;
  return d.subtract(diff, "day").startOf("day");
}

function calcDisplayRange(
  viewType: ViewType,
  baseDate: string,
  anchorWeekday: number,
  barCount: number
): { startDate: string; endDate: string } {
  const base = dayjs(baseDate);
  switch (viewType) {
    case "daily": {
      const start = base.subtract(barCount - 1, "day").startOf("day");
      const end = base.endOf("day");
      return { startDate: fmt(start), endDate: fmt(end) };
    }
    case "weekly": {
      const baseWeekStart = getWeekStart(baseDate, anchorWeekday);
      const start = baseWeekStart.subtract(barCount - 1, "week");
      const end = baseWeekStart.add(6, "day");
      return { startDate: fmt(start), endDate: fmt(end) };
    }
    case "monthly": {
      const baseMonthStart = base.startOf("month");
      const start = baseMonthStart.subtract(barCount - 1, "month");
      const end = baseMonthStart.endOf("month");
      return { startDate: fmt(start), endDate: fmt(end) };
    }
  }
}

function getLowerBoundAligned(
  viewType: ViewType,
  publicationDate: string,
  anchorWeekday: number
): string {
  switch (viewType) {
    case "daily":
      return fmt(dayjs(publicationDate).startOf("day"));
    case "weekly":
      return fmt(getWeekStart(publicationDate, anchorWeekday));
    case "monthly":
      return fmt(dayjs(publicationDate).startOf("month"));
  }
}

function calcPrevNextAvailable(
  viewType: ViewType,
  range: { startDate: string; endDate: string },
  publicationDate: string,
  anchorWeekday: number,
  latestLearningDate: string
) {
  const lowerBound = getLowerBoundAligned(viewType, publicationDate, anchorWeekday);
  const upperBound = fmt(latestLearningDate);
  const prevAvailable = dayjs(range.startDate).isAfter(dayjs(lowerBound));
  const nextAvailable = dayjs(range.endDate).isBefore(dayjs(upperBound));
  return { prevAvailable, nextAvailable, lowerBound, upperBound };
}

/* ===== パラメータ（ここだけいじればOK） ===== */
const anchorWeekday = 3;               // 週起点: 水曜=3
const publicationDate = "2025-09-01";  // 下限
const latestLearningDate = "2025-10-26"; // 上限

// シンプルに3パターンだけ用意（必要に応じてここを書き換える）
const samples = [
  { title: "DAILY (5本)",   view: "daily"  as ViewType,  baseDate: "2025-10-21", barCount: 5 },
  { title: "WEEKLY (5本)",  view: "weekly" as ViewType,  baseDate: "2025-10-20", barCount: 5 },
  { title: "MONTHLY (5本)", view: "monthly" as ViewType, baseDate: "2025-10-20", barCount: 5 },
];

/* ===== 実行 ===== */
function run() {
  for (const s of samples) {
    const range = calcDisplayRange(s.view, s.baseDate, anchorWeekday, s.barCount);
    const result = calcPrevNextAvailable(
      s.view, range, publicationDate, anchorWeekday, latestLearningDate
    );
    console.log(`\n=== ${s.title} ===`);
    console.log({
      viewType: s.view,
      baseDate: s.baseDate,       // ★ 依頼どおり baseDate を出力
      barCount: s.barCount,
      range,
      ...result,
    });
  }
}

run();

