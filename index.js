require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expressError");
const listingsRoutes = require("./routes/listings");
const reviewRoutes = require("./routes/review");
const userRoutes = require("./routes/users");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user");
const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const atlasDB = process.env.DB_LINK;
async function main() {
  try {
    await mongoose.connect(atlasDB);
    console.log("Connected to Database");
    const store = MongoStore.create({
      mongoUrl: atlasDB, 
    });

    const sessionOptions = {
      store:store,
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      },
    };
    app.use(session(sessionOptions));
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new localStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    app.use((req, res, next) => {
      res.locals.success = req.flash("success");
      res.locals.error = req.flash("error");
      res.locals.currUser = req.user;
      next();
    });

    app.use("/listings/:id/reviews", reviewRoutes);
    app.use("/listings", listingsRoutes);
    app.use("/", userRoutes);

    app.use("/", (req, res) => {
      res.redirect("/listings");
    });

    app.use((req, res, next) => {
      next(new ExpressError(404, "Page not found!"));
    });

    //eroor handling middleware
    app.use((err, req, res, next) => {
      return res.render("error.ejs", { err });
    });

    app.listen(3000, () => {
      console.log("Server listening");
    });
  } catch (e) {
    console.log(e);
  }
}

main();
