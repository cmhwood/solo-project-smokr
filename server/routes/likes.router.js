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
router.get('/', async (req, res) => {
  try {
    const query = `
        SELECT "cookLikes".post_id, "cookLikes".user_id, "user".profile_image_url 
        FROM "cookLikes"
        JOIN "user" ON "cookLikes".user_id = "user".id
      `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('Error getting likes:', err);
    res.sendStatus(500);
  }
});

router.get('/:cookId', async (req, res) => {
  const { cookId } = req.params;
  try {
    const query = `
        SELECT "cookLikes".user_id, "user".profile_image_url, "user".username 
        FROM "cookLikes"
        JOIN "user" ON "cookLikes".user_id = "user".id
        WHERE "cookLikes".post_id = $1
      `;
    const result = await pool.query(query, [cookId]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error getting liked users:', err);
    res.sendStatus(500);
  }
});

module.exports = router;
