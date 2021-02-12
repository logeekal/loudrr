let { db } = require("./");
const {
  RELATIONSHIPS,
  ENTITIES,
  COMMENT_STATUS,
  DOMAIN_STATUS,
  ROBOHASH_URL,
} = require("./constant");
const uuid = require("uuid");
const { convertNeo4jResultToObject } = require("./utils");
const neo4j = require("neo4j-driver");
const bcrypt = require("bcrypt");

class DBAdapter {
  constructor(dbInstance = db) {
    this.db = dbInstance;
  }

  session() {
    return this.db.session();
  }

  createUser = async (email, name, password, avatar) => {
    let localPassword = null;
    const session = this.db.session({});
    this.checkMandatory({ email });
    this.checkMandatory({ name });
    this.checkMandatory({ avatar });

    if (!password) {
      let uuidPass = uuid.v4();
      localPassword = uuidPass.substr(0, uuidPass.indexOf("-"));
    }

    const AVATAR_URL = ROBOHASH_URL + `/${bcrypt.hashSync(email, 2)}`;
    // returning cypher query.

    const userId = uuid.v4().replace(/-/g, "");

    const cypher =
      `CREATE (user:${ENTITIES.USER}{id:$userId,email:$email,name:$name,password:$password,avatar:$avatar,createDate:timestamp(),updateDate:timestamp()})` +
      `RETURN user {.id, .name, .avatar, .createDate, .updateDate} as newUser`;

    let results = await session.run(cypher, {
      userId,
      email,
      name,
      password: password || localPassword,
      avatar: AVATAR_URL,
    });

    session.close();

    return results.records[0].get('newUser');
  };

  createDomain = async (domainAddress, domainCreatedBy) => {
    const session = this.db.session();
    //createdBy : email of the user

    this.checkMandatory({ domainAddress });

    this.checkMandatory({ domainCreatedBy });

    const domainKey = uuid.v4();

    const query =
      `MATCH (u:${ENTITIES.USER}{email:'${domainCreatedBy}'}) ` +
      `CREATE (u)-[:${RELATIONSHIPS.HAS_DOMAIN}]->(domain:${ENTITIES.DOMAIN}{address:'${domainAddress}',key:'${domainKey}',status:'${DOMAIN_STATUS.ACTIVE}',createDate:timestamp(),updateDate:timestamp()}) ` +
      `RETURN domain`;

    const results = await session.run(query);
    await session.close();
    return results.records[0].get("domain").properties;
  };

