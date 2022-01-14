const Post = require('../models/postModel');
const ApiFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.aliasCheapCars = (req, res, next) => {
  req.query.limit = 10;
  req.query.price = { lte: '500000' };
  next();
};

exports.getAllPosts = catchAsync(async (req, res, next) => {
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
});

exports.getPost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new AppError('No post found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { post },
  });
});

exports.createPost = catchAsync(async (req, res, next) => {
  const post = await Post.create(req.body);

  res.status(201).json({
    status: 'success',
    data: { post },
  });
});

exports.updatePost = catchAsync(async (req, res, next) => {
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: { post },
  });
});

exports.deletePost = catchAsync(async (req, res, next) => {
  await Post.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    message: 'Post was deleted successfully',
  });
});

exports.getPostStats = catchAsync(async (req, res, next) => {
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
});

exports.getPostStatsById = catchAsync(async (req, res, next) => {
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
});
