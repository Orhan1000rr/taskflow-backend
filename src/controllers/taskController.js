const { randomUUID } = require('crypto');
const taskStore = require('../models/taskStore');

const validStatuses = ['pending', 'in-progress', 'completed'];
const validPriorities = ['low', 'medium', 'high'];
const editableFields = ['title', 'description', 'assignee', 'priority', 'status'];

// Gelişmiş validation middleware yerine temel alan kontrolü yapılıyor.
function checkTask(task) {
  if (typeof task.title !== 'string' || !task.title.trim()) {
    return 'Görev başlığı (title) boş olamaz.';
  }
  if (typeof task.description !== 'string') {
    return 'Açıklama (description) metin olmalıdır.';
  }
  if (typeof task.assignee !== 'string' || !task.assignee.trim()) {
    return 'Görev sorumlusu (assignee) boş olamaz.';
  }
  if (!validPriorities.includes(task.priority)) {
    return 'Öncelik (priority) low, medium veya high olmalıdır.';
  }
  if (!validStatuses.includes(task.status)) {
    return 'Durum (status) pending, in-progress veya completed olmalıdır.';
  }
  return null;
}

function listTasks(req, res) {
  res.json(taskStore.getAll());
}

function getTask(req, res) {
  const task = taskStore.getById(req.params.id);
  if (!task) {
    return res.status(404).json({ message: 'Görev bulunamadı.' });
  }
  return res.json(task);
}

function createTask(req, res) {
  const body = req.body || {};
  const now = new Date().toISOString();
  const task = {
    id: randomUUID(),
    title: body.title,
    description: body.description === undefined ? '' : body.description,
    assignee: body.assignee,
    priority: body.priority === undefined ? 'medium' : body.priority,
    status: body.status === undefined ? 'pending' : body.status,
    createdAt: now,
    updatedAt: now
  };

  const error = checkTask(task);
  if (error) {
    return res.status(400).json({ message: error });
  }

  task.title = task.title.trim();
  task.assignee = task.assignee.trim();
  taskStore.add(task);
  return res.status(201).json(task);
}

function updateTask(req, res) {
  const currentTask = taskStore.getById(req.params.id);
  if (!currentTask) {
    return res.status(404).json({ message: 'Görev bulunamadı.' });
  }

  // Sadece gönderilen alanları değiştir. id ve tarihleri istemci değiştiremez.
  const changes = {};
  for (const field of editableFields) {
    if (Object.prototype.hasOwnProperty.call(req.body || {}, field)) {
      changes[field] = req.body[field];
    }
  }
  if (Object.keys(changes).length === 0) {
    return res.status(400).json({ message: 'Güncellenecek en az bir alan gönderilmelidir.' });
  }

  const draft = { ...currentTask, ...changes };
  const error = checkTask(draft);
  if (error) {
    return res.status(400).json({ message: error });
  }

  if (typeof changes.title === 'string') changes.title = changes.title.trim();
  if (typeof changes.assignee === 'string') changes.assignee = changes.assignee.trim();
  changes.updatedAt = new Date().toISOString();

  const updated = taskStore.update(req.params.id, changes);
  return res.json(updated);
}

function deleteTask(req, res) {
  const removed = taskStore.remove(req.params.id);
  if (!removed) {
    return res.status(404).json({ message: 'Görev bulunamadı.' });
  }
  return res.json({ message: 'Görev silindi.', id: req.params.id });
}

module.exports = { listTasks, getTask, createTask, updateTask, deleteTask };
