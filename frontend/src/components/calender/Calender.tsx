import { useEffect, useState } from "react";
import { getDatesOfYear } from "./getAllDate";
import { Month } from "../month/Month";
import styles from "./styles.module.css";
import { buildDiaryDataFromIndex, type DiaryData } from "../grouping";
import { getDiaryIndex } from "../diary/getdiary";

export const Calender = () => {
  const [groupedData, setGroupedData] = useState<DiaryData>();


  useEffect(() => {
    const fetchData = async () => {
      if (import.meta.env.VITE_MODE === "test") {
        const res = await fetch("/diary-beta-/mock.json");
        if (!res.ok) throw new Error("mock fetch error");
        const grouped = await buildDiaryDataFromIndex(await res.json());
        setGroupedData(grouped);
      } else {
        const raw = await getDiaryIndex();
        const grouped = await buildDiaryDataFromIndex(raw);
        setGroupedData(grouped);
      }
    };
    fetchData().then(() => {console.log(groupedData);});
  }, []);

  useEffect(() => {
    if (!groupedData) return; // データがない場合は何もしない

    // DOMの描画完了を待つ
    setTimeout(() => {
      const today = new Date();
      const month = today.getMonth(); // 0–11
      const targetElement = document.getElementById(`month-${month}`);

      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  }, [groupedData]);

  const allDate = getDatesOfYear(2026);
  const MONTHS = Array.from({ length: 12 }, (_, i) => i);

  const handleUpdateData = async () => {
    if (import.meta.env.VITE_MODE === "test") {
      const res = await fetch("/diary-beta-/mock.json");
      if (!res.ok) throw new Error("mock fetch error");
      const grouped = await buildDiaryDataFromIndex(await res.json());
      setGroupedData(grouped);
    } else {
      const raw = await getDiaryIndex();
      const grouped = await buildDiaryDataFromIndex(raw);
      setGroupedData(grouped);
    }
  };
  if (!groupedData) {
    return (
      <div className={styles.wrapper}>
        <div>loading...</div>
        <button onClick={handleUpdateData}>読み込み</button>
      </div>
    );
  }
  return (
    <div className={styles.wrapper}>
      {MONTHS.map((i) => {
        const monthKey = String(i + 1).padStart(2, "0");
        return (
        <Month
          allDate={allDate}
          month={i}
          diaryMonthData={groupedData?.[2026]?.[monthKey]}
        />
      )})}
    </div>
  );
};
