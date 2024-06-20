const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

// Route to get all cook ratings
router.get('/ratings', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "cook_rating"');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching ratings', error);
    res.sendStatus(500);
  }
});

module.exports = router;
