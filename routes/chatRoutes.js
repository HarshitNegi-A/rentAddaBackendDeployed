const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const chatController = require("../controllers/chatController");

// ✅ GET chat room by booking
router.get("/room/:bookingId", auth, chatController.getChatRoom);

// ✅ GET messages for chat room
router.get("/messages/:chatRoomId", auth, chatController.getMessages);

// ✅ SEND message
router.post("/send", auth, chatController.sendMessage);

module.exports = router;
