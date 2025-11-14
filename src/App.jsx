import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Chat from './pages/Chat'
import ThreeBackground from './components/ThreeBackground'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('authToken')
    setIsAuthenticated(!!token)
    setLoading(false)
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
      <ThreeBackground />
      <div className="app-content">
        <Router>
          <Routes>
            <Route 
              path="/login" 
              element={
                isAuthenticated ? <Navigate to="/chat" /> : <Login setIsAuthenticated={setIsAuthenticated} />
              } 
            />
            <Route 
              path="/signup" 
              element={
                isAuthenticated ? <Navigate to="/chat" /> : <Signup setIsAuthenticated={setIsAuthenticated} />
              } 
            />
            <Route 
              path="/chat" 
              element={
                isAuthenticated ? <Chat setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />
              } 
            />
            <Route path="/" element={<Navigate to={isAuthenticated ? "/chat" : "/login"} />} />
          </Routes>
        </Router>
      </div>
    </div>
  )
}

export default App

