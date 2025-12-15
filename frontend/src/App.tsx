import './App.css'
import { Calender } from './components/calender/Calender'
import { Header } from './components/header/Header'
// import { LoginButton } from './login/Login'
// import { Diary } from './components/diary/Diary'

function App() {

  return (
    <>
    <Header />
    {/* <LoginButton/> */}
    <main>
    <Calender/>
    </main>
      {/* <Diary/> */}
    </>
  )
}

export default App
