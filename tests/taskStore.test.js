const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'taskflow-store-'));
process.env.DATA_FILE = path.join(tempDir, 'tasks.json');
const store = require('../src/models/taskStore');

test('JSON veri dosyası üzerinde ekleme, listeleme, güncelleme ve silme', () => {
  try {
    assert.deepEqual(store.getAll(), []);
    const task = { id: 'task-1', title: 'Dokümantasyon', status: 'pending' };
    store.add(task);
    assert.equal(store.getAll().length, 1);
    assert.equal(store.getById('task-1').title, 'Dokümantasyon');
    assert.equal(store.update('task-1', { status: 'completed' }).status, 'completed');
    assert.equal(store.remove('task-1'), true);
    assert.equal(store.getById('task-1'), undefined);
    assert.equal(store.remove('task-1'), false);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
