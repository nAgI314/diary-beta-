// import { useEffect, useState } from "react";
// import { buildDiaryData, type DiaryData } from "../grouping";
// import { getGithubContent } from "../diary/getdiary";
import { getDatesOfYear } from "./getAllDate";
import { Month } from "../month/Month";

export const Calender = () => {
//   const [groupedData, setGroupedData] = useState<DiaryData>();

//   useEffect(() => {
//     const fetchData = async () => {
//       const raw = await getGithubContent();
//       const grouped = buildDiaryData(raw);
//       setGroupedData(grouped);
//     };
//     fetchData();
//   }, []);

  const allDate = getDatesOfYear(2025); 
  const MONTHS = Array.from({ length: 12 }, (_, i) => i);
  return (
    <div>
        {MONTHS.map((i) => 
        <Month allDate={allDate} month={i}/>
        )}
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
