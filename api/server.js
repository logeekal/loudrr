const express = require("express");
const { db, setup } = require("./db");
const passport = require("./passport");
const localStrategy = require("./passport/local");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const app = express();
const auth = require('./routes/auth')
const users = require('./routes/users');
const domains = require('./routes/domains');
const comments = require('./routes/comments');
const cors = require('cors');

 app.use(cors({
   origin: true,
   credentials: true
 }))

app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: "$$$$ SAMPLE_SECRET_OF_COMMENTER_APP $$$$$$",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
    }
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(localStrategy);



// app.use((req,res,next)=>{
//   console.log(req);
//   next();
// })


//routeHandlers
app.use('/auth', auth);
app.use('/users', users);
app.use('/domains', domains);
app.use('/comments', comments);

const PORT = 3030;

app.get("/health", (req, res) => {
  res.send("Don't worry. I am still UP");
});



app.listen(PORT, async () => {
  setup(db);
});
