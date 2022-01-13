const express = require('express');
const PostController = require('../controllers/postController');

const router = express.Router();

router
  .route('/under-500k')
  .get(PostController.aliasCheapCars, PostController.getAllPosts);

router.route('/post-stats').get(PostController.getPostStats);

router
  .route('/')
  .get(PostController.getAllPosts)
  .post(PostController.createPost);

router
  .route('/:id')
  .get(PostController.getPost)
  .patch(PostController.updatePost)
  .delete(PostController.deletePost);

module.exports = router;
