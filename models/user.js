const mongoose = require("mongoose");
// const { v4: uuid } = require('uuid');


const userSchema = mongoose.Schema({
 name: {
    type: String
 },
 email: {
    type: String
 },
 password: {
    type: String
 },
 socketID: {
   type: String
},
})

module.exports = mongoose.model('User',userSchema)