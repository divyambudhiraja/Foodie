const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  guests: { type: Number, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  specialRequests: { type: String },
  agreedToTerms: { type: Boolean, required: true }
});

module.exports = mongoose.model('Reservation', reservationSchema);
