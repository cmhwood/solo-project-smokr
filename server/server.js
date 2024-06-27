const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 5001;

// Middleware Includes
const sessionMiddleware = require('./modules/session-middleware');
const passport = require('./strategies/user.strategy');

// Route Includes
const userRouter = require('./routes/user.router');
const cookRouter = require('./routes/cooks.router');
const feedRouter = require('./routes/feed.router');
const ratingRouter = require('./routes/ratings.router');
const commentsRouter = require('./routes/comments.router');
const likesRouter = require('./routes/likes.router');

// Express Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('build'));

// Passport Session Configuration
app.use(sessionMiddleware);

// Start Passport Sessions
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/user', userRouter);
app.use('/api/cooks', cookRouter);
app.use('/api/feed', feedRouter);
app.use('/api', ratingRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/likes', likesRouter);

// Listen Server & Port
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
