const RELATIONSHIPS = {
    HAS_DOMAIN: 'HAS_DOMAIN',
    HAS_COMMENT: 'HAS_COMMENT',
    REPLY_OF: 'REPLY_OF',
    COMMENTED: 'COMMENTED',
    HAS_REPLY: 'HAS_REPLY',
    HAS_PAGE: 'HAS_PAGE'
}


const ENTITIES = {
    USER: "USER",
    COMMENT: "COMMENT",
    DOMAIN: "DOMAIN",
    PAGE: "PAGE",
}


const COMMENT_STATUS = {
    POSTED: 'POSTED',
    DRAFT:'DRAFT',
    DELETED: 'DELETED'
}

const DOMAIN_STATUS = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE'
}

const ROBOHASH_URL = 'https://robohash.org';


module.exports = {
    RELATIONSHIPS,
    ENTITIES,
    COMMENT_STATUS,
    DOMAIN_STATUS,
    ROBOHASH_URL
}