# Trainee Developer Assignment

## Overview

This assignment has 3 parts:

1. Core Task (Mandatory) ✅
2. Notes Backend (Optional) ✅
3. Notes Frontend (Optional) ✅

---

## 1. Core Task — Bug Fixes ✅

**File:** `core/buggy-code/debugging-assignment.js`

Fixed **15 bugs** in the provided Express.js file:

| # | Line | Bug | Fix |
|---|------|-----|-----|
| 1 | 18 | `res.send(userList)` — undefined variable | Changed to `res.send(allUsers)` |
| 2 | 23 | `u.id === id` — number vs string type mismatch | Added `Number(req.params.id)` |
| 3 | 29 | `getUserById` had no `return` statement | Added `return user` |
| 4 | 32 | `notes.lenght` — typo | Fixed to `notes.length` |
| 5 | 37 | Missing `await` on async `fetchExternalData()` | Added `await` |
| 6 | 42 | `notes = []` — assignment used as condition | Changed to `notes.length === 0` |
| 7 | 52 | `generateNoteId` — function reference, not a call | Added `()` to call it |
| 8 | 57 | `!title && !content` — wrong AND logic | Changed to `\|\|` (OR) |
| 9 | 74 | `n.id === id` — number vs string type mismatch | Added `Number(id)` |
| 10 | 85 | `user.name = username` — undefined variable | Changed to `user.name = name` |
| 11 | 92 | `n.userId = userId` — assignment instead of comparison | Changed to `===` |
| 12 | 99 | `email \|\| password` — OR lets anyone bypass login | Changed to `&&` (AND) |
| 13 | 108 | `users.filter()` returns array, `.name` breaks | Changed to `users.find()` |
| 14 | 114 | `a + b` on strings causes concatenation | Wrapped with `Number()` |
| 15 | 119 | Log said `"port 5000"` but server runs on 3000 | Fixed log message |

---

## 2. Backend — Notes API ✅

**Folder:** `backend/notes-api/`

A REST API built with **Node.js + Express** running on port **5000**.

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/notes` | Get all notes |
| GET | `/notes/:id` | Get a single note by ID |
| POST | `/notes` | Create a new note |
| PUT | `/notes/:id` | Update an existing note |
| DELETE | `/notes/:id` | Delete a note |

### Run the Backend

```bash
cd backend/notes-api
npm install
node index.js
```

Server starts at: `http://localhost:5000`

---

## 3. Frontend — Notes UI ✅

**Folder:** `frontend/notes-ui/`

A responsive Notes UI built with **HTML, CSS, and vanilla JavaScript**.

### Features

- 📋 View all notes in a sidebar list
- ✏️ Create a new note
- 💾 Edit and save an existing note
- 🗑️ Delete a note with confirmation
- 🔍 Search notes by title or content
- ⌨️ Save with `Ctrl+S` keyboard shortcut
- 🔔 Toast notifications for all actions

### Run the Frontend

```bash
cd frontend/notes-ui
npx serve . -l 3001
```

App opens at: `http://localhost:3001`

> **Note:** Make sure the backend API is running on port 5000 before opening the frontend.

---

## Project Structure

```
fullstacktask/
├── core/
│   └── buggy-code/
│       └── debugging-assignment.js   ← Bug fixes (Part 1)
├── backend/
│   └── notes-api/
│       ├── index.js                  ← Express API server
│       └── package.json
├── frontend/
│   └── notes-ui/
│       ├── index.html                ← App markup
│       ├── style.css                 ← Styles
│       └── app.js                    ← App logic
└── README.md
```

---

## Rules

- Used Google / documentation for reference
- Did not copy a full project from the internet
- Code is kept simple and readable

---

## Submission

- Push code to GitHub
- Share repository link

---

## Evaluation Criteria

- Problem solving
- Code quality
- Understanding of basics
- Effort and learning ability
