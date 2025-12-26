const express = require('express');
const app = express();
const mongoose = require('mongoose');
const initdata = require('./data.js');
const Listing = require('../models/listing');



main().then(() =>{
    console.log("connected to db ");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wonderhub');
}

const initdb =  async () =>{
    await Listing.deleteMany({}); // delete initial data if there any

     Listing.insertMany(initdata.data).then((res) =>{
        console.log("data is intilized");
     }).catch((err)=>{
        console.log("data intializatino is failed");
     });  
}

initdb();
