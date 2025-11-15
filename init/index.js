const mongoose = require("mongoose")
const Listing = require("../models/listings/listings");
const data = require("./data")
async function main(){
   await mongoose.connect("mongodb://localhost:27017/WanderLust")
}
main().then(()=>{
    console.log("Connection has been established")
}).catch(()=>{console.log("Error making connection ")});


const initDB = async ()=>{
    await Listing.deleteMany({})
    data.forEach((listing)=>{
        listing.owner = "69064393ade1a4c633c0ac8c";
        listing.image = {
            url:listing.image,
            fieldname:'WanderLustImages'
        }
    })
    await Listing.insertMany(data);
}
initDB().then(()=>{
    console.log("Data insertion successful")
}).catch("There is a problem in insertion");

