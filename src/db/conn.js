const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/SchoolAdministration")
.then(() =>{
    console.log("connection success")
}).catch((e) =>{
    console.log("no connction")
});