const neo4j = require("neo4j-driver");
const { ENTITIES } = require("./constant");
const path = require("path");

console.log("Running in ", __dirname);

const envConfig =
  process.env.NODE_ENV === "production"
    ? { path: path.join(__dirname, "../../.env.production") }
    : {};

console.log("running with env config", envConfig);

require("dotenv").config(envConfig);

console.log("Running DB module");

async function dbSetup(dbInstance, dbName) {
  console.log("Setting up database");

  const session = dbInstance.session({
    database: dbName || process.env.DB_NAME,
  });

  const USER_CONSTRAINT_QUERY =
    `CREATE CONSTRAINT USER_NAME_CONSTRAINT IF NOT EXISTS on (u:${ENTITIES.USER}) ` +
    `ASSERT u.email is UNIQUE `;

  await session.run(USER_CONSTRAINT_QUERY);

  const PAGE_CONSTRAINT_QUERY =
    `CREATE CONSTRAINT PAGE_SLUG_CONSTRAINT IF NOT EXISTS on (u:${ENTITIES.PAGE}) ` +
    ` ASSERT `;

  session.close();

  console.log("Completed Setting up Database");
}

const Neo4jDriver = (function () {
  let dbInstance;
  function createDB() {
    console.log(
      `Connecting to ${process.env.DB_HOST} with password ${process.env.DB_PASSWORD}`
    );
    const dbDriver = neo4j.driver(
      `neo4j://${process.env.DB_HOST}`,
      neo4j.auth.basic(process.env.DB_USER, process.env.DB_PASSWORD, "native"),
      { disableLosslessIntegers: true }
    );
    // console.log(dbDriver);
    return dbDriver;
  }

  return function () {
    if (!dbInstance) {
      dbInstance = createDB();
    }

    return dbInstance;
  };
})();

const Neo4jDriverTest = (function () {
  let dbInstance;
  function createDB() {
    const dbDriver = neo4j.driver(
      `neo4j://${process.env.DB_HOST_TEST}`,
      neo4j.auth.basic(process.env.DB_USER, process.env.DB_PASSWORD, "native"),
      { disableLosslessIntegers: true }
    );
    return dbDriver;
  }

  return function () {
    if (!dbInstance) {
      dbInstance = createDB();
    }

    return dbInstance;
  };
})();

module.exports = {
  db: Neo4jDriver(),
  dbTest: Neo4jDriverTest(),
  setup: dbSetup,
};
