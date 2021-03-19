const GithubStrategy = require("passport-github").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FBStrategy = require("passport-facebook").Strategy;
const DBAdapter = require("../db/dbAdapter");
const path = require("path");

const db = new DBAdapter();

const envConfig =
  process.env.NODE_ENV === "production"
    ? { path: path.join(__dirname, "../../.env.production") }
    : { path: path.join(__dirname, "../../.env") };

require("dotenv").config(envConfig);

console.log(`Host : ${process.env.HOST} , ${process.env.GITHUB_CLIENT_ID} , ${process.env.GITHUB_CLIENT_SECRET}`)

const githubStrategy = new GithubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  },
  function (accessToken, refreshToken, profile, cb) {
    // console.log({ profile: profile._json });
    /**
     *  Sample Profile of github user
{
  profile: {
    login: '',
    id: ,
    node_id: ,
    avatar_url: ,
    gravatar_id: '',
    url: ,
    html_url: ,
    followers_url: ,
    following_url: ,
    gists_url: ,
    starred_url: ,
    subscriptions_url: ,
    organizations_url: ,
    repos_url: ,
    events_url: ,
    received_events_url: ,
    type: 'User',
    site_admin: false,
    name: ,
    company:null,
    blog: '',
    location: 'India',
    email: ,
    hireable: true,
    bio: null,
    twitter_username: null,
    public_repos: 45,
    public_gists: 0,
    followers: 4,
    following: 6,
    created_at: '2014-05-05T05:23:14Z',
    updated_at: '2021-03-07T13:21:35Z'
  }
}
     * 
     * 
     */
    const profileJson = profile._json;
    findOrCreateUser(profileJson, cb);
  }
);

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.HOST}/auth/callback/google`,
  },
  function (accessToken, refreshToken, profile, cb) {
    const profileJson = profile._json;
    profileJson["avatar_url"] = profileJson.picture;
    console.log({ google_profile: profileJson });
    findOrCreateUser(profileJson, cb);
  }
);

const fbStrategy = new FBStrategy(
  {
    clientID: process.env.FB_CLIENT_ID,
    clientSecret: process.env.FB_CLIENT_SECRET,
    callbackURL: `${process.env.HOST}/auth/callback/facebook`,
    profileFields: ["id", "displayName", "photos", "email"],
  },
  function (accessToken, refreshToken, profile, cb) {
    const profileJson = profile._json;
    try {
      profileJson["avatar_url"] = profileJson.picture.data.url;
    } catch {
      profileJson["avatar_url"] = "";
    }
    console.log({ fb_profile: profileJson });
    findOrCreateUser(profileJson, cb);
  }
);

const findOrCreateUser = (profile, cb) => {
  db.getUser(profile.email).then((user) => {
    if (!user) {
      db.createUser(profile.email, profile.name, null, profile.avatar_url)
        .then((user) => {
          console.log(`got user : `, user);
          cb(null, { ...user, email: profile.email });
        })
        .catch(() => {
          console.log(err);
          cb(err, null);
        });
    } else {
      console.log("Got user .. Now callback : ", user);
      cb(null, user);
    }
  });
};

module.exports = {
  githubStrategy,
  googleStrategy,
  fbStrategy,
};
