const express = require("express");
const router = express.Router({mergeParams : true});
const warpAsync = require("../utils/warpAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../model/review.js");
const Listing = require('../model/listing.js');
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");

const reviewController = require("../controllers/review.js");


// review post
router.post("/" , isLoggedIn ,warpAsync(reviewController.createReview));

// delete rivew route
router.delete("/:reviewId" ,isLoggedIn, isReviewAuthor , warpAsync(reviewController.deleteReview));

module.exports = router;