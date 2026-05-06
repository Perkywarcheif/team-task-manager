const router = require('express').Router();
const db = require('../db');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  const { name, description } = req.body;
  const [result] = await db.query(
    'INSERT INTO projects (name, description, admin_id) VALUES (?, ?, ?)',
    [name, description, req.user.id]
  );
  await db.query(
    'INSERT INTO project_members (project_id, user_id, role) VALUES (?, ?, ?)',
    [result.insertId, req.user.id, 'admin']
  );
  res.json({ message: 'Project created', projectId: result.insertId });
});

router.get('/', auth, async (req, res) => {
  const [rows] = await db.query(
    `SELECT p.*, pm.role FROM projects p
     JOIN project_members pm ON p.id = pm.project_id
     WHERE pm.user_id = ?`,
    [req.user.id]
  );
  res.json(rows);
});

router.post('/:id/members', auth, async (req, res) => {
  const { email } = req.body;
  const [users] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
  if (!users.length) return res.status(404).json({ message: 'User not found' });
  await db.query(
    'INSERT INTO project_members (project_id, user_id, role) VALUES (?, ?, ?)',
    [req.params.id, users[0].id, 'member']
  );
  res.json({ message: 'Member added' });
});

router.delete('/:id/members/:userId', auth, async (req, res) => {
  await db.query(
    'DELETE FROM project_members WHERE project_id = ? AND user_id = ?',
    [req.params.id, req.params.userId]
  );
  res.json({ message: 'Member removed' });
});

router.get('/:id/members', auth, async (req, res) => {
  const [rows] = await db.query(
    `SELECT u.id, u.name, u.email, pm.role FROM users u
     JOIN project_members pm ON u.id = pm.user_id
     WHERE pm.project_id = ?`,
    [req.params.id]
  );
  res.json(rows);
});

module.exports = router;