const mongoose = require("mongoose")
const Review = require('../reviews')
const listingsSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:String,
    image: {
        url:String,
        fieldname:String
    },
    price: Number,
    location:String,
    country: String,
    reviews:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Review'
        }
    ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    geometry:{
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
}) 

//this is a post type of middleware of mongoose itself 
//it says if 'findOneAndDelete' method is called for Listing model, then execute the specified callback post the execution of findOneAndDelete method
// schema.post(method, callback)
listingsSchema.post('findOneAndDelete',async(listing)=>{
    if(listing.reviews.length>0)
        await Review.deleteMany({_id:{$in:listing.reviews}})
})

const Listing = mongoose.model("Listing", listingsSchema);

module.exports = Listing;