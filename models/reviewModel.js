const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
  {
    review: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    post: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Post',
      },
    ],
    user: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  { toObject: { virtual: true }, toJSON: { virtual: true } }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'firstname photo',
  });
  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
