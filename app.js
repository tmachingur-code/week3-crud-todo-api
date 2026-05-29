const express = require('express');
require('dotenv').config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3002;

// =====================
// In-memory database
// =====================
let todos = [
  { id: 1, task: 'Learn Node.js', completed: false },
  { id: 2, task: 'Build CRUD API', completed: false },
];

// ID system
let nextId = todos.length + 1;


// =====================
// ROOT ROUTE
// =====================
app.get('/', (req, res) => {
  res.send('API running');
});


// =====================
// ACTIVE TODOS 
// =====================
app.get('/todos/active', (req, res) => {
  const active = todos.filter(t => !t.completed);
  res.status(200).json(active);
});


// =====================
// COMPLETED TODOS
// =====================
app.get('/todos/completed', (req, res) => {
  const completed = todos.filter(t => t.completed);
  res.status(200).json(completed);
});


// =====================
// GET ALL TODOS
// =====================
app.get('/todos', (req, res) => {
  res.status(200).json(todos);
});


// =====================
// GET SINGLE TODO
// =====================
app.get('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);

  const todo = todos.find(t => t.id === id);

  if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  res.status(200).json(todo);
});


// =====================
// CREATE TODO 
// =====================
app.post('/todos', (req, res) => {
  const { task, completed } = req.body;

  if (!task) {
    return res.status(400).json({
      message: '"task" field is required',
    });
  }

  const newTodo = {
    id: nextId++,
    task,
    completed: completed ?? false,
  };

  todos.push(newTodo);

  res.status(201).json(newTodo);
});


// =====================
// UPDATE TODO
// =====================
app.patch('/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));

  if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  Object.assign(todo, req.body);

  res.status(200).json(todo);
});


// =====================
// DELETE TODO
// =====================
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);

  const initialLength = todos.length;

  todos = todos.filter(t => t.id !== id);

  if (todos.length === initialLength) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  res.status(204).send();
});


// =====================
// ERROR HANDLER
// =====================
app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Server error!' });
});


// =====================
// START SERVER
// =====================
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});