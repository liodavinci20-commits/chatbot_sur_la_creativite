import { useState, useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import './index.css'

// Lazy load des pages lourdes pour des transitions fluides
const IntroPage = lazy(() => import('./pages/IntroPage'))
const FoundationsPage = lazy(() => import('./pages/FoundationsPage'))
const HubPage = lazy(() => import('./pages/HubPage'))

// Écran de chargement pendant le lazy loading
function PageLoader() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: '#0a0a12',
      color: '#1DB97A',
      fontSize: '1.1rem',
      gap: '12px',
      fontFamily: "'Outfit', sans-serif"
    }}>
      <div style={{
        width: '28px',
        height: '28px',
        border: '3px solid rgba(29, 185, 122, 0.2)',
        borderTop: '3px solid #1DB97A',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      Chargement...
    </div>
  )
}

function App() {
  // Persister l'utilisateur dans sessionStorage pour ne pas le perdre lors de la navigation
  const [user, setUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem('chatbot_user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  // Synchroniser avec sessionStorage à chaque changement
  useEffect(() => {
    if (user) {
      sessionStorage.setItem('chatbot_user', JSON.stringify(user))
    } else {
      sessionStorage.removeItem('chatbot_user')
    }
  }, [user])

  const handleLogout = () => {
    setUser(null)
    sessionStorage.removeItem('chatbot_user')
  }

  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
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
            element={user ? <HubPage user={user} onLogout={handleLogout} /> : <Navigate to="/" replace />}
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App

