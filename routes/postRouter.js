const express = require('express');
const PostController = require('../controllers/postController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRouter');

const router = express.Router();

router.use('/:postId/reviews', reviewRouter);

router
  .route('/under-500k')
  .get(PostController.aliasCheapCars, PostController.getAllPosts);

router.route('/post-stats').get(PostController.getPostStats);

router
  .route('/')
  .get(PostController.getAllPosts)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'user'),
    PostController.setUserId,
    PostController.createPost
  );

router
  .route('/:id')
  .get(PostController.getPost)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'user'),
    PostController.updatePost
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'user'),
    PostController.deletePost
  );

module.exports = router;
