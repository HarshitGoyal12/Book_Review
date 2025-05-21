const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  author: {
    type: String,
    required: [true, 'Please add an author'],
    trim: true
  },
  genre: {
    type: String,
    required: [true, 'Please add a genre']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  publishedYear: {
    type: Number
  },
  publisher: {
    type: String
  },
  isbn: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for average rating
BookSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'book',
  justOne: false
});

// Cascade delete reviews when a book is deleted
BookSchema.pre('remove', async function(next) {
  await this.model('Review').deleteMany({ book: this._id });
  next();
});

// Add index for search functionality
BookSchema.index({ title: 'text', author: 'text' });

module.exports = mongoose.model('Book', BookSchema);