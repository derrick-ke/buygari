const Post = require('../models/postModel');

exports.getAllPosts = async (req, res) => {
  try {
    const queryObj = { ...req.query };

    const excludedObj = ['limit', 'page', 'sort', 'fields'];

    excludedObj.forEach((el) => delete queryObj[el]);

    const query = Post.find(queryObj);

    const posts = await Post.find(query);

    res.status(200).json({
      status: 'success',
      results: posts.length,
      data: posts,
    });
  } catch (err) {
    res.status(404).json({
      status: 'error',
      message: err,
    });
  }
};

exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: { post },
    });
  } catch (err) {
    res.status(404).json({
      status: 'error',
      message: err,
    });
  }
};

exports.createPost = async (req, res) => {
  try {
    const post = await Post.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { post },
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err,
    });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: { post },
    });
  } catch (err) {
    res.status(404).json({
      status: 'error',
      message: err,
    });
  }
};

exports.deletePost = async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
    });
  } catch (err) {
    res.status(404).json({
      status: 'error',
      message: err,
    });
  }
};
