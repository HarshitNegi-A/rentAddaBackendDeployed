const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const orderController = require("../controllers/orderController");

router.get("/", auth, orderController.getOwnerOrders);
router.put("/:bookingId/status", auth, orderController.updateStatus);

module.exports = router;
