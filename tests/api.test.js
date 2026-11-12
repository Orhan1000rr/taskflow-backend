const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'taskflow-api-'));
process.env.DATA_FILE = path.join(tempDir, 'tasks.json');
const app = require('../src/app');

test('HTTP üzerinden temel CRUD işlemleri', async () => {
  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;

  async function call(method, endpoint, body) {
    const response = await fetch(baseUrl + endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined
    });
    const text = await response.text();
    return { status: response.status, body: text ? JSON.parse(text) : null };
  }

  try {
    const firstList = await call('GET', '/tasks');
    assert.equal(firstList.status, 200);
    assert.deepEqual(firstList.body, []);

    const created = await call('POST', '/tasks', {
      title: 'API testlerini yaz',
      description: 'CRUD işlemlerini kontrol et',
      assignee: 'Ayşe',
      priority: 'high'
    });
    assert.equal(created.status, 201);
    const id = created.body.id;
    assert.ok(id);
    assert.equal(created.body.status, 'pending');

    const list = await call('GET', '/tasks');
    assert.equal(list.body.length, 1);

    const detail = await call('GET', `/tasks/${id}`);
    assert.equal(detail.status, 200);
    assert.equal(detail.body.assignee, 'Ayşe');

    const updated = await call('PUT', `/tasks/${id}`, { status: 'completed' });
    assert.equal(updated.status, 200);
    assert.equal(updated.body.status, 'completed');

    const invalid = await call('POST', '/tasks', { title: '' });
    assert.equal(invalid.status, 400);

    const deleted = await call('DELETE', `/tasks/${id}`);
    assert.equal(deleted.status, 200);

    const missing = await call('GET', `/tasks/${id}`);
    assert.equal(missing.status, 404);
  } finally {
    await new Promise((resolve) => server.close(resolve));
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
