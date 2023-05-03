const sql = require("../../config/database.config");
var oracledb = require("oracledb");
const config = require("../../config/database.connection");
const { isOracle } = require("../../config/constant");
const { poolPromise } = require("../../config/mssqlDB.config");

const NewUser = function (user) {
  this.user_name = user.user_name;
  this.password = user.password;
  this.role = user.role;
  this.active = user.active;
  this.activated = user.activated;
};

let conn;
let result;

async function newUser(newUser) {
  try {
    if (isOracle) {
      conn = await oracledb.getConnection(config);
      result = await conn.execute(
        `INSERT INTO USERMANAGMENTTABLE VALUES (:user_name, :password, :role, :active, :activated, :deactivated)`,
        {
          user_name: {
            dir: oracledb.BIND_IN,
            val: newUser.user_name,
            type: oracledb.STRING,
          },
          password: {
            dir: oracledb.BIND_IN,
            val: newUser.password,
            type: oracledb.STRING,
          },
          role: {
            dir: oracledb.BIND_IN,
            val: newUser.role,
            type: oracledb.STRING,
          },
          active: {
            dir: oracledb.BIND_IN,
            val: newUser.active,
            type: oracledb.NUMBER,
          },
          activated: {
            dir: oracledb.BIND_IN,
            val: newUser.activated,
            type: oracledb.DB_TYPE_TIMESTAMP,
          },
          deactivated: {
            dir: oracledb.BIND_IN,
            val: null,
            type: oracledb.DB_TYPE_TIMESTAMP,
          },
        },
        { autoCommit: true }
      );
      return result;
    } else {
      const pool = await poolPromise;
      const rs = await pool.request().query(
        `INSERT INTO [dbo].[UserManagmentTable]
        ([user_name]
        ,[password]
        ,[Role]
        ,[Active]
        ,[Activated]
        ,[DeActivated])
  VALUES
        ( '${newUser.user_name}' , '${newUser.password}' , '${newUser.role}' , ${newUser.active} , CURRENT_TIMESTAMP , null)`
      );
      console.log(rs);
      return rs;
    }
  } catch (err) {
    console.error("Error executing query", err);
    throw err;
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (err) {
        console.error("Error closing database connection", err);
      }
    }
  }
}

async function getAll() {
  if (isOracle) {
    const sqlQ = "SELECT * FROM USERMANAGMENTTABLE";
    const users = await sql.query(sqlQ);
    return users;
  } else {
    const pool = await poolPromise;
    const rs = await pool.request().query(
      `SELECT [user_name]
      ,[password]
      ,[Role]
      ,[Active]
      ,[Activated]
      ,[DeActivated]
  FROM [dbo].[UserManagmentTable]`
    );
    return rs.recordsets[0];
  }
}

async function getUserByRole(role) {
  try {
    if (isOracle) {
      conn = await oracledb.getConnection(config);
      result = await conn.execute(
        "SELECT * FROM USERMANAGMENTTABLE WHERE ROLE=:role",
        { role: role },
        { outFormat: oracledb.OBJECT }
      );
      const userResult = result.rows;
      return userResult;
    } else {
      const pool = await poolPromise;
      const rs = await pool.request().query(
        `SELECT [user_name]
      ,[password]
      ,[Role]
      ,[Active]
      ,[Activated]
      ,[DeActivated]
  FROM [dbo].[UserManagmentTable] WHERE Role = '${role}'`
      );
      return rs.recordsets[0];
    }
  } catch (err) {
    console.error("Error executing query", err);
    throw err;
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (err) {
        console.error("Error closing database connection", err);
      }
    }
  }
}

async function signInUser(user) {
  try {
    if (isOracle) {
      conn = await oracledb.getConnection(config);
      result = await conn.execute(
        'select user_name as "user_name", password as "password", role as "Role", active as "Active", activated as "Activated", deactivated as "Deactivated" from USERMANAGMENTTABLE where user_name = :user_name and password = :password',
        { user_name: user.user_name, password: user.password },
        { outFormat: oracledb.OBJECT }
      );
      const userResult = result.rows[0];
      return userResult;
    } else {
      const pool = await poolPromise;
      const rs = await pool.request().query(
        `SELECT TOP 1 [user_name]
          ,[password]
          ,[Role]
          ,[Active]
          ,[Activated]
          ,[DeActivated]
      FROM [dbo].[UserManagmentTable] WHERE user_name=${user.user_name} and password='${user.password}' `
      );
      return rs.recordset[0];
    }
  } catch (err) {
    console.error("Error executing query", err);
    throw err;
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (err) {
        console.error("Error closing database connection", err);
      }
    }
  }
}

module.exports = {
  NewUser,
  signInUser,
  newUser,
  getAll,
  getUserByRole,
};
