import { useEffect, useState } from "react";
import { isLoggedIn } from "../../utils/auth.ts";
import { LoginButton } from "../login/Login";
import styles from "./styles.module.css";


export const Header = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoggedIn(isLoggedIn());
  }, []);

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
      </div>
    </header>
  );
};
