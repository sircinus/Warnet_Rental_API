const express = require("express");
const router = express.Router();
const UsersModel = require("../models/users");
const OrdersModel = require("../models/orders");
const bcrypt = require("bcrypt");
const passwordCheck = require("../utils/passwordCheck");

//Register
router.post("/register", async (req, res) => {
  const { userID, name, password } = req.body;

  try {
    const existingUser = await UsersModel.findOne({ where: { userID } });
    if (existingUser) {
      return res.status(400).json({
        error: "User already exists",
      });
    }
    console.log(userID);
    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser = await UsersModel.create({
      userID,
      name,
      password: encryptedPassword,
    });

    res.status(200).json({
      data: newUser,
      metadata: "Account Successfully Created",
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

//Login
router.post("/login", async (req, res) => {
  const { userID, password } = req.body;

  const list = await OrdersModel.findAll({ where: { userID: userID } });
  const check = await passwordCheck(userID, password);

  if (check.compare === true) {
    res.status(200).json({
      metadata: "Login Success",
      user: check.userData,
      orders: list,
    });
  } else {
    res.status(400).json({
      error: "Incorrect ID Or Password!",
    });
  }
});

//UpdateUserName
router.put("/updateName", async (req, res) => {
  const { userID, name } = req.body;

  try {
    const users = await UsersModel.update(
      {
        name,
      },
      { where: { userID: userID } }
    );
    res.status(200).json({
      metadata: "Name Updated👌",
      users,
    });
  } catch (error) {
    res.status(404).json({
      error: "Error, Please Try Again!",
      error,
    });
  }
});

//UpdateUserPassword
router.put("/updatePassword", async (req, res) => {
  const { userID, password, newPass } = req.body;
  console.log(newPass);
  const check = await passwordCheck(userID, password);

  const encryptedPassword = await bcrypt.hash(newPass, 10);

  if (check.compare == true) {
    const users = await UsersModel.update(
      {
        password: encryptedPassword,
      },
      { where: { userID: userID } }
    );
    res.status(200).json({
      users: { updated: users[0] },
      metadata: "User Updated👌",
    });
  } else {
    res.status(404).json({
      error: "Error, Please Try Again!",
    });
  }
});

//GetAllOrders
// GetAllOrders or GetOrdersByDate
router.get("/orders", async (req, res) => {
  try {
    const { date } = req.query;
    let orders;

    if (date) {
      orders = await OrdersModel.findAll({
        where: { orderDate: date },
      });
    } else {
      // If no date parameter is provided, fetch all orders
      orders = await OrdersModel.findAll();
    }

    res.status(200).json({
      data: orders,
      metadata: date ? `Show Orders for ${date}` : "Show All Orders",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "An error occurred while fetching the orders",
    });
  }
});

//DeleteOrder
router.delete("/deleteOrder", async (req, res) => {
  const { userID, orderID } = req.body;
  console.log(userID);
  console.log(orderID);
  const check = await OrdersModel.findOne({
    where: { userID: userID, orderID: orderID },
  });

  if (check) {
    const orders = await OrdersModel.destroy({
      where: { userID: userID, orderID: orderID },
    });

    res.status(200).json({
      users: {
        deleted: orders,
      },
      metadata: "Order Deleted👌",
    });
  } else {
    res.status(404).json({
      error: "Task doesn't exist",
    });
  }
});

//AddOrder
router.post("/addOrder", async (req, res) => {
  const {
    userID,
    orderStation,
    orderDuration,
    orderDate,
    orderTime,
    totalPayment,
  } = req.body;

  const orderCreate = await OrdersModel.create({
    userID: userID,
    orderStation: orderStation,
    orderDuration: orderDuration,
    orderDate: orderDate,
    orderTime: orderTime,
    totalPayment: totalPayment,
    paymentStatus: "0",
  });

  res.status(200).json({
    new_data: orderCreate,
    metadata: "Input Order",
  });
});

//UpdateOrder
router.put("/updateOrder", async (req, res) => {
  const {
    userID,
    orderID,
    orderStation,
    orderDate,
    totalPayment,
    paymentStatus,
  } = req.body;
  console.log(userID);
  console.log(orderID);
  console.log(paymentStatus);
  const orders = await OrdersModel.update(
    {
      orderStation: orderStation,
      orderDate: orderDate,
      totalPayment: totalPayment,
      paymentStatus: paymentStatus,
    },
    { where: { userID: userID, orderID: orderID } }
  );
  res.status(200).json({
    data: { updated: orders[0] },
    metadata: "Update endpoint",
  });
});

module.exports = router;
