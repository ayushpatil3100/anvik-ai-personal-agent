import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import PortfolioHome from './pages/PortfolioHome'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Chat from './pages/Chat'
import ThreeBackground from './components/ThreeBackground'
import { authAPI } from './services/api'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in and validate token
    const token = localStorage.getItem('authToken')
    if (token) {
      // Optionally validate token with backend
      authAPI.getCurrentUser()
        .then(() => {
          setIsAuthenticated(true)
        })
        .catch(() => {
          // Token invalid, clear it
          authAPI.logout()
          setIsAuthenticated(false)
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <Router>
        <Routes>
          <Route 
            path="/" 
            element={
              isAuthenticated ? <Navigate to="/chat" /> : <PortfolioHome />
            } 
          />
          <Route 
            path="/login" 
            element={
              isAuthenticated ? <Navigate to="/chat" /> : (
                <div className="app-content">
                  <ThreeBackground />
                  <Login setIsAuthenticated={setIsAuthenticated} />
                </div>
              )
            } 
          />
          <Route 
            path="/signup" 
            element={
              isAuthenticated ? <Navigate to="/chat" /> : (
                <div className="app-content">
                  <ThreeBackground />
                  <Signup setIsAuthenticated={setIsAuthenticated} />
                </div>
              )
            } 
          />
          <Route 
            path="/chat" 
            element={
              isAuthenticated ? (
                <div className="app-content">
                  <ThreeBackground />
                  <Chat setIsAuthenticated={setIsAuthenticated} />
                </div>
              ) : <Navigate to="/" />
            } 
          />
        </Routes>
      </Router>
    </div>
  )
}

export default App

