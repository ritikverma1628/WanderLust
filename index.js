const express = require("express")
const mongoose = require("mongoose")
const Review = require('./models/reviews');
const path = require("path")
const methodOverride = require("method-override")
const asyncWrap = require("./utils/asyncWrap");
const ejsMate = require('ejs-mate');
const Listing = require("./models/listings/listings")
const ExpressError = require("./utils/expressError")
const {listingValidations,reviewValidations} = require('./joiValidations')
const listingsRoutes = require('./routes/listings')
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
app.use('/listings',listingsRoutes);




//server-side validations for review form
const validateReview = (req,res,next)=>{
    const {error} = reviewValidations.validate(req.body)
    if(error){
        throw new ExpressError(404, error)
    }
    else{
        next();
    }
}

app.listen(3000,()=>{
    console.log("Server listening");
})

app.get("/",(req,res)=>{
    res.send("Hello, this is home page");
})



//post route for review
app.post('/listings/:id/reviews', validateReview, asyncWrap(async(req,res)=>{
    let review = await Review.create(req.body.review)
    const listing = await Listing.findById(req.params.id);
    listing.reviews.push(review);
    await listing.save();
    res.redirect(`/listings/${req.params.id}`)
}))

//deleting the review
app.delete("/listings/:id/reviews/:reviewId", asyncWrap(async(req,res)=>{
    const listingId = req.params.id;
    const reviewId = req.params.reviewId;

    await Review.deleteOne({_id:reviewId});
    await Listing.findOneAndUpdate({_id:listingId}, {$pull:{reviews:reviewId}});

    res.redirect(`/listings/${listingId}`);
}))



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