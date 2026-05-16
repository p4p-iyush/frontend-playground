import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import { supabase } from '../lib/supabase'
import PreviewFrame from '../components/PreviewFrame'

const TABS = [
  { id: 'html',  label: 'index.html',  dotClass: 'html',   lang: 'html' },
  { id: 'css',   label: 'style.css',   dotClass: 'css',    lang: 'css' },
  { id: 'js',    label: 'script.js',   dotClass: 'js',     lang: 'javascript' },
  { id: 'notes', label: 'notes.md',    dotClass: 'notes',  lang: null },
]

export default function EditorPage() {
  const navigate   = useNavigate()
  const { id }     = useParams()

  const [title,     setTitle]     = useState('My Project')
  const [html,      setHtml]      = useState('<h1 class="text-3xl font-bold text-center mt-10 text-blue-400">Hello Tailwind! 👋</h1>\n<p class="text-center text-gray-400 mt-4">Start coding below...</p>')
  const [css,       setCss]       = useState('body {\n  background: #0d1117;\n  font-family: sans-serif;\n}')
  const [js,        setJs]        = useState('console.log("Hello from Frontend Playground!")')
  const [notes,     setNotes]     = useState('')
  const [activeTab, setActiveTab] = useState('html')
  const [srcDoc,    setSrcDoc]    = useState('')
  const [saving,    setSaving]    = useState(false)
  const [autoRun,   setAutoRun]   = useState(false)
  const [panelWidth, setPanelWidth] = useState(50) // percent

  // Resizer
  const containerRef = useRef(null)
  const isDragging   = useRef(false)

  const finalCode = useMemo(() => `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script src="https://cdn.tailwindcss.com"></script>
  <style>${css}</style>
</head>
<body>
  ${html}
  <script>${js}<\/script>
</body>
</html>`, [html, css, js])

  // Auto-run
  useEffect(() => {
    if (!autoRun) return
    const t = setTimeout(() => setSrcDoc(finalCode), 600)
    return () => clearTimeout(t)
  }, [finalCode, autoRun])

  // Load existing project
  useEffect(() => {
    if (!id) return
    async function load() {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single()
      if (error) { console.error(error); return }
      setTitle(data.title || 'My Project')
      setHtml(data.html   || '')
      setCss(data.css     || '')
      setJs(data.js       || '')
      setNotes(data.notes || '')
      setSrcDoc(`<!DOCTYPE html><html><head>
        <script src="https://cdn.tailwindcss.com"><\/script>
        <style>${data.css}</style></head>
        <body>${data.html}
        <script>${data.js}<\/script></body></html>`)
    }
    load()
  }, [id])

  // ── Resizer mouse events ──
  const onMouseDown = useCallback((e) => {
    e.preventDefault()
    isDragging.current = true
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'

    const onMove = (e) => {
      if (!isDragging.current || !containerRef.current) return
      const rect  = containerRef.current.getBoundingClientRect()
      const ratio = ((e.clientX - rect.left) / rect.width) * 100
      setPanelWidth(Math.min(Math.max(ratio, 20), 80))
    }

    const onUp = () => {
      isDragging.current = false
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [])

  function runCode() { setSrcDoc(finalCode) }

  async function saveProject() {
    setSaving(true)
    try {
      if (id) {
        await supabase.from('projects').update({ title, html, css, js, notes }).eq('id', id)
        alert('Project saved!')
      } else {
        const { data, error } = await supabase
          .from('projects')
          .insert([{ title, html, css, js, notes }])
          .select()
        if (error) throw error
        navigate(`/editor/${data[0].id}`)
      }
    } catch (err) {
      console.error(err)
      alert('Save failed')
    }
    setSaving(false)
  }

  async function publishProject() {
    setSaving(true)
    try {
      if (id) {
        await supabase.from('projects').update({ title, html, css, js, notes, published: true }).eq('id', id)
        navigate(`/p/${id}`)
      } else {
        const { data, error } = await supabase
          .from('projects')
          .insert([{ title, html, css, js, notes, published: true }])
          .select()
        if (error) throw error
        navigate(`/p/${data[0].id}`)
      }
    } catch (err) {
      console.error(err)
      alert('Publish failed')
    }
    setSaving(false)
  }

  const editorValue = { html, css, js }[activeTab] ?? notes
  const editorOnChange = {
    html:  (v) => setHtml(v  ?? ''),
    css:   (v) => setCss(v   ?? ''),
    js:    (v) => setJs(v    ?? ''),
    notes: (v) => setNotes(v ?? ''),
  }[activeTab]

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-base)' }}>

      {/* ── TOP BAR ── */}
      <div className="editor-topbar">
        {/* Left: logo + title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => navigate('/')}
            className="btn btn-ghost btn-sm"
            title="Back to Home"
          >
            ← Home
          </button>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="editor-title-input"
            placeholder="Project title..."
          />
        </div>

        {/* Right: actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

          {/* Auto-run toggle */}
          <label style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontFamily: 'var(--font-mono)', fontSize: 11,
            color: autoRun ? 'var(--accent-green)' : 'var(--text-muted)',
            cursor: 'pointer'
          }}>
            <div
              onClick={() => setAutoRun(p => !p)}
              style={{
                width: 32, height: 18, borderRadius: 9,
                background: autoRun ? 'var(--accent-green)' : 'var(--bg-hover)',
                border: '1px solid var(--border)',
                position: 'relative', cursor: 'pointer', transition: 'background 0.2s'
              }}
            >
              <div style={{
                position: 'absolute', top: 2,
                left: autoRun ? 15 : 2,
                width: 12, height: 12, borderRadius: '50%',
                background: '#fff', transition: 'left 0.2s'
              }} />
            </div>
            Auto
          </label>

          <button className="btn btn-ghost btn-sm" onClick={runCode}>
            ▶ Run
          </button>

          <button className="btn btn-ghost btn-sm" onClick={saveProject} disabled={saving}>
            {saving ? '...' : '↓ Save'}
          </button>

          <button className="btn btn-primary btn-sm" onClick={publishProject} disabled={saving}>
            ⬆ Publish
          </button>
        </div>
      </div>

      {/* ── EDITOR + PREVIEW ── */}
      <div ref={containerRef} className="editor-layout" style={{ flex: 1, overflow: 'hidden' }}>

        {/* LEFT: Editor Panel */}
        <div className="editor-panel" style={{ width: `${panelWidth}%` }}>

          {/* File Tabs */}
          <div className="file-tabs">
            {TABS.map(tab => (
              <button
                key={tab.id}
                className={`file-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className={`tab-dot ${tab.dotClass}`} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Editor Area */}
          <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
            {activeTab === 'notes' ? (
              <textarea
                className="notes-area"
                placeholder={`# Project Notes\n\nWrite anything here — todos, ideas, references...\n\nSupports plain text & markdown-style notes.`}
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            ) : (
              <Editor
                height="100%"
                theme="vs-dark"
                language={TABS.find(t => t.id === activeTab)?.lang}
                value={editorValue}
                onChange={editorOnChange}
                options={{
                  fontSize: 13,
                  fontFamily: 'JetBrains Mono, monospace',
                  fontLigatures: true,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  lineNumbers: 'on',
                  wordWrap: 'on',
                  padding: { top: 12 },
                  smoothScrolling: true,
                  cursorBlinking: 'smooth',
                  renderLineHighlight: 'gutter',
                }}
              />
            )}
          </div>
        </div>

        {/* ── RESIZER ── */}
        <div className="resizer" onMouseDown={onMouseDown} />

        {/* RIGHT: Preview Panel */}
        <div className="preview-panel">
          <div className="preview-topbar">
            <div className="preview-status">
              <span className="status-dot" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>
                Preview {autoRun ? '· auto' : ''}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 10,
                color: 'var(--accent-blue)',
                background: 'rgba(56,139,253,0.08)',
                border: '1px solid rgba(56,139,253,0.2)',
                borderRadius: 4, padding: '2px 7px'
              }}>
                Tailwind ✓
              </span>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setSrcDoc('')}
                title="Clear preview"
              >
                ✕
              </button>
            </div>
          </div>

          <div style={{ flex: 1, overflow: 'hidden' }}>
            <PreviewFrame code={srcDoc} />
          </div>
        </div>

      </div>
    </div>
  )
}