const Listing = require("../model/listing");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({})
    res.render("listings/index.ejs", { allListings });
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}


module.exports.showListings =async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path : "review",
        populate : {
            path : "author",
        },
        }).populate("owner");
    if(!listing){
        req.flash("error" , "listing does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}


module.exports.createNewListings = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url , ".." , filename);
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user;
    newListing.image = {url , filename};
    await newListing.save();
    req.flash("success" , "New Listings Created!");
    res.redirect("/listings");
}

module.exports.editListings = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error" , "listing does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}

module.exports.updateListings = async (req, res) => {
    if(!req.body.listing){
        throw new ExpressError(400 , "Send a Valid Response");
    }
    let { id } = req.params;
    const newlist = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    newlist.image = {url , filename};
    await newlist.save();
    }
    req.flash("success" , "Listings Updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListings = async (req, res) => {
    const { id } = req.params;
    const deletedlist = await Listing.findByIdAndDelete(id);
    console.log(deletedlist);
    req.flash("success" , "Listings Deleted!");
    res.redirect("/listings");
}
module.exports.searchListing = async(req,res) => {
    const  { country }  = req.query;
    console.log(country);
    let listing =await Listing.find({
        "$or":[
            {country : country}
        ]
    });
    res.render("listings/search.ejs" , {listing});
}

module.exports.filterListings = async (req, res) => {
    try {
        const { country } = req.body;
        if (country == 1) {
            const listing = await Listing.find().sort({ price: 1 }); // 1 for ascending order
            res.render("listings/search.ejs", { listing });
        }
        if (country == 0) {
            const listing = await Listing.find().sort({ price: -1 }); // 1 for ascending order
            res.render("listings/search.ejs", { listing });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}

