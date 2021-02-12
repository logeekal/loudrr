const { Neo4jError } = require("neo4j-driver");
const { dbTest, setup } = require("../");
const DBAdapter = require("../dbAdapter");
const { COMMENT_STATUS, DOMAIN_STATUS } = require("../constant");
const { getAvatar, getTestAvatar } = require("../utils");

let avatar = getTestAvatar();

const users = [
  {
    name: "test_firstname_1",
    email: "test_firstname_1@email.com",
    password: "random",
  },
  {
    name: "test_firstname_2",
    email: "test_firstname_2@email.com",
    password: "random",
  },
  {
    name: "test_firstname_3",
    email: "test_firstname_3@email.com",
    password: "random",
  },
];

const db = new DBAdapter(dbTest);
const {
  createChildComment,
  createDomain,
  createUser,
  createParentComment,
  getAllChildComments,
  getAllCommentsByUser,
  getCommentById,
  getDomain,
  getDomainsforUser,
  getFirstLevelChildComments,
  updateCommentStatus,
  updateDomainStatus,
  loginUser,
  getPagesForDomain,
} = db;

describe("Neo4jAdapter Testing", () => {
  beforeAll(async () => {
    await setup(dbTest);
  });
  beforeEach(async () => {
    const session = dbTest.session();
    await session.run("MATCH (n) DETACH DELETE n");
    await session.close();
  });
  afterEach(async () => {
    const session = dbTest.session();
    await session.run("MATCH (n) DETACH DELETE n");
    await session.close();
  });

  test("Creating a User with all the fields", async function () {
    const user = users[0];
    const results = await createUser(
      user.email,
      user.name,
      user.password,
      avatar
    );

    expect(results).toBeObject();

    expect(results).toContainKeys([
      "name",
      "id",
      "createDate",
      "updateDate",
      "avatar",
    ]);

    expect("email" in results).toBeFalsy();
    expect("password" in results).toBeFalsy();
    expect(results["name"]).toEqual(user.name);
  });

  test("Creating a User with same email should fail", async () => {
    const user = users[0];

    const results = await createUser(
      user.email,
      user.name,
      user.password,
      avatar
    );

    expect(
      async () =>
        await db.createUser(user.email, user.name, user.password, avatar)
    ).rejects.toThrowError(Neo4jError);
  });

  test("Creating a user without password should be successfull", async () => {
    const user = users[0];

    const results = await createUser(user.email, user.name, null, avatar);
    expect(results).toBeObject();
    expect(results).toContainAllKeys([
      "name",
      "id",
      "createDate",
      "updateDate",
      "avatar",
    ]);
    expect(results["name"]).toEqual(user.name);
  });

  test("Creating a user and then login with correct password should be successful", async () => {
    const user1 = users[0];

    const createdUser = await createUser(
      user1.email,
      user1.name,
      user1.password,
      avatar
    );

    const loggedInUser = await loginUser(user1.email, user1.password);

    expect(loggedInUser).toBeObject();
    expect(loggedInUser).toContainAllKeys([
      "id",
      "name",
      "avatar",
      "createDate",
      "updateDate",
    ]);

    expect("email" in loggedInUser).toBeFalsy();
    expect("password" in loggedInUser).toBeFalsy();

    expect(loggedInUser.createDate.toString()).toEqual(
      createdUser.createDate.toString()
    );
  });

  test("Creating a user and then login with wrong password should throw an error", async () => {
    const user1 = users[0];

    const createdUser = await createUser(
      user1.email,
      user1.name,
      user1.password,
      avatar
    );

    await expect(loginUser(user1.email, "wrong password")).rejects.toThrow(
      "Credentials do not Match"
    );
  });

  test("login with non-existing user should throw an error", async () => {
    await expect(
      loginUser("Non-existing email", "wrong password")
    ).rejects.toThrow("User with email Non-existing email does not exist");
  });

  test("Creating a user without name/email/avatar should error out", async () => {
    const user1 = users[0];

    await expect(createUser(user1.email, null, null, avatar)).rejects.toThrow(
      "name should have a value"
    );

    //creating without email

    await expect(
      async () => await createUser(null, user.name, null, avatar)
    ).rejects.toThrow();

    //creating without avatar
    await expect(
      async () => await createUser(user.email, user.name, null, null)
    ).rejects.toThrow();
  });

  test("Creating and fetching a user and its 2 domains should be successfull", async () => {
    const user = users[0];
    const domainAddress1 = "marriedfriends";
    const domainAddress2 = "commenter";

    const result = await createUser(user.email, user.name, null, avatar);

    let domain = await createDomain(domainAddress1, user.email);

    expect(domain).toBeObject();
    expect(domain).toContainAllKeys([
      "address",
      "key",
      "status",
      "createDate",
      "updateDate",
    ]);

    domain = await getDomainsforUser(user.email);

    expect(domain).toBeArray();
    expect(domain[0]).toContainKeys(["address", "key"]);
    expect(domain[0].address).toBeOneOf([domainAddress1, domainAddress2]);

    //create second domain belonging to the user and then get both the domains.
    const domain2 = await createDomain(domainAddress2, user.email);

    const bothDomains = await getDomainsforUser(user.email);

    expect(bothDomains).toBeArray();
    expect(bothDomains).toHaveLength(2);
    expect(bothDomains[0].address).toBeOneOf([domainAddress1, domainAddress2]);
    expect(bothDomains[1].address).toBeOneOf([domainAddress1, domainAddress2]);
    expect(bothDomains[0].address === bothDomains[1].address).not.toBeTruthy();
  });

  test("Creating a user and domain and updating domain status should be successfull", async () => {
    const user = users[0];

    const domainAddress = "marriedfriends";

    const createdUser = await createUser(user.email, user.name, null, avatar);

    const createdDomain = await createDomain(domainAddress, user.email);

    const updatedDomain = await updateDomainStatus(
      createdDomain.key,
      DOMAIN_STATUS.INACTIVE
    );

    expect(updatedDomain.status).toBe(DOMAIN_STATUS.INACTIVE);
    expect(createdDomain.status).toBe(DOMAIN_STATUS.ACTIVE);
  });

  test("Creation and retrieval of 2 Page and parent comments should be successful ", async () => {
    const user = users[0];
    const domain1 = "marriedfriends";
    const page1 = {
      path: "/path/1",
      title: "Sample title for page 1",
    };

    const page2 = {
      path: "/path/2",
      title: "Sample title for page 2",
    };

    const comment1 = {
      text: "First parent comment",
    };

    const comment2 = {
      text: "Second parent comment",
    };

    const createdUser1 = await createUser(
      user.email,
      user.name,
      user.password,
      avatar
    );
    const createdUser2 = await createUser(
      users[1].email,
      users[1].name,
      users[1].password,
      avatar
    );
    const createdUser3 = await createUser(
      users[2].email,
      users[2].name,
      users[2].password,
      avatar
    );

    const createdDomain1 = await createDomain(domain1, user.email);

    const createdParentComment1 = await createParentComment(
      comment1.text,
      users[1].email,
      page1.path,
      page1.title,
      createdDomain1.key,
      COMMENT_STATUS.POSTED
    );
    const createdParentComment2 = await createParentComment(
      comment2.text,
      users[2].email,
      page2.path,
      page2.title,
      createdDomain1.key,
      COMMENT_STATUS.DRAFT
    );

    const replyToParentComment1 = await createChildComment(
      createdParentComment1.id,
      "Testing the reply",
      users[2].email,
      COMMENT_STATUS.POSTED
    );

    expect(createdParentComment1).toBeObject();
    expect(createdParentComment1.id).not.toBeNull();
    expect(createdParentComment1.markdownText).toEqual(escape(comment1.text));

    expect(createdParentComment2).toBeObject();
    expect(createdParentComment2.id).not.toBeNull();
    expect(createdParentComment2.markdownText).toEqual(escape(comment2.text));

    //check relationships by fetching the actual data
    const allPages = await getPagesForDomain(createdDomain1.key);

    expect(allPages).toBeObject();
    expect(allPages).toContainAllKeys([
      "page",
      "comment",
      "commentedBy",
      "replyCount",
    ]);
    expect(allPages["comment"][0].markdownText).toEqual(escape(comment2.text));
    expect(allPages["comment"][1].markdownText).toEqual(escape(comment1.text));
    expect(allPages["commentedBy"][0].id).toEqual(createdUser3.id);
    expect(allPages["commentedBy"][1].id).toEqual(createdUser2.id);
    expect(allPages["commentedBy"][0]).not.toContainKeys(["password"]);
    expect(allPages["replyCount"][0]).toEqual(0);
    expect(allPages["replyCount"][1]).toEqual(1);
    expect(allPages["page"][0].pageLocation).toEqual(escape(page2.path));
    expect(allPages["page"][1].pageLocation).toEqual(escape(page1.path));
  });

  test("Creation of parent comment from an non-existing user show throw an error", async () => {
    const user1 = users[0];
    const domain1 = {
      address: "marriedfriends",
    };
    const createdUser1 = await createUser(
      user1.email,
      user1.name,
      user1.password,
      avatar
    );

    const createdDomain = await createDomain(domain1.address, user1.email);

    await expect(
      createParentComment(
        "Sample Text",
        "non Existing user email",
        "Fictional_location",
        "Fictional title",
        createdDomain.key,
        COMMENT_STATUS.POSTED
      )
    ).rejects.toThrow("User does not exist");
  });

  test("Creation of parent Comment with existing user but an non-existing domain should throw an error", async () => {
    const user1 = users[0];

    const createdUSer1 = await createUser(
      user1.email,
      user1.name,
      user1.password,
      avatar
    );
    await expect(
      createParentComment(
        "sample text",
        user1.email,
        "Sample page location",
        "Sample page title",
        "non-existing domain key",
        COMMENT_STATUS.POSTED
      )
    ).rejects.toThrow("Invalid Domain Key");
  });

  test("creation and retreival of reply of comment i.e. child comments upto 2 levels should be successfull", async () => {
    const [user1, user2, user3] = users;

    const createdUser1 = await createUser(
      user1.email,
      user1.name,
      user1.password,
      avatar
    );
    const createdUser2 = await createUser(
      user2.email,
      user2.name,
      user2.password,
      avatar
    );
    const createdUser3 = await createUser(
      user3.email,
      user3.name,
      user3.password,
      avatar
    );

    const domain1 = "marriedfriends";
    const page1 = {
      path: "/path/1",
      title: "Sample title for page 1",
    };

    const page2 = {
      path: "/path/2",
      title: "Sample title for page 2",
    };

    const parentComment = {
      text: "First parent comment",
    };

    const childComment1 = {
      text: "Reply of first parent comment",
    };

    const childComment2 = {
      text: "2nd level child comment in reply of first child comment",
    };
    const childComment3 = {
      text: "2nd Reply to parent Comment",
    };

    const createdDomain = await createDomain(domain1, user1.email);

    const parentCommentFirstPage = await createParentComment(
      parentComment.text,
      user2.email,
      page1.path,
      page1.title,
      createdDomain.key,
      COMMENT_STATUS.POSTED
    );

    const firstReplyofParentComment = await createChildComment(
      parentCommentFirstPage.id,
      childComment1.text,
      user1.email,
      COMMENT_STATUS.POSTED
    );
    const firstReplyofFirstChildComment = await createChildComment(
      firstReplyofParentComment.comment.id,
      childComment2.text,
      user2.email,
      COMMENT_STATUS.POSTED
    );
    const secondReplyofParentComment = await createChildComment(
      parentCommentFirstPage.id,
      childComment3.text,
      user3.email,
      COMMENT_STATUS.POSTED
    );

    const {
      comment: comments,
      parentId: parentIds,
      by,
    } = await getAllChildComments(parentCommentFirstPage.id);
    expect(comments).toBeArray();
    expect(comments.length).toBe(3);


    for (let idx = 0; idx < comments.length; idx++) {
      expect('password' in by[idx] ).toBeFalsy();
      expect('email' in by[idx] ).toBeFalsy();
      let comment = comments[idx];
      if (comment.id === firstReplyofParentComment.comment.id) {
        expect(parentIds[idx]).toBe(parentCommentFirstPage.id);
        expect(by[idx].id).toEqual(createdUser1.id);
      }
      if (comment.id === firstReplyofFirstChildComment.comment.id) {
        expect(parentIds[idx]).toBe(firstReplyofParentComment.comment.id);
        expect(by[idx].id).toEqual(createdUser2.id);
      }
      if (comment.id === secondReplyofParentComment.comment.id) {
        expect(parentIds[idx]).toBe(parentCommentFirstPage.id);
        expect(by[idx].id).toEqual(createdUser3.id);
      }
    }

    const {comment : allFirstLevelcomments, by: user }  = await getFirstLevelChildComments(
      parentCommentFirstPage.id
    );

    expect(allFirstLevelcomments.length).toBe(2);
    expect(user.length).toBe(2);
    expect(allFirstLevelcomments[0].id).toEqual(secondReplyofParentComment.comment.id);
    expect(user[0].id).toEqual(createdUser3.id)

    for(let idx=0; idx<allFirstLevelcomments.length; idx++){
      let currComment = allFirstLevelcomments[idx];
      let {comment: secondLevelComments, by: byUser} = await getFirstLevelChildComments(currComment.id);
      expect(secondLevelComments).toBeArray();
      if (currComment.id === firstReplyofParentComment.comment.id) {
        expect(secondLevelComments.length).toBe(1);
      } else if (currComment.id === secondReplyofParentComment.comment.id) {
        expect(secondLevelComments.length).toBe(0);
      }
    }

  });
});
