import { eachDayOfInterval } from "date-fns";

/**
 * 指定した年の全ての日付を配列で返す
 */
export function getDatesOfYear(year: number): Date[] {
  const start = new Date(year, 0, 1);   // 1月1日
  const end = new Date(year, 11, 31);   // 12月31日

  return eachDayOfInterval({ start, end });
}
