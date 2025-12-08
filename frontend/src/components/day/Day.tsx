import type { DiaryDay } from "../grouping";
import styles from "./styles.module.css";

interface DayProps {
    day: number;
    isToday: boolean;
    diaryDayData?: DiaryDay;
} 

export const Day = (props:DayProps) => {

    return (
        <div 
            className={`
                ${props.diaryDayData ? styles.diary_day : styles.day}
                ${props.isToday ? styles.today : ""}
            `} 
            onClick={()=>window.open(props.diaryDayData?.markdown?.html_url, '_blank') }
        >
            <div>{props.day}</div>
        </div>
    )
}

