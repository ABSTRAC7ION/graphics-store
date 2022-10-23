var express = require("express");
var router = express();
var mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const dotenv = require("dotenv");
dotenv.config();

router.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
router.use(passport.initialize());
router.use(passport.session());
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});

//schema routes
const product = require("../models/product");
const User = require("../models/user");
const cartIm = require("../models/cart");

const { error } = require("console");

//connect to DB
const { MONGO_DB } = process.env;

const mongoUri = MONGO_DB;
mongoose.connect(mongoUri, (err) => {
  if (err) console.log(err);
});
const connection = mongoose.connection;
connection.on("err", console.error.bind(console, "connection error"));
connection.once("open", () => {
  console.log("connected to database");
});

//setting up passport login method
passport.use(
  new LocalStrategy((username, password, done) => {
    if (username.includes("@")) {
      User.findOne({ email: username }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: "Incorrect username or email" });
        }
        console.log(user);
        bcrypt.compare(password, user.password, (err, res) => {
          if (res) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Incorrect password" });
          }
        });
      });
    } else {
      User.findOne({ username: username }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: "Incorrect username or email" });
        }
        console.log(user);
        bcrypt.compare(password, user.password, (err, res) => {
          if (res) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Incorrect password" });
          }
        });
      });
    }
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

router.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  })
);

router.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

router.get("/log-out", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

//retrieve collections from db
router.get("/", function (req, res) {
  product.find({}, async function (err, products) {
    if (err) {
      throw err;
    } else {
      res.render("index", {
        user: req.user,
        products: products,
        message: null,
      });
    }
  });
});

//sign-up
router.get("/sign-up", (req, res) =>
  res.render("sign-up-form", { errors: null })
);

router.post(
  "/sign-up",
  [
    //check email
    check("email")
      .not()
      .isEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid Email")
      .custom((value, { req }) => {
        return new Promise((resolve, reject) => {
          User.findOne({ email: req.body.email }, function (err, user) {
            if (err) {
              reject(new Error("Server Error"));
            }
            if (user) {
              reject(new Error("E-mail already in use"));
            }
            resolve(true);
          });
        });
      }),
    //check username
    check("username")
      .not()
      .isEmpty()
      .withMessage("Username is required")
      .custom((value, { req }) => {
        return new Promise((resolve, reject) => {
          User.findOne({ username: req.body.username }, function (err, user) {
            if (err) {
              reject(new Error("Server Error"));
            }
            if (user) {
              reject(new Error("Username already in use"));
            }
            resolve(true);
          });
        });
      }),
  ],
  async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let fullname = req.body.password;
    let email = req.body.email;
    let age = req.body.age;

    const validationErrors = validationResult(req);
    let errors = [];
    if (!validationErrors.isEmpty()) {
      Object.keys(validationErrors.mapped()).forEach((field) => {
        errors.push(validationErrors.mapped()[field]["msg"]);
      });
    }

    if (errors.length) {
      res.render("sign-up-form", {
        errors: errors,
      });
    } else {
      const user = new User({
        username: username,
        password: password,
        fullname: fullname,
        email: email,
        age: age,
      });

      bcrypt.hash(user.password, 10, (err, hashedPassword) => {
        // if err, do something
        if (err) {
          console.log(err);
        }
        // otherwise, store hashedPassword in DB
        else {
          user.password = hashedPassword;
          user.save();
          res.redirect("/");
        }
      });
    }
  }
);

//create new product
router.get("/new", function (req, res) {
  res.render("upload-new", { user: req.user });
});

router.post("/new", async function (req, res) {
  if (!req.body.file) {
    try {
      res.render("upload-new", { msg: "please upload an image" });
    } catch (e) {
      console.log(e); // [Error]
    }
  } else {
    let newProduct = new product({
      name: req.body.name,
      description: req.body.description,
      artist: req.user.username,
      price: 20,
      genre: req.body.genre,
      image: req.body.file,
      likes: 0,
      date: new Date().toLocaleString(),
    });
    await newProduct.save();
    let user = await User.findOne({
      _id: req.user._id,
    });
    user.creations.push(newProduct);
    await user.save();
    res.redirect("/");
  }
});

router.get("/products", function (req, res) {
  res.render("products");
});

router.get("/product/:_id?", function (req, res) {
  var _id = req.params._id;
  product.find({ _id: _id }, async function (err, products) {
    if (err) {
      throw err;
    } else {
      res.render("product", {
        products: products,
      });
    }
  });
});

router.get("/add-to-cart/:_id", function (req, res) {
  var _id = req.params._id;
  var cart = new cartIm(req.session.cart ? req.session.cart : {});

  product.findById(_id, function (err, product) {
    if (err) {
      return res.redirect("/");
    }
    //console.log(product, product._id);
    cart.add(product, product._id);
    req.session.cart = cart;
    res.redirect("back");
  });
});

// router.get("/add-to-likes/:_id", function (req, res) {
//   var _id = req.params._id;

//   product.findById(_id, function (err, product) {
//     if (err) {
//       return res.redirect("back");
//     }
//     product.likes = product.likes + 1;
//     console.log(product);
//     product.save();
//     res.redirect("back");
//   });

// });

router.get("/cart", function (req, res) {
  if (!req.session.cart) {
    return res.render("cart", { products: null });
  } else {
    var cart = new cartIm(req.session.cart);
    res.render("cart", {
      products: cart.generateArray(),
      totalPrice: cart.totalPrice,
      totalQnty: cart.totalQnty,
    });
  }
});

router.get("/genre/:genre?", function (req, res) {
  var genre = req.params.genre;
  product.find({ genre: genre }, async function (err, products) {
    if (err) {
      throw err;
    } else {
      res.render("genre", {
        products: products,
      });
    }
  });
});

router.get("/:user?", async function (req, res) {
  let username = req.params.user;
  User.findOne({ username: username }, async function (err, user) {
    if (err) {
      throw err;
    } else {
      res.render("profile", {
        user: user,
        currentUser: req.user,
      });
    }
  });
});

router.get("/account/edit", async function (req, res) {
  res.render("accountEdit", {
    user: req.user,
  });
});

router.use(function (req, res) {
  res.status(404);

  // respond with html page
  if (req.accepts("html")) {
    res.render("error", { error: error });
    return;
  }

  // respond with json
  if (req.accepts("json")) {
    res.json({ error: "Not found" });
    return;
  }

  // default to plain-text. send()
  res.type("txt").send("Not found");
});

module.exports = router;
