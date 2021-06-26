Promise = require("bluebird"); // eslint-disable-line no-global-assign
const { port, env } = require("./config/vars");
const logger = require("./config/logger");
const app = require("./config/express");
const mongoose = require("./config/mongoose");

// open mongoose connection
mongoose.connect();

// listen to requests
app.listen(port, () => logger.info(`server started on port ${port} (${env})`));

/**
 * Exports express
 * @public
 */
module.exports = app;

// require('dotenv').config()

// const express = require('express')
// const app = express()
// const mongoose = require('mongoose')

// const PORT = process.env.PORT || 5000

// mongoose.connect(process.env.DaTABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true})

// const db = mongoose.connection
// db.on('error', (error) => console.error(error))
// db.once('open', () => console.log('Connected to database'))

// app.use(express.json())

// const subscribersRouter = require('./routes/subscribers')
// app.use('/subscribers', subscribersRouter)

// app.listen(PORT, () => console.log(`Server started at ${PORT}`))
