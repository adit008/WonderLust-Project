const express = require('express');
const router = express.Router();
const { createBooking, getUserBookings } = require('../controllers/booking');
const { isLoggedIn } = require('../middleware'); 
const Booking = require('../model/booking');
const methodOverride = require('method-override');
const bookingController = require('../controllers/booking');

router.use(methodOverride('_method'));

router.delete('/bookings/:id' , bookingController.deleteBooking);


router.post('/booking', isLoggedIn, createBooking);

router.get('/booking', isLoggedIn, getUserBookings);

router.get('/bookings', isLoggedIn, async (req, res) => {
    try {
        const userId = req.user._id.toString(); 
        const bookings = await Booking.find({ userId }); 
        res.render('booking/details.ejs', { bookings }); 
    } catch (err) {
        console.error('Error fetching bookings:', err);
        res.status(500).send('Error fetching bookings');
    }
});




module.exports = router;
