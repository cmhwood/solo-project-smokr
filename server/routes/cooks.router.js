const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');

// This route *should* return the logged in users cooks
router.get('/', rejectUnauthenticated, (req, res) => {
  console.log('/cooks GET route');
  console.log('is authenticated?', req.isAuthenticated());
  console.log('user', req.user);
  let queryText = `SELECT * FROM "cooks" 
  WHERE "user_id"=$1
  ORDER BY "created_at" DESC;`; //WHERE "user_id"=$1 for specific user's cook
  pool
    .query(queryText, [req.user.id])
    .then((result) => {
      res.send(result.rows);
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
});

// This route *should* add a cook for the logged in user
router.post('/', rejectUnauthenticated, async (req, res) => {
  console.log('/cook POST route');
  console.log(req.body);
  console.log('is authenticated?', req.isAuthenticated());
  console.log('user', req.user);

  try {
    const result = await pool.query(
      `INSERT INTO "cooks" ("cook_name", "user_id", "cook_image_url", "cook_date", "location", "recipe_notes", "cook_rating") VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`,
      [
        req.body.cook_name,
        req.user.id,
        req.body.image_url,
        req.body.cook_date,
        req.body.location,
        req.body.recipe_notes,
        req.body.cook_rating,
      ]
    );
    res.send(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

/**
 * Update a cook if that user is logged in
 */
router.put('/:id', (req, res) => {
  const queryText = `
    UPDATE "cooks" SET "cook_name" = $1, "cook_image_url;" =$2, "cook_date" =$3, "location" =$4, "recipe_notes" =$5, "cook_rating" =$6 WHERE "cooks"."cook_id"=$7 AND "user"."id"=$8;
    `;
  pool
    .query(queryText, [
      req.body.cook_name,
      req.body.cook_image_url,
      req.body.cook_date,
      req.body.location,
      req.body.recipe_notes,
      req.body.cook_rating,
      req.body.cook_id,
      req.user.id,
    ])
    .then(() => {
      res.sendStatus(201);
    })
    .catch((error) => {
      console.log('error updating user', error);
      res.sendStatus(500);
    });
});

/**
 * Delete a cook if it's something the logged in user added
 */
router.delete('/:id', rejectUnauthenticated, (req, res) => {
  // endpoint functionality
  const queryText = `
    DELETE FROM "cooks" 
    WHERE cooks.cook_id = $1 AND "cooks"."user_id"=$2;
    `;
  pool
    .query(queryText, [req.params.id, req.user.id]) // $1, $2
    .then(() => {
      res.sendStatus(201);
    })
    .catch((error) => {
      console.log('error deleting item', error);
      res.sendStatus(500);
    });
});

module.exports = router;
