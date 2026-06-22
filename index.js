// flow samjho
// user login karna chahta hai, user ne login form me username, password credentials diye
// passport.authenticate() call hoga ---- localStrategy ke through User.authenticate() call hoga aur databse me un credentials ko match karke user ko authenticate kiya jayega
// fir us fullUserObject ko serailise karke uski userId req.session.passport.user me store kar li jati hai matlab session ban jata hai us logged in user ka 
// fir ultimately as a response, cookie ke form me us session ki id browser ko bhej di jati hai 
// browser se request aayi --- request me sath cookie aayi -- cookie me sessionki id thi --- to session ki id aayi request ke sath
// express-session us session id ko use karke us session ka data nikalta hai 
// passport-session check karta hai ki usme userid hai kya
// agar nahi hai, to deserializeUser call nhi hota, req.user=undefined hota hai aur req.isAuthenticated() false hota hai 
// agar session me sessio id hai matlab user logged in hai, to  passport session deserializeUser ko call karta hai, jo serialised user id ko deserialize karta hai 
// fir us id ke data ko database me lookup kiya jata hai 
//poora data milne ke baad use req.user me store kar diya jata hai 

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
//express-session package provides the facility of sessions to the stateless protocol http
//it creates a session and stores some data in a storage at the server side, and then sends a unique session id = connect.sid in the form of a signed cookie 
//req.session is the object in which the session data is loaded from the session store and by default req.session store some defualt cookie information
//server jab res.cookie ke through cookie send karta hai to vo browser/frontend pe save ho jata hai and then client uske baad jo bhi request karta hai server se to har request ke sath vo cookie bhi sent hota hai from client to server but server ko ek cookieParser naam ka package use karna padta hai agar server ko client ki req object me stored cookies object ko read karna hai to, but mene yaha pe to kahi bhi use nhi kiya cookieparser package ko to kese parse hoga cookie? 
//express-session automatically uses cookie-parser internally to parse the incoming request's cookie header.  
const session = require("express-session");
// it is a mongo based session store for the express sessions
const MongoStore = require("connect-mongo");
//used to flash some messages, the flash message is stored for a single time in the session store, and once the flash message is used(accessed), it immediately vanishes from the sessionstore
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
    //remember ki ye code server code hai. Matlab backend-server, mongoose ke through mongodb ke cloud database(atlas) ke server se connection banane ke lie request bhejta hai
    //pehle to localhost matlab mere hi laptop ke disk pe db store hote the par ab mai atlasDB ka link de raha hu to atlas pe dbs store honge
    await mongoose.connect(atlasDB);
    console.log("Connected to Database");
    //pehle sessions memorySTore me store hote the matlab mere hi laptop pe, but ab sessions bhi atlas pe hi store honge. even sessions store hone ke lie session naam ka ek separate collection bhi ban jayega 
    const store = MongoStore.create({
      mongoUrl: atlasDB, 
    });

    const sessionOptions = {
      store:store,
      //secret option is used to sign the session id, signing the session id means that if the session id is changed or tampered by the client, then the server will not be able to recognize it and will not be able to use it but if user changes the cookie data which is encrypted using secret(stored at server side) then the server will not be able to decode it and will not be able to use it 
      secret: process.env.SECRET,
      //resave false means ki agar session me koi change nhi hua hai to us session ko db me save karne ki try nhi karega, matlab redundant writes ko avoid karega
      resave: false,
      saveUninitialized: false,
      cookie: {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      },
    };

    // app.use() is used for middlewares that runs on all routes and methods, while app.all() is used to handle all HTTP methods for a specific route.
    //is line se express-session sessionStore me user ka session store karta hai aur user available karane ke lie us session data ko req.session me store kara deta hai  
    app.use(session(sessionOptions));
    app.use(flash());
    // passport.initialize() is middleware that initializes Passport and augments the request object with authentication methods like req.login and req.isAuthenticated, enabling authentication functionality in the app.
    app.use(passport.initialize());

// passport.session() kya karta hai
// Session ke andar dekhta hai:
// req.session.passport.user
// Us value ko uthaata hai (usually user ID)
// deserializeUser() call karta hai
// Database se full user object nikalta hai
// Aur finally:
// req.user = fullUserObject
    
    app.use(passport.session());
    passport.use(new localStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    app.use((req, res, next) => {
      //res.locals wale variables are accessible for only one response and are automatically availabe to the ejs files rendered in that one response. This one response is rendered by the route called by next() of middleware in which res.locals are intialised.
      res.locals.success = req.flash("success");
      res.locals.error = req.flash("error");
      //req.user is a property which is created in req object by passport and contains the currently logged in user
      res.locals.currUser = req.user;
      res.locals.search = req.query.search || "";
      next();
    });

    //refers to the routes defined in reviewRoutes if the prefix of the route "/listings/:id/reviews" matches
    app.use("/listings/:id/reviews", reviewRoutes);
    app.use("/listings", listingsRoutes);
    app.use("/", userRoutes);
  

    app.get("/", (req, res) => {
      res.redirect("/listings");
    });

    app.use((req, res, next) => {
      next(new ExpressError(404, "Page not found!"));
    });

    //eroor handling middleware
    app.use((err, req, res, next) => {
      return res.render("error.ejs", { err });
    });

    //listen method capabilizes the computer to be a server by enabling it to listen the incoming requests from the client.
    //once started, the server keeps active for listening the request until explicitly turned off
    app.listen(3000, () => {
      console.log("Server listening");
    });
  } catch (e) {
    console.log(e);
  }
}

main();
