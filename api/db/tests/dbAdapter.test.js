const { Neo4jError } = require("neo4j-driver");
const { db , setup} = require("../");
const { createUser, createDomain, getDomainsforUser, createParentComment } = require("../dbAdapter");
const { COMMENT_STATUS } = require('../constant');
require("jest-extended");
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
];

describe("Neo4jAdapter Testing", () => {
beforeAll(async () => {
await setup(db)    
})
  beforeEach(async () => {
    const session = db.session();
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
      "email",
      "createDate",
      "password",
      "updateDate",
      "avatar",
    ]);
    expect(results["email"]).toEqual(user.email);
  });


  test("Creating a User with same email should fail", async ()=> {

    const user = users[0];

    const results = await createUser(user.email, user.name, user.password, avatar);

    expect(async ()=> await createUser(user.email, user.name, user.password, avatar)).rejects.toThrowError(Neo4jError);

    
  })

  test("Creating a user without password should be successfull", async () => {
    const user = users[0];

    const results = await createUser(user.email, user.name, null, avatar);
    expect(results).toBeObject();
    expect(results).toContainKeys([
      "name",
      "email",
      "createDate",
      "password",
      "updateDate",
      "avatar",
    ]);
    expect(results["email"]).toEqual(user.email);
  });

  test("Creating a user without name/email/avatar should error out", async () => {
    const user1 = users[0];

    await expect(
      async () => await createUser(user1.email, null, null, avatar)
    ).rejects.toThrow();

    //creating without email

    await expect(
      async () => await createUser(null, user.name, null, avatar)
    ).rejects.toThrow();

    //creating without avatar
    await expect(
      async () => await createUser(user.email, user.name, null, null)
    ).rejects.toThrow();
  });

  test("Creating a user and its 2 domains should be successfull", async () => {
    const user = users[0];
    const domainAddress1= "marriedfriends";
    const domainAddress2 = "commenter";

    const result = await createUser(user.email, user.name, null, avatar);

    let domain = await createDomain(domainAddress1, user.email);

    expect(domain).toBeObject();
    expect(domain).toContainAllKeys(['address','key','createDate','updateDate'])

    domain = await getDomainsforUser(user.email);

    expect(domain).toBeArray();
    expect(domain[0]).toContainKeys(['address','key'])
    expect(domain[0].address).toBeOneOf([domainAddress1,domainAddress2])

    //create second domain belonging to the user and then get both the domains.
    const domain2 = await createDomain(domainAddress2, user.email);


    const bothDomains = await getDomainsforUser(user.email);

    expect(bothDomains).toBeArray();
    expect(bothDomains).toHaveLength(2);
    expect(bothDomains[0].address).toBeOneOf([domainAddress1,domainAddress2])
    expect(bothDomains[1].address).toBeOneOf([domainAddress1,domainAddress2])
    expect(bothDomains[0].address === bothDomains[1].address).not.toBeTruthy();
  });

  test("Creation of 2 Page and parent comments should be successful ", async ()=> {
    const user = users[0];
    const domain1 = 'marriedfriends';
    const page1 = {
        path: '/path/1',
        title: "Sample title for page 1"
    }

    const page2 = {
        path: '/path/2',
        title: "Sample title for page 2"
    }

    const comment1 = {
        text: 'First parent comment'
    }

    const comment2 = {
        text: 'Second parent comment'
    }

    const createdUser = await createUser(user.email, user.name, user.password, avatar);

    const createdDomain1 = await createDomain(domain1,user.email);

    const createdParentComment = await createParentComment(comment1.text, createUser.name, page1.path, page1.title, createdDomain1.key, COMMENT_STATUS.POSTED);

  })
});
