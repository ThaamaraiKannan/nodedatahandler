const mysql = require('mysql');
const util = require('util');



function connectDB(dbName, env) {
  const connection = mysql.createConnection({
    host: env.DB_HOST ,
    user:  env.DB_USERNAME,
    password:  env.DB_PASSWORD,
    database: dbName || env.DB_NAME,
    multipleStatements: true
  });
  
  // Promisify the connection methods for async/await support
  connection.query = util.promisify(connection.query);

  return connection;
}

async function query(sql, data = [], db = null, env = null, response = false) {
  const connection = connectDB(db, env);
  try {
    await connection.connect();
    const results = await connection.query(sql, data);
    if (response) {
      return { data: processResult(results), statusCode: 200 };
    } else {
      return { message: "Successfully Created", statusCode: 201 };
    }
  } catch (error) {
    console.error("Database error", error);
    return error;
  } finally {
    connection.end();
  }
}

function processResult(results) {
  console.info(`Number of rows fetched: ${results.length}`);
  const data = results.map(row => {
    return Object.values(row).map(value => {
      try {
        return JSON.parse(value);
      } catch (error) {
        console.error(error)
        return value;
      }
    });
  });
  console.info("Result processing successful");
  return data;
}

async function ErrorHandler(errorLogDb, errorInsertSql, errorData, env) {
    try {
      const connection = await connectDB(errorLogDb, env);
      await connection.execute(errorInsertSql, errorData);
      await connection.end(); // Properly close the connection
      console.info("Error logged to database successfully.");
      return { "Message": "Successfully Created" };
    } catch (error) {
      console.error("Failed to log error to Error database", error);
      throw error; // Rethrow the error after logging
    }
  }

async function migrate(sourceDb, targetDb, selectSql, insertSql, env = null, fetchOne = false, cleanup = false, truncateSql = null) {
  let sourceConnection;
  let targetConnection;
  try {
    sourceConnection = connectDB(sourceDb, env);
    targetConnection = connectDB(targetDb, env);
    await sourceConnection.connect();
    await targetConnection.connect();

    const [fetchedData] = fetchOne
      ? await sourceConnection.query(selectSql)
      : await sourceConnection.query(selectSql);
    
    await targetConnection.query(insertSql, [fetchedData]);

    if (cleanup) {
      if (!truncateSql) {
        throw new Error("Truncate SQL must be provided when cleanup is True");
      }
      
      await sourceConnection.query(truncateSql);
    }

    return { message: "Success", statusCode: 200 };
  } catch (e) {
    console.error(e);
    return { error: e.message, statusCode: 500 };
  } finally {
    if (sourceConnection) sourceConnection.end();
    if (targetConnection) targetConnection.end();
  }
}

module.exports = {
  query,
  migrate,
  ErrorHandler
};