const { db } = require("./");
const { RELATIONSHIPS, ENTITIES, COMMENT_STATUS } = require("./constant");
const uuid = require("uuid");
const { convertNeo4jResultToObject } = require("./utils");
const neo4j = require("neo4j-driver");

async function createUser(email, name, password, avatar) {
  let localPassword = null;
  const session = db.session({});
  checkMandatory({ email });
  checkMandatory({ name });
  checkMandatory({ avatar });

  if (!password) {
    let uuidPass = uuid.v4();
    localPassword = uuidPass.substr(0, uuidPass.indexOf("-"));
  }
  // returning cypher query.
  const cypher =
    `CREATE (newUser:${ENTITIES.USER}{email:$email,name:$name,password:$password,avatar:$avatar,createDate:timestamp(),updateDate:timestamp()})` +
    `RETURN newUser`;

  let results = await session.run(cypher, {
    email,
    name,
    password: password || localPassword,
    avatar: avatar,
  });

  session.close();
  return results.records[0].get("newUser").properties;
}

async function createDomain(domainAddress, domainCreatedBy) {
  const session = db.session();
  //createdBy : email of the user

  checkMandatory({ domainAddress });

  checkMandatory({ domainCreatedBy });

  const domainKey = uuid.v4();

  const query =
    `MATCH (u:${ENTITIES.USER}{email:'${domainCreatedBy}'}) ` +
    `CREATE (u)-[:${RELATIONSHIPS.HAS_DOMAIN}]->(domain:${ENTITIES.DOMAIN}{address:'${domainAddress}',key:'${domainKey}',createDate:timestamp(),updateDate:timestamp()}) ` +
    `RETURN domain`;

  const results = await session.run(query);
  await session.close();
  return results.records[0].get("domain").properties;
}

async function createParentComment(
  mdText,
  from,
  pageLocation,
  pageTitle,
  domainKey,
  commentStatus
) {
  //from : email of the user
  //mdText: comment text in markdown

  const session = db.session();

  checkMandatory({ mdText });
  checkMandatory({ from });
  checkMandatory({ pageLocation });
  checkMandatory({ pageTitle });
  checkMandatory({ domainKey });

  if (![COMMENT_STATUS.POSTED, COMMENT_STATUS.DRAFT].includes(commentStatus)) {
    throw new Error("Invalid Comment Status");
  }

  //CHECK IF USERS IS EXISTING BEFORE CREATING COMMENT:

  const userExistenceResultSet = await getUser(from);

  if (!userExistenceResultSet) {
    throw new Error(
      "User does not exist. User should be existing before creating parent comment."
    );
  }

  const exitingDomainKey = await getDomain(domainKey); //will throw an error if domain keys is not existing

  const query =
    `MERGE (page:${ENTITIES.PAGE} {pageLocation:'${pageLocation}'}) ` +
    `ON CREATE SET page.pageTitle='${pageTitle}',page.createDate=timestamp(),page.updateDate=timestamp() ` +
    `WITH page ` +
    /*
                    check if page exists and if it does NOT
                    create the page
                    and its relationship
                */
    `MATCH (domain:${ENTITIES.DOMAIN} {key:'${domainKey}'}) ` +
    `MERGE (domain)-[:${RELATIONSHIPS.HAS_PAGE}]->(page) ` +
    `WITH page ` +
    `CREATE (page)-[:${RELATIONSHIPS.HAS_COMMENT}]->(comment:${
      ENTITIES.COMMENT
    } {id:'${uuid.v4()}',markdownText:'${mdText}',createdate:timestamp(),updateDate:timestamp(),status:'${commentStatus}'}) ` +
    `WITH comment ` +
    `MATCH (u:${ENTITIES.USER}{email:'${from}'}) ` +
    `CREATE (u)-[:${RELATIONSHIPS.COMMENTED}]->(comment) ` +
    `RETURN comment `;

  const results = await session.run(query);
  session.close();
  return results.records[0].get("comment").properties;
}

async function createChildComment(
  parentCommentId,
  mdText,
  fromUser,
  commentStatus
) {
  checkMandatory({ parentCommentId });
  checkMandatory({ mdText });
  checkMandatory({ fromUser });
  const session = db.session();

  if (![COMMENT_STATUS.POSTED, COMMENT_STATUS.DRAFT].includes(commentStatus)) {
    throw new Error(`Invalid Comment Status : ${commentStatus}`);
  }

  const fromUserExists = getUser(fromUser);

  if (!fromUserExists) {
    throw new Error("User does not exists. Child comment cannot be added.");
  }

  const query =
    `MATCH (parentComment:${ENTITIES.COMMENT}{id:'${parentCommentId}'}) ` +
    `CREATE (comment:${
      ENTITIES.COMMENT
    } {id:'${uuid.v4()}',markDownText:'${mdText}',status:'${commentStatus}',createDate:timestamp(),updateDate:timestamp()}) ` +
    `CREATE (parentComment)-[:${RELATIONSHIPS.HAS_REPLY}]->(comment) ` +
    `CREATE (comment)-[:${RELATIONSHIPS.REPLY_OF}]->(parentComment) ` +
    `WITH comment, parentComment ` +
    `MATCH (user:${ENTITIES.USER} {email:'${fromUser}'}) ` +
    `CREATE (user)-[:${RELATIONSHIPS.COMMENTED}]->(comment) ` +
    `RETURN comment, parentComment.id as parentCommentId`;


  const results = await session.run(query);

  session.close();

  return {
    comment: results.records[0].get("comment").properties,
    parentCommentId: results.records[0].get("parentCommentId"),
  };
}

