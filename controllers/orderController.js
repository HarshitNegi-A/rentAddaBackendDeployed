const Booking = require("../model/BookingModel");
const ChatRoom = require("../model/chatRoom");
const Item = require("../model/ItemModel");
const User = require("../model/UserModel");

exports.getOwnerOrders = async (req, res) => {
  try {
    // ✅ Find all items owned by the logged-in user
    const items = await Item.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Booking,
          include: [
            { model: User, attributes: ["id", "name", "email"] }
          ]
        }
      ]
    });

    // ✅ Format data cleanly
    const orders = [];

    items.forEach(item => {
      item.Bookings.forEach(booking => {
        orders.push({
          bookingId: booking.id,
          itemId: item.id,
          itemTitle: item.title,
          renterName: booking.User?.name,
          renterEmail: booking.User?.email,
          startDate: booking.startDate,
          endDate: booking.endDate,
          totalPrice: booking.totalPrice,
          status: booking.status || "Pending"
        });
      });
    });

    res.json({ orders });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load orders" });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const booking = await Booking.findByPk(bookingId, { include: Item });
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // ✅ Only owner can update
    if (booking.Item.userId !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    booking.status = status;
    await booking.save();

    // ✅ If accepted → create chat room
    if (status === "accepted") {
      const existing = await ChatRoom.findOne({ where: { bookingId } });

      if (!existing) {
        await ChatRoom.create({
          bookingId,
          ownerId: booking.Item.userId,
          renterId: booking.userId,
        });
      }
    }

    res.json({ message: "Status updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating status" });
  }
};