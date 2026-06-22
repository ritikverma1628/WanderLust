require("dotenv").config();
const Listing = require('../models/listings/listings')
const asyncWrap = require("../utils/asyncWrap");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingService = mbxGeocoding({ accessToken:process.env.MAPBOX_TOKEN});

module.exports.getListings = asyncWrap(async(req,res)=>{
    const { search, country, minPrice, maxPrice } = req.query;
    let queryObj = {};

    if (search) {
        queryObj.$or = [
            { title: { $regex: search, $options: "i" } },
            { location: { $regex: search, $options: "i" } },
            { country: { $regex: search, $options: "i" } }
        ];
    }

    if (country) {
        queryObj.country = { $regex: country, $options: "i" };
    }

    if (minPrice || maxPrice) {
        queryObj.price = {};
        if (minPrice) {
            queryObj.price.$gte = Number(minPrice);
        }
        if (maxPrice) {
            queryObj.price.$lte = Number(maxPrice);
        }
    }

    const listings = await Listing.find(queryObj);
    res.render("index.ejs", { listings, search, country, minPrice, maxPrice });
})

module.exports.renderNewForm = (req,res)=>{
    res.render("new.ejs");
}

module.exports.postListing = asyncWrap(async(req,res, next)=>{
    const response = await geocodingService.forwardGeocode({
        query: req.body.location,
        limit: 1
    })
    .send()
    
    const listing = req.body;
    listing.owner=req.user._id;
    
    if (!response.body.features || response.body.features.length === 0) {
        req.flash('error', "Could not find coordinates for that location. Please try a different location.");
        return res.redirect("/listings/new");
    }
    
    listing.geometry = response.body.features[0].geometry;
    await Listing.create(listing);
    req.flash('success',"New Listing created");
    res.redirect("/listings")
})

module.exports.destroyListing = asyncWrap(async(req,res)=>{
    await Listing.findByIdAndDelete(req.params.id);
    req.flash('success',"Listing Deleted");
    res.redirect("/listings");
})

module.exports.renderEditForm = asyncWrap(async(req,res)=>{
    const listing = await Listing.findById(req.params.id);
    if(!listing){
        req.flash('error','The listing you are trying to edit does not exist');
        return res.redirect('/listings')
    }
    // console.log(listing);
    let originalImage = listing.image.url;
    originalImage = originalImage.replace('/upload','/upload/w_250')
    res.render("edit.ejs",{listing,originalImage});
})

module.exports.editListing = asyncWrap(async (req,res)=>{
    const newListing = req.body;
    await Listing.findByIdAndUpdate(req.params.id,newListing);
    req.flash('success',"Listing Updated");
    res.redirect("/listings");
})

module.exports.showListing = asyncWrap(async (req,res)=>{
    console.log("i am in show");
    const id = req.params.id;
    console.log(id);
    const listing = await Listing.findById(id).populate({path:'reviews', populate:{path:'author', model:'User'}}).populate('owner');
    console.log(listing);
    if(!listing){
        req.flash('error','The Listing you are trying to access may have been deleted');
        return res.redirect('/listings');
    }
    res.render("show.ejs",{listing, mapToken:process.env.MAPBOX_TOKEN})
})