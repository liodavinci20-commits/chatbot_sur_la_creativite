import { useState, useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import AdminBar from './components/AdminBar'
import { supabase } from './lib/supabase'
import './index.css'

// Lazy load des pages lourdes pour des transitions fluides
const IntroPage = lazy(() => import('./pages/IntroPage'))
const FoundationsPage = lazy(() => import('./pages/FoundationsPage'))
const MiniProjectPage = lazy(() => import('./pages/MiniProjectPage'))
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
  const [user, setUser] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('chatbot_user')) } catch { return null }
  })

  // Écoute les changements de session Supabase
  useEffect(() => {
    // Récupère la session active au démarrage
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && !user) {
        const meta = session.user.user_metadata || {}
        const name = meta.name || meta.prenom || session.user.email.split('@')[0]
        const u = { name, id: session.user.id }
        setUser(u)
        sessionStorage.setItem('chatbot_user', JSON.stringify(u))
      }
    })

    // Écoute les changements AUTH (login / logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setUser(null)
        sessionStorage.removeItem('chatbot_user')
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (user) sessionStorage.setItem('chatbot_user', JSON.stringify(user))
    else sessionStorage.removeItem('chatbot_user')
  }, [user])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    sessionStorage.removeItem('chatbot_user')
  }

  return (
    <BrowserRouter>
      {/* Barre Admin flottante — visible uniquement en mode développeur */}
      {user?.isAdmin && <AdminBar onLogout={handleLogout} />}

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
            path="/mini-project"
            element={user ? <MiniProjectPage user={user} /> : <Navigate to="/" replace />}
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

