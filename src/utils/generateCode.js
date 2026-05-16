export function generateCode(html, css, js) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <script src="https://cdn.tailwindcss.com"></script>

    <style>
      body {
        font-family: sans-serif;
        padding: 10px;
      }

      ${css}
    </style>
  </head>

  <body>
    ${html}

    <script>
      ${js}
    </script>
  </body>
  </html>
  `
}