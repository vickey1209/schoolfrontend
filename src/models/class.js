const mongoose = require("mongoose");
// const autoIncrement = require('mongoose-auto-increment');
// autoIncrement.initialize(connection);
const classSchema = new mongoose.Schema({
    school:{
        type: mongoose.Schema.Types.ObjectId, ref:'School',
    },
    classname :{
        type:String,
        required:true
    }
})


const Class = new mongoose.model("Class", classSchema);

module.exports = Class;