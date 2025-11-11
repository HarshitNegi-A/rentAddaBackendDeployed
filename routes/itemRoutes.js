const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const itemController = require('../controllers/itemController');

//  NEW: Import Cloudinary Multer storage
const multer = require("multer");
const { storage } = require("../config/cloudinary");
const upload = multer({ storage });



router.post('/', auth, upload.single("image"), itemController.addItem);


router.get('/', itemController.getItems);


router.get('/mine', auth, itemController.getMyItems);


router.get('/:id', itemController.getItemById);


router.delete('/:id', auth, itemController.deleteItem);


router.put('/:id', auth, upload.single("image"), itemController.updateItem);


module.exports = router;
