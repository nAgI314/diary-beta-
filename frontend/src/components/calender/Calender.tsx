import { useEffect, useRef, useState } from "react";
import { getDatesOfYear } from "./getAllDate";
import { Month } from "../month/Month";
import styles from "./styles.module.css";
import { buildDiaryDataFromIndex, type DiaryData } from "../grouping";
import { getDiaryIndex } from "../diary/getdiary";

export const Calender = () => {
  const [groupedData, setGroupedData] = useState<DiaryData>();
  const [visibleYears, setVisibleYears] = useState<number[]>([2026]);

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
    fetchData();
  }, []);

  useEffect(() => {
    if (!groupedData) return;

    setTimeout(() => {
      const today = new Date();
      const currentYear = today.getFullYear();
      const month = today.getMonth();
      const targetElement = month != 0 ? document.getElementById(`month-${currentYear}-${month-1}`) : document.getElementById(`month-${currentYear}-${month}`);

      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  }, [groupedData]);

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

  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isTop = entry.target === topRef.current;
        const isBottom = entry.target === bottomRef.current;

        if (!entry.isIntersecting) {return;}

        if (isTop) {
          setVisibleYears((prev) => {
            const min = Math.min(...prev);
            return prev.includes(min - 1) ? prev : [...prev, min - 1];
          });
        }

        if (isBottom) {
          setVisibleYears((prev) => {
            const max = Math.max(...prev);
            return prev.includes(max + 1) ? prev : [...prev, max + 1];
          });
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0,
      }
    );

    if (topRef.current) {
      observer.observe(topRef.current);
    }
    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      <div
        ref={topRef}
        style={{
          height: 10,
          top: 0,
        }}
      />
      {!groupedData ?

        <div className={styles.wrapper}>
          <div>loading...</div>
          <button onClick={handleUpdateData}>読み込み</button>
        </div>

      :<>
      {visibleYears
        .sort((a, b) => a - b)
        .map((year) => {
          const allDate = getDatesOfYear(year);

          return (
            <div key={year}>
              <h1>{year}</h1>
              {MONTHS.map((i) => {
                const monthKey = String(i + 1).padStart(2, "0");
                return (
                  <Month
                    key={`${year}-${i}`}
                    allDate={allDate}
                    month={i}
                    year={year}
                    diaryMonthData={groupedData?.[year]?.[monthKey]}
                  />
                );
              })}
            </div>
          );
        })}</>}
      <div
        ref={bottomRef}
        style={{
          height: 10,
        }}
      />
    </div>
  );
};