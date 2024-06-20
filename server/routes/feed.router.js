const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

// GETS all the cooks for the cook list that are active
// GET route to fetch cooks with associated user profile image
router.get('/', (req, res) => {
  const query = `
    SELECT
      cooks.id,
      cooks.cook_name,
      cooks.cook_date,
      cooks.location,
      cooks.recipe_notes,
      cook_rating.rating AS cook_rating,
      users.profile_image_url,
      array_agg(cook_images.image_url) AS cook_images
    FROM "cooks"
    JOIN "user" AS users ON cooks.user_id = users.id
    LEFT JOIN "cook_images" ON cooks.id = cook_images.cook_id
    LEFT JOIN "cook_rating" ON cooks.cook_rating = cook_rating.id
    WHERE cooks.is_active = TRUE
    GROUP BY cooks.id, users.id, cook_rating.rating
    ORDER BY cooks.created_at DESC;
  `;
  pool
    .query(query)
    .then((result) => {
      res.send(result.rows);
    })
    .catch((err) => {
      console.log('ERROR: Get all active cooks', err);
      res.sendStatus(500);
    });
});

module.exports = router;
