export default function PreviewFrame({ code }) {
  return (
    <iframe
      title="preview"
      srcDoc={code}
      sandbox="allow-scripts"
      className="w-full h-full border-0"
    />
  )
}