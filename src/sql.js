const fs = require('fs');

function readSqlFile(filename) {
  try {
    const sql = fs.readFileSync(filename, { encoding: 'utf8' });
    return sql;
  } catch (e) {
    console.error(`An error occurred while reading the file: ${e.message}`);
    return null; // or throw e; to propagate the error, depending on your use case
  }
}

module.exports = readSqlFile;