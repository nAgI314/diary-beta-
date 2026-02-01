// export interface GithubContentItem {
//   name: string;
//   path: string;
//   sha: string;
//   size: number;
//   url: string;
//   html_url: string;
//   git_url: string;
//   download_url: string | null;
//   type: "file" | "dir";
//   _links: {
//     self: string;
//     git: string;
//     html: string;
//   };
// }

// export type GithubContentsResponse = GithubContentItem[];

export interface DiaryIndex {
  version: number;
  dates: string[]; // "YYYY-MM-DD"
}

export const getDiaryIndex = async (): Promise<DiaryIndex> => {
  const response = await fetch(
    "https://api.diary.minagiri.net/repo?owner=nAgI314&repo=diary&path=primary/index.json",
    { credentials: "include" }
  );

  if (!response.ok) {
    throw new Error("index fetch error");
  }
  const data = await response.json();
  const decoded = atob(data.content); 
  const index: DiaryIndex = JSON.parse(decoded);
  // console.log(index);
  return index;
};