function checkMandatory(obj) {
  if (!Object.values(obj)[0]) {
    throw new Error(`${Object.keys(obj)[0]} should have a value`);
  }
}

async function getUser(userEmail) {
  const session = db.session({ defaultAccessMode: neo4j.session.READ });
  checkMandatory({ userEmail });

  const query = `MATCH (u:${ENTITIES.USER}{email:'${userEmail}'})` + `RETURN u`;

  const results = await session.run(query);

  session.close();

  return results.records[0];
}

async function getDomainsforUser(userEmail) {
  checkMandatory({ userEmail });
  const session = db.session({ defaultAccessMode: neo4j.session.READ });

  const query =
    `MATCH (u:${ENTITIES.USER}{email:'${userEmail}'})` +
    `MATCH (u)-[:${RELATIONSHIPS.HAS_DOMAIN}]->(domain)` +
    `RETURN domain`;

  const results = await session.run(query);

  session.close();

  const domains = results.records.map(
    (record) => record.get("domain").properties
  );
  return domains;
}

async function getDomain(domainKey) {
  checkMandatory({ domainKey });

  const session = db.session({ defaultAccessMode: neo4j.session.READ });

  const query =
    `MATCH (domain:${ENTITIES.DOMAIN}{key:'${domainKey}'}) ` + `RETURN domain`;

  const results = await session.run(query);
  session.close();

  if (results.records.length > 0) {
    return results.records["0"].get("domain");
  } else {
    throw new Error("Invalid Domain Key");
  }
}

async function getPagesForDomain(domainKey) {
  checkMandatory({ domainKey });

  const session = db.session({ defaultAccessMode: neo4j.session.READ });

  const query =
    `MATCH (domain:${ENTITIES.DOMAIN}{key:'${domainKey}'}) ` +
    `MATCH (domain)-[:${RELATIONSHIPS.HAS_PAGE}]->(page) ` +
    `MATCH (page) -[:${RELATIONSHIPS.HAS_COMMENT}]->(comment) ` +
    `RETURN page, comment ` +
    `ORDER BY comment.createDate DESC`;

  const results = await session.run(query);

  session.close();


  return convertNeo4jResultToObject(results);
}

async function getAllCommentsByUser(userEmail) {
  checkMandatory(userEmail);

  const session = db.session({ defaultAccessMode: neo4j.session.READ });

  const query =
    `MATCH (user:${ENTITIES.USER}{email:${userEmail}})` +
    `OPTIONAL MATCH (user)-[:${RELATIONSHIPS.COMMENTED}]->(comment)` +
    `MATCH (comment)-[:${RELATIONSHIPS.REPLY_OF}*]->(parentComment)` +
    `OPTIONAL MATCH (page)-[:${RELATIONSHIPS.HAS_COMMENT}]->(parentComment)` +
    `RETURN comment, parentComment, page.title` +
    `ORDER comment.createDate DESC`;

  const results = session.run(query);

  session.close();

  return results.records;
}

/**
 * 
 * @typedef allComments 
 * 
 * @property {array} comments
 * @property {array} parentIds
 */
/**
 * @param  {string} commentId
 * 
 * @returns {allComments}
 */
async function getAllChildComments(commentId) {
  checkMandatory({commentId});

  const session = db.session({ defaultAccessMode: neo4j.session.READ });

  const query = `MATCH (parentComment:${ENTITIES.COMMENT}{id:'${commentId}'}) `+ 
                `MATCH  (parentComment)-[:${RELATIONSHIPS.HAS_REPLY}*]->(child) `+
                `MATCH (child)-[:${RELATIONSHIPS.REPLY_OF}]->(x) ` +
                `RETURN child as comments, x.id as parentIds`;
 
  const results = await session.run(query);

    session.close()
  return convertNeo4jResultToObject(results);
  

}

function getVariableName(obj) {
  return Object.keys(obj)[0];
}

async function getFirstLevelChildComments(commentId){
    checkMandatory({commentId});


  const session = db.session({ defaultAccessMode: neo4j.session.READ });

  const query = `MATCH (parentComment:${ENTITIES.COMMENT}{id:'${commentId}'}) ` +
                `MATCH (parentComment)-[:${RELATIONSHIPS.HAS_REPLY}]->(comment) `+
                `RETURN comment`;
   
  const results = await session.run(query);

  session.close()
  if(results.records.length > 0){
    return results.records.map(record=> record.get('comment').properties);
  }else{
      return []
  }
}

module.exports = {
  createUser,
  createDomain,
  createParentComment,
  createChildComment,
  getUser,
  getDomainsforUser,
  getPagesForDomain,
  getFirstLevelChildComments,
  getAllChildComments,
};
