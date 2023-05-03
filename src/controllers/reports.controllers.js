const { jwtSecretKey } = require("../../config/constant");
const Reports = require("../models/reports.models");
const jwt = require("jsonwebtoken");

let instrument = null;
let heatid = null;
let fromTime = null;
let toTime = null;
let treatid = null;
let sampleno = null;

async function getReportsIHTS(req, res) {
  let token;
  if (!req.headers.authorization) {
    return res.status(401).send({ message: "Please provide a valid token" });
  }
  token = req.headers.authorization.split(" ")[1];
  try {
    payload = jwt.verify(token, jwtSecretKey);
    instrument = req.body.instrument;
    heatid = req.body.heatid;
    treatid = req.body.treatid;
    sampleno = req.body.sampleno;
    fromTime = req.body.fromTime;
    toTime = req.body.toTime;

    let reports;

    try {
      if (
        instrument &&
        !heatid &&
        !treatid &&
        !sampleno &&
        !fromTime &&
        !toTime
      ) {
        const reports = await Reports.getHTRDT(instrument);
        res.json(reports);
      } else if (
        instrument &&
        heatid &&
        !treatid &&
        !sampleno &&
        !fromTime &&
        !toTime
      ) {
        const reports = await Reports.getHTRDTByHeatNo(instrument, heatid);
        res.json(reports);
      } else if (
        instrument &&
        !heatid &&
        !treatid &&
        !sampleno &&
        fromTime &&
        toTime
      ) {
        const reports = await Reports.getHTRDTByTime(
          instrument,
          fromTime,
          toTime
        );
        res.json(reports);
      } else if (
        instrument &&
        heatid &&
        treatid &&
        sampleno &&
        !fromTime &&
        !toTime
      ) {
        switch (instrument) {
          case "LECO1":
            reports = await Reports.getinstruHTRDTs2(
              instrument,
              heatid,
              sampleno,
              treatid
            );
            res.json(reports);
            break;

          case "SPECTRO1":
          case "SPECTRO2":
          case "SPECTRO3":
          case "BOFCLAB":
            reports = await Reports.getinstruHTRDTs1(
              instrument,
              heatid,
              treatid,
              sampleno
            );
            res.json(reports);
            break;

          case "LECO2":
          case "LECO3":
            reports = await Reports.getinstruHTRDTs3(
              instrument,
              heatid,
              treatid,
              sampleno
            );
            res.json(reports);
            break;

          case "XRF1":
          case "XRF2":
            reports = await Reports.getinstruHTRDTs4(
              instrument,
              heatid,
              treatid,
              sampleno
            );
            res.json(reports);
            break;
        }
      }
    } catch (err) {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving reports.",
        });
      console.error("Error getting reports", err);
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
  getReportsIHTS,
};
