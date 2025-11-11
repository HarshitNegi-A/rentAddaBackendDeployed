const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Booking = sequelize.define("Booking", {
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  totalPrice: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
  type: DataTypes.STRING,
  defaultValue: "Pending",
  allowNull: false,
}

});




module.exports = Booking;
