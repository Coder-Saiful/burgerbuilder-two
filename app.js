const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const compression = require('compression');
const userRouter = require('./routers/userRouter');
const orderRouer = require('./routers/orderRouter');
const app = express();

app.use(compression());
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV === "development") {
    app.use(morgan('dev'));
}

app.get('/', (req, res) => {
    res.send("Server Start...");
});

app.use('/api/user', userRouter);
app.use('/api/order', orderRouer);

module.exports = app;