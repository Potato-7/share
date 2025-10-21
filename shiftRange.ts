function shiftRange(baseDate: string, viewType: "daily" | "weekly" | "monthly", barCount: number, direction: "prev" | "next") {
  const base = dayjs(baseDate);
  const unit = viewType === "daily" ? "day" : viewType === "weekly" ? "week" : "month";
  const amount = direction === "prev" ? -barCount : barCount;
  return base.add(amount, unit).format("YYYY-MM-DD");
}

