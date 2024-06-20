const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${path.basename(file.originalname)}`);
  },
});

const upload = multer({ storage });

// This route *should* return the logged in users cooks
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
      cooks.user_id,
      array_agg(cook_images.image_url) AS cook_images
    FROM "cooks"
    JOIN "user" AS users ON cooks.user_id = users.id
    LEFT JOIN "cook_images" ON cooks.id = cook_images.cook_id
    WHERE cooks.user_id = $1 AND cooks.is_active = TRUE
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
  // console.log(
  //   '/cook POST route',
  //   'Request Body:',
  //   req.body,
  //   'Is authenticated?',
  //   req.isAuthenticated(),
  //   'User:',
  //   req.user
  // );

  try {
    await pool.query('BEGIN');
    console.log('Transaction started');

    const { cook_name, cook_date, location, recipe_notes, cook_rating, cook_image_urls } = req.body;
    const userId = req.user.id;

    const insertCookResult = await pool.query(
      `INSERT INTO "cooks" ("cook_name", "user_id", "cook_date", "location", "recipe_notes", "cook_rating")
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;`,
      [cook_name, userId, cook_date, location, recipe_notes, cook_rating]
    );

    const newCookId = insertCookResult.rows[0].id;
    // console.log('New Cook ID:', newCookId);

    if (Array.isArray(cook_image_urls) && cook_image_urls.length > 0) {
      for (let index = 0; index < cook_image_urls.length; index++) {
        const imageUrl = cook_image_urls[index];
        // console.log(`Inserting image ${index + 1}:`, imageUrl);

        await pool.query(`INSERT INTO "cook_images" ("cook_id", "image_url") VALUES ($1, $2);`, [
          newCookId,
          imageUrl,
        ]);
      }
    } else {
      console.log('No cook images provided or not an array.');
    }

    await pool.query('COMMIT');
    // console.log('Transaction committed successfully');

    res.sendStatus(201);
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error executing query', error);
    res.sendStatus(500);
  }
});

router.put('/:id', rejectUnauthenticated, async (req, res) => {
  console.log('editing cook', req.body);
  const cookId = Number(req.params.id);
  console.log(cookId);
  const {
    cook_name,
    cook_date,
    location,
    recipe_notes,
    cook_rating,
    is_active,
    cook_image_urls,
    // is_active,  New field to handle soft delete
  } = req.body;

  try {
    // Start a transaction
    await pool.query('BEGIN');
    // console.log('Transaction started');

    const updateCookQuery = `
      UPDATE "cooks"
      SET
        "cook_name" = $1,
        "cook_date" = $2,
        "location" = $3,
        "recipe_notes" = $4,
        "cook_rating" = $5,
        "is_active" = $6
      WHERE
        "id" = $7;
    `;
    await pool.query(updateCookQuery, [
      cook_name,
      cook_date,
      location,
      recipe_notes,
      cook_rating,
      is_active,
      cookId,
    ]);

    console.log('Cook information updated successfully');

    // Delete existing cook images
    // const deleteImagesQuery = `
    //   DELETE FROM "cook_images"
    //   WHERE "cook_id" = $1;
    // `;
    // await pool.query(deleteImagesQuery, [cookId]);
    // console.log('Existing cook images deleted successfully');

    // Insert new cook images
    if (Array.isArray(cook_image_urls) && cook_image_urls.length > 0) {
      for (let i = 0; i < cook_image_urls.length; i++) {
        const imageUrl = cook_image_urls[i];
        // console.log(`Inserting new image ${i + 1}:`, imageUrl);
        await pool.query(
          `INSERT INTO "cook_images" ("cook_id", "image_url")
           VALUES ($1, $2);`,
          [cookId, imageUrl]
        );
      }
      // console.log('All new cook images inserted successfully');
    } else {
      console.log('No new cook images provided or not an array.');
    }

    // Commit the transaction
    await pool.query('COMMIT');
    // console.log('Transaction committed successfully');
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

// GET route for fetching a specific cook by ID
router.get('/:id', (req, res) => {
  const cookId = req.params.id;
  const query = `
    SELECT
      cooks.id,
      cooks.cook_name,
      cooks.cook_date,
      cooks.location,
      cooks.recipe_notes,
      cooks.cook_rating,
      users.profile_image_url,
      cooks.user_id,
      array_agg(cook_images.image_url) AS cook_images
    FROM "cooks"
    JOIN "user" AS users ON cooks.user_id = users.id
    LEFT JOIN "cook_images" ON cooks.id = cook_images.cook_id
    WHERE cooks.id = $1
    GROUP BY cooks.id, users.id;
  `;
  pool
    .query(query, [cookId])
    .then((result) => {
      res.send(result.rows[0]); // Send the first (and only) result
    })
    .catch((err) => {
      console.log('ERROR: Get cook by ID', err);
      res.sendStatus(500);
    });
});

module.exports = router;

// SELECT * FROM cooks WHERE id = $1
