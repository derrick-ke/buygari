const Post = require('../models/postModel');
const ApiFeatures = require('../utils/apiFeatures');

exports.aliasCheapCars = (req, res, next) => {
  req.query.limit = 10;
  req.query.price = { lte: '500000' };
  next();
};

exports.getAllPosts = async (req, res) => {
  try {
    const features = new ApiFeatures(Post.find(), req.query)
      .filter()
      .sort()
      .limit()
      .paginate();
    const posts = await features.query;

    res.status(200).json({
      status: 'success',
      results: posts.length,
      data: posts,
    });
  } catch (err) {
    res.status(404).json({
      status: 'error',
      message: [err, 'An error occured'],
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

exports.getPostStats = async (req, res) => {
  try {
    const stats = await Post.aggregate([
      { $match: { make: 'Toyota', model: 'Premio' } },
      {
        $group: {
          _id: '$year',
          averagePrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: { stats },
    });
  } catch (error) {
    res.status(404).json({
      status: 'error',
      message: error,
    });
  }
};

exports.getPostStatsById = async (req, res) => {
  try {
    const post = Post.findById(req.params.id);

    const stats = await Post.aggregate([
      {
        $match: {
          make: `${post.make}`,
          model: `${post.model}`,
        },
      },
      {
        $group: {
          _id: '$year',
          averagePrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $match: { _id: { $eq: `${post.year}` * 1 } },
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: { stats },
    });
  } catch (error) {
    res.status(404).json({
      status: 'error',
      message: error,
    });
  }
};
