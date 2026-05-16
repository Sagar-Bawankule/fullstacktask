const API_URL = "http://localhost:5000";

let notes = [];
let activeNoteId = null;
let isNewNote = false;

// ─── DOM Elements ───────────────────────────────
const notesList     = document.getElementById("notes-list");
const notesCount    = document.getElementById("notes-count");
const searchInput   = document.getElementById("search-input");
const emptyState    = document.getElementById("empty-state");
const editor        = document.getElementById("editor");
const noteTitle     = document.getElementById("note-title");
const noteContent   = document.getElementById("note-content");
const editorMeta    = document.getElementById("editor-meta");
const saveBtn       = document.getElementById("save-btn");
const deleteBtn     = document.getElementById("delete-btn");
const newNoteBtn    = document.getElementById("new-note-btn");
const emptyNewBtn   = document.getElementById("empty-new-btn");
const toast         = document.getElementById("toast");

// ─── Toast ───────────────────────────────
function showToast(msg, type = "success") {
  toast.textContent = msg;
  toast.className = `toast ${type}`;
  setTimeout(() => { toast.className = "toast hidden"; }, 3000);
}

// ─── Format Date ───────────────────────────────
function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ─── Render Sidebar List ───────────────────────────────
function renderList(data) {
  notesList.innerHTML = "";
  notesCount.textContent = `${data.length} note${data.length !== 1 ? "s" : ""}`;

  if (data.length === 0) {
    notesList.innerHTML = `<li style="padding:20px;text-align:center;color:var(--text-muted);font-size:13px;">No notes found</li>`;
    return;
  }

  data.forEach(note => {
    const li = document.createElement("li");
    li.className = `note-item${note.id === activeNoteId ? " active" : ""}`;
    li.dataset.id = note.id;
    li.innerHTML = `
      <div class="note-item-title">${escapeHtml(note.title)}</div>
      <div class="note-item-preview">${escapeHtml(note.content)}</div>
      <div class="note-item-date">${formatDate(note.createdAt)}</div>
    `;
    li.addEventListener("click", () => openNote(note.id));
    notesList.appendChild(li);
  });
}

// ─── Escape HTML ───────────────────────────────
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// ─── Show Editor / Empty State ───────────────────────────────
function showEditor() {
  emptyState.classList.add("hidden");
  editor.classList.remove("hidden");
}

function showEmptyState() {
  editor.classList.add("hidden");
  emptyState.classList.remove("hidden");
  activeNoteId = null;
  isNewNote = false;
}

// ─── Open a Note ───────────────────────────────
function openNote(id) {
  const note = notes.find(n => n.id === id);
  if (!note) return;

  activeNoteId = id;
  isNewNote = false;
  noteTitle.value = note.title;
  noteContent.value = note.content;
  editorMeta.textContent = `Created on ${formatDate(note.createdAt)}`;
  showEditor();
  renderList(getFilteredNotes());
}

// ─── Open New Note Form ───────────────────────────────
function openNewNote() {
  activeNoteId = null;
  isNewNote = true;
  noteTitle.value = "";
  noteContent.value = "";
  editorMeta.textContent = "Unsaved new note";
  showEditor();
  noteTitle.focus();

  // Deselect all in list
  document.querySelectorAll(".note-item").forEach(el => el.classList.remove("active"));
}

// ─── Get Filtered Notes ───────────────────────────────
function getFilteredNotes() {
  const q = searchInput.value.toLowerCase().trim();
  if (!q) return notes;
  return notes.filter(n =>
    n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
  );
}

// ─── Fetch All Notes ───────────────────────────────
async function fetchNotes() {
  try {
    const res = await fetch(`${API_URL}/notes`);
    if (!res.ok) throw new Error("Failed to fetch");
    notes = await res.json();
    renderList(getFilteredNotes());
  } catch (err) {
    showToast("Cannot connect to API. Is the server running?", "error");
  }
}

// ─── Save (Create or Update) ───────────────────────────────
async function saveNote() {
  const title   = noteTitle.value.trim();
  const content = noteContent.value.trim();

  if (!title || !content) {
    showToast("Title and content are required", "error");
    return;
  }

  try {
    let res, data;

    if (isNewNote) {
      res  = await fetch(`${API_URL}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content })
      });
      data = await res.json();
      if (!res.ok) throw new Error(data.error);
      notes.unshift(data);
      activeNoteId = data.id;
      isNewNote = false;
      editorMeta.textContent = `Created on ${formatDate(data.createdAt)}`;
      showToast("Note created ✓");
    } else {
      res  = await fetch(`${API_URL}/notes/${activeNoteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content })
      });
      data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const idx = notes.findIndex(n => n.id === activeNoteId);
      if (idx !== -1) notes[idx] = data;
      showToast("Note saved ✓");
    }

    renderList(getFilteredNotes());
  } catch (err) {
    showToast(err.message || "Save failed", "error");
  }
}

// ─── Delete Note ───────────────────────────────
async function deleteNote() {
  if (!activeNoteId) return;
  if (!confirm("Delete this note?")) return;

  try {
    const res = await fetch(`${API_URL}/notes/${activeNoteId}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Delete failed");
    notes = notes.filter(n => n.id !== activeNoteId);
    showEmptyState();
    renderList(getFilteredNotes());
    showToast("Note deleted");
  } catch (err) {
    showToast("Failed to delete note", "error");
  }
}

// ─── Event Listeners ───────────────────────────────
newNoteBtn.addEventListener("click", openNewNote);
emptyNewBtn.addEventListener("click", openNewNote);
saveBtn.addEventListener("click", saveNote);
deleteBtn.addEventListener("click", deleteNote);
searchInput.addEventListener("input", () => renderList(getFilteredNotes()));

// Save with Ctrl+S
document.addEventListener("keydown", e => {
  if ((e.ctrlKey || e.metaKey) && e.key === "s") {
    e.preventDefault();
    saveNote();
  }
});

// ─── Init ───────────────────────────────
fetchNotes();
