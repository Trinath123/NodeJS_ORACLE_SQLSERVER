const { jwtSecretKey, isOracle } = require("../../config/constant");
const Settings = require("../models/settings.models");
const jwt = require("jsonwebtoken");

// Retrive all settings of devices from table.
async function getSettings(req, res) {
  if (!req.headers.authorization) {
    return res.status(401).send({ message: "Please provide a valid token" });
  }
  token = req.headers.authorization.split(" ")[1];
  try {
    payload = jwt.verify(token, jwtSecretKey);
    try {
      const settings = await Settings.getSettings();
      // formating setting data as per UI requirement
      let formatSetting = isOracle
        ? settings.reduce((a, v) => ({ ...a, [v.DEVICE]: v }), {})
        : settings.reduce((a, v) => ({ ...a, [v.Device]: v }), {});
      res.json(formatSetting);
    } catch (err) {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving settings.",
        });
      console.error("Error getting settings", err);
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

async function updateSettings(req, res) {
  if (!req.headers.authorization) {
    return res.status(401).send({ message: "Please provide a valid token" });
  }
  token = req.headers.authorization.split(" ")[1];
  try {
    payload = jwt.verify(token, jwtSecretKey);
    const data = req.body;
    const formatData = Object.values(data);
    console.log(formatData);
    try {
      const updatedResult = await Settings.updateSettings(formatData);
      if (updatedResult.rowsAffected === 0) {
        res.status(400).json({ message: "Invalid Device Number" });
      } else {
        res.json({ message: "Update Successful" });
      }
    } catch (err) {
      if (err)
        res.status(500).send({
          message: err.message || "Some error occurred while updating data.",
        });
      console.error("Error updating data", err);
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
  getSettings,
  updateSettings,
};
