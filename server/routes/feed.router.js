const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

// GETS all the cooks for the cook list
router.get('/', (req, res) => {
  const query = `
    SELECT
      cooks.id,
      cooks.cook_name,
      cooks.cook_date,
      cooks.location,
      cooks.recipe_notes,
      cooks.cook_rating,
      users.profile_image_url,
      array_agg(cook_images.image_url) AS cook_images
    FROM "cooks"
    JOIN "user" AS users ON cooks.user_id = users.id
    LEFT JOIN "cook_images" ON cooks.id = cook_images.cook_id
    GROUP BY cooks.id, users.id
    ORDER BY cooks.created_at DESC;
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

module.exports = router;

// SELECT *
// FROM "cooks"
// ORDER BY "created_at" DESC;

// SELECT
//       cooks.id,
//       cooks.cook_name,
//       cooks.cook_date,
//       cooks.location,
//       cooks.recipe_notes,
//       cooks.cook_rating,
//       users.profile_image_url,
//       array_agg(cook_images.image_url) AS cook_images
//     FROM "cooks"
//     JOIN "user" AS users ON cooks.user_id = users.id
//     LEFT JOIN "cook_images" ON cooks.id = cook_images.cook_id
//     GROUP BY cooks.id, users.id
//     ORDER BY cooks.created_at DESC;
