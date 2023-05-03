const sql = require("../../config/database.config");
var oracledb = require("oracledb");
const query = "SELECT * FROM TCPPortSettings";
const config = require("../../config/database.connection");
const { isOracle } = require("../../config/constant");
const { poolPromise } = require("../../config/mssqlDB.config");

//Query for Fetching Settings
async function getSettings() {
  if (isOracle) {
    const sqlQ = query;
    const settings = await sql.query(sqlQ);
    return settings;
  } else {
    const pool = await poolPromise;
    const rs = await pool.request().query(
      `SELECT [Device]
      ,[PortNo]
      ,[Enabled]
      ,[AutoTransmit]
  FROM [dbo].[TCPPortSettings]`
    );
    return rs.recordsets[0];
  }
}

let conn;
async function updateSettings(data) {
  try {
    if (isOracle) {
      conn = await oracledb.getConnection(config);
      const updateQuery = `UPDATE TCPPortSettings SET DEVICE=:DEVICE,PORTNO=:PORTNO,ENABLED=:ENABLED,AUTOTRANSMIT=:AUTOTRANSMIT where DEVICE=:DEVICE`;
      const options = {
        autoCommit: true,
        bindDefs: {
          DEVICE: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
          PORTNO: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
          ENABLED: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
          AUTOTRANSMIT: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        },
      };
      const updateBindData = data;
      const result = conn.executeMany(updateQuery, updateBindData, options);

      return result;
    } else {
      const pool = await poolPromise;
      const rs = await pool.request().query(
        `UPDATE e
SET PortNo = t.PortNo, Enabled = t.Enabled, AutoTransmit = t.AutoTransmit
FROM [dbo].[TCPPortSettings] e
JOIN (
    VALUES
       (3, 8596, 1, 1),
        (2, 8476, 0, 1)
) t (Device, PortNo, Enabled, AutoTransmit) ON t.Device = e.Device`
      );

      return rs.rowsAffected;
    }
  } catch (err) {
    console.error(err);
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
  getSettings,
  updateSettings,
};
