export const LoginButton = () => {
  const apiUrl = import.meta.env.VITE_API_URL || "https://api.diary.minagiri.net";
  return (
    <a href={`${apiUrl}/auth/github/login`}>Login with GitHub</a>
  );
};
