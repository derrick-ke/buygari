const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    make: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: [true, 'The year is required'],
    },
    price: {
      type: Number,
      required: true,
    },
    mileage: {
      type: String,
      required: true,
    },
    transmission: {
      type: String,
      required: true,
    },
    condition: {
      type: String,
      required: true,
      enum: {
        values: ['USED', 'NEW', 'SALVAGE', 'AUCTION'],
        message: 'Not a valid condition',
      },
      uppercase: true,
    },
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    views: {
      type: Number,
      default: 0,
    },
    images: [String],
    color: String,
    engine: String,
    body: String,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

postSchema.virtual('title').get(function () {
  return `${this.year} ${this.make} ${this.model}`;
});

postSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'post',
  localField: '_id',
});

postSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: '-__v',
  });
  next();
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
