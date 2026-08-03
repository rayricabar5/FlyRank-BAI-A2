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

// app.post("/tasks", (req, res) => {
//   const {title} = req.body;

//   if (title === undefined || title === null || String(title).trim() === "") {
//     return res
//       .status(400)
//       .json({error: "title is required and cannot be empty"});
//   }

//   const id = tasks.length === 0 ? 1: Math.max(...tasks.map((t) => t.id)) + 1;
//   const task = {id, title: String(title).trim(), done: false};

//   tasks.push(task);
//   res.status(201).json(task);
// });

// app.put("/tasks/:id", (req, res) => {
//   const { title, done } = req.body;
//   const id = Number(req.params.id);

//   const task = tasks.find(task => task.id === id);

//   // Unknown ID
//   if (!task) {
//     return res.status(404).json({
//       error: "Unknown id"
//     });
//   }

//   // Empty body
//   if (title === undefined && done === undefined) {
//     return res.status(400).json({
//       error: "Empty/invalid body"
//     });
//   }

//   // Validate title if provided
//   if (title !== undefined) {
//     if (String(title).trim() === "") {
//       return res.status(400).json({
//         error: "Empty/invalid body"
//       });
//     }

//     task.title = title;
//   }

//   // Validate done if provided
//   if (done !== undefined) {
//     if (typeof done !== "boolean") {
//       return res.status(400).json({
//         error: "Empty/invalid body"
//       });
//     }

//     task.done = done;
//   }

//   // Return updated task
//   return res.json(task);
// });

// app.delete("/tasks/:id", (req, res) => {
//   const id = Number(req.params.id);

//   const task = tasks.find(task => task.id === id);

//   // Unknown id
//   if (!task) {
//     return res.status(404).json({
//       error: "Unknown id"
//     });
//   }

//   // Remove task
//   tasks = tasks.filter(task => task.id !== id);

//   // Success with empty body
//   return res.status(204).send();
// });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
