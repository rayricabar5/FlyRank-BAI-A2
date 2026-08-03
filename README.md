# Task API

A simple RESTful Task API built with **Node.js**, **Express**, and **SQLite**. The API supports creating, reading, updating, and deleting tasks (CRUD) while storing data in a local SQLite database.

---

## Technologies Used

- Node.js
- Express.js
- SQLite
- better-sqlite3
- Swagger UI

---

## Why SQLite?

SQLite was chosen because it is a lightweight, serverless relational database that stores all data in a single file. It is easy to set up, requires no separate database server, and is well suited for small applications and learning REST API development.

---

## Database Location

The SQLite database is stored locally in the project root as:

```
tasks.db
```

The database and its `tasks` table are automatically created when the application starts if they do not already exist.

---

## How to Start the Project

1. Install the project dependencies:

```bash
npm install
```

2. Start the server:

```bash
node index.js
```

3. Open the API in your browser:

```
http://localhost:3000/
```

Swagger documentation is available at:

```
http://localhost:3000/docs
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | Retrieve all tasks |
| GET | `/tasks/:id` | Retrieve a task by ID |
| POST | `/tasks` | Create a new task |
| PUT | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

---

## Database Screenshot

<img width="777" height="473" alt="Screenshot 2026-08-03 190142" src="https://github.com/user-attachments/assets/c24efdbd-0d7b-4179-8cdc-c28477695022" />


## Example SQL Query

<img width="438" height="410" alt="Screenshot 2026-08-03 190158" src="https://github.com/user-attachments/assets/2de62f7f-162c-45d2-8e61-6cf7052ee1eb" />


Example output:

| id | title | done |
|---:|-------------------------------|-----:|
| 1 | Feed the Dog | 0 |
| 2 | Walk the Dog | 0 |
| 3 | Do Homework in Digital Signal Processing | 0 |

---

## Project Structure

```
.
├── index.js
├── openapi.json
├── package.json
├── tasks.db
└── README.md
```
