const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');

exports.getAllReviews = factory.getAllDocs(Review);

exports.setPostUserId = (req, res, next) => {
  req.body.user = req.user.id;
  req.body.post = req.params.postId;
};

exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
