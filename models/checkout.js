// const mongoose = require('mongoose');

// const checkoutSchema = new mongoose.Schema({
//   firstName: String,
//   lastName: String,
//   email: String,
//   phone: String,
//   address: String,
//   city: String,
//   zip: String,
//   country: String,
//   cardName: String,
//   cardNumber: String,
//   expiry: String,
//   cvv: String
// });

// const Checkout = mongoose.model('Checkout', checkoutSchema);
// module.exports = Checkout;




const mongoose = require('mongoose');

const checkoutSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  cardName: { type: String, required: true },
  cardNumber: { type: String, required: true },
  expiration: { type: String, required: true },
  cvv: { type: String, required: true },
  address: { type: String, required: true },
  cartItems: [
    {
      id: String,
      name: String,
      price: String,
      image: String,
      quantity: String
    }
  ]
});
const Checkout = mongoose.model('Checkout', checkoutSchema);
module.exports = Checkout;
