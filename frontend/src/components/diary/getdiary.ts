export interface GithubContentItem {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string | null;
  type: "file" | "dir";
  _links: {
    self: string;
    git: string;
    html: string;
  };
}

export type GithubContentsResponse = GithubContentItem[];

export const getGithubContent = async ():Promise<GithubContentsResponse> => {
  const alldata = await getAllFilesRecursive("primary");
  console.log(alldata);
  return alldata
};

const getAllFilesRecursive = async (
  path: string
): Promise<GithubContentItem[]> => {
  const items = await getGithubDirectory(path);
//   console.log(items);
  const files: GithubContentItem[] = [];

  for (const item of items) {
    // console.log(item)
    if (item.type === "file") {
      files.push(item);
    } else if (item.type === "dir") {
      const subFiles = await getAllFilesRecursive(item.path);
      files.push(...subFiles);
    }
    // break;
  }
  return files;
};

const getGithubDirectory = async (
  path: string
): Promise<GithubContentsResponse> => {
  const response = await fetch(
    `http://localhost:8080/repo?owner=nAgI314&repo=diary&path=${path}`
  );

  if (!response.ok) {
    throw new Error("directory fetch error");
  }

  const data: GithubContentsResponse = await response.json();
  return data;
};
