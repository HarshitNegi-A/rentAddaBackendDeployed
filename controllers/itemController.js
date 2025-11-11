const Item = require('../model/ItemModel');
const User = require('../model/UserModel');
const { Op } = require("sequelize");
const util = require("util");


exports.addItem = async (req, res) => {
  try {
    const { title, description, pricePerDay, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const imageUrl = req.file.path;

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
    console.error(err)
    res.status(500).json({ message: "Failed to add item"});
  }
};



// ✅ Get Items with Filters
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

    if (search) where.title = { [Op.like]: `%${search}%` };
    if (category) where.category = category;

    if (minPrice || maxPrice) {
      where.pricePerDay = {};
      if (minPrice) where.pricePerDay[Op.gte] = Number(minPrice);
      if (maxPrice) where.pricePerDay[Op.lte] = Number(maxPrice);
    }

    let order = [["createdAt", "DESC"]];
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



// ✅ Get Single Item

exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findOne({
      where: { id: req.params.id },
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



// ✅ Get My Items
exports.getMyItems = async (req, res) => {
  try {
    const items = await Item.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });

    res.json({ items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching your items" });
  }
};



// ✅ Delete Item
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



// ✅ Update Item (Cloudinary support)
exports.updateItem = async (req, res) => {
  try {
    const { title, description, pricePerDay, category } = req.body;

    const item = await Item.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!item) {
      return res.status(404).json({ message: "Item not found or not yours" });
    }

    // ✅ If new image uploaded → Cloudinary URL
    if (req.file) {
      item.image = req.file.path;
    }

    item.title = title;
    item.description = description;
    item.pricePerDay = pricePerDay;
    item.category = category;

    await item.save();

    res.json({ message: "Item updated", item });
  } catch (err) {
    console.error("UPLOAD ERROR:", err.message, err);
    res.status(500).json({ message: "Failed to update item" });
  }
};
