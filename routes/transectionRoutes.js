const express = require('express')
const { addTransection, getAllTransection, editTransection, deleteTransection } = require('../controller/transectionController')
const requireAuth = require('../middleware/requireAuth')


const router= express.Router()

router.use(requireAuth)
router.post('/get-transection', getAllTransection)
router.post('/add-transection', addTransection)
router.post('/edit-transection', editTransection)
router.post('/delete-transection', deleteTransection)
module.exports=router