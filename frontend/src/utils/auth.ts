export const fetchLoginStatus = async () => {
  const res = await fetch("https://api.diary.minagiri.net/auth/me", {
    credentials: "include", // ← 重要
  });
  const data = await res.json();
  return data.authenticated as boolean;
};
