const fs = require('fs');
const path = require('path');

// Testlerde DATA_FILE ile farklı bir JSON dosyası kullanılabilir.
const dataFile = process.env.DATA_FILE || path.join(__dirname, '../../data/tasks.json');

function readTasks() {
  if (!fs.existsSync(dataFile)) {
    return [];
  }

  return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
}

function saveTasks(tasks) {
  fs.mkdirSync(path.dirname(dataFile), { recursive: true });
  fs.writeFileSync(dataFile, JSON.stringify(tasks, null, 2) + '\n', 'utf8');
}

function getAll() {
  return readTasks();
}

function getById(id) {
  return readTasks().find((task) => task.id === id);
}

function add(task) {
  const tasks = readTasks();
  tasks.push(task);
  saveTasks(tasks);
  return task;
}

function update(id, changes) {
  const tasks = readTasks();
  const index = tasks.findIndex((task) => task.id === id);

  if (index === -1) {
    return null;
  }

  tasks[index] = { ...tasks[index], ...changes };
  saveTasks(tasks);
  return tasks[index];
}

function remove(id) {
  const tasks = readTasks();
  const index = tasks.findIndex((task) => task.id === id);

  if (index === -1) {
    return false;
  }

  tasks.splice(index, 1);
  saveTasks(tasks);
  return true;
}

module.exports = { getAll, getById, add, update, remove };
