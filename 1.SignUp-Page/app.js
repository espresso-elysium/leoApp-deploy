require('dotenv').config();
const express = require("express")
const app = express()
const cookieParser = require("cookie-parser")
const path = require("path")
app.set('view engine', "ejs")
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public")))
const userModel = require("./models/user")
const cors = require('cors');
const jwt = require("jsonwebtoken")
const bcyrpt = require("bcrypt")

const crypto = require("crypto")




app.use(cors());
app.use(express.static(path.join(__dirname, '../Gemini-clone/gemini-clone/build')));
const session = require('express-session');
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

const mongoose = require('mongoose');
console.log('MONGO_URI:', process.env.MONGO_URI); // Should print your URI
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));


app.get("/", (req, res) => {
  const error = req.session.error;
  req.session.error = null; // Clear error after reading
  res.render("signUp", { error });
});

// app.post("/", async (req, res) => {
//   let { username, email, Gname, password } = req.body;

//   let createdUser = await userModel.create({
//     username, email, password, Gname
//   })
//   res.redirect('http://localhost:5173', { Gname, username })
// })




app.post(
  '/', async (req, res) => {
    let { email, password, Gname, username } = req.body;

    let user = await userModel.findOne({ email });
    if (user) {
      req.session.error = "Email already in use";
      return res.redirect('/');
    }
    bcyrpt.genSalt(10, (err, salt) => {
      bcyrpt.hash(password, salt, async (err, hash) => {
        let user = await userModel.create({     //usermodel mein info daalni hai create krke and async hai toh use await 
          username,

          Gname,
          password: hash,
          email
        })

        //ap is user ko token bhejna hai jwt ki help se 
        let token = jwt.sign({ email: email, userid: user._id, username: user.username, Gname: user.Gname }, process.env.JWT_SECRET)
        res.cookie("token", token)
        res.redirect("http://localhost:5173")
      })

    })
  })







app.get("/login", (req, res) => {
  res.render("login")
})

// app.get('/leoApp', isLoggedIn, async (req, res) => {
//   let user = await userModel.findOne({ email: req.user.email })
//   res.redirect("'http://localhost:5173'")
// })


app.post(
  '/login', async (req, res) => {
    let { email, password } = req.body

    let user = await userModel.findOne({ email })  //find ki uss user ka already account toh nhi
    if (!user) return res.status(500).send("something went wrong")   //agr already account nhi hai toh return something went wrong  nhi tohh - --->

    //ab password compare kro login ke liye

    bcyrpt.compare(password, user.password, (err, result) => {
      if (result) {

        let token = jwt.sign({ email: email, userid: user._id, username: user.username, Gname: user.Gname }, process.env.JWT_SECRET)    //jo user bna hai naya uska email or user id save kra hai ,"shhh" is secret key for token
        res.cookie("token", token)
        res.status(200).redirect("http://localhost:5173")
      } //agr pass shi hai toh "you can login nhi toh redirect"

      else res.redirect("/login")
    })



  })



app.get("/logout", (req, res) => {
  res.cookie("token", "")
  res.redirect("/login")

})


function isLoggedIn(req, res, next) {
  if (req.cookies.token === "") res.redirect("/login")

  else {
    let data = jwt.verify(req.cookies.token, process.env.JWT_SECRET)
    req.user = data
    next()
  }
}

app.get('/api/userinfo', (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ username: user.username, Gname: user.Gname });
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});