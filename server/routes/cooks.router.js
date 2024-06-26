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
    LEFT JOIN "cook_rating" ON cooks.cook_rating = cook_rating.id
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

    if (Array.isArray(cook_image_urls) && cook_image_urls.length > 0) {
      for (let index = 0; index < cook_image_urls.length; index++) {
        const imageUrl = cook_image_urls[index];

        await pool.query(`INSERT INTO "cook_images" ("cook_id", "image_url") VALUES ($1, $2);`, [
          newCookId,
          imageUrl,
        ]);
      }
    } else {
      console.log('No cook images provided or not an array.');
    }

    await pool.query('COMMIT');

    res.sendStatus(201);
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error executing query', error);
    res.sendStatus(500);
  }
});

router.put('/:id', rejectUnauthenticated, async (req, res) => {
  console.log('Editing cook', req.body);
  const cookId = Number(req.params.id);
  console.log(cookId);

  const { cook_name, cook_date, location, recipe_notes, cook_rating, is_active, cook_image_urls } =
    req.body;

  try {
    // Start a transaction
    await pool.query('BEGIN');

    // Update cook information
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

    // Retrieve existing images
    const existingImagesQuery = `
      SELECT "image_url"
      FROM "cook_images"
      WHERE "cook_id" = $1;
    `;
    const existingImagesResult = await pool.query(existingImagesQuery, [cookId]);
    const existingImageUrls = existingImagesResult.rows.map((row) => row.image_url);

    // Determine which images to insert
    const imagesToInsert = cook_image_urls.filter((url) => !existingImageUrls.includes(url));
    // Determine which images to delete
    const imagesToDelete = existingImageUrls.filter((url) => !cook_image_urls.includes(url));

    // Insert new images that are not already in the database
    if (imagesToInsert.length > 0) {
      const insertImageQuery = `
        INSERT INTO "cook_images" ("cook_id", "image_url")
        VALUES ($1, unnest($2::text[]));
      `;
      await pool.query(insertImageQuery, [cookId, imagesToInsert]);
      console.log('Inserted images:', imagesToInsert);
    }

    // Delete images that are no longer in the updated list
    if (imagesToDelete.length > 0) {
      const deleteImageQuery = `
        DELETE FROM "cook_images"
        WHERE "cook_id" = $1 AND "image_url" = ANY($2::text[]);
      `;
      await pool.query(deleteImageQuery, [cookId, imagesToDelete]);
      console.log('Deleted images:', imagesToDelete);
    }

    // Commit the transaction
    await pool.query('COMMIT');
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
      res.sendStatus(204); // 204 for successful deletion (No Content)
    })
    .catch((error) => {
      console.error('Error deleting cook', error);
      res.sendStatus(500); // Internal Server Error
    });
});

// GET route for fetching a specific cook by ID
router.get('/:id', async (req, res) => {
  const cookId = req.params.id;
  const query = `
    SELECT 
      cooks.*, 
      array_agg(cook_images.image_url) AS cook_images, 
      cook_rating.rating AS cook_rating_text
    FROM cooks
    LEFT JOIN cook_images ON cooks.id = cook_images.cook_id
    JOIN cook_rating ON cooks.cook_rating = cook_rating.id
    WHERE cooks.id = $1
    GROUP BY cooks.id, cook_rating.rating;
  `;

  try {
    const result = await pool.query(query, [cookId]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching cook details:', error);
    res.sendStatus(500);
  }
});

module.exports = router;

// SELECT * FROM cooks WHERE id = $1
