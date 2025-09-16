const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    address: String,
    city: String,
    state: String,
    zipCode: String,
    cardName: String,
    cardNumber: String,
    expMonth: String,
    expYear: Number,
    cvv: String
});

module.exports = mongoose.model('Payment', paymentSchema);
