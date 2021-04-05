const express = require("express");
const { db, setup } = require("./db");
const passport = require("./passport");
const localStrategy = require("./passport/local");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const auth = require("./routes/auth");
const users = require("./routes/users");
const domains = require("./routes/domains");
const comments = require("./routes/comments");
const cors = require("cors");
const next = require("next");
const { pass } = require("./passport/local");
const { githubStrategy, googleStrategy, fbStrategy } = require("./passport/social");

const dev = process.env.NODE_ENV !== "production";

const nextApp = next({ dev });
const nextHandle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const app = express();
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );

  app.use(express.json());
  app.use(cookieParser());
  app.use(
    session({
      secret: "$$$$ SAMPLE_SECRET_OF_COMMENTER_APP $$$$$$",
      resave: false,
      saveUninitialized: true,
      proxy: process.env.NODE_ENV === 'production',
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: process.env.NODE_ENV === 'production',
        sameSite: "none"
      },
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(localStrategy);
  passport.use(githubStrategy);
  passport.use(googleStrategy);
  passport.use(fbStrategy);

  // app.use((req,res,next)=>{
  //   console.log(req);
  //   next();
  // })

  //routeHandlers
  app.use("/auth", require('./routes/auth'));
  app.use("/users", users);
  app.use("/domains", domains);
  app.use("/comments", comments);

  const PORT = 3030;

  app.get("/health", (req, res) => {
    res.send("Don't worry. I am still UP");
  });

  app.all("*", (req, res) => {
    return nextHandle(req, res);
  });

  app.listen(PORT, async () => {
    setup(db);
  });
});
