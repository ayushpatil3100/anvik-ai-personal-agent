import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Brain, Mail, Lock } from 'lucide-react'
import AuthShowcase from '../components/AuthShowcase'
import { authAPI } from '../services/api'
import './Auth.css'

function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!email || !password) {
        setError('Please fill in all fields')
        setLoading(false)
        return
      }

      const data = await authAPI.login(email, password)
      setIsAuthenticated(true)
      navigate('/chat')
    } catch (err) {
      // Show user-friendly error message
      let errorMessage = err.message || 'Login failed. Please check your credentials.'
      
      // Check if it's a connection error
      if (errorMessage.includes('Cannot connect to backend')) {
        errorMessage = 'Cannot connect to backend server. Please ensure the backend is running on port 3000.'
      }
      
      setError(errorMessage)
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <AuthShowcase />
      <div className="auth-card glass-panel">
        <div className="auth-card__header">
          <div className="auth-logo">
            <Brain size={28} />
            <span>Anvik</span>
          </div>
          <h2>Welcome back</h2>
          <p>Sign in to orchestrate your AI personal agent.</p>
          <div className="auth-pill-row">
            <span>Agents</span>
            <span>Connectors</span>
            <span>Playbooks</span>
          </div>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}

          <div className="auth-input-group">
            <label>
              <Mail size={18} />
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="auth-input-group">
            <label>
              <Lock size={18} />
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <div className="auth-footer">
            <p>
              Don&apos;t have an account? <Link to="/signup">Sign up</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login

