const express = require('express');
const router = express.Router();
const db = require('../db');
const path = require('path');

// Serve login and signup pages
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

router.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/signup.html'));
});

// Handle login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT * FROM users WHERE email=? AND password=?', [email, password], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      req.session.user = results[0];
      res.redirect('/dashboard');
    } else {
      res.send('<script>alert("Invalid credentials"); window.location.href="/login";</script>');
    }
  });
});

// Handle signup
router.post('/signup', (req, res) => {
  const { username, email, password } = req.body;
  db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, password], (err) => {
    if (err) {
      res.send('<script>alert("Email already exists!"); window.location.href="/signup";</script>');
    } else {
      res.redirect('/login');
    }
  });
});

module.exports = router;
