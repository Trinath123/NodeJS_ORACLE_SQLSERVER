const { jwtSecretKey, TokenExpiredTime } = require("../../config/constant");
const User = require("../models/userManagement.models");
const jwt = require("jsonwebtoken");
var _ = require("lodash");

async function createUser(req, res) {
  let token;
  // Create a user
  const user = new User.NewUser({
    user_name: req.body.user_name,
    password: req.body.password,
    role: req.body.role,
    active: 1,
    activated: new Date(),
  });

  try {
    await User.newUser(user);
    try {
      token = jwt.sign(
        { user_name: user.user_name, role: user.role },
        jwtSecretKey,
        { expiresIn: TokenExpiredTime }
      );
    } catch (err) {
      const error = new Error("Error! Something went wrong.");
      return next(error);
    }
    res.status(201).json({
      success: true,
      data: {
        user_name: user.user_name,
        role: user.role,
        active: user.active,
        token: token,
      },
    });
  } catch (err) {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    console.error("Error getting users", err);
    res.status(500).send("Server error");
  }
}

async function login(req, res) {
  let token;
  // Verify a user
  const user = new User.NewUser({
    user_name: req.body.user_name,
    password: req.body.password,
  });

  try {
    const users = await User.signInUser(user);
    if (!_.isEmpty(users)) {
      try {
        token = jwt.sign(
          { user_name: user.user_name, role: user.role },
          jwtSecretKey,
          { expiresIn: TokenExpiredTime }
        );
      } catch (err) {
        const error = new Error("Error! Something went wrong.");
        return next(error);
      }
      res.status(200).json({
        success: true,
        data: {
          user_name: users.user_name,
          role: users.Role,
          active: users.Active,
          activated: users.Activated,
          deactivated: users.Deactivated,
          token: token,
        },
      });
    } else {
      res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (err) {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    console.error("Error getting users", err);
    res.status(500).send("Server error");
  }
}

var token;

// Retrieve all Users from the database.
async function findAll(req, res) {
  if (!req.headers.authorization) {
    return res.status(401).send({ message: "Please provide a valid token" });
  }
  token = req.headers.authorization.split(" ")[1];
  try {
    payload = jwt.verify(token, jwtSecretKey);
    try {
      const users = await User.getAll();
      res.json(users);
    } catch (err) {
      if (err)
        res.status(500).send({
          message: err.message || "Some error occurred while retrieving users.",
        });
      console.error("Error getting users", err);
      res.status(500).send("Server error");
    }
  } catch (e) {
    if (e.name === "TokenExpiredError") {
      res.status(401).send({ message: "Token Expired" });
    } else {
      res.status(401).send({ message: "Authentication failed" });
    }
    return;
  }
}

async function roleUser(req, res) {
  if (!req.headers.authorization) {
    return res.status(401).send({ message: "Please provide a valid token" });
  }
  token = req.headers.authorization.split(" ")[1];
  try {
    payload = jwt.verify(token, jwtSecretKey);
    try {
      const role = req.params.role;
      const users = await User.getUserByRole(role.toLowerCase());
      res.json(users);
    } catch (err) {
      if (err)
        res.status(500).send({
          message: err.message || "Some error occurred while retrieving users.",
        });
      console.error("Error getting users", err);
      res.status(500).send("Server error");
    }
  } catch (e) {
    if (e.name === "TokenExpiredError") {
      res.status(401).send({ message: "Token Expired" });
    } else {
      res.status(401).send({ message: "Authentication failed" });
    }
    return;
  }
}

module.exports = {
  createUser,
  login,
  findAll,
  roleUser,
};
