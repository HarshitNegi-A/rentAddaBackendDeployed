const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const ChatRoom = sequelize.define("ChatRoom", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  bookingId: { type: DataTypes.INTEGER, allowNull: false },
  ownerId: { type: DataTypes.INTEGER, allowNull: false },
  renterId: { type: DataTypes.INTEGER, allowNull: false },
});

module.exports = ChatRoom;
