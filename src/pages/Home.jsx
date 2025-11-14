import { Link } from 'react-router-dom'
import { Brain, Sparkles, Zap, Shield, ArrowRight, Check } from 'lucide-react'
import HomeBackground from '../components/HomeBackground'
import './Home.css'

function Home() {
  const features = [
    {
      icon: <Brain size={24} />,
      title: 'AI-Powered Assistant',
      description: 'Intelligent conversations with advanced AI that understands context and remembers your preferences.',
    },
    {
      icon: <Sparkles size={24} />,
      title: 'Memory Graph',
      description: 'Your AI remembers everything. Upload documents, chat history, and build a comprehensive knowledge base.',
    },
    {
      icon: <Zap size={24} />,
      title: 'Tool Integration',
      description: 'Seamlessly connect with Calendar, Notion, and Email. Your AI can manage your entire workflow.',
    },
    {
      icon: <Shield size={24} />,
      title: 'Secure & Private',
      description: 'Enterprise-grade security with encrypted storage. Your data stays private and protected.',
    },
  ]

  const capabilities = [
    'Schedule meetings and manage calendar',
    'Create and update Notion pages',
    'Send and manage emails',
    'Upload and analyze documents',
    'Remember context across conversations',
    'Multi-tool orchestration',
  ]

  return (
    <div className="home-page">
      <HomeBackground />
      <div className="home-content">
        {/* Navigation */}
        <nav className="home-nav">
          <div className="home-logo">
            <Brain size={28} />
            <span>Anvik</span>
          </div>
          <div className="home-nav-links">
            <Link to="/login" className="nav-link">
              Sign In
            </Link>
            <Link to="/signup" className="nav-link primary">
              Get Started
              <ArrowRight size={16} />
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={14} />
              <span>AI Personal Agent</span>
            </div>
            <h1 className="hero-title">
              Your AI isn't intelligent
              <br />
              <span className="gradient-text">until it remembers</span>
            </h1>
            <p className="hero-description">
              Anvik is your intelligent personal assistant that remembers everything,
              connects to your tools, and orchestrates your entire workflow.
            </p>
            <div className="hero-cta">
              <Link to="/signup" className="cta-button primary">
                Get Started Free
                <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="cta-button secondary">
                Sign In
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="section-header">
            <h2 className="section-title">Powerful Features</h2>
            <p className="section-description">
              Everything you need to supercharge your productivity
            </p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card glass-panel">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Capabilities Section */}
        <section className="capabilities-section">
          <div className="capabilities-content glass-panel">
            <div className="capabilities-text">
              <h2 className="section-title">What Anvik Can Do</h2>
              <p className="section-description">
                Your AI assistant can help you with a wide range of tasks
              </p>
              <ul className="capabilities-list">
                {capabilities.map((capability, index) => (
                  <li key={index} className="capability-item">
                    <Check size={18} className="check-icon" />
                    <span>{capability}</span>
                  </li>
                ))}
              </ul>
              <Link to="/signup" className="cta-button primary">
                Start Using Anvik
                <ArrowRight size={18} />
              </Link>
            </div>
            <div className="capabilities-visual">
              <div className="visual-card">
                <Brain size={64} className="visual-icon" />
                <div className="visual-glow"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="footer-cta">
          <div className="footer-cta-content glass-panel">
            <h2 className="footer-cta-title">Ready to get started?</h2>
            <p className="footer-cta-description">
              Join thousands of users who are already using Anvik to boost their productivity
            </p>
            <Link to="/signup" className="cta-button primary large">
              Create Your Account
              <ArrowRight size={20} />
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Home

