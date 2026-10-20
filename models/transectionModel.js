const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
 userid: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true,
},

  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0.01, 'Amount must be greater than zero'],
  },
  type: {
    type: String,
    required: [true, 'Type is required'],
    enum: ['income', 'expense'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    maxlength: 100,
  },
  reference: {
    type: String,
    trim: true,
    maxlength: 200,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: 500,
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
  }
}, { timestamps: true });

const transactionModel = mongoose.model('transection', transactionSchema);

module.exports = transactionModel;
