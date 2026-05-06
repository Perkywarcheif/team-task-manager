const router = require('express').Router();
const db = require('../db');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  const { title, description, due_date, priority, project_id, assigned_to } = req.body;
  const [result] = await db.query(
    'INSERT INTO tasks (title, description, due_date, priority, project_id, assigned_to, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [title, description, due_date, priority, project_id, assigned_to, req.user.id]
  );
  res.json({ message: 'Task created', taskId: result.insertId });
});

router.get('/project/:projectId', auth, async (req, res) => {
  const [rows] = await db.query(
    `SELECT t.*, u.name as assigned_name FROM tasks t
     LEFT JOIN users u ON t.assigned_to = u.id
     WHERE t.project_id = ?`,
    [req.params.projectId]
  );
  res.json(rows);
});

router.get('/dashboard/:projectId', auth, async (req, res) => {
  const pid = req.params.projectId;
  const [[total]] = await db.query('SELECT COUNT(*) as total FROM tasks WHERE project_id = ?', [pid]);
  const [byStatus] = await db.query('SELECT status, COUNT(*) as count FROM tasks WHERE project_id = ? GROUP BY status', [pid]);
  const [byUser] = await db.query(
    `SELECT u.name, COUNT(*) as count FROM tasks t
     JOIN users u ON t.assigned_to = u.id
     WHERE t.project_id = ? GROUP BY t.assigned_to`,
    [pid]
  );
  const [[overdue]] = await db.query(
    `SELECT COUNT(*) as count FROM tasks WHERE project_id = ? AND due_date < CURDATE() AND status != 'done'`,
    [pid]
  );
  res.json({ total: total.total, byStatus, byUser, overdue: overdue.count });
});

router.patch('/:id/status', auth, async (req, res) => {
  const { status } = req.body;
  await db.query('UPDATE tasks SET status = ? WHERE id = ?', [status, req.params.id]);
  res.json({ message: 'Status updated' });
});

router.put('/:id', auth, async (req, res) => {
  const { title, description, due_date, priority, assigned_to, status } = req.body;
  await db.query(
    'UPDATE tasks SET title=?, description=?, due_date=?, priority=?, assigned_to=?, status=? WHERE id=?',
    [title, description, due_date, priority, assigned_to, status, req.params.id]
  );
  res.json({ message: 'Task updated' });
});

router.delete('/:id', auth, async (req, res) => {
  await db.query('DELETE FROM tasks WHERE id = ?', [req.params.id]);
  res.json({ message: 'Task deleted' });
});

module.exports = router;