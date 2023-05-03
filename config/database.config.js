const oracledb = require('oracledb');
const config = require('./database.connection');

async function connect() {
    try {
        await oracledb.createPool(config);
        console.log('Connected to database');
    } catch (err) {
        console.error('Error connecting to database', err);
        throw err;
    }
}

async function disconnect() {
    try {
        await oracledb.getPool().close();
        console.log('Disconnected from database');
    } catch (err) {
        console.error('Error disconnecting from database', err);
        throw err;
    }
}

async function query(sql, binds = [], options = {}) {
    let conn;
    let result;

    options.outFormat = oracledb.OUT_FORMAT_OBJECT;

    try {
        conn = await oracledb.getConnection(config);
        result = await conn.execute(sql, binds, options);
        return result ? result.rows : null;
    } catch (err) {
        console.error('Error executing query', err);
        throw err;
    } finally {
        if (conn) {
            try {
                await conn.close();
            } catch (err) {
                console.error('Error closing database connection', err);
            }
        }
    }
}

module.exports = {
    connect,
    disconnect,
    query,
};


