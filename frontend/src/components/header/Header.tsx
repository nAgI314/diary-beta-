import { useEffect, useState } from "react";
import { fetchLoginStatus } from "../../utils/auth.ts";
import { LoginButton } from "../login/Login";
import styles from "./styles.module.css";


export const Header = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    setLoggedIn(await fetchLoginStatus());
    console.log("Login status checked:", loggedIn);
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* 左：ロゴ */}
        <div className={styles.left}>
          <span className={styles.logo}>Diary</span>
        </div>

        {/* 右：ログイン状態 */}
        <div className={styles.right}>
          {loggedIn ? (
            <span className={styles.user}>Logged in</span>
          ) : (
            <LoginButton />
          )}
        </div>

        <button onClick={checkLoginStatus} style={{ display: "none" }}>
          Check Login Status
        </button>
      </div>
    </header>
  );
};
