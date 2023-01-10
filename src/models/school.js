const mongoose = require("mongoose");
// const autoIncrement = require('mongoose-auto-increment');
// autoIncrement.initialize(connection);
const schoolSchema = new mongoose.Schema({
    schoolname :{
        type:String,
        required:true
    }
})


const School = new mongoose.model("School", schoolSchema);

module.exports = School;