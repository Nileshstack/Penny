const express = require('express')
const rateLimit = require('express-rate-limit')
const { loginController, registerController } = require('../controller/userController')

const router= express.Router()
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, message: 'Too many authentication attempts. Please try again later.' },
})

//routes
router.post('/login', authLimiter, loginController)
router.post('/register', authLimiter, registerController)

module.exports=router