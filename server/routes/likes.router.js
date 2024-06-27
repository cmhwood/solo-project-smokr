const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');

router.post('/', rejectUnauthenticated, (req, res) => {
  const { cookId } = req.body;
  const userId = req.user.id;

  const query = `INSERT INTO "cookLikes" ("post_id", "user_id") VALUES ($1, $2)
                 ON CONFLICT ("post_id", "user_id") DO NOTHING;
                 UPDATE "cooks" SET "like_count" = "like_count" + 1 WHERE "id" = $1;`;

  pool
    .query(query, [cookId, userId])
    .then(() => res.sendStatus(201))
    .catch((err) => {
      console.error('Error adding like:', err);
      res.sendStatus(500);
    });
});

module.exports = router;
