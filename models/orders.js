const { Model, DataTypes } = require("sequelize");
const sequelize = require("../db.config");

class Order extends Model {}

Order.init(
  {
    orderID: {
      type: DataTypes.INTEGER,
      unique: true,
      primaryKey: true,
      autoIncrement: true,
    },
    userID: {
      type: DataTypes.INTEGER,
    },
    orderStation: {
      type: DataTypes.ENUM("PS4", "PS5"),
    },
    orderDate: {
      type: DataTypes.DATEONLY,
    },
    totalPayment: {
      type: DataTypes.INTEGER,
    },
    paymentStatus: {
      type: DataTypes.ENUM("0", "1"),
    },
  },
  {
    sequelize,
    modelName: "Orders",
  }
);

module.exports = Order;
