const mongoose = require("mongoose");

module.exports = () => {

  try {
    mongoose.connect(
      "mongodb+srv://mobigic:mobigic@cluster0.wc8z2.mongodb.net/"
    );

    console.log("Connected to database successfully");
  } catch (error) {
    console.log(error);
    console.log("Could not connect database!");
  }
};

// mongodb+srv://mobigic:mobigic@cluster0.wc8z2.mongodb.net/
