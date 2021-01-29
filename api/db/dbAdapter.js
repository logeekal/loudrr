const db = require('./')
const { RELATIONSHIPS, ENTITIES, COMMENT_STATUS} = require('./constant');
const uuid = require('uuid');
const {getCurrentDate} =  require('./utils');


function createUser(email, fname, lname, password) {
    let localPassword = null;
    if(!email){
        throw new Error('Email is mandatory');
    }
    if(!password){
      let uuid = uuid.v4();
      localPassword = uuid.substr(0, uuid.indexOf('-'));
    }

    // returning cypher query.
    const cypher = `CREATE (newUser: ${ENTITIES.USER} {email:{email},fname: {fname},lname: {lname},password: {password},createDate: ${Date.now().toLocaleString()},updateDate: ${Date.now().toLocaleString()} })`;
    db.cypher({
        query: cypher,
        params : {
            email,
            fname,
            lname,
            password: password && localPassword
        }
    });
    
}

function createDomain(domainAddress, domainCreatedBy){
    //createdBy : email of the user

    checkMandatory(domainAddress);

    checkMandatory(domainCreatedBy);

    const domainKey = uuid.v4();

    const query = `MATCH (u:${ENTITIES.USER} {email : ${domainCreatedBy}})` +
                   `CREATE (domain:${ENTITIES.DOMAIN} {address:${domainAddress},key:${domainKey},createdDate:${getCurrentDate()},updateDate:${getCurrentDate()}} )`
                   `(u)-[:${RELATIONSHIPS.HAS_DOMAIN}]->(domain)`;

    db.cypher({
        query
    })

}


// function createPage(pageLocation, pageTitle, domainAddress){
//     checkMandatory(domainAddress)
//     checkMandatory(pageLocation)
//     checkMandatory(pageTitle)

//     const query = `MATCH (domain:${ENTITIES.DOMAIN} {address:${domainAddress}})` + 
//                   `CREATE (page:${ENTITIES.PAGE} {pageLocation:${pageLocation},title:${pageTitle},createDate:${getCurrentDate()},updatedate:${getCurrentDate()}})`


// }

function createParentComment(mdText, from, pageLocation, pageTitle, domainKey, commentStatus) {
    //from : email of the user
    //mdText: comment text in markdown
    
    checkMandatory(mdText);
    checkMandatory(from);
    checkMandatory(pageLocation);
    checkMandatory(pageTitle);
    checkMandatory(domainKey);

    if(!(COMMENT_STATUS.POSTED,COMMENT_STATUS.DRAFT).includes(commentStatus)){
        throw new Error('Invalid Comment Status')
    }

    const query=`MATCH (u:${ENTITIES.USER} {email:${from}} ) ` +
                /*
                    check if page exists and if it does NOT
                    create the page
                    and its relationship
                */
                `MATCH (domain:${ENTITIES.DOMAIN} {key:${domainKey}})`
                `MERGE (page:${ENTITIES.PAGE} {pageLocation:${pageLocation}})` +
                `ON CREATE SET page.pageTitle=${pageTitle},createDate:${getCurrentDate()},updateDate:${getCurrentDate()}}` +
                `MERGE (domain)-[:${RELATIONSHIPS.HAS_PAGE}]->(page)` +
                `CREATE (comment: ${ENTITIES.COMMENT} {id:${uuid.v4()} mardownText:${mdText},createdate:${getCurrentDate()},updateDate:${getCurrentDate()},status:${commentStatus}})` +
                `CREATE (u)-[:${RELATIONSHIPS.COMMENTED}]->(comment)` + 
                `CREATE (page)-[:${RELATIONSHIPS.HAS_COMMENT}]->(comment)`;

    db.cypher({
        query: query
    });
}


function createChildComment(parentCommentId, mdText, fromUser, status) {
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

    db.cypher({
        query:query
    })
}


function  checkMandatory(variable) {
    if(!variable){
        return `${getVariableName()} should have a value}`
    }
}

function getVariableName(obj) {
    return Object.keys(obj)[0];
}