  createParentComment = async (
    mdText,
    from,
    pageLocation,
    pageTitle,
    domainKey,
    commentStatus
  ) => {
    //from : email of the user
    //mdText: comment text in markdown

    const session = this.db.session();

    this.checkMandatory({ mdText });
    this.checkMandatory({ from });
    this.checkMandatory({ pageLocation });
    this.checkMandatory({ pageTitle });
    this.checkMandatory({ domainKey });
    const safeMdText = escape(mdText);

    if (
      ![COMMENT_STATUS.POSTED, COMMENT_STATUS.DRAFT].includes(commentStatus)
    ) {
      throw new Error("Invalid Comment Status");
    }

    //CHECK IF USERS IS EXISTING BEFORE CREATING COMMENT:

    const userExistenceResultSet = await this.getUser(from);

    if (!userExistenceResultSet) {
      throw new Error(
        "User does not exist. User should be existing before creating parent comment."
      );
    }

    const exitingDomainKey = await this.getDomain(domainKey); //will throw an error if domain keys is not existing

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
      } {id:'${uuid.v4()}',markdownText:'${safeMdText}',createdate:timestamp(),updateDate:timestamp(),status:'${commentStatus}'}) ` +
      `WITH comment ` +
      `MATCH (u:${ENTITIES.USER}{email:'${from}'}) ` +
      `CREATE (u)-[:${RELATIONSHIPS.COMMENTED}]->(comment) ` +
      `RETURN comment `;

    const results = await session.run(query);
    session.close();
    return results.records[0].get("comment").properties;
  };

  createChildComment = async (
    parentCommentId,
    mdText,
    fromUser,
    commentStatus
  ) => {
    this.checkMandatory({ parentCommentId });
    this.checkMandatory({ mdText });
    this.checkMandatory({ fromUser });
    const session = this.db.session();

    if (
      ![COMMENT_STATUS.POSTED, COMMENT_STATUS.DRAFT].includes(commentStatus)
    ) {
      throw new Error(`Invalid Comment Status : ${commentStatus}`);
    }

    const fromUserExists = await this.getUser(fromUser);

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
  };

  checkMandatory = (obj) => {
    if (!Object.values(obj)[0]) {
      throw new Error(`${Object.keys(obj)[0]} should have a value`);
    }
  };

  loginUser = async (userEmail, userPassword) => {
    this.checkMandatory({ userEmail });
    this.checkMandatory({ userPassword });

    const session = this.db.session();

    const existingUser = await this.getUser(userEmail);

    if (!existingUser) {
      throw new Error(`User with email ${userEmail} does not exists`);
    }

    const query =
      `MATCH (u:${ENTITIES.USER}{email:'${userEmail}',password:'${userPassword}'}) ` +
      `RETURN u {.id, .avatar, .name, .createDate, .updateDate} as user `;

    const results = await session.run(query);

    if (results.records.length > 0) {
      const 
        createdUserWithoutPassword
       = results.records[0].get("user");
      return createdUserWithoutPassword;
    } else {
      throw new Error("Credentials do not Match");
    }
  };

  getUser = async (userEmail) => {
    const session = this.db.session({ defaultAccessMode: neo4j.session.READ });
    this.checkMandatory({ userEmail });

    const query =
      `MATCH (u:${ENTITIES.USER}{email:'${userEmail}'})` + `RETURN u`;

    const results = await session.run(query);

    session.close();

    if (results.records.length > 0) {
      return results.records[0].get("u").properties;
    } else {
      return null;
    }
  };

  getDomainsforUser = async (userEmail) => {
    this.checkMandatory({ userEmail });
    const session = this.db.session({ defaultAccessMode: neo4j.session.READ });

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
  };

  getDomain = async (domainKey) => {
    this.checkMandatory({ domainKey });

    const session = this.db.session({ defaultAccessMode: neo4j.session.READ });

    const query =
      `MATCH (domain:${ENTITIES.DOMAIN}{key:'${domainKey}'}) ` +
      `RETURN domain`;

    const results = await session.run(query);
    session.close();

    if (results.records.length > 0) {
      return results.records["0"].get("domain");
    } else {
      throw new Error("Invalid Domain Key");
    }
  };

  getPagesForDomain = async (domainKey) => {
    this.checkMandatory({ domainKey });

    const session = this.db.session({ defaultAccessMode: neo4j.session.READ });

    const query =
      `MATCH (domain:${ENTITIES.DOMAIN}{key:'${domainKey}'}) ` +
      `MATCH (domain)-[:${RELATIONSHIPS.HAS_PAGE}]->(page) ` +
      `OPTIONAL MATCH (page) -[:${RELATIONSHIPS.HAS_COMMENT}]->(comment) ` +
      `OPTIONAL MATCH (comment)-[:${RELATIONSHIPS.HAS_REPLY}*]->(reply) ` +
      `MATCH (user)-[:${RELATIONSHIPS.COMMENTED}]->(comment) ` +
      `RETURN page, comment, user{.id, .avatar, .name} as commentedBy, size(collect(reply)) as replyCount ` +
      `ORDER BY comment.createDate DESC`;

    const results = await session.run(query);

    session.close();

    return convertNeo4jResultToObject(results);
  };

  getAllCommentsByUser = async (userEmail) => {
    this.checkMandatory({ userEmail });

    const session = this.db.session({ defaultAccessMode: neo4j.session.READ });

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
  };

  getCommentById = async (commentId) => {
    this.checkMandatory({ commentId });

    const session = this.db.session();

    const query =
      `MATCH (comment:${ENTITIES.COMMENT}{id:'${commentId}'}) ` +
      `RETURN comment`;

    const results = session.run(query);

    if (results.records.length > 0) {
      return results.records.get("comment").properties;
    } else {
      return null;
    }
  };

  updateCommentStatus = async (commentId, status) => {
    this.checkMandatory({ commentId });

    if (
      ![
        COMMENT_STATUS.POSTED.toLowerCase(),
        COMMENT_STATUS.DRAFT.toLowerCase(),
      ].includes(status.toLowerCase())
    ) {
      throw new Error("Wrong comment status");
    }

    const session = this.db.session();

    const existingComment = await getCommentById(commentId);
    if (!existingComment) {
      throw new Error(`Comment with id ${commentId} does not exist`);
    }

    const query =
      `MATCH(comment:${ENTITIES.COMMENT}{id:'${commentId}'}) ` +
      `SET comment.status=${status}, comment.updateDate=timestamp() ` +
      `RETURN comment`;

    const results = session.run(query);

    session.close();

    return results.records[0].get(["comment"]).properties;
  };

  updateDomainStatus = async (domainKey, status) => {
    this.checkMandatory({ domainKey });
    this.checkMandatory({ status });

    if (!Object.values(DOMAIN_STATUS).includes(status)) {
      throw new Error("Invalid Domain status");
    }

    const session = this.db.session();

    const query =
      `MATCH (domain:${ENTITIES.DOMAIN}{key:'${domainKey}'}) ` +
      `SET domain.status='${status}',domain.updateDate=timestamp() ` +
      `RETURN domain`;

    const results = await session.run(query);

    if (!results.records || results.records.length === 0) {
      throw new Error("Invalid domain Key");
    }

    return results.records[0].get("domain").properties;
  };

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
  getAllChildComments = async (commentId) => {
    this.checkMandatory({ commentId });

    const session = this.db.session({ defaultAccessMode: neo4j.session.READ });

    const query =
      `MATCH (parentComment:${ENTITIES.COMMENT}{id:'${commentId}'}) ` +
      `MATCH  (parentComment)-[:${RELATIONSHIPS.HAS_REPLY}*]->(child) ` +
      `MATCH (child)-[:${RELATIONSHIPS.REPLY_OF}]->(x) ` +
      `MATCH (user)-[:${RELATIONSHIPS.COMMENTED}]->(child) ` +
      `RETURN child as comment, x.id as parentId, user {.avatar, .id, .name } as by`;

    const results = await session.run(query);

    session.close();
    return convertNeo4jResultToObject(results);
  };

  getVariableName = async (obj) => {
    return Object.keys(obj)[0];
  };

  getFirstLevelChildComments = async (commentId) => {
    this.checkMandatory({ commentId });

    const session = this.db.session({ defaultAccessMode: neo4j.session.READ });

    const query =
      `MATCH (parentComment:${ENTITIES.COMMENT}{id:'${commentId}'}) ` +
      `MATCH (parentComment)-[:${RELATIONSHIPS.HAS_REPLY}]->(comment) ` +
      `MATCH (u)-[:${RELATIONSHIPS.COMMENTED}]->(comment) ` +
      `RETURN comment, u{.name, .avatar, .id} as by`;

    const results = await session.run(query);

    session.close();
    if (results.records.length > 0) {
      return convertNeo4jResultToObject(results);
    } else {
      return {comment: [], by: []};
    }
  };
}

module.exports = DBAdapter;

// module.exports = {
//   createUser,
//   createDomain,
//   createParentComment,
//   createChildComment,
//   updateCommentStatus,
//   updateDomainStatus,
//   getUser,
//   getDomainsforUser,
//   getPagesForDomain,
//   getFirstLevelChildComments,
//   getAllChildComments,
//   loginUser,
//   injectDifferentDB,
// };
