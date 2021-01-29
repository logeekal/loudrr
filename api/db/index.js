const neo4j = require('neo4j-driver');
const { ENTITIES } = require('./constant');

require('dotenv').config()

console.log('Running DB module');


async function dbSetup(dbInstance) {
    console.log('Setting up database')

    const session = dbInstance.session({database: process.env.DB_NAME});

    const USER_CONSTRAINT_QUERY = `CREATE CONSTRAINT USER_NAME_CONSTRAINT IF NOT EXISTS on (u:${ENTITIES.USER}) `+
                                  `ASSERT u.email is UNIQUE `;

    await session.run(USER_CONSTRAINT_QUERY);

    const PAGE_CONSTRAINT_QUERY= `CREATE CONSTRAINT PAGE_SLUG_CONSTRAINT IF NOT EXISTS on (u:${ENTITIES.PAGE}) ` +
                                 ` ASSERT `

    session.close();

    console.log('Completed Setting up Database')
}


const Neo4jDriver = (function (){
    let dbInstance;
    function createDB(){
        const dbDriver = neo4j.driver(`neo4j://${process.env.DB_HOST}`, neo4j.auth.basic(process.env.DB_USER, process.env.DB_PASSWORD,'native'))
        // console.log(dbDriver);
        return dbDriver;
    }

    return function (){
        if (!dbInstance){
            dbInstance = createDB()
        }

        return dbInstance;
    }
})();


module.exports =  {
    db: Neo4jDriver(),
    setup: dbSetup
}