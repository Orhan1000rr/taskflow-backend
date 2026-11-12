const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'taskflow-controller-'));
process.env.DATA_FILE = path.join(tempDir, 'tasks.json');
const controller = require('../src/controllers/taskController');

function mockResponse() {
  return {
    code: 200,
    payload: null,
    status(value) { this.code = value; return this; },
    json(value) { this.payload = value; return this; }
  };
}

test('Controller ile beş CRUD işlemi ve hata yanıtı', () => {
  try {
    const created = mockResponse();
    controller.createTask({ body: { title: 'Sunumu hazırla', assignee: 'Musa', priority: 'high' } }, created);
    assert.equal(created.code, 201);
    assert.equal(created.payload.status, 'pending');
    const id = created.payload.id;

    const listed = mockResponse();
    controller.listTasks({}, listed);
    assert.equal(listed.payload.length, 1);

    const detail = mockResponse();
    controller.getTask({ params: { id } }, detail);
    assert.equal(detail.payload.title, 'Sunumu hazırla');

    const updated = mockResponse();
    controller.updateTask({ params: { id }, body: { status: 'completed' } }, updated);
    assert.equal(updated.payload.status, 'completed');

    const invalid = mockResponse();
    controller.createTask({ body: { title: '', assignee: 'Musa' } }, invalid);
    assert.equal(invalid.code, 400);

    const deleted = mockResponse();
    controller.deleteTask({ params: { id } }, deleted);
    assert.equal(deleted.code, 200);

    const missing = mockResponse();
    controller.getTask({ params: { id } }, missing);
    assert.equal(missing.code, 404);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
