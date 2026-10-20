const mongoose = require('mongoose');
const moment = require('moment');
const transactionModel = require('../models/transectionModel');
const ApiError = require('../middleware/ApiError');

const transactionFields = (input) => {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new ApiError(400, 'Invalid transaction data');
  }

  const amount = Number(input.amount);
  const type = input.type;
  const category = typeof input.category === 'string' ? input.category.trim() : '';
  const description = typeof input.description === 'string' ? input.description.trim() : '';
  const reference = typeof input.reference === 'string' ? input.reference.trim() : '';
  const date = typeof input.date === 'string' ? new Date(input.date) : new Date(NaN);

  if (!Number.isFinite(amount) || amount <= 0 ||
      !['income', 'expense'].includes(type) ||
      category.length < 1 || category.length > 100 ||
      description.length < 1 || description.length > 500 ||
      reference.length > 200 || !Number.isFinite(date.getTime())) {
    throw new ApiError(400, 'Invalid transaction data');
  }

  return { amount, type, category, description, reference, date };
};

const getAllTransection = async (req, res, next) => {
  try {
    const { frequency, selectedDate, type = 'all' } = req.body || {};
    if (!['7', '30', '365', 'custom'].includes(String(frequency)) ||
        !['all', 'income', 'expense'].includes(type)) {
      throw new ApiError(400, 'Invalid transaction filters');
    }

    let date;
    if (frequency === 'custom') {
      if (!Array.isArray(selectedDate) || selectedDate.length !== 2 ||
          !moment(selectedDate[0]).isValid() || !moment(selectedDate[1]).isValid() ||
          moment(selectedDate[0]).isAfter(selectedDate[1])) {
        throw new ApiError(400, 'A valid custom date range is required');
      }
      date = {
        $gte: new Date(selectedDate[0]),
        $lte: new Date(selectedDate[1]),
      };
    } else {
      date = { $gt: moment().subtract(Number(frequency), 'days').toDate() };
    }

    const query = { userid: req.user.id, date };
    if (type !== 'all') {
      query.type = type;
    }

    const transactions = await transactionModel.find(query).sort({ date: -1 });
    res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    next(error);
  }
};

const addTransection = async (req, res, next) => {
  try {
    const transaction = await transactionModel.create({
      ...transactionFields(req.body),
      userid: req.user.id,
    });
    res.status(201).json({
      success: true,
      message: 'New transaction created successfully',
      newTransection: transaction,
    });
  } catch (error) {
    next(error);
  }
};

const getTransactionId = (body) => body?.transactionId || body?.trasactionId;

const editTransection = async (req, res, next) => {
  try {
    const transactionId = getTransactionId(req.body);
    if (!mongoose.isValidObjectId(transactionId)) {
      throw new ApiError(400, 'Invalid transaction ID');
    }

    const transaction = await transactionModel.findOneAndUpdate(
      { _id: transactionId, userid: req.user.id },
      { $set: transactionFields(req.body.payload) },
      { new: true, runValidators: true }
    );
    if (!transaction) {
      throw new ApiError(404, 'Transaction not found');
    }

    res.status(200).json({
      success: true,
      message: 'Transaction updated successfully',
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

const deleteTransection = async (req, res, next) => {
  try {
    const transactionId = getTransactionId(req.body);
    if (!mongoose.isValidObjectId(transactionId)) {
      throw new ApiError(400, 'Invalid transaction ID');
    }

    const transaction = await transactionModel.findOneAndDelete({
      _id: transactionId,
      userid: req.user.id,
    });
    if (!transaction) {
      throw new ApiError(404, 'Transaction not found');
    }
    res.status(200).json({ success: true, message: 'Transaction deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTransection,
  addTransection,
  editTransection,
  deleteTransection,
};
