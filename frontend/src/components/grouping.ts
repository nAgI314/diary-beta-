import type { GithubContentItem } from "./diary/getdiary";

export interface DiaryDay {
  date: string;  // "2025-12-04"
  markdown?: GithubContentItem;
  images: GithubContentItem[];
}

export interface DiaryMonth {
  [day: string]: DiaryDay;
}

export interface DiaryData {
  [year: string]: {
    [month: string]: DiaryMonth;
  };
}

export const buildDiaryData = (files: GithubContentItem[]): DiaryData => {
  const result: DiaryData = {};

  for (const file of files) {
    const match = file.path.match(/^primary\/(\d{4})\/(\d{2})\/(\d{2})\/(.+)$/);
    if (!match) continue;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars 
    const [_, year, month, day, filename] = match;

    result[year] ??= {};
    result[year][month] ??= {};
    result[year][month][day] ??= {
      date: `${year}-${month}-${day}`,
      images: [],
    };

    const entry = result[year][month][day];

    if (filename === "main.md") {
      entry.markdown = file;
    } else {
      entry.images.push(file);
    }
  }

  return result;
};
