const express = require('express');
const swaggerUI = require("swagger-ui-express");
const openapi = require("./openapi.json")
const app = express();
const port = 3000;

// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

app.use(express.json());
app.use("/docs", swaggerUI.serve, swaggerUI.setup(openapi));

const SEED_TASKS = [
  { id: 1, title: "Feed the Dog", done: false },
  { id: 2, title: "Walk the Dog", done: false },
  { id: 3, title: "Do Homework in Digital Signal Processing", done: false }
];

let tasks = [...SEED_TASKS.map((task) => ({ ...task }))];

app.get("/", (req, res) => {
  res.json({
    name: "Task API",
    version: "1.0",
    endpoints: ["/tasks"]
  })
});

app.get("/health", (req, res) => {
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

app.put("/tasks/:id", (req, res) => {
  const { title, done } = req.body;
  const id = Number(req.params.id);

  const task = tasks.find(task => task.id === id);

  // Unknown ID
  if (!task) {
    return res.status(404).json({
      error: "Unknown id"
    });
  }

  // Empty body
  if (title === undefined && done === undefined) {
    return res.status(400).json({
      error: "Empty/invalid body"
    });
  }

  // Validate title if provided
  if (title !== undefined) {
    if (String(title).trim() === "") {
      return res.status(400).json({
        error: "Empty/invalid body"
      });
    }

    task.title = title;
  }

  // Validate done if provided
  if (done !== undefined) {
    if (typeof done !== "boolean") {
      return res.status(400).json({
        error: "Empty/invalid body"
      });
    }

    task.done = done;
  }

  // Return updated task
  return res.json(task);
});

app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  const task = tasks.find(task => task.id === id);

  // Unknown id
  if (!task) {
    return res.status(404).json({
      error: "Unknown id"
    });
  }

  // Remove task
  tasks = tasks.filter(task => task.id !== id);

  // Success with empty body
  return res.status(204).send();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
