// prevnext.one.ts
import dayjs from "dayjs";

/* ===== 型 ===== */
type ViewType = "daily" | "weekly" | "monthly";

/* ===== パラメータ（ここだけ編集すればOK） ===== */
const viewType: ViewType = "daily";           // 'daily' | 'weekly' | 'monthly'
const baseDate = "2025-10-21";                // ← いじる①
const publicationDate = "2025-09-01";         // ← いじる②（コース表示開始日）
const today = "2025-10-26";                   // ← いじる③（現在日）
const barCount = 5;                            // 表示本数（必要なら変えてOK）
const anchorWeekday = 3;                       // 週起点: 水曜=3（固定でOK）

/* ===== ユーティリティ ===== */
const fmt = (d: dayjs.Dayjs | string | Date, f = "YYYY-MM-DD") =>
  (dayjs.isDayjs(d) ? d : dayjs(d)).format(f);

/** 0=日〜6=土 の週起点に揃えた週開始 */
function getWeekStart(date: string | Date, anchor: number) {
  const d = dayjs(date);
  const diff = (d.day() - anchor + 7) % 7;
  return d.subtract(diff, "day").startOf("day");
}

/** 表示レンジを算出 */
function calcDisplayRange(
  vt: ViewType,
  base: string,
  anchor: number,
  count: number
): { startDate: string; endDate: string } {
  const b = dayjs(base);
  switch (vt) {
    case "daily": {
      const start = b.subtract(count - 1, "day").startOf("day");
      const end = b.endOf("day");
      return { startDate: fmt(start), endDate: fmt(end) };
    }
    case "weekly": {
      const baseWeekStart = getWeekStart(base, anchor);
      const start = baseWeekStart.subtract(count - 1, "week");
      const end = baseWeekStart.add(6, "day");
      return { startDate: fmt(start), endDate: fmt(end) };
    }
    case "monthly": {
      const baseMonthStart = b.startOf("month");
      const start = baseMonthStart.subtract(count - 1, "month");
      const end = baseMonthStart.endOf("month");
      return { startDate: fmt(start), endDate: fmt(end) };
    }
  }
}

/** 下限・上限（前提：下限＝コース開始を含む最初の週/月、上限＝今日を含む週/月） */
function getAlignedBounds(
  vt: ViewType,
  pubDate: string,
  anchor: number,
  todayStr: string
) {
  const t = dayjs(todayStr);
  if (vt === "daily") {
    // daily は要望に合わせて：下限＝pubDate（日）、上限＝today（その日）
    return {
      lowerBound: fmt(dayjs(pubDate).startOf("day")),
      upperBound: fmt(t.startOf("day")),
    };
  }
  if (vt === "weekly") {
    const lowerStart = getWeekStart(pubDate, anchor);
    const upperEnd = getWeekStart(t, anchor).add(6, "day");
    return { lowerBound: fmt(lowerStart), upperBound: fmt(upperEnd) };
  }
  // monthly
  return {
    lowerBound: fmt(dayjs(pubDate).startOf("month")),
    upperBound: fmt(t.endOf("month")),
  };
}

/** prev/next 導出 */
function calcPrevNext(
  vt: ViewType,
  range: { startDate: string; endDate: string },
  pubDate: string,
  anchor: number,
  todayStr: string
) {
  const { lowerBound, upperBound } = getAlignedBounds(vt, pubDate, anchor, todayStr);
  const prevAvailable = dayjs(range.startDate).isAfter(dayjs(lowerBound));
  const nextAvailable = dayjs(range.endDate).isBefore(dayjs(upperBound));
  return { prevAvailable, nextAvailable, lowerBound, upperBound };
}

/* ===== 実行（出力フォーマット固定） ===== */
(function run() {
  const range = calcDisplayRange(viewType, baseDate, anchorWeekday, barCount);
  const { prevAvailable, nextAvailable, lowerBound, upperBound } = calcPrevNext(
    viewType, range, publicationDate, anchorWeekday, today
  );

  console.log(`=== ${viewType.toUpperCase()} (${barCount}本) ===`);
  // 出力順を固定したいので、キー順で明示的に構築
  const out = {
    viewType,
    baseDate,
    barCount,
    range,
    prevAvailable,
    nextAvailable,
    lowerBound,
    upperBound,
  };
  console.log(out);
})();

