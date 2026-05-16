import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

// ── Loader ──
function Loader() {
  return (
    <div className="loader-overlay" id="loader">
      <div className="loader-3d">
        <div className="loader-cube">
          <div className="face front">&lt;/&gt;</div>
          <div className="face back">&lt;/&gt;</div>
          <div className="face left">&lt;/&gt;</div>
          <div className="face right">&lt;/&gt;</div>
          <div className="face top">&lt;/&gt;</div>
          <div className="face bottom">&lt;/&gt;</div>
        </div>
      </div>
      <div className="loader-text">
        Initializing Playground
        <span className="loader-dots">
          <span>.</span><span>.</span><span>.</span>
        </span>
      </div>
    </div>
  )
}

// ── Footer ──
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <span style={{ color: 'var(--accent-blue)' }}>[</span>
            {' '}Frontend Playground{' '}
            <span style={{ color: 'var(--accent-blue)' }}>]</span>
            <p>Build · Preview · Publish · Share</p>
          </div>
          <div className="footer-links">
            <a
              href="https://linkedin.com/in/YOUR_LINKEDIN_ID"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </a>
            <a
              href="https://github.com/YOUR_GITHUB_ID"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
              GitHub
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="footer-copy">
            © {new Date().getFullYear()} Frontend Playground — Built with ❤️
          </span>
          <div className="footer-tech">
            <span className="tech-badge">React</span>
            <span className="tech-badge">Tailwind</span>
            <span className="tech-badge">Monaco</span>
            <span className="tech-badge">Supabase</span>
            <span className="tech-badge">Vite</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ── Main HomePage ──
export default function HomePage() {
  const navigate = useNavigate()

  const [projects, setProjects]     = useState([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [filter, setFilter]         = useState('all')
  const [showLoader, setShowLoader] = useState(true)

  useEffect(() => {
    fetchProjects()
    const timer = setTimeout(() => setShowLoader(false), 1800)
    return () => clearTimeout(timer)
  }, [])

  async function fetchProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) setProjects(data)
    setLoading(false)
  }

  async function deleteProject(e, projectId) {
    e.stopPropagation()
    if (!window.confirm('Delete this project?')) return

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId)

    if (error) { alert('Failed to delete'); return }
    setProjects(prev => prev.filter(p => p.id !== projectId))
  }

  function copyURL(e, projectId) {
    e.stopPropagation()
    navigator.clipboard.writeText(`${window.location.origin}/p/${projectId}`)
    alert('URL Copied!')
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    })
  }

  // Filter + Search
  const filtered = projects.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase())
    if (filter === 'all') return matchSearch
    if (filter === 'published') return matchSearch && p.published
    if (filter === 'recent') {
      const twoDaysAgo = Date.now() - 2 * 24 * 60 * 60 * 1000
      return matchSearch && new Date(p.created_at).getTime() > twoDaysAgo
    }
    return matchSearch
  })

  return (
    <>
      {/* 3D Loader */}
      {showLoader && <Loader />}

      <div className="bg-grid" />
      <div className="bg-glow" />

      <div className="content-layer" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

        {/* NAVBAR */}
        <nav className="navbar">
          <span className="navbar-logo">
            <span className="logo-bracket">[</span>
            fp
            <span className="logo-bracket">]</span>
            <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: 12 }}>
              &nbsp;/ playground
            </span>
          </span>
          <button className="btn btn-primary" onClick={() => navigate('/editor')}>
            + New Project
          </button>
        </nav>

        <main style={{ flex: 1, maxWidth: 1200, margin: '0 auto', width: '100%', padding: '40px 24px' }}>

          {/* HERO */}
          <div className="fade-in" style={{ marginBottom: 40 }}>
            <div className="hero-badge">⚡ Live Code Playground</div>
            <h1 className="hero-title">
              Build. Preview.<br />
              <span className="accent">Ship Instantly.</span>
            </h1>
            <p className="hero-subtitle">
              Write HTML, CSS, JavaScript & Tailwind in one place.
              Run live previews and share with a single URL.
            </p>
          </div>

          {/* STATS */}
          <div className="stats-bar fade-in fade-in-delay-1">
            <div className="stat-item">
              <span className="stat-value">{projects.length}</span>
              <span className="stat-label">Projects</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{projects.filter(p => p.published).length}</span>
              <span className="stat-label">Published</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">∞</span>
              <span className="stat-label">Possibilities</span>
            </div>
          </div>

          {/* SEARCH + FILTER */}
          <div className="fade-in fade-in-delay-2" style={{ marginBottom: 28 }}>
            <div className="search-container" style={{ marginBottom: 14 }}>
              <span className="search-icon">⌕</span>
              <input
                className="search-input"
                placeholder="Search projects..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['all', 'recent', 'published'].map(f => (
                <button
                  key={f}
                  className={`filter-chip ${filter === f ? 'active' : ''}`}
                  onClick={() => setFilter(f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* PROJECTS GRID */}
          <div className="fade-in fade-in-delay-3">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {filtered.length} project{filtered.length !== 1 ? 's' : ''}
              </h2>
            </div>

            {loading ? (
              <div className="empty-state">
                <div className="empty-state-icon">⟳</div>
                <h3>Loading projects...</h3>
              </div>
            ) : filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">◻</div>
                <h3>{search ? 'No results found' : 'No projects yet'}</h3>
                <p>{search ? 'Try a different search term' : 'Click "New Project" to get started'}</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 18 }}>
                {filtered.map((project, i) => (
                  <div
                    key={project.id}
                    className="project-card"
                    onClick={() => navigate(`/editor/${project.id}`)}
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    {/* Card Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
                        {project.title}
                      </h2>
                      {project.published && (
                        <span style={{
                          fontSize: 10, padding: '2px 8px',
                          background: 'rgba(63,185,80,0.1)',
                          border: '1px solid rgba(63,185,80,0.3)',
                          borderRadius: 20, color: 'var(--accent-green)',
                          fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap'
                        }}>
                          ● live
                        </span>
                      )}
                    </div>

                    {/* Code Preview */}
                    <div className="project-card-preview">
                      {project.html?.slice(0, 80) || '<!-- empty -->'}
                    </div>

                    {/* Meta */}
                    <div className="project-card-meta">
                      <span className="meta-dot" />
                      <span>{formatDate(project.created_at)}</span>
                      <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 10 }}>
                        #{project.id?.slice(0, 8)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ flex: 1 }}
                        onClick={e => copyURL(e, project.id)}
                      >
                        ⎘ Copy URL
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={e => deleteProject(e, project.id)}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}