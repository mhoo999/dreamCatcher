import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TestSupabase from './pages/TestSupabase';
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { AuthProvider } from './contexts/AuthContext'
import SignUp from './components/auth/SignUp'
import SignIn from './components/auth/SignIn'
import LogoutButton from './components/auth/LogoutButton'

function Home() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/test-supabase" element={<TestSupabase />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/logout" element={<LogoutButton />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
