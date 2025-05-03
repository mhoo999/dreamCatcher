import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import TestSupabase from './pages/TestSupabase';
// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import { AuthProvider } from './contexts/AuthContext'
import SignUp from './components/auth/SignUp'
import SignIn from './components/auth/SignIn'
import LogoutButton from './components/auth/LogoutButton'
import ProtectedRoute from './components/auth/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import DreamInput from './pages/DreamInput';
import AppShell from './components/layout/AppShell';
import Goals from './pages/Goals';
import Profile from './pages/Profile';
import DreamDetail from './pages/DreamDetail';

function Home() {
  // 온보딩으로 리디렉션 (임시)
  return <Navigate to="/onboarding" replace />;
}

function App() {
  return (
    <AuthProvider>
      <AppShell>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/dream-input" element={<DreamInput />} />
            <Route path="/test-supabase" element={<TestSupabase />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/logout" element={<LogoutButton />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/goals" element={
              <ProtectedRoute>
                <Goals />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/dream/:id" element={
              <ProtectedRoute>
                <DreamDetail />
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </AppShell>
    </AuthProvider>
  )
}

export default App
