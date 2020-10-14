const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const userRoutes = require("./routes/user");

const app = express();

mongoose
  .connect(
    'mongodb://CoreUser:mongo-sinner85426@192.168.10.123:8203/cbc_mongo_storage?authSource=admin', { 
      useCreateIndex: true,
      useNewUrlParser: true, 
      useUnifiedTopology: true,
      useFindAndModify: false,
      }
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});
app.use("/api/user", userRoutes);

app.listen(3000, () => console.log('Server listening port 3000...'))

module.exports = app;
