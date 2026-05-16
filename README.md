# Frontend Playground

> A lightweight, browser-based code playground to write HTML, CSS, JavaScript & Tailwind — with live preview, notes, and instant shareable URLs.

🔗 **Live Demo:** [frontend-playground-two-gray.vercel.app](https://frontend-playground-two-gray.vercel.app)

---

## Features

- ✅ HTML, CSS, JavaScript & **Tailwind CSS** editor
- ✅ Monaco Editor (VS Code-like experience)
- ✅ **Live preview** inside sandboxed iframe
- ✅ **Auto-run** toggle with debounce
- ✅ **Resizable** editor & preview panels
- ✅ **Notes tab** per project
- ✅ Save & Publish separately
- ✅ Shareable public URLs
- ✅ Search & filter projects
- ✅ Delete projects
- ✅ Dark theme with 3D loader animation
- ✅ Deployed on Vercel

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, React Router, Tailwind CSS |
| Editor | Monaco Editor |
| Backend | Supabase (PostgreSQL) |
| Bundler | Vite |
| Hosting | Vercel |

---

## Folder Structure

```text
src/
│
├── components/
│   ├── CodeEditor.jsx
│   └── PreviewFrame.jsx
│
├── pages/
│   ├── HomePage.jsx
│   ├── EditorPage.jsx
│   └── ProjectPage.jsx
│
├── lib/
│   └── supabase.js
│
├── utils/
│   └── generateCode.js
│
├── App.jsx
├── main.jsx
└── index.css
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/p4p-iyush/frontend-playground.git
cd frontend-playground
```

### Install Dependencies

```bash
npm install
```

---

## Setup Supabase

1. Create a project on [Supabase](https://supabase.com)
2. Run this SQL in the Supabase SQL editor:

```sql
create table projects (
  id uuid default gen_random_uuid() primary key,
  title text default 'Untitled Project',
  html text,
  css text,
  js text,
  notes text,
  published boolean default false,
  created_at timestamp default now()
);
```

---

## Environment Variables

Create a `.env` file in the root:

```env
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

---

## Vercel Deployment

Create a `vercel.json` in the root for client-side routing:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## Run Locally

```bash
npm run dev
```

---

## Project Workflow