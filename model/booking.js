const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const bookingSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
  hotelId: { type: Schema.Types.ObjectId, ref: 'Listing', required: true }, 
  hotelName: { type: String, required: true }, 
  startDate: { type: Date, required: true }, 
  endDate: { type: Date, required: true }, 
  totalAmount: { type: Number, required: true }, 
  guestCount: { type: Number, default: 1 }, 
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending'
},  bookingStatus: { type: String, default: 'Confirmed' }, 
}, {
  timestamps: true, 
});

module.exports = mongoose.model('Booking', bookingSchema);
