const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

// GETS all the cooks for the cook list
router.get('/', (req, res) => {
  const query = `
    SELECT *
    FROM "cooks"
    ORDER BY "created_at" DESC;
  `;
  pool
    .query(query)
    .then((result) => {
      res.send(result.rows);
    })
    .catch((err) => {
      console.log('ERROR: Get all cooks', err);
      res.sendStatus(500);
    });
});

//  ORDER BY "created_at" DESC;
module.exports = router;
