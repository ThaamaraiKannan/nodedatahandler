
# Nodedatahandler

Nodedatahandler is a comprehensive toolkit for Node.js that simplifies the process of building API responses, reading SQL files, and managing database connections and migrations.

## Features

* Build consistent API responses with ease.
* Read SQL files from your filesystem.
* Handle database connections with simplified async/await support.
* Log errors and track database operations efficiently.
* Migrate data between databases with minimal configuration.

## Installation

Install nodedatahandler by running:

```
npm install nodedatahandler
```

## Usage

Below are examples of how to use the main features of nodedatahandler.

**Building API Responses**

```javascript
const { buildResponse } = require('nodedatahandler');

// ... inside your API handler

const response = buildResponse(event, context, { message: 'Success' });

// send `response` back to your API caller
```

**Reading SQL Files**

```javascript
const readSqlFile = require('nodedatahandler/sql');

const sqlContent = readSqlFile('path/to/your/sqlfile.sql');

// use `sqlContent` with your database client
```

**Database Connection and Error Handling**

```javascript
const { query, migrate } = require('nodedatahandler/dbConnector');

// ... perform database operations
```

**API Reference**

Detailed information on all available methods and their usage can be found below.

**buildResponse(event, context, response, [statusCode], [methods])**

Builds and returns an API response object.

**readSqlFile(filename)**

Reads an SQL file and returns its content as a string.

**query(sql, [data], [db], [env], [response])**

Executes a SQL query and returns the results.

**migrate(sourceDb, targetDb, selectSql, insertSql, [env], [fetchOne], [cleanup], [truncateSql])**

Handles data migration between databases.

## Examples

For more examples on how to use nodedatahandler, refer to the `/examples` directory in this package.

Here's a simple example:

```javascript
const { buildResponse, query } = require('nodedatahandler');

async function getPosts(event, context) {
  const posts = await query('SELECT * FROM posts');
  return buildResponse(event, context, posts);
}
```

## Support

If you have any questions or encounter issues, please open an issue on the GitHub issue tracker for this project.