const mongoose = require('mongoose');
const review = require('./review');
const { required } = require('joi');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title : {
        type : String,
    },
    description : String,
    image : {
        url : String,
        filename : String,
    },
    price : {
        type : Number,
        min : [0],
    },
    location : String,
    country : String,
    review : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review",
        }
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User",
    },
    rating : {
        type : Number,
        min : [0],
    },
    iframe : {
        type : String,
    },
    bookings: [
        { type: Schema.Types.ObjectId, ref: 'Booking' }, 
      ]
});

const Listing = mongoose.model("listing" , listingSchema);

module.exports = Listing;