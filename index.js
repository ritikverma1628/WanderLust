const express = require("express")
const mongoose = require("mongoose")
const Listing = require("./models/listings/listings")
const path = require("path")

const app = express();


async function main(){
    await mongoose.connect("mongodb://localhost:27017/WanderLust")
};

main().then(()=>{
    console.log("Database connected")
}).catch(()=>{
    console.log("Error connecting database")
});


app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"))
app.use(express.static(path.join(__dirname,"public")));

app.listen(3000,()=>{
    console.log("Server listening");
})

app.get("/",(req,res)=>{
    res.send("Hello, this is home page");
})

app.get("/listings", async(req,res)=>{
    const listings = await Listing.find({});
    res.render("index.ejs",{listings})
})

app.get("/listings/:id",async (req,res)=>{
    const id = req.params.id;
    const listing = await Listing.findById(id);
    res.render("show.ejs",{listing})
    
})