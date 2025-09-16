const express = require("express");
const router = express.Router();
const warpAsync = require("../utils/warpAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require('../model/listing.js');
const {isLoggedIn, isOwner} = require("../middleware.js");
const review = require("../model/review.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage })

const controller = require("../controllers/listing.js");

//index route
router.get("/", warpAsync(controller.index));

//search route
router.get("/search/" , controller.searchListing);

//new route
router.get("/new", isLoggedIn , controller.renderNewForm);

//show route
router.get("/:id", warpAsync(controller.showListings))

//create route

router.post("/", isLoggedIn , upload.single("listing[image]") , warpAsync(controller.createNewListings));

//edit route

router.get("/:id/edit",isLoggedIn, isOwner , warpAsync(controller.editListings))

//update route

router.put("/:id", isLoggedIn , isOwner , upload.single("listing[image]") , warpAsync(controller.updateListings));

//delete route

router.delete("/:id",isLoggedIn, isOwner , warpAsync(controller.deleteListings));

//filter

router.post("/filter" , controller.filterListings);




module.exports = router;


