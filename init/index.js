require("dotenv").config();
const mongoose = require("mongoose")
const Listing = require("../models/listings/listings");
const data = require("./data")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingService = mbxGeocoding({ accessToken:process.env.MAPBOX_TOKEN});

const atlasDB = process.env.DB_LINK;

async function main(){
   await mongoose.connect(atlasDB)
}
main().then(()=>{
    console.log("Connection has been established")
}).catch(()=>{console.log("Error making connection ")});


const initDB = async () => {
    await Listing.deleteMany({});
    
    for (let listing of data) {
        const response = await geocodingService.forwardGeocode({
            query: listing.location,
            limit: 1
        }).send();
        
        listing.owner = "692554c250b2e6441486a245";
        listing.image = {
            url: listing.image,
            fieldname: 'WanderLustImages'
        };
        listing.geometry = response.body.features[0].geometry;
    }
    
    await Listing.insertMany(data);
}
initDB().then(() => {
    console.log("Data insertion successful");
}).catch((err) => {
    console.log("There is a problem in insertion:", err);
});

