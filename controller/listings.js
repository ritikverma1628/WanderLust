const Listing = require('../models/listings/listings')
const asyncWrap = require("../utils/asyncWrap");

module.exports.getListings = asyncWrap(async(req,res)=>{
    const listings = await Listing.find({});
    res.render("index.ejs",{listings})
})

module.exports.renderNewForm = (req,res)=>{
    res.render("new.ejs");
}

module.exports.postListing = asyncWrap(async(req,res, next)=>{
    const listing = req.body;
    listing.owner=req.user._id;
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
    console.log(listing);
    res.render("edit.ejs",{listing});
})

module.exports.editListing = asyncWrap(async (req,res)=>{
    const newListing = req.body;
    await Listing.findByIdAndUpdate(req.params.id,newListing);
    req.flash('success',"Listing Updated");
    res.redirect("/listings");
})

module.exports.showListing = asyncWrap(async (req,res)=>{
    const id = req.params.id;
    const listing = await Listing.findById(id).populate({path:'reviews', populate:{path:'author', model:'User'}}).populate('owner');
    console.log(listing)
    if(!listing){
        req.flash('error','The Listing you are trying to access may have been deleted');
        return res.redirect('/listings');
    }
    res.render("show.ejs",{listing})
})