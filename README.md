# Frontend Playground

A frontend playground platform where users can create, edit, preview, save, and publish HTML, CSS, and JavaScript projects with live preview and shareable URLs.

---

# Features

* HTML, CSS, and JavaScript editor
* Monaco Editor integration
* Live preview using iframe
* Tailwind CSS support
* Publish projects with unique URLs
* View all published projects
* Delete projects
* Responsive dark UI

---

# Tech Stack

## Frontend

* React
* React Router
* Tailwind CSS
* Monaco Editor
* Vite

## Backend Service

* Supabase

---

# Folder Structure

```text
src/
│
├── components/
│   ├── PreviewFrame.jsx
│
├── pages/
│   ├── HomePage.jsx
│   ├── EditorPage.jsx
│   ├── ProjectPage.jsx
│
├── lib/
│   ├── supabase.js
│
├── App.jsx
├── main.jsx
└── index.css
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/p4p-iyush/frontend-playground.git
```

## Move Into Project

```bash
cd frontend-playground
```

## Install Dependencies

```bash
npm install
```

---

# Setup Supabase

Create a project on Supabase.

Create table:

```sql
create table projects (
  id uuid default gen_random_uuid() primary key,
  title text default 'Untitled Project',
  html text,
  css text,
  js text,
  created_at timestamp default now()
);
```

---

# Environment Variables

Create `.env` file:

```env
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

---

# Run Project

```bash
npm run dev
```

---

# Project Workflow

1. Create project
2. Write HTML, CSS, and JS code
3. Run live preview
4. Publish project
5. Share generated URL

---

# Future Improvements

* Authentication
* Edit existing projects
* Project templates
* File uploads
* Custom domains
* AI code generation

---

# Author

Piyush Jain
