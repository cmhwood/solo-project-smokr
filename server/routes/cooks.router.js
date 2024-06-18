const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');

// This route *should* return the logged in users cooks
// GET route to fetch cooks with associated user profile image
router.get('/', rejectUnauthenticated, async (req, res) => {
  const queryText = `
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
    WHERE cooks.user_id = $1
    GROUP BY cooks.id, users.id
    ORDER BY cooks.created_at DESC;`;

  try {
    const result = await pool.query(queryText, [req.user.id]);
    res.send(result.rows);
  } catch (error) {
    console.error('Error executing query', error);
    res.sendStatus(500);
  }
});

// This route *should* add a cook for the logged in user
router.post('/', rejectUnauthenticated, async (req, res) => {
  console.log('/cook POST route');
  console.log('Request Body:', req.body);
  console.log('Is authenticated?', req.isAuthenticated());
  console.log('User:', req.user);

  try {
    // Start a transaction
    await pool.query('BEGIN');
    console.log('Transaction started');

    // Insert new cook
    const insertCookResult = await pool.query(
      `INSERT INTO "cooks" (
        "cook_name", 
        "user_id", 
        "cook_date", 
        "location", 
        "recipe_notes", 
        "cook_rating"
      ) 
      VALUES (
        $1, 
        $2, 
        $3, 
        $4, 
        $5, 
        $6
      ) 
      RETURNING id;`,
      [
        req.body.cook_name,
        req.user.id,
        req.body.cook_date,
        req.body.location,
        req.body.recipe_notes,
        req.body.cook_rating,
      ]
    );

    const newCookId = insertCookResult.rows[0].id;
    console.log('New Cook ID:', newCookId);

    // Commit the transaction after inserting the cook
    await pool.query('COMMIT');
    console.log('Transaction committed successfully');

    // Check if cook_images is an array and not empty
    const cookImages = req.body.cook_image_urls;
    console.log('Cook Images:', cookImages);

    if (Array.isArray(cookImages) && cookImages.length > 0) {
      // Start a new transaction for inserting images
      await pool.query('BEGIN');
      console.log('Transaction started for cook images');

      // Insert multiple cook images
      for (let index = 0; index < cookImages.length; index++) {
        const imageUrl = cookImages[index];
        console.log(`Inserting image ${index + 1}:`, imageUrl);

        await pool.query(
          `INSERT INTO "cook_images" (
            "cook_id",
            "image_url"
          ) 
          VALUES (
            $1, 
            $2
          );`,
          [newCookId, imageUrl]
        );
      }

      // Commit the transaction after inserting images
      await pool.query('COMMIT');
      console.log('Transaction committed successfully for cook images');
    } else {
      console.log('No cook images provided or not an array.');
    }

    res.sendStatus(201);
  } catch (error) {
    // Roll back transaction in case of error
    await pool.query('ROLLBACK');
    console.error('Error executing query', error);
    res.sendStatus(500);
  }
});

/**
 * Update a cook if that user is logged in
 */

router.put('/:id', rejectUnauthenticated, async (req, res) => {
  const cookId = req.params.id;
  const {
    cook_name,
    cook_date,
    location,
    recipe_notes,
    cook_rating,
    cook_image_urls, // Assuming cook_image_urls is an array of new image URLs
  } = req.body;

  try {
    // Start a transaction
    await pool.query('BEGIN');
    console.log('Transaction started');

    // Update cook information
    const updateCookQuery = `
      UPDATE "cooks" 
      SET 
        "cook_name" = $1, 
        "cook_date" = $2, 
        "location" = $3, 
        "recipe_notes" = $4, 
        "cook_rating" = $5 
      WHERE 
        "id" = $6 AND "user_id" = $7;
    `;
    await pool.query(updateCookQuery, [
      cook_name,
      cook_date,
      location,
      recipe_notes,
      cook_rating,
      cookId,
      req.user.id,
    ]);

    console.log('Cook information updated successfully');

    // Delete existing cook images
    const deleteImagesQuery = `
      DELETE FROM "cook_images" 
      WHERE "cook_id" = $1;
    `;
    await pool.query(deleteImagesQuery, [cookId]);
    console.log('Existing cook images deleted successfully');

    // Insert new cook images
    if (Array.isArray(cook_image_urls) && cook_image_urls.length > 0) {
      for (let i = 0; i < cook_image_urls.length; i++) {
        const imageUrl = cook_image_urls[i];
        console.log(`Inserting new image ${i + 1}:`, imageUrl);
        await pool.query(
          `INSERT INTO "cook_images" ("cook_id", "image_url") 
           VALUES ($1, $2);`,
          [cookId, imageUrl]
        );
      }
      console.log('All new cook images inserted successfully');
    } else {
      console.log('No new cook images provided or not an array.');
    }

    // Commit the transaction
    await pool.query('COMMIT');
    console.log('Transaction committed successfully');
    res.sendStatus(200);
  } catch (error) {
    // Roll back transaction in case of error
    await pool.query('ROLLBACK');
    console.error('Error updating cook', error);
    res.sendStatus(500);
  }
});

/**
 * Delete a cook if it's something the logged in user added
 */
router.delete('/:id', rejectUnauthenticated, (req, res) => {
  const queryText = `
    DELETE FROM "cooks" 
    WHERE "id" = $1 AND "user_id" = $2;
  `;
  pool
    .query(queryText, [req.params.id, req.user.id])
    .then(() => {
      res.sendStatus(204); // Changed to 204 for successful deletion (No Content)
    })
    .catch((error) => {
      console.error('Error deleting cook', error);
      res.sendStatus(500); // Internal Server Error
    });
});


module.exports = router;
