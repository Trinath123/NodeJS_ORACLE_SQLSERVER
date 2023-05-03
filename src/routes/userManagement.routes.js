module.exports = (app) => {
  const users = require("../controllers/usermanagement.controllers");

  // Create a new User
  app.post("/api/v1/user/create", users.createUser);

  // Retrieve all Users
  app.get("/api/v1/user/all", users.findAll);

  // Retrieve Users by role
  app.get("/api/v1/user/role/:role", users.roleUser);

  //Login a user
  app.post("/api/v1/user/login", users.login);
};
