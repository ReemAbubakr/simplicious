// models/coupon.js
const mongoose = require('mongoose');
const AppError = require('../utils/AppError');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Coupon code is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  discountType: {
    type: String,
    required: [true, 'Discount type is required'],
    enum: ['percentage', 'fixed'],
    default: 'percentage'
  },
  discountValue: {
    type: Number,
    required: [true, 'Discount value is required'],
    min: [0, 'Discount value cannot be negative']
  },
  minimumCartValue: {
    type: Number,
    default: 0,
    min: [0, 'Minimum cart value cannot be negative']
  },
  validFrom: {
    type: Date,
    default: Date.now
  },
  validUntil: {
    type: Date,
    required: [true, 'Expiry date is required']
  },
  maxUses: {
    type: Number,
    min: [1, 'Max uses must be at least 1']
  },
  currentUses: {
    type: Number,
    default: 0,
    min: [0, 'Current uses cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  applicableCategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  excludedProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  }],
  userSpecific: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

// Index for faster querying
couponSchema.index({ code: 1, isActive: 1 });

// Pre-save hook to validate dates
couponSchema.pre('save', function(next) {
  if (this.validUntil && this.validUntil < this.validFrom) {
    return next(new AppError('Expiry date must be after the start date', 400));
  }
  next();
});

// Static method to validate coupon
couponSchema.statics.validateCoupon = async function(code, cartTotal) {
  const coupon = await this.findOne({
    code,
    isActive: true,
    validFrom: { $lte: Date.now() },
    validUntil: { $gte: Date.now() },
    $or: [
      { maxUses: { $exists: false } },
      { maxUses: { $gt: 0 } },
      { currentUses: { $lt: { $ifNull: ['$maxUses', Infinity] } } }
    ]
  });

  if (!coupon) {
    throw new AppError('Invalid or expired coupon code', 400);
  }

  if (cartTotal < coupon.minimumCartValue) {
    throw new AppError(`Minimum cart value of ${coupon.minimumCartValue} required`, 400);
  }

  return coupon;
};

// Method to apply discount
couponSchema.methods.calculateDiscount = function(cartTotal) {
  let discount = 0;
  
  if (this.discountType === 'percentage') {
    discount = (cartTotal * this.discountValue) / 100;
    // Ensure discount doesn't exceed cart total
    discount = Math.min(discount, cartTotal);
  } else {
    discount = Math.min(this.discountValue, cartTotal);
  }
  
  return discount;
};

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;