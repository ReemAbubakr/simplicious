const mongoose = require('mongoose');
const bookSchema=require('./book'); // Assuming book.js is in the same directory

const cartSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    default: null ,
    required: false,

  },
  
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  
  // books: [{
  //   book: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'Book',
  //     required: true
  //   },
  //    imagePath: { 
  //   type: String, 
  //   required: true 
  //   },
  //   quantity: {
  //     type: Number,
  //     required: true,
  //     min: 1,
  //     default: 1
  //   },
  //   addedAt: {
  //     type: Date,
  //     default: Date.now
  //   }
  // }],
  books:[{book:{
   type:String,
    required: true

  },
    imagePath: { 
      type: String, 
      required: true 
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    addedAt: {
      type: Date,
      default: Date.now
    },
    price: {
      type: String,
      required: true,
     
    }
  }],
  
  
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 9000000000
  }
}, 
{
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  strict: 'throw'
});

// Virtual for total items in cart
cartSchema.virtual('totalItems').get(function() {
  return this.books.reduce((total, bookItem) => total + bookItem.quantity, 0);
});

// Virtual for total price
cartSchema.virtual('totalPrice').get(function() {
  if (!this.books || this.books.length === 0) return 0;
  

  
  return this.books.reduce((total, bookItem) => {
    const price = parseFloat(Number(bookItem.price));
    return total + (price * bookItem.quantity);
  }, 0);
});

module.exports = mongoose.model('Cart', cartSchema);
