const router = require('express').Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hash]
    );
    res.json({ message: 'User created', userId: result.insertId });
  } catch (err) {
    res.status(400).json({ message: 'Email already exists' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  if (!rows.length) return res.status(400).json({ message: 'User not found' });
  const valid = await bcrypt.compare(password, rows[0].password);
  if (!valid) return res.status(400).json({ message: 'Wrong password' });
  const token = jwt.sign({ id: rows[0].id, name: rows[0].name, email: rows[0].email }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: rows[0].id, name: rows[0].name, email: rows[0].email } });
});

module.exports = router;