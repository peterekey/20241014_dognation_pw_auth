const express = require("express");
const router = express.Router();
const helper = require("../helpers/helper");
const passport = require("passport");
const filename = "./data/users.json";
const bcrypt = require("bcrypt");
let users = require("../data/users.json");

// Register New User:
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  console.log(`username is ${username} and password is ${password}`);
  const id = { id: helper.getNewId(users) };
  try {
    const user = await helper.userExists(username);
    if (user) {
      console.log("User already exists!");
      return res.redirect("login");
    }
    // Hash password before storing in local DB:
    const passwordHash = async (password, saltRounds) => {
      try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);
        console.log(`hash is ${hash}`);
        return hash;        
      } catch (err) {
        console.log(err);
      }
      return null;
    }

    const hashedPassword = await passwordHash(password, 10);
    const newUser = { ...id, username, password: hashedPassword };

    // Store new user in local DB
    users.push(newUser);
    helper.writeJSONFile(filename, users);

    res.redirect("login");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Log In User:
router.post(
  "/login", 
  passport.authenticate("local", { failureRedirect: "/login" }),
  (req, res) => {
    console.log("Login successful");
    console.log("Session:", req.session);
    console.log("User:", req.user);
    res.redirect("../");
  }
);

// Log out user:
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
  });
  res.redirect("../");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/login", (req, res) => {
  res.render("login");
});

module.exports = router;
