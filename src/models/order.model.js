// src/models/order.model.js
import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  customer: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    }
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PhotoService',
    required: true
  },
  serviceSnapshot: {
    name: String,
    price: Number,
    category: String,
    options: [{ 
      name: String, 
      value: String,
      priceModifier: Number
    }]
  },
  bookingDetails: {
    date: Date,
    time: String,
    location: String,
    notes: String
  },
  payment: {
    amount: {
      type: Number,
      required: true
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    paidAt: Date
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  adminNotes: String,
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp before save
OrderSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Add payment completed method
OrderSchema.methods.completePayment = async function(razorpayPaymentId, razorpaySignature) {
  this.payment.razorpayPaymentId = razorpayPaymentId;
  this.payment.razorpaySignature = razorpaySignature;
  this.payment.status = 'completed';
  this.payment.paidAt = new Date();
  this.status = 'confirmed';
  await this.save();
};

// Add statics for querying orders
OrderSchema.statics.findPendingOrders = function() {
  return this.find({ status: 'pending' })
    .sort({ createdAt: -1 })
    .populate('service');
};

OrderSchema.statics.findConfirmedOrders = function() {
  return this.find({ status: 'confirmed' })
    .sort({ createdAt: -1 })
    .populate('service');
};

// Export model
let Order;
try {
  Order = mongoose.model('Order');
} catch {
  Order = mongoose.model('Order', OrderSchema);
}

export { Order };