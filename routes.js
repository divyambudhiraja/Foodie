const express = require('express');
const bcrypt = require('bcrypt');
const User = require('./models/user');
const Reservation = require('./models/reservation');
const CartItem = require('./models/cartitems');
const Checkout = require('./models/checkout'); // use the correct path

const router = express.Router();

// ✅ Landing Page: first page to open
router.get('/', (req, res) => {
    if (req.session.user) {
        return res.redirect('/index');
    }
    res.render('landing'); // shows login/signup buttons
});

// ✅ Login Page
router.get('/login', (req, res) => {
    const error = req.query.error || null;
    res.render('login', {
        title: 'Login',
        showRegisterLink: true,
        registerUrl: '/register',
        error
    });
});

router.get('/forgot-password', (req, res) => res.render('newpass'));

// ✅ Register Page
router.get('/register', (req, res) => {
    res.render('register', {
        pageTitle: 'Create Your Account',
        formAction: '/register',
        formMethod: 'POST',
        buttonText: 'Create Account',
        termsText: 'I agree to the Terms of Service and Privacy Policy',
        loginUrl: '/login',
        showLoginLink: true
    });
});

// ✅ Protected Index Page
router.get('/index', (req, res) => {
    if (req.session.user) {
        res.render('index');
    } else {
        res.redirect('/login');
    }
});

// Other Routes
router.get('/about', (req, res) => res.render('about'));
router.get('/menue', (req, res) => res.render('menue'));
router.get('/blog', (req, res) => res.render('blog'));
router.get('/reservation', (req, res) => res.render('reservation'));
router.get('/cart', (req, res) => res.render('cart'));
router.get('/dilivery', (req, res) => {
    res.render('dilivery', {
        pageTitle: 'Order Delivery - Foodie',
        siteName: 'Foodie',
        currentPage: '/dilivery',
        currentYear: new Date().getFullYear()
    });
});
router.get('/contactus', (req, res) => res.render('contactus'));
router.get('/cart', (req, res) => {
    res.render('cart');
});

router.get('/checkout', (req, res) => {
    res.render('checkout');
});

// ✅ Reservation POST
router.post('/reservation', async (req, res) => {
    try {
        const {
            fullName, email, phone, guests, date, time,
            specialRequests, agreedToTerms
        } = req.body;

        const reservation = new Reservation({
            fullName,
            email,
            phone,
            guests: parseInt(guests),
            date,
            time,
            specialRequests,
            agreedToTerms: agreedToTerms === 'on'
        });

        await reservation.save();
        console.log("✅ Reservation saved to MongoDB");
        res.redirect('/index');
    } catch (err) {
        console.error("❌ Error saving reservation:", err);
        res.status(500).send("Reservation failed. Please try again.");
    }
});

// ✅ Login POST
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.redirect('/register'); // or show alert for "User not found"
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            req.session.user = user;
            res.redirect('/index');
        } else {
            // Re-render the login page with error message
            res.render('login', { error: 'Incorrect password' });
        }
    } catch (err) {
        console.error("❌ Login error:", err);
        res.status(500).send("Login error. Please try again.");
    }
});

// ✅ Register POST
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const existing = await User.findOne({ username });
        if (existing) {
            return res.status(400).send("User already exists."); // Bad Request
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        // Log the user in automatically after successful registration
        req.session.user = newUser;  // Store the user session
        res.redirect('/index');  // Redirect to the index page after registration
    } catch (err) {
        console.error("❌ Registration error:", err);
        res.status(500).send("Registration error. Please try again.");
    }
});

// POST /cart/add
router.post('/cart/add', async (req, res) => {
  const { name, price, quantity, image } = req.body;

  // Ensure all required fields are provided
  if (!name || !price || !quantity || !image) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const newItem = new CartItem({ name, price, quantity, image });
    await newItem.save();
    res.status(201).json({ message: 'Item saved to MongoDB', item: newItem });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save item to MongoDB' });
  }
});



router.post('/checkout', async (req, res) => {
  try {
    const { firstName, lastName, cardName, cardNumber, expiration, cvv, address, city, zip, country, email, phone } = req.body;
    
    // Parse cartItems from the hidden form field
    let cartItems = [];
    let subtotal = 0;
    let tax = 0;
    let shipping = 0;
    let total = 0;

    if (req.body.cartItems) {
      try {
        const parsed = JSON.parse(req.body.cartItems);
        cartItems = parsed.items || parsed || [];
        subtotal = parsed.subtotal || 0;
        tax = parsed.tax || 0;
        shipping = parsed.shipping || 0;
        total = parsed.total || 0;
      } catch (e) {
        console.warn('⚠️ Could not parse cartItems:', e);
      }
    }

    const order = new Checkout({
      firstName,
      lastName,
      cardName,
      cardNumber,
      expiration,
      cvv,
      address,
      city,
      zip,
      country,
      email,
      phone,
      cartItems: cartItems,
      subtotal: subtotal,
      tax: tax,
      shipping: shipping,
      total: total
    });

    await order.save();
    console.log("✅ Order saved to MongoDB with cartItems:", cartItems);

    res.render('confirmation', { ...req.body });
  } catch (err) {
    console.error('❌ Error saving order:', err);
    res.status(500).send('Failed to save order');
  }
});





// ✅ Logout
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error("❌ Logout error:", err);
            return res.status(500).send("Logout failed. Please try again.");
        }
        res.redirect('/');
    });
});

module.exports = router;
