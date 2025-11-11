const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const itemController = require('../controllers/itemController')
const upload = require('../middleware/upload')

router.post('/', auth, upload.single("image"), itemController.addItem)
router.get('/', itemController.getItems)
router.get('/mine', auth, itemController.getMyItems);
router.get('/:id', itemController.getItemById);

router.delete('/:id', auth, itemController.deleteItem);
router.put('/:id', auth, upload.single("image"), itemController.updateItem);



module.exports = router