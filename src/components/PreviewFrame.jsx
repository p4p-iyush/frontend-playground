export default function PreviewFrame({ code }) {
  return (
    <iframe
      title="preview"
      srcDoc={code}
      sandbox="allow-scripts allow-same-origin"
      style={{
        width: '100%',
        height: '100%',
        border: 'none',
        display: 'block',
        background: '#fff',
      }}
    />
  )
}