# Foodie
An Express.js + EJS web app for managing restaurant operations, browsing menus, making reservations, and handling online orders. Data is stored in MongoDB. User authentication is handled with bcrypt hashing for demo purposes.

## Features
- **Pages**: Landing (auth), Home, Menu Gallery, About, Blog, Contact, Cart, Checkout, Reservation, Confirmation
- **Menu Management**: Browse restaurant menu with item details
- **Shopping Cart**: Add items to cart, manage quantities, persist cart data
- **Checkout & Orders**: Complete purchase flow with order tracking (Checkout model)
- **Reservations**: Book a table with date/time preferences, stored in MongoDB
- **User Auth**: Secure login/registration with bcrypt password hashing
- **Security & Logging**: helmet, morgan, compression, express-rate-limit, custom middleware
- **Views**: Server-side rendered with EJS (views/), static assets (public/assets/)

## Tech Stack
- **Node.js**, Express
- **EJS** templating engine
- **MongoDB** (local instance via Mongoose)
- **Mongoose** ODM for data modeling
- **bcrypt** for password hashing
- **helmet**, **cors**, **morgan**, **body-parser**, **compression**
- **express-session** for session management
- **express-rate-limit** for API rate limiting

## Project Structure
```
Foodie/
├─ server.js               # App entry point
├─ db.js                   # MongoDB connection via Mongoose
├─ routes.js               # All route handlers (pages, auth, cart, reservations)
├─ models/
│  ├─ user.js              # User model (username, password with bcrypt)
│  ├─ cartitems.js         # Cart items model
│  ├─ checkout.js          # Order/checkout model
│  └─ reservation.js       # Table reservation model
├─ public/
│  └─ assets/
│     ├─ css/
│     │  ├─ style.css
│     │  └─ styleee.css
│     ├─ images/           # Menu/restaurant images
│     └─ js/
│        ├─ cart.js        # Client-side cart logic
│        ├─ checkout.js    # Client-side checkout logic
│        └─ menue.js       # Client-side menu interactions
├─ views/                  # EJS templates
│  ├─ landing.ejs          # Auth landing page
│  ├─ login.ejs
│  ├─ register.ejs
│  ├─ index.ejs            # Home page
│  ├─ menue.ejs            # Menu gallery
│  ├─ about.ejs
│  ├─ blog.ejs
│  ├─ contactus.ejs
│  ├─ cart.ejs             # Shopping cart
│  ├─ checkout.ejs         # Checkout/order form
│  ├─ confirmation.ejs     # Order confirmation
│  ├─ reservation.ejs      # Reservation form
│  ├─ dilivery.ejs         # Delivery/tracking info
│  └─ newpass.ejs          # Password reset page
├─ package.json
└─ README.md
```

## Prerequisites
- Node.js 18+ recommended
- Local MongoDB running at `mongodb://127.0.0.1:27017/restaurantApp`
- Database name is **restaurantApp** (see db.js)

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Ensure MongoDB is running locally
Default connection string is in db.js:
```javascript
await mongoose.connect("mongodb://127.0.0.1:27017/restaurantApp", {...});
```
Start your mongod service before running the app:
```bash
mongod
```

### 3. Start the server
```bash
npm start
```

### 4. Open in browser
```
http://localhost:3000
```

## Available Scripts
- `npm start` – Start the server on port 3000

## Routes

### Pages
- `GET /` → Landing page (shows login/signup or redirects to home if authenticated)
- `GET /index` → Home page (protected, requires login)
- `GET /menue` → Menu gallery with all available items
- `GET /about` → About us page
- `GET /blog` → Blog page
- `GET /contactus` → Contact us page
- `GET /reservation` → Reservation form page
- `GET /cart` → Shopping cart page
- `GET /checkout` → Checkout/payment page
- `GET /confirmation` → Order confirmation page
- `GET /dilivery` → Delivery/order tracking page
- `GET /forgot-password` → Password reset page (renders newpass.ejs)

