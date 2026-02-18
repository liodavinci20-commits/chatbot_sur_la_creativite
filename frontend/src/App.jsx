import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import IntroPage from './pages/IntroPage'
import FoundationsPage from './pages/FoundationsPage'
import HubPage from './pages/HubPage'
import './index.css'

function App() {
  const [user, setUser] = useState(null)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage onLogin={setUser} />} />
        <Route
          path="/intro"
          element={user ? <IntroPage user={user} /> : <Navigate to="/" replace />}
        />
        <Route
          path="/foundations"
          element={user ? <FoundationsPage user={user} /> : <Navigate to="/" replace />}
        />
        <Route
          path="/hub"
          element={user ? <HubPage user={user} onLogout={() => setUser(null)} /> : <Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App

