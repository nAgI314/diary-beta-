import styles from "./styles.module.css";

interface DayProps {
    day: number    
} 

export const Day = (props:DayProps) => {
    return (
        <div className={styles.day} >
            <div>{props.day}</div>
        </div>
    )
}

