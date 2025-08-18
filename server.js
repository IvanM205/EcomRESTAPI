const express = require('express');
const app = express();
const session = require('express-session');
const store = new session.MemoryStore();
const PORT = process.env.PORT | 4001;

// import Routers
const customersRouter = require('./routes/customersRouter');
const productsRouter = require('./routes/productsRouter');
const cartsRouter = require('./routes/cartsRouter');
const ordersRouter = require('./routes/ordersRouter');
const authRouter = require('./routes/authRouter');
//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
    session({
        secret: process.env.RANDSECRET,
        cookie: {
            maxAge: 300000000,
            secure: false,
            sameSite: 'lax'
        },
        saveUninitialized: false,
        resave: false,
        store
    })
)

function ensureAuthentication(req, res, next) {
  // Complete the if statement below:
  if (req.session.authenticated) {
    return next();
  } else {
    res.status(403).json({ msg: "You're not authorized to view this page" });
  }
}

// ROUTES
app.get('/', (req, res) => {
    res.send('Server is running!');
})

app.use('/customers', ensureAuthentication, customersRouter);
app.use('/products', ensureAuthentication, productsRouter);
app.use('/carts', ensureAuthentication, cartsRouter);
app.use('/orders', ensureAuthentication, ordersRouter);
app.use('/auth', authRouter);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});