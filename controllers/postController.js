const Post = require('../models/postModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.aliasCheapCars = (req, res, next) => {
  req.query.limit = 10;
  req.query.price = { lte: '500000' };
  next();
};

exports.getAllPosts = factory.getAllDocs(Post);
exports.getPost = factory.getOne(Post, { path: 'reviews' });

exports.setUserId = (req, res, next) => {
  req.body.user = req.user.id;
  next();
};

exports.createPost = factory.createOne(Post);

exports.updatePost = factory.updateOne(Post);

exports.deletePost = factory.deleteOne(Post);

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
