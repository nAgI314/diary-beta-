import { format, getDay, isToday } from "date-fns";
import { Day } from "../day/Day";
import styles from "./styles.module.css";
import { enUS } from "date-fns/locale";
import type { DiaryMonth } from "../grouping";

interface MonthProps {
  allDate: Date[];
  month: number;
  diaryMonthData?: DiaryMonth;
}

export const Month = (props: MonthProps) => {
  const monthData = props.allDate.filter(
    (date) => date.getMonth() === props.month
  );

  // console.log("Month", props.month, props.diaryMonthData);

  // 月初の曜日（日=0）
  const startDay = getDay(monthData[0]);

  // 空白マスを作る
  const blanks = Array.from({ length: startDay });
  return (
    <div className={styles.month} id={`month-${props.month}`}>
      {/* 月名 */}
      {/* <h3 className={styles.monthTitle}>{props.month + 1}月</h3> */}
      <h3 className={styles.monthTitle}>
        {format(monthData[0], "MMMM", { locale: enUS })}
      </h3>

      <div className={styles.grid}>
        {/* 曜日ヘッダ */}
        {["日", "月", "火", "水", "木", "金", "土"].map((d, i) => (
          <div
            key={d}
            className={`${styles.weekday} ${
              i === 0 ? styles.sunday : i === 6 ? styles.saturday : ""
            }`}
          >
            {d}
          </div>
        ))}

        {/* 空白 */}
        {blanks.map((_, i) => (
          <div key={`blank-${i}`} />
        ))}

        {/* 日付 */}
        {monthData.map((date) => {
          const dayOfWeek = getDay(date);
          const date_num = date.getDate();
          const dayKey = String(date_num).padStart(2, "0");

          // console.log(dayKey, props.diaryMonthData?.[dayKey]);
          return (
            <div
              key={date.toISOString()}
              className={`
                ${styles.dayCell}
                ${dayOfWeek === 0 ? styles.sunday : ""}
                ${dayOfWeek === 6 ? styles.saturday : ""}
              `}
            >
              <Day
                day={date_num}
                isToday = {isToday(date)}
                diaryDayData={props.diaryMonthData?.[dayKey]}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
