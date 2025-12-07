import { getDay, isToday } from "date-fns";
import { Day } from "../day/Day";
import styles from "./styles.module.css";

interface MonthProps {
  allDate: Date[];
  month: number;
}

export const Month = (props: MonthProps) => {
  const monthData = props.allDate.filter(
    (date) => date.getMonth() === props.month
  );

  // 月初の曜日（日=0）
  const startDay = getDay(monthData[0]);

  // 空白マスを作る
  const blanks = Array.from({ length: startDay });
  return (
    <div className={styles.month}>
      {/* 月名 */}
      <h3 className={styles.monthTitle}>{props.month + 1}月</h3>

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

          return (
            <div
              key={date.toISOString()}
              className={`
                ${styles.dayCell}
                ${dayOfWeek === 0 ? styles.sunday : ""}
                ${dayOfWeek === 6 ? styles.saturday : ""}
                ${isToday(date) ? styles.today : ""}
              `}
            >
              <Day day={date.getDate()} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
