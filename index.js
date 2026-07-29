const express = require('express');
const app = express();
const port = 3000;

// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

app.use(express.json());

const SEED_TASKS = [
  { id: 1, title: "Feed the Dog", done: false },
  { id: 2, title: "Walk the Dog", done: false },
  { id: 3, title: "Do Homework in Digital Signal Processing", done: false }
];

const tasks = [...SEED_TASKS.map((task) => ({ ...task }))];

app.get("/", (req, res) => {
  res.json({
    name: "Task API",
    version: "1.0",
    endpoints: ["/tasks"]
  })
});

app.get("health", (req, res) => {
  res.json({status: "ok"});
});

app.get("/tasks", (req, res) => {
  res.json(tasks);
});

app.get("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ error: `Task ${id} not found` });
  }
  res.json(task);
});

app.post("/tasks", (req, res) => {
  const {title} = req.body;

  if (title === undefined || title === null || String(title).trim() === "") {
    return res
      .status(400)
      .json({error: "title is required and cannot be empty"});
  }

  const id = tasks.length === 0 ? 1: Math.max(...tasks.map((t) => t.id)) + 1;
  const task = {id, title: String(title).trim(), done: false};

  tasks.push(task);
  res.status(201).json(task);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
