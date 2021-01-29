const {db} = require('./')
const { RELATIONSHIPS, ENTITIES, COMMENT_STATUS} = require('./constant');
const uuid = require('uuid');
const {getCurrentDate} =  require('./utils');
const neo4j  = require('neo4j-driver');


async function createUser(email, name, password, avatar) {
    let localPassword = null;
    const session = db.session({});
    checkMandatory({email});
    checkMandatory({name});
    checkMandatory({avatar})

    if(!password){
      let uuidPass = uuid.v4();
      localPassword = uuidPass.substr(0, uuidPass.indexOf('-'));
    }
    // returning cypher query.
    const cypher = `CREATE (newUser:${ENTITIES.USER}{email:$email,name:$name,password:$password,avatar:$avatar,createDate:'${Date.now().toLocaleString()}',updateDate:'${Date.now().toLocaleString()}'})` + 
                    `RETURN newUser`;
    
    let results = await session.run(cypher, {
            email,
            name,
            password: password || localPassword,
            avatar:avatar
        }
    );

    session.close();
    return results.records[0].get('newUser').properties;

    
}

async function createDomain(domainAddress, domainCreatedBy){
    const session = db.session();
    //createdBy : email of the user

    checkMandatory({domainAddress});

    checkMandatory({domainCreatedBy});

    const domainKey = uuid.v4();

    const query =  `MATCH (u:${ENTITIES.USER}{email:'${domainCreatedBy}'}) ` + 
                   `CREATE (u)-[:${RELATIONSHIPS.HAS_DOMAIN}]->(domain:${ENTITIES.DOMAIN}{address:'${domainAddress}',key:'${domainKey}',createDate:'${getCurrentDate()}',updateDate:'${getCurrentDate()}'}) ` + 
                   `RETURN domain`;

    const results = await session.run(query);
    await session.close();
    return results.records[0].get('domain').properties;
}

async function createParentComment(mdText, from, pageLocation, pageTitle, domainKey, commentStatus) {
    //from : email of the user
    //mdText: comment text in markdown

    const session = db.session();
    
    checkMandatory({mdText});
    checkMandatory({from});
    checkMandatory({pageLocation});
    checkMandatory({pageTitle});
    checkMandatory({domainKey});


    if(![COMMENT_STATUS.POSTED,COMMENT_STATUS.DRAFT].includes(commentStatus)){
        throw new Error('Invalid Comment Status')
    }

    const query = 
                `MERGE (page:${ENTITIES.PAGE} {pageLocation:'${pageLocation}'}) ` +
                `ON CREATE SET page.pageTitle='${pageTitle}',page.createDate='${getCurrentDate()}',page.updateDate='${getCurrentDate()}' ` +
                `WITH page ` +
                /*
                    check if page exists and if it does NOT
                    create the page
                    and its relationship
                */
                `MATCH (domain:${ENTITIES.DOMAIN} {key:'${domainKey}'})` +
                `MERGE (domain)-[:${RELATIONSHIPS.HAS_PAGE}]->(page) ` +
                `WITH page ` +
                `MATCH (u:${ENTITIES.USER}{email:'${from}'} ) ` +
                `CREATE (u)-[:${RELATIONSHIPS.COMMENTED}]->(comment: ${ENTITIES.COMMENT} {id:'${uuid.v4()}',mardownText:'${mdText}',createdate:'${getCurrentDate()}',updateDate:'${getCurrentDate()}',status:'${commentStatus}'}) ` + 
                `CREATE (page)-[:${RELATIONSHIPS.HAS_COMMENT}]->(comment) ` + 
                `WITH comment ` + 
                `MATCH (comment:${ENTITIES.COMMENT})-[relations]->(x) ` + 
                `RETURN comment, relations, x`                ;

    const results   = await session.run(query);
    console.log(results);
    session.close();
    return results.records[0].get('comment').properties
}


