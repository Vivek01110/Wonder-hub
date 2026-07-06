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
    initdata.data = initdata.data.map((obj) => ({...obj, owner : "6a4a5019932e2814ad3e8b74"})); // owner username : vivek , pass : vivek@1346

     Listing.insertMany(initdata.data).then((res) =>{
        console.log("data is intilized");
     }).catch((err)=>{
        console.log("data intializatino is failed");
     });  
}

initdb();
