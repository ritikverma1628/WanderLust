const express = require("express")
const mongoose = require("mongoose")
const Listing = require("./models/listings/listings")
const Review = require('./models/reviews');
const path = require("path")
const methodOverride = require("method-override")
const ejsMate = require('ejs-mate');
const {title}= require("process")
const asyncWrap = require("./utils/asyncWrap")
const ExpressError = require("./utils/expressError")
const listingSchema = require('./joiValidations')

const app = express();


async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/WanderLust")
};

main().then(()=>{
    console.log("Database connected")
}).catch(()=>{
    console.log("Error connecting database")
});

app.engine("ejs",ejsMate)
app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"))
app.use(express.static(path.join(__dirname,"public")));
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'));

const isValid = (req,res,next)=>{
    const {error} = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(404,error)
    }
    else{next()};
}

app.listen(3000,()=>{
    console.log("Server listening");
})

app.get("/",(req,res)=>{
    res.send("Hello, this is home page");
})

app.get("/listings", asyncWrap(async(req,res)=>{
    const listings = await Listing.find({});
    res.render("index.ejs",{listings})
}))

app.get("/listings/new",(req,res)=>{
    res.render("new.ejs");
})

app.delete("/listings/:id",asyncWrap(async(req,res)=>{
    await Listing.findByIdAndDelete(req.params.id);
    res.redirect("/listings");
}))

app.patch("/listings/:id", isValid , asyncWrap(async (req,res)=>{
    const newListing = req.body;
    await Listing.findByIdAndUpdate(req.params.id,newListing);
    res.redirect("/listings");
}))

app.get("/listings/:id",asyncWrap(async (req,res)=>{
    const id = req.params.id;
    const listing = await Listing.findById(id);
    res.render("show.ejs",{listing})
    
}))

app.post("/listings",isValid, asyncWrap(async(req,res, next)=>{
    const listing = req.body;
    await Listing.create(listing);
    res.redirect("/listings")

    
}))

//post route for review
app.post('/listings/:id/reviews', async(req,res)=>{
    let review = await Review.create(req.body.review)
    const listing = await Listing.findById(req.params.id);
    listing.reviews.push(review);
    await listing.save();
    res.redirect(`/listings/${req.params.id}`)
})

app.get("/listings/:id/edit",asyncWrap(async(req,res)=>{
    const listing = await Listing.findById(req.params.id);
    console.log(listing);
    res.render("edit.ejs",{listing});
}));

app.use("/",(req,res,next)=>{
    next(new ExpressError(404, 'Page not found!'))
})

app.use((err,req,res,next)=>{
    // console.log(err.message);
    // next();

    // res.status(err.statusCode).send(err.message);
    res.render('error.ejs', {err})

})