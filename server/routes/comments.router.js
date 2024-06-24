const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

// Get comments for a specific cook
router.get('/', async (req, res) => {
  const { cookId } = req.query; // Get cookId from query params
  try {
    const comments = await pool.query(
      'SELECT comments.comment_id, comments.comment_text, "user".username FROM comments JOIN "user" ON comments.user_id = "user".id WHERE comments.post_id = $1;',
      [cookId]
    );
    res.json(comments.rows);
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a new comment
router.post('/', async (req, res) => {
  const { cook_id, user_id, comment_text } = req.body;
  try {
    const newComment = await pool.query(
      'INSERT INTO comments (post_id, user_id, comment_text) VALUES ($1, $2, $3) RETURNING *',
      [cook_id, user_id, comment_text]
    );
    res.send(newComment.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
