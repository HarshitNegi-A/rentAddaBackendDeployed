const ChatRoom = require("../model/chatRoom");
const Message = require("../model/Message");


// ✅ Get chat room for a booking
exports.getChatRoom = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const room = await ChatRoom.findOne({ where: { bookingId } });

    if (!room) return res.json({ chatRoomId: null });

    res.json({ chatRoomId: room.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching chat room" });
  }
};



// ✅ Get all messages (polling)
exports.getMessages = async (req, res) => {
  try {
    const { chatRoomId } = req.params;

    const messages = await Message.findAll({
      where: { chatRoomId },
      order: [["createdAt", "ASC"]],
    });

    res.json({ messages });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching messages" });
  }
};



// ✅ Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { chatRoomId, content } = req.body;

    if (!content.trim()) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    const msg = await Message.create({
      chatRoomId,
      senderId: req.user.id,
      content,
    });

    res.status(201).json({ message: msg });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending message" });
  }
};
