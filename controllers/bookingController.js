const Booking = require("../model/BookingModel");
const Item = require("../model/ItemModel");
const { Op } = require("sequelize");

exports.createBooking = async (req, res) => {
  try {
    const { itemId, startDate, endDate } = req.body;

    // 1. Check if item exists
    const item = await Item.findByPk(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    // ❌ Prevent booking own item
    if (item.userId === req.user.id) {
      return res.status(400).json({ message: "You cannot book your own item" });
    }

    // 2. Check for date conflicts
    const conflict = await Booking.findOne({
      where: {
        itemId,
        [Op.or]: [
          { startDate: { [Op.between]: [startDate, endDate] } },
          { endDate: { [Op.between]: [startDate, endDate] } },
          {
            startDate: { [Op.lte]: startDate },
            endDate: { [Op.gte]: endDate }
          }
        ]
      }
    });

    if (conflict) {
      return res.status(409).json({
        message: "Item is not available on the selected dates"
      });
    }

    // 3. Calculate total price
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    const totalPrice = item.pricePerDay * days;

    // 4. Create booking (default status = pending)
    const booking = await Booking.create({
      itemId,
      userId: req.user.id,
      startDate,
      endDate,
      totalPrice,
      status: "pending"
    });

    res.status(201).json({
      message: "Booking successful. Waiting for owner approval.",
      booking
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Booking failed" });
  }
};


exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { userId: req.user.id },
      include: {
        model: Item,
        attributes: ["id", "title", "image", "pricePerDay"]
      },
      order: [["createdAt", "DESC"]]
    });

    res.json({ bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Unable to get bookings" });
  }
};
