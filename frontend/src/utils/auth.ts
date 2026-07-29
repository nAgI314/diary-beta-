export const fetchLoginStatus = async () => {
  const apiUrl = import.meta.env.VITE_API_URL || "https://api.diary.minagiri.net";
  const res = await fetch(`${apiUrl}/auth/me`, {
    credentials: "include",
  });
  const data = await res.json();
  return data.authenticated as boolean;
};
