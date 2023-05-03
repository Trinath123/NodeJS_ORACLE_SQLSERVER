module.exports = (app) => {
  const settings = require("../controllers/settings.controllers");

  // Fetch data from HeatTestResultDataTable
  app.get("/api/v1/settings/setting", settings.getSettings);

  // Update data in TcpPortSettings
  app.put("/api/v1/settings/update", settings.updateSettings);
};
