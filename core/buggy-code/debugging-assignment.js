const express = require("express");
const app = express();

app.use(express.json());

const users = [
  { id: 1, name: "Amit", email: "amit@test.com" },
  { id: 2, name: "Riya", email: "riya@test.com" }
];

const notes = [
  { id: 1, title: "Note 1", content: "Content 1", userId: 1 },
  { id: 2, title: "Note 2", content: "Content 2", userId: 2 }
];

// BUG 1 FIXED: was sending undefined variable `userList`, should be `allUsers`
app.get("/users", (req, res) => {
  const allUsers = users;
  res.send(allUsers);
});

// BUG 2 FIXED: req.params.id is a string, must convert to Number before comparing
app.get("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find(u => u.id === id);
  res.send(user);
});

// BUG 3 FIXED: function was not returning the result
function getUserById(id) {
  const user = users.find(u => u.id === id);
  return user;
}

// BUG 4 FIXED: `notes.lenght` is a typo, should be `notes.length`
app.get("/notes/count", (req, res) => {
  const total = notes.length;
  res.send({ total });
});

// BUG 5 FIXED: missing `await` on async call to fetchExternalData()
app.get("/external-data", async (req, res) => {
  const data = await fetchExternalData();
  res.send(data);
});

// BUG 6 FIXED: `notes = []` is an assignment (=), should use `notes.length === 0` for comparison
app.get("/notes", (req, res) => {
  if (notes.length === 0) {
    console.log("No notes found");
  }
  res.send(notes);
});

function generateNoteId() {
  return Math.floor(Math.random() * 1000);
}

// BUG 7 FIXED: `generateNoteId` was a reference, not a function call — missing ()
const newId = generateNoteId();

// BUG 8 FIXED: `!title && !content` should be `||` — reject if EITHER is missing
app.post("/notes", (req, res) => {
  const { title, content, userId } = req.body;

  if (!title || !content) {
    return res.status(400).send("Invalid input");
  }

  const newNote = {
    id: newId,
    title: title,
    content: content,
    userId: userId
  };

  notes.push(newNote);
  res.send(newNote);
});

// BUG 9 FIXED: req.params.id is a string, must convert to Number before comparing
app.delete("/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  const noteIndex = notes.findIndex(n => n.id === id);

  notes.splice(noteIndex, 1);
  res.send({ message: "Note deleted" });
});

// BUG 10 FIXED: `user.name = username` — `username` is undefined, should be `name`
app.put("/users/:id", (req, res) => {
  const id = req.params.id;
  const { name } = req.body;

  const user = users.find(u => u.id == id);
  user.name = name;

  res.send(user);
});

// BUG 11 FIXED: `n.userId = userId` is an assignment (=), should be `===` for comparison
app.get("/user-notes/:userId", (req, res) => {
  const userId = req.params.userId;
  const userNotes = notes.filter(n => n.userId === Number(userId));
  res.send(userNotes);
});

// BUG 12 FIXED: `||` (OR) should be `&&` (AND) — both email AND password must match for login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "admin@test.com" && password === "123456") {
    res.send({ message: "Login successful" });
  } else {
    res.send({ message: "Invalid credentials" });
  }
});

// BUG 13 FIXED: `users.filter()` returns an array, not a single user — use `find()` instead
app.get("/profile/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find(u => u.id === id);
  res.send(user.name);
});

// BUG 14 FIXED: a+b with string inputs does concatenation — parse to numbers first
app.post("/sum", (req, res) => {
  const { a, b } = req.body;
  const total = Number(a) + Number(b);
  res.send({ total });
});

// BUG 15 FIXED: server listens on 3000 but log said "port 5000" — corrected the message
app.listen(3000, () => {
  console.log("Server running on port 3000");
});