async function createChildComment(parentCommentId, mdText, fromUser, status) {
    checkMandatory(parentCommentId);
    checkMandatory(mdText);
    checkMandatory(fromUser);

    if(!(COMMENT_STATUS.POSTED,COMMENT_STATUS.DRAFT).includes(commentStatus)){
        throw new Error('Invalid Comment Status')
    }

    const query = `MATCH (parentComment:${ENTITIES.COMMENT}{id:${parentCommentId}})` + 
                  `MATCH (user:${ENTITIES.USER} {email:${fromUser}})`
                  `CREATE (comment:${ENTITIES.COMMENT} {markDownText:${mdText},status:${status},createDate:${getCurrentDate()},updateDate:${getCurrentDate}}) ` + 
                  `CREATE (parentComment)-[:${RELATIONSHIPS.HAS_REPLY}]->(comment)` + 
                  `CREATE (comment)-[:${RELATIONSHIPS.REPLY_OF}]->(parentComment)` +
                  `CRETAE (user)=[:${RELATIONSHIPS.COMMENTED}]->(comment)`;

    const results = await session.run(query);

    session.close();

    return results.records[0];
}

function  checkMandatory(obj) {
    if(!Object.values(obj)[0]){
        throw new Error(`${Object.keys(obj)[0]} should have a value`)
    }
}


async function getUser(userEmail){
    const session = db.session({defaultAccessMode: neo4j.session.READ})
    checkMandatory(userEmail);

    const query = `MATCH (u:${ENTITIES.USER}{email:${userEmail}})`+
                  `RETURN u`;
    
    const results = await session.run(query);

    session.close();

    return results.records[0]
}

async function getDomainsforUser(userEmail) {
    checkMandatory({userEmail});
    const session = db.session({defaultAccessMode : neo4j.session.READ});

    const query = `MATCH (u:${ENTITIES.USER}{email:'${userEmail}'})` + 
                  `MATCH (u)-[:${RELATIONSHIPS.HAS_DOMAIN}]->(domain)` + 
                  `RETURN domain`

                  console.log(query);
    
    const results =  await session.run(query);

    session.close();

    const domains = results.records.map((record)=> record.get('domain').properties )
    return domains;
}


async function getPagesForDomain(domainKey){

    checkMandatory(domainKey);
    
    
    const session = db.session({defaultAccessMode :neo4j.session.READ});

    const query =  `MATCH (domain:${ENTITIES.DOMAIN}){key:${domainKey}}` + 
                   `(domain)-[:${RELATIONSHIPS.HAS_PAGE}]->(page)` + 
                   `(page) -[:${RELATIONSHIPS.HAS_COMMENT}]->(comment)` +
                   `RETURN page, comment` + 
                   `ORDER BY comment.createDate DESC`;


    const results =  await session.run(query);

    session.close();

    return results.records;

}


async function getAllCommentsByUser(userEmail) {
    checkMandatory(userEmail);

    const session = db.session({defaultAccessMode: neo4j.session.READ});

    const query = `MATCH (user:${ENTITIES.USER}{email:${userEmail}})` + 
                  `OPTIONAL MATCH (user)-[:${RELATIONSHIPS.COMMENTED}]->(comment)` + 
                  `MATCH (comment)-[:${RELATIONSHIPS.REPLY_OF}*]->(parentComment)` + 
                  `OPTIONAL MATCH (page)-[:${RELATIONSHIPS.HAS_COMMENT}]->(parentComment)` +
                  `RETURN comment, parentComment, page.title` + 
                  `ORDER comment.createDate DESC`;

    const results =  session.run(query);

    session.close();

    return results.records;
}

async function getChildComments(commentId){
    checkMandatory(commentId);

    const session =  db.session({defaultAccessMode: neo4j.session.READ});

    const query =  `MATCH (comment:${ENTITIES.COMMENT}{id:${commentId}})`
}

function getVariableName(obj) {
    return Object.keys(obj)[0];
}

module.exports = {
    createUser,
    createDomain,
    createParentComment,
    getUser,
    getDomainsforUser,
}