import { useEffect, useState } from "react";
import { buildDiaryData, type DiaryData } from "../grouping";
import { getGithubContent } from "./getdiary";

export const Diary = () => {

  const [groupedData, setGroupedData] = useState<DiaryData>();

  useEffect(() => {
    const fetchData = async () => {
      const raw = await getGithubContent();
      const grouped = buildDiaryData(raw);
      setGroupedData(grouped);

      
    };
  fetchData()
  },[])

  // const github_content = await getGithubContent();

  // const grouped_data = buildDiaryData(github_content);
  // console.log("ikkaidiinoni ")
  console.log(groupedData);
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Diary</h2>

      {groupedData && Object.entries(groupedData).map(([year, months]) => 
      {
        console.log(year)
      return (
        <div key={year}>
          <h3 className="text-lg font-semibold">{year} 年</h3>

          {Object.entries(months).map(([month, days]) => (
            <div key={month} className="ml-4">
              <h4 className="font-medium">{month} 月</h4>

              <ul className="ml-4 list-disc">
                {Object.entries(days).map(([day, entry]) => (
                  <li key={day}>
                    {entry.date}
                    {entry.markdown && " 📝"}
                    {entry.images.length > 0 && ` 📷(${entry.images.length})`}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )})}
    </div>
  );
};
