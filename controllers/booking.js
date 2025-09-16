const Booking = require('../model/booking');
const User = require('../model/user');
const Listing = require('../model/listing');

// Create a new booking
module.exports.createBooking = async (req, res) => {
  try {
    const { hotelId, startDate, endDate, guestCount } = req.body;
    const userId = req.user._id;

    const hotel = await Listing.findById(hotelId);
    if (!hotel) return res.status(404).json({ error: 'Hotel not found' });

    const nights = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);
    const totalAmount = hotel.price * nights * guestCount;

    const booking = new Booking({
      userId,
      hotelId,
      hotelName: hotel.title,
      startDate,
      endDate,
      totalAmount,
      guestCount,
      paymentStatus: 'Pending', 
    });

    await booking.save();

    await User.findByIdAndUpdate(userId, { $push: { bookings: booking._id } });
    await Listing.findByIdAndUpdate(hotelId, { $push: { bookings: booking._id } });

    res.render("listings/payment.ejs");

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    await User.findByIdAndUpdate(booking.userId, { $pull: { bookings: id } });
    await Listing.findByIdAndUpdate(booking.hotelId, { $pull: { bookings: id } });

    await Booking.findByIdAndDelete(id);

    res.redirect('/bookings'); 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.getUserBookings = async (req, res) => {
    try {
      const userId = req.user._id;
      const bookings = await Booking.find({ userId }).populate('hotelId', 'title location price');
      res.render('bookings/index', { bookings });
    } catch (err) {
      res.status(500).send(err.message);
    }
  };
  
