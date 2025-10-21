// prevnext.sample.ts
import dayjs from "dayjs";

/* ===== 型 ===== */
type ViewType = "daily" | "weekly" | "monthly";

/* ===== ユーティリティ（最小限） ===== */
const fmt = (d: dayjs.Dayjs | string | Date, f = "YYYY-MM-DD") =>
  (dayjs.isDayjs(d) ? d : dayjs(d)).format(f);

/** 0=日〜6=土 の週起点に揃えた週開始日 */
function getWeekStart(date: string | Date, anchorWeekday: number) {
  const d = dayjs(date);
  const diff = (d.day() - anchorWeekday + 7) % 7;
  return d.subtract(diff, "day").startOf("day");
}

/** 表示範囲を算出（viewType × baseDate × barCount × anchor） */
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

/** publicationDate を表示単位に整列した下限に変換 */
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

/** 前後ボタン可否（prev は下限、next は最新学習日で判定） */
function calcPrevNextAvailable(
  viewType: ViewType,
  range: { startDate: string; endDate: string },
  publicationDate: string,     // 下限（公開開始・表示開始日）
  anchorWeekday: number,       // 週起点
  latestLearningDate: string   // 上限（最終学習日）
) {
  const lowerBound = getLowerBoundAligned(viewType, publicationDate, anchorWeekday);
  const upperBound = fmt(latestLearningDate);

  const prevAvailable = dayjs(range.startDate).isAfter(dayjs(lowerBound));
  const nextAvailable = dayjs(range.endDate).isBefore(dayjs(upperBound));

  return { prevAvailable, nextAvailable, lowerBound, upperBound };
}

/* ===== サンプル境界・週起点 ===== */
const anchorWeekday = 3; // 水曜
const publicationDate = "2025-09-01"; // 下限（=公開・提供開始など）
const latestLearningDate = "2025-10-26"; // 上限（=最新データ日）

/* ===== サンプル: prev/next を groupBy の時みたいにログ出力 ===== */
function section(title: string) {
  console.log(`\n=== ${title} ===`);
}

function runPrevNextSamples() {
  // 例として「現ページ」「一つ前のページ」「一つ先のページ」相当のレンジを固定で用意
  // ※実際のアプリでは、現在レンジを基準に前/次のレンジをずらして評価する想定

  /* DAILY */
  section("DAILY prev/next");
  // 現在（終点を 2025-10-21 にして直近5日）
  const dailyCurrent = calcDisplayRange("daily", "2025-10-21", anchorWeekday, 5);
  // 前ページ（さらに5日遡る想定）
  const dailyPrev = { startDate: "2025-10-12", endDate: "2025-10-16" };
  // 次ページ（少し未来に寄りすぎる例）
  const dailyNext = { startDate: "2025-10-22", endDate: "2025-10-26" };

  console.log("current:", {
    range: dailyCurrent,
    ...calcPrevNextAvailable("daily", dailyCurrent, publicationDate, anchorWeekday, latestLearningDate),
  });
  console.log("prev pg :", {
    range: dailyPrev,
    ...calcPrevNextAvailable("daily", dailyPrev, publicationDate, anchorWeekday, latestLearningDate),
  });
  console.log("next pg :", {
    range: dailyNext,
    ...calcPrevNextAvailable("daily", dailyNext, publicationDate, anchorWeekday, latestLearningDate),
  });

  /* WEEKLY（週起点=水曜） */
  section("WEEKLY (anchor=Wed=3) prev/next");
  // 下限ピッタリのページ（prev不可/next可）
  const weeklyAtLower = { startDate: "2025-08-27", endDate: "2025-09-23" };
  // 中間ページ（prev可/next可）
  const weeklyMid = { startDate: "2025-09-24", endDate: "2025-10-21" };
  // 上限超え（prev可/next不可）
  const weeklyUpperPlus = { startDate: "2025-09-30", endDate: "2025-10-27" };

  console.log("lower :", {
    range: weeklyAtLower,
    ...calcPrevNextAvailable("weekly", weeklyAtLower, publicationDate, anchorWeekday, latestLearningDate),
  });
  console.log("middle :", {
    range: weeklyMid,
    ...calcPrevNextAvailable("weekly", weeklyMid, publicationDate, anchorWeekday, latestLearningDate),
  });
  console.log("upper+ :", {
    range: weeklyUpperPlus,
    ...calcPrevNextAvailable("weekly", weeklyUpperPlus, publicationDate, anchorWeekday, latestLearningDate),
  });

  /* MONTHLY */
  section("MONTHLY prev/next");
  // 現在ページ（2025-06〜2025-10表示の想定）
  const monthlyCurrent = calcDisplayRange("monthly", "2025-10-20", anchorWeekday, 5);
  // さらに前ページ（2025-05〜2025-09相当の例）
  const monthlyPrev = { startDate: "2025-05-01", endDate: "2025-09-30" };
  // 次ページ（2025-07〜2025-11…ただし上限が10/26なのでnext不可想定）
  const monthlyNext = { startDate: "2025-07-01", endDate: "2025-11-30" };

  console.log("current:", {
    range: monthlyCurrent,
    ...calcPrevNextAvailable("monthly", monthlyCurrent, publicationDate, anchorWeekday, latestLearningDate),
  });
  console.log("prev pg :", {
    range: monthlyPrev,
    ...calcPrevNextAvailable("monthly", monthlyPrev, publicationDate, anchorWeekday, latestLearningDate),
  });
  console.log("next pg :", {
    range: monthlyNext,
    ...calcPrevNextAvailable("monthly", monthlyNext, publicationDate, anchorWeekday, latestLearningDate),
  });
}

/* 実行 */
runPrevNextSamples();

