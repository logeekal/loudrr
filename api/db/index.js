const neo4j = require('neo4j');
require('dotenv').config()

db = new neo4j.GraphDatabase(`http://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${DB_HOST}`);


module.exports = db