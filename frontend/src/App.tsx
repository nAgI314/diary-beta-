import { useEffect, useState } from 'react';
import './App.css'
import { Calender } from './components/calender/Calender'
import { Header } from './components/header/Header'
import { fetchLoginStatus } from './utils/auth';
// import { LoginButton } from './login/Login'
// import { Diary } from './components/diary/Diary'

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    setLoggedIn(await fetchLoginStatus());
  };
  return (
    <>
    <Header loggedIn={loggedIn}/>
    {/* <LoginButton/> */}
    <main>
      {loggedIn ? <Calender/> : <p>Not logged in</p>}
    {/* <Calender/> */}
    </main>
    </>
  )
}

export default App