### Authentication
- `GET /login` → Login page
- `GET /register` → Registration page
- `POST /login` → Authenticate user, set session, redirect to /index
- `POST /register` → Create new user with bcrypt hashed password, redirect to /login

### Cart & Checkout
- `POST /add-to-cart` → Add item to cart (CartItem model)
- `GET /view-cart` → Retrieve user's cart items
- `POST /checkout` → Process checkout, create Checkout record in MongoDB
- `GET /confirmation` → Display order confirmation

### Reservations
- `GET /reservations` → List user's reservations
- `POST /make-reservation` → Create new table reservation (Reservation model)

## Data Models

### User
Stored in `users` collection via Mongoose:
```javascript
{
  username: String (required, unique),
  password: String (required, bcrypt hashed),
  _id: ObjectId
}
```

### CartItem
```javascript
{
  userId: ObjectId,
  itemId: String,
  itemName: String,
  price: Number,
  quantity: Number,
  addedAt: Date
}
```

### Checkout (Order)
```javascript
{
  userId: ObjectId,
  items: [CartItem],
  totalPrice: Number,
  paymentMethod: String,
  deliveryAddress: String,
  status: String (default: "pending"),
  createdAt: Date,
  updatedAt: Date
}
```

### Reservation
```javascript
{
  userId: ObjectId,
  name: String,
  email: String,
  phone: String,
  reservationDate: Date,
  time: String,
  partySize: Number,
  specialRequests: String,
  status: String (default: "pending"),
  createdAt: Date
}
```

## Middleware
- **helmet** – Security headers protection
- **morgan** – HTTP request logging (dev mode)
- **compression** – Gzip compression for responses
- **express-rate-limit** – API rate limiting
- **express-session** – Session management with secure cookies
- **bodyParser** – URL-encoded and JSON parsing
- **Custom logger** – Request/response logging (if implemented in middleware/)

## Error Handling & DB Availability
- On startup, the app connects to MongoDB via `connectDB()` in db.js
- If MongoDB is unavailable, the app exits with error code 1
- POST requests to cart/checkout/reservation endpoints return 503 if DB is down
- Generic error handler returns a friendly error page in production mode

## Session & Security
- Sessions stored in memory (for production, use MongoDB session store like `connect-mongo`)
- Secure cookies: `httpOnly: true`, `secure: true` in production mode
- Session timeout: 1 day (86400000 ms)
- Session secret: Use environment variable `SESSION_SECRET` (fallback: 'yourSecretKey')
- Passwords: Hashed with bcrypt (see bcrypt in routes.js for authentication)

## Environment Variables (Optional)
Create a `.env` file to override defaults:
```
PORT=3000
NODE_ENV=development
SESSION_SECRET=your_session_secret_here
MONGODB_URI=mongodb://127.0.0.1:27017/restaurantApp
```

## Notes & Limitations
- Session store is in-memory; for production, use `connect-mongo` or similar
- MongoDB URI is hardcoded in db.js; consider moving to `.env` for flexibility
- Rate limiting is configured but may need tuning based on traffic
- Static images served from `public/assets/images/` via express.static
- For production, enable `secure: true` in session cookies (requires HTTPS)
- User authentication uses bcrypt but consider adding JWT tokens for API-based clients

## Troubleshooting

### App shows DB error or routes fail:
- Ensure MongoDB is running: `mongod` or check your OS service manager
- Confirm the URI in db.js matches your setup: `mongodb://127.0.0.1:27017/restaurantApp`
- Check MongoDB is listening on port 27017: `netstat -an | grep 27017`

### Port already in use:
- Change `PORT` in server.js (default 3000) or free the port:
  ```bash
  lsof -i :3000  # Find process using port
  kill -9 <PID>  # Kill the process
  ```

### Changes not reflected:
- Restart the server: `npm start`
- Use a watcher like **nodemon** for auto-reload during development:
  ```bash
  npm install -g nodemon
  nodemon server.js
  ```

### Session not persisting:
- Clear browser cookies and restart the server
- Check that `express-session` middleware is mounted before routes
- Verify `cookie.httpOnly: true` and `cookie.secure` settings in production

## License
ISC
