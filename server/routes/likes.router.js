const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');

router.post('/', rejectUnauthenticated, (req, res) => {
  const { cookId } = req.body;
  const userId = req.user.id;

  const query = `INSERT INTO "cookLikes" ("post_id", "user_id") VALUES ($1, $2)`;

  pool
    .query(query, [cookId, userId])
    .then(() => res.sendStatus(201))
    .catch((err) => {
      console.error('Error adding like:', err);
      res.sendStatus(500);
    });
});

// GET request to fetch likes
router.get('/', rejectUnauthenticated, (req, res) => {
  const query = 'SELECT * FROM "cookLikes"';
  pool
    .query(query)
    .then((result) => res.send(result.rows))
    .catch((error) => {
      console.error('Error fetching likes:', error);
      res.sendStatus(500);
    });
});

module.exports = router;

module.exports = router;
