if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}


const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js");
const listings = require("./Routes/listing.js");
const reviews = require("./Routes/review.js");
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./model/user.js');
const userRouter = require("./Routes/user.js");
const {isLoggedIn, isOwner} = require("./middleware.js");
const Listing = require('./model/listing.js');
const multer  = require('multer');
const {storage} = require("./cloudConfig.js");
const upload = multer({storage })
const MongoStore = require('connect-mongo');
const favicon = require('serve-favicon');
const Payment = require('./model/payment.js');
const bookingRoutes = require('./Routes/booking.js');




app.use(cors());
const dburl = process.env.ATLASDB_URL;

mongooseurl = 'mongodb://127.0.0.1:27017/wonderlust';

main().then((res) => {
    console.log("connection establised");
})
    .catch(err => {
        console.log(err);
    });


async function main() {
    await mongoose.connect(dburl);
}
app.set("views engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")))
mongoose.set('strictPopulate', false);
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

const store = MongoStore.create({
    mongoUrl : dburl,
    crypto : {
        secret : process.env.SECERT,
    },
    touchAfter : 24 * 3600,
});

store.on("error" , () => {
    console.log("error in mongo session store" , err);
})

const sessionOptions = {
    store,
    secret: process.env.SECERT,
    resave : false,
    saveuninitialized :true,
    cookies:{
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxage : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    }
};



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session()); 
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})




app.get("/trending" , async(req, res) => {
    const allListings = await Listing.find({category : "Trending"})
    res.render("listings/icons.ejs" , {allListings});
})
app.get("/rooms" , async(req, res) => {
    const allListings = await Listing.find({category : "Rooms"})
    res.render("listings/icons.ejs" , {allListings});
})
app.get("/mountains" , async(req, res) => {
    const allListings = await Listing.find({category : "mountains"})
    res.render("listings/icons.ejs" , {allListings});
})
app.get("/farms" , async(req, res) => {
    const allListings = await Listing.find({category : "farms"})
    res.render("listings/icons.ejs" , {allListings});
})
app.get("/castles" , async(req, res) => {
    const allListings = await Listing.find({category : "castles"})
    res.render("listings/icons.ejs" , {allListings});
})
app.get("/camping" , async(req, res) => {
    const allListings = await Listing.find({category : "Camping"})
    res.render("listings/icons.ejs" , {allListings});
})
app.get("/amazing-pool" , async(req, res) => {
    const allListings = await Listing.find({category : "Amazing pools"})
    res.render("listings/icons.ejs" , {allListings});
})
app.get("/iconic-city" , async(req, res) => {
    const allListings = await Listing.find({category : "Iconic Center"})
    res.render("listings/icons.ejs" , {allListings});
})

app.post('/submit-payment', async (req, res) => {
    try {
        const paymentData = new Payment(req.body);
        await paymentData.save(); 
        res.render("listings/success.ejs");
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred. Please try again.");
    }
});




app.use("/listings", listings);
app.use("/listings/:id/reviews" , reviews);
app.use("/" , userRouter);

app.get("/com" , (req,res) => {
    res.render("listings/complaint.ejs");
})

app.use(bookingRoutes);

// for all error

app.all("*" , (req,res,next) => {
    next(new ExpressError(404 , "Page Not Found"));
})

// middleware 

app.use((err, req, res, next) => {
    let {statusCode=500 , message="Something Went Wrong"} = err;
    res.status(statusCode).render("listings/error.ejs" , {message});
    // res.status(statusCode).send(message);
})


app.listen(8080, () => {
    console.log("app is listening to port 8080");
}) 