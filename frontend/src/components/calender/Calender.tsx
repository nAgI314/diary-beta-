import { useEffect, useState } from "react";
import { buildDiaryData, type DiaryData } from "../grouping";
import { getGithubContent } from "../diary/getdiary";
import { getDatesOfYear } from "./getAllDate";
import { Month } from "../month/Month";
import styles from "./styles.module.css";

export const Calender = () => {
  const [groupedData, setGroupedData] = useState<DiaryData>();

  useEffect(() => {
    const fetchData = async () => {
      if (import.meta.env.VITE_MODE === "test") {
        const res = await fetch("/diary-beta-/mock.json");
        if (!res.ok) throw new Error("mock fetch error");

        const mockData: DiaryData = await res.json();
        setGroupedData(mockData);
      } else {
        const raw = await getGithubContent();
        const grouped = buildDiaryData(raw);
        setGroupedData(grouped);
      }
    };
    fetchData();
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

  console.log(groupedData);

  console.log(groupedData?.[2025]?.[12]);
  const allDate = getDatesOfYear(2025);
  const MONTHS = Array.from({ length: 12 }, (_, i) => i);

  const handleUpdateData = async () => {
    // console.log(import.meta.env.VITE_MODE);
    if (import.meta.env.VITE_MODE === "test") {
      
      const res = await fetch("/diary-beta-/mock.json");
      if (!res.ok) throw new Error("mock fetch error");

      const mockData: DiaryData = await res.json();
      setGroupedData(mockData);
    } else {
      const raw = await getGithubContent();
      const grouped = buildDiaryData(raw);
      setGroupedData(grouped);
    }
  };
  if (!groupedData) {
    return (
      <div>
        <div className={styles.wrapper}>loading...</div>
        <button onClick={handleUpdateData}>読み込み</button>
      </div>
    );
  }
  return (
    <div className={styles.wrapper}>
      {MONTHS.map((i) => (
        <Month
          allDate={allDate}
          month={i}
          diaryMonthData={groupedData?.[2025]?.[i + 1]}
        />
      ))}
      {/* {groupedData &&
        Object.entries(groupedData).map(([year, months]) => (
          <div>
            <h1>{year}年</h1>
            <div>
              {Object.entries(months).map(([month, days]) => (
                <div>{month}</div>
              ))}
            </div>
          </div>
        ))} */}
    </div>
  );
};
