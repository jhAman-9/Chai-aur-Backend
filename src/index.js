// require('dotenv').config({path : './env'})

import dotenv from "dotenv";
import { app } from "./app.js";

// import mongoose from "mongoose";
// import { DB_NAME } from "./constants";

import connectDB from "./db/index.js";

dotenv.config({
  path: "./env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is Running at port : ${process.env.PORT}`);
    })

    // app.on("error", (error) => {
    //   console.log("Error : ", error);
    //   throw error;
    // });
  })
  .catch((err) => {
    console.log("MONGOOSE CONNECTION FIALED !!!", err);
  });

/*
import express from "express";
// function connectDB() {
// }
// connectDB()

const app = express()
// Effi function
(async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

        app.on("error", (error) => {
            console.log('Error :', error);
            throw error
        }) 


        app.listen(process.env.PORT, () => {
            console.log(`App is Listing on port ${process.env.PORT}`);
        })
    }

    catch (error) {
        console.error("Error: ", error)
        throw error
    }
})()

*/
