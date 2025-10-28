const mongoose = require("mongoose")
const Review = require('../reviews')
const listingsSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:String,
    image: {
        type:String,
        default: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG90ZWx8ZW58MHx8MHx8fDA%3D&fm=jpg&q=60&w=3000",
        set : (v) => v===""? "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG90ZWx8ZW58MHx8MHx8fDA%3D&fm=jpg&q=60&w=3000":v
    },
    price: Number,
    location:String,
    country: String,
    reviews:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
}) 

listingsSchema.post('findOneAndDelete',async(listing)=>{
    if(listing.reviews.length>0)
        await Review.deleteMany({_id:{$in:listing.reviews}})
})

const Listing = mongoose.model("Listing", listingsSchema);

module.exports = Listing;