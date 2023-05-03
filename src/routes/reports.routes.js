module.exports = (app) => {
  const reports = require("../controllers/reports.controllers");

  // Fetch data from HeatTestResultDataTable
  app.post("/api/v1/reports/report", reports.getReportsIHTS);
};
