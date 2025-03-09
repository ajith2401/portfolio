// models/Book.js
import mongoose from 'mongoose';

const PoemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a poem title'],
    trim: true,
    maxlength: [100, 'Poem title cannot be more than 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Please provide the poem content']
  },
  translation: {
    type: String,
    default: ''
  },
  pageNumber: {
    type: Number,
    default: null
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a book title'],
    trim: true,
    maxlength: [200, 'Book title cannot be more than 200 characters'],
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a book description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  coverImage: {
    type: String,
    default: 'default-cover.jpg'
  },
  publishYear: {
    type: Number,
    required: [true, 'Please provide the year of publication']
  },
  isbn: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: 'Tamil'
  },
  pageCount: {
    type: Number,
    default: 0
  },
  poems: [PoemSchema],
  publisher: {
    type: String,
    default: ''
  },
  featured: {
    type: Boolean,
    default: false
  },
  price: {
    type: Number,
    default: 0
  },
  purchaseLinks: {
    amazon: String,
    flipkart: String,
    other: String
  },
  reviews: [{
    name: String,
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware to update 'updatedAt' field on update
BookSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});


let Book;
try {
    Book = mongoose.model('Book');
} catch {
    Book = mongoose.model('Book', BookSchema);
}

export { Book };
