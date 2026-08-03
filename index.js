const express = require('express');
const swaggerUI = require("swagger-ui-express");
const openapi = require("./openapi.json")
const Database = require("better-sqlite3");
const app = express();

const db = new Database("tasks.db");
const port = 3000;

app.use(express.json());
app.use("/docs", swaggerUI.serve, swaggerUI.setup(openapi));

//CONSTANT TASKS
const SEED_TASKS = [
  { title: "Feed the Dog", done: 0 },
  { title: "Walk the Dog", done: 0 },
  { title: "Do Homework in Digital Signal Processing", done: 0 }
];


//CREATE TABLE IF NOT EXISTS tasks
db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY,
        title TEXT,
        done BOOLEAN
    );
`);

//Prepare statements for database operations
const getAllTasks = db.prepare (`SELECT * FROM tasks`);
const getTask = db.prepare (`
  SELECT * FROM tasks WHERE id = ?
  `);
const add_tasks = db.prepare(`
    INSERT INTO tasks (title, done)
    VALUES(?, ?)
`);

const updateTask = db.prepare(`
    UPDATE tasks
    SET title = ?,
      done = ?
    WHERE id = ?`);

const deleteTask = db.prepare(`
    DELETE FROM tasks
    WHERE id = ?
  `);

const table_size = db.prepare(`
    SELECT COUNT(*) as count FROM tasks
`);


//table initialization and seeding
if (table_size.get().count === 0) {
    for (const task of SEED_TASKS) {
        add_tasks.run(task.title, task.done);
    }
}
else {
    console.log("Table already seeded!");
}

console.log("Table created!");

//Health and status check
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

//SHOW TASKS OR SPECIFIC TASK//

app.get("/tasks", (req, res) => {
  const allTasks = getAllTasks.all();
  res.json(allTasks);
});

app.get("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const specificTask = getTask.get(id);

  if (!specificTask) {
    return res.status(404).json({ error: `Task ${id} not found` });
  }
  res.json(specificTask);
});

//ADD TASKS//

app.post("/tasks", (req, res) => {
  const {title} = req.body;

  if (title === undefined || title === null || String(title).trim() === "") {
    return res
      .status(400)
      .json({error: "title is required and cannot be empty"});
  }

  add_tasks.run(String(title).trim(), 0);

  res.status(201).json({message: "new task added"});
});

//UPDATE//

app.put("/tasks/:id", (req, res) => {
  const { title, done } = req.body;
  const id = Number(req.params.id);

  const task = getTask.get(id);

  if (!task) {
      return res.status(404).json({
          error: "Unknown id"
      });
  }

  if (title === undefined && done === undefined) {
    return res.status(400).json({
      error: "Empty/invalid body"
    });
  }

  if (title !== undefined && String(title).trim() === "") {
    return res.status(400).json({
      error: "Empty/invalid body"
    });
  }

  if (done !== undefined && typeof done !== "boolean") {
    return res.status(400).json({
      error: "Empty/invalid body"
    });
  }

  const newTitle = title ?? task.title;
  const newDone = done === undefined ? task.done : (done ? 1 : 0);

  updateTask.run(String(newTitle).trim(), newDone, id);

  return res.json(getTask.get(id));
});

//DELETE TASK

app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  const task = getTask.get(id);

  // Unknown id
  if (!task) {
    return res.status(404).json({
      error: "Unknown id"
    });
  }

  // Remove task
  deleteTask.run(id);

  // Success with empty body
  return res.status(204).send();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
