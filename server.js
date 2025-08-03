const express = require('express');
const app = express();
const PORT = process.env.PORT | 4001;

// import Routers
const customersRouter = require('./routes/customersRouter');

//middleware
app.use(express.json());

// ROUTES
app.get('/', (req, res) => {
    res.send('Server is running!');
})

app.use('/customers', customersRouter);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});