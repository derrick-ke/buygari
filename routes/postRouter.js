const express = require('express');
const PostController = require('../controllers/postController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/under-500k')
  .get(PostController.aliasCheapCars, PostController.getAllPosts);

router.route('/post-stats').get(PostController.getPostStats);

router
  .route('/')
  .get(authController.protect, PostController.getAllPosts)
  .post(PostController.createPost);

router
  .route('/:id')
  .get(PostController.getPost)
  .patch(PostController.updatePost)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'editor'),
    PostController.deletePost
  );

module.exports = router;
