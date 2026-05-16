import Editor from '@monaco-editor/react'

export default function CodeEditor({
  language,
  value,
  onChange
}) {
  return (
    <Editor
      height="100%"
      language={language}
      value={value}
      onChange={onChange}
      theme="vs-dark"
    />
  )
}