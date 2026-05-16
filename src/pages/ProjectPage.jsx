import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import PreviewFrame from '../components/PreviewFrame'

export default function ProjectPage() {
  const { id }       = useParams()
  const navigate     = useNavigate()
  const [code,       setCode]       = useState('')
  const [project,    setProject]    = useState(null)
  const [loading,    setLoading]    = useState(true)
  const [notFound,   setNotFound]   = useState(false)
  const [copied,     setCopied]     = useState(false)

  useEffect(() => { fetchProject() }, [id])

  async function fetchProject() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) { setNotFound(true); setLoading(false); return }

    setProject(data)
    setCode(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script src="https://cdn.tailwindcss.com"><\/script>
  <style>${data.css}</style>
</head>
<body>
  ${data.html}
  <script>${data.js}<\/script>
</body>
</html>`)
    setLoading(false)
  }

  function copyURL() {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function formatDate(d) {
    return new Date(d).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric'
    })
  }

  // ── Loading ──
  if (loading) return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-base)', gap: 24
    }}>
      <div className="loader-3d" style={{ width: 56, height: 56 }}>
        <div className="loader-cube">
          <div className="face front">&lt;/&gt;</div>
          <div className="face back">&lt;/&gt;</div>
          <div className="face left">&lt;/&gt;</div>
          <div className="face right">&lt;/&gt;</div>
          <div className="face top">&lt;/&gt;</div>
          <div className="face bottom">&lt;/&gt;</div>
        </div>
      </div>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>
        Loading project...
      </p>
    </div>
  )

  // ── Not Found ──
  if (notFound) return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-base)', gap: 16, textAlign: 'center', padding: 24
    }}>
      <div className="bg-grid" />
      <div className="bg-glow" />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 64, marginBottom: 16, opacity: 0.4 }}>◻</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
          Project Not Found
        </h1>
        <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 13, marginBottom: 28 }}>
          This project doesn't exist or was deleted.
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          ← Back to Playground
        </button>
      </div>
    </div>
  )

  // ── Main ──
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-base)' }}>

      {/* TOP BAR */}
      <div style={{
        height: 52, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 16px',
        borderBottom: '1px solid var(--border)',
        background: 'rgba(8,11,16,0.9)', backdropFilter: 'blur(12px)',
        flexShrink: 0, gap: 12
      }}>

        {/* Left */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/')}>
            ← Home
          </button>

          <div style={{ width: 1, height: 20, background: 'var(--border)' }} />

          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 13,
            fontWeight: 600, color: 'var(--text-primary)'
          }}>
            {project?.title}
          </span>

          <span style={{
            fontSize: 10, padding: '2px 8px',
            background: 'rgba(63,185,80,0.1)',
            border: '1px solid rgba(63,185,80,0.3)',
            borderRadius: 20, color: 'var(--accent-green)',
            fontFamily: 'var(--font-mono)'
          }}>
            ● live
          </span>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {project?.created_at && (
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 11,
              color: 'var(--text-muted)'
            }}>
              {formatDate(project.created_at)}
            </span>
          )}

          <button className="btn btn-ghost btn-sm" onClick={copyURL}>
            {copied ? '✓ Copied!' : '⎘ Copy URL'}
          </button>

          <button
            className="btn btn-primary btn-sm"
            onClick={() => navigate(`/editor/${id}`)}
          >
            ✎ Edit
          </button>
        </div>
      </div>

      {/* PREVIEW — full remaining height */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <PreviewFrame code={code} />
      </div>

    </div>
  )
}