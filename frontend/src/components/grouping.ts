import type { DiaryIndex } from "./diary/getdiary";

export interface DiaryDay {
  date: string;  // "2025-12-04"
  path: string; // "primary/2025/12/04"
  // markdown?: GithubContentItem;
  // images: GithubContentItem[];
}

export interface DiaryMonth {
  [day: string]: DiaryDay;
}

export interface DiaryData {
  [year: string]: {
    [month: string]: DiaryMonth;
  };
}

export const buildDiaryDataFromIndex = async (
  index: DiaryIndex
): Promise<DiaryData> => {
  const result: DiaryData = {};

  for (const date of index.dates) {
    // "2026-01-05"
    const [year, month, day] = date.split("-");

    result[year] ??= {};
    result[year][month] ??= {};
    result[year][month][day] = {
      date,
      path: `primary/${year}/${month}/${day}`,
    };
  }

  return result;
};
