const express = require("express")
const mongoose = require("mongoose")
const Listing = require("./models/listings/listings")
const path = require("path")
const methodOverride = require("method-override")

const app = express();


async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/WanderLust")
};

main().then(()=>{
    console.log("Database connected")
}).catch(()=>{
    console.log("Error connecting database")
});

app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"))
app.use(express.static(path.join(__dirname,"public")));
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'));

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

app.get("/listings/new",(req,res)=>{
    res.render("new.ejs");
})

app.delete("/listings/:id",async(req,res)=>{
    await Listing.findByIdAndDelete(req.params.id);
    res.redirect("/listings");
})

app.patch("/listings/:id",async (req,res)=>{
    const newListing = req.body;
    await Listing.findByIdAndUpdate(req.params.id,newListing);
    res.redirect("/listings");
})

app.get("/listings/:id",async (req,res)=>{
    const id = req.params.id;
    const listing = await Listing.findById(id);
    res.render("show.ejs",{listing})
    
})

app.post("/listings", async(req,res)=>{
    const listing = req.body;
    await Listing.create(listing);
    res.redirect("/listings")
})

app.get("/listings/:id/edit",async(req,res)=>{
    const listing = await Listing.findById(req.params.id);
    console.log(listing);
    res.render("edit.ejs",{listing});
});
