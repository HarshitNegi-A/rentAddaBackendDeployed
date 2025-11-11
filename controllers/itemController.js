const Item=require('../model/ItemModel');
const User = require('../model/UserModel');
const { Op } = require("sequelize");

exports.addItem = async (req, res) => {
  try {
    const { title, description, pricePerDay, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const imageUrl = req.file.filename;

    const item = await Item.create({
      title,
      description,
      pricePerDay,
      category,
      image: imageUrl,
      userId: req.user.id,
    });

    res.status(201).json({
      message: "Item added successfully",
      item,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add item" });
  }
};

exports.getItems = async (req, res) => {
  try {
    const {
      search = "",
      category,
      minPrice,
      maxPrice,
      sort
    } = req.query;

    const where = {};

    // ✅ Search by title or description
    if (search) {
      where.title = { [Op.like]: `%${search}%` };
    }

    // ✅ Category filter
    if (category) {
      where.category = category;
    }

    // ✅ Price filter
    if (minPrice || maxPrice) {
      where.pricePerDay = {};
      if (minPrice) where.pricePerDay[Op.gte] = Number(minPrice);
      if (maxPrice) where.pricePerDay[Op.lte] = Number(maxPrice);
    }

    // ✅ Sorting
    let order = [["createdAt", "DESC"]]; // default: newest first

    if (sort === "priceAsc") order = [["pricePerDay", "ASC"]];
    if (sort === "priceDesc") order = [["pricePerDay", "DESC"]];

    const items = await Item.findAll({
      where,
      order,
      include: [{ model: User, attributes: ["id", "name"] }],
    });

    res.json({ items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch items" });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Item.findOne({
      where: { id },
      include: { model: User, attributes: ["id", "name"] }
    });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ item });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching item details" });
  }
};

exports.getMyItems = async (req, res) => {
  try {
    const items = await Item.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]]
    });

    res.json({ items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching your items" });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!item) {
      return res.status(404).json({ message: "Item not found or not yours" });
    }

    await item.destroy();
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete item" });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { title, description, pricePerDay, category } = req.body;

    const item = await Item.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!item) {
      return res.status(404).json({ message: "Item not found or not yours" });
    }

    // If user uploaded a new image
    if (req.file) item.image = req.file.filename;

    item.title = title;
    item.description = description;
    item.pricePerDay = pricePerDay;
    item.category = category;

    await item.save();

    res.json({ message: "Item updated", item });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update item" });
  }
};
