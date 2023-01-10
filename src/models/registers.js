const mongoose = require("mongoose");
// const autoIncrement = require('mongoose-auto-increment');
// autoIncrement.initialize(connection);
const studentSchema = new mongoose.Schema({
    school :{
        type:String,
        required:true
            },
    class :{
        type:String,
        required:true
           },
    name :{
        type:String,
        required:true
         },
    age :{
        type:Number,
        required:true
         },
    phone:{
        type:Number,
        required:true
          },
    address:{
        type:String,
        required:true
            },
    date:{
        type:String,
        required:true
         },
    hobbies:{
        type:Array
            },
    file:{
        type:String
         }
        })


const Student = new mongoose.model("Student", studentSchema);

module.exports = Student;