const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
const methodOverride = require("method-override")
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/expressError");
const listingsRoutes = require('./routes/listings');
const reviewRoutes = require('./routes/review')
const session = require('express-session')
const flash = require('connect-flash');
const app = express();

app.engine("ejs",ejsMate)
app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"))
app.use(express.static(path.join(__dirname,"public")));
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'));
const sessionOptions = {secret:'secretcode',resave:false, saveUninitialized:true, cookie:{expires:Date.now +(7*24*60*60*1000),maxAge:7*24*60*60*1000,httpOnly:true}}
app.use(session(sessionOptions))
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/listings/:id/reviews',reviewRoutes);
app.use('/listings',listingsRoutes);


async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/WanderLust")
};
main().then(()=>{
    console.log("Database connected")
}).catch(()=>{
    console.log("Error connecting database")
});


app.listen(3000,()=>{
    console.log("Server listening");
})


app.get("/",(req,res)=>{
    res.send("Hello, this is home page");
})

app.use("/",(req,res,next)=>{
    next(new ExpressError(404, 'Page not found!'))
})

//eroor handling middleware
app.use((err,req,res,next)=>{
    // console.log(err.message);
    // next();

    // res.status(err.statusCode).send(err.message);
    res.render('error.ejs', {err})

})