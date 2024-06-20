// GET route for fetching a specific cook by ID
router.get('/:id', (req, res) => {
  const cookId = req.params.id;
  const query = 'SELECT * FROM cooks WHERE id = $1';
  pool
    .query(query, [cookId])
    .then((result) => res.send(result.rows[0]))
    .catch((err) => {
      console.error('Error in GET /api/cooks/:id', err);
      res.sendStatus(500);
    });
});
