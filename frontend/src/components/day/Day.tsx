import type { DiaryDay } from "../grouping";
import styles from "./styles.module.css";

interface DayProps {
  day: number;
  isToday: boolean;
  diaryDayData?: DiaryDay;
}

export const Day = (props: DayProps) => {
  const hasDiary = Boolean(props.diaryDayData?.markdown?.html_url);
  return (
    <div
      className={`
                ${props.diaryDayData ? styles.diary_day : styles.day}
                ${props.isToday ? styles.today : ""}
            `}
      // onClick={()=>window.open(props.diaryDayData?.markdown?.html_url, '_blank') }
      onClick={
        hasDiary
          ? () => window.open(props.diaryDayData!.markdown!.html_url, "_blank")
          : undefined
      }
    >
      <div>{props.day}</div>
    </div>
  );
};
