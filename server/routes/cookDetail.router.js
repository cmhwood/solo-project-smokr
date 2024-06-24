const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

router.get('/:id', (req, res) => {
  const cookId = req.params.id;
  const query = `SELECT *, to_char(cook_date, 'MM-DD-YYYY') AS formatted_date FROM cooks WHERE id = $1`;
  pool
    .query(query, [cookId])
    .then((result) => res.send(result.rows[0]))
    .catch((err) => {
      console.error('Error in GET /api/cooks/:id', err);
      res.sendStatus(500);
    });
});

module.exports = router;
