const express = require("express");
const csv = require("csvtojson");
const app = express();
const path = require("path");
const hbs = require("hbs");
const ejs = require("ejs");
const mongodb = require("mongodb").MongoClient;
let url = "mongodb://localhost:27017/";
// const fs = require("fs");
// const multer = require("multer");
// const auth = require("./middleware/auth");

// const upload = multer({ dest: "uploads/"})
require("./db/conn");
const Register = require("./models/registers");
const School = require("./models/school");
const Class = require("./models/class");

const port = process.env.PORT || 3000;
const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

//app.use(express.static('templates/views'))
app.use(express.json());
app.use(express.urlencoded({ extended: true, useNewUrlParser: true }));
app.use(express.static(static_path));
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);
app.set("views", template_path);
hbs.registerPartials(partials_path);

//console.log(process.env.SECRET_KEY);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/addschool", (req, res) => {
  res.render("addschool");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/selectschool", (req, res) => {
  School.find({}, function(err, result){
    // console.log(result);
    if (err) {
      console.log(err);
    } else {
      res.render("selectschool", {details: result });
    }
  });
});

app.get("/liststudents", (req, res) => {
  School.find({}, function(err, result){
    // console.log(result);
    if (err) {
      console.log(err);
    } else {
      res.render("liststudents", {details: result });
    }
  });
});

app.get("/listclass", (req, res) => {
  School.find({}, function(err, result){
    // console.log(result);
    if (err) {
      console.log(err);
    } else {
      res.render("listclass", {details: result });
    }
  });
});

app.get("/liststudents/:schoolname", async (req, res) => {
  const schoolname = req.params.schoolname;
  Class.find({schoolname: schoolname}, function(err, result){
    if (err) {
      console.log(err);
    } else {
      res.render("listclass2", { data: { details:result, schoolname: schoolname } });
    }
  });  
});

app.get("/showstudent", async (req, res) => {
  const schoolname = req.params.schoolname;
  Class.find({schoolname: schoolname}, function(err, result){
    if (err) {
      console.log(err);
    } else {
      res.render("listclass2", { data: { details:result, schoolname: schoolname } });
    }
  });  
});

app.post("/showstudent", async (req, res) => {
  const school = req.body.school;
  const class1 = req.body.class;
  Register.find({school: school, class: class1}, function(err, result){
  if (err) {
        console.log(err);
      } else {
        // console.log(result)
        res.render("showstudent", {details: result });
      }
  });  

});

app.get("/selectschool/:schoolname", async (req, res) => {
  const schoolname = req.params.schoolname;
  Class.find({schoolname: schoolname}, function(err, result){
    if (err) {
      console.log(err);
    } else {
      // res.render("register", {details: result });
      res.render("register", { data: { details:result, schoolname: schoolname } });// MULTIPLE DATA SENDING
      
    }
  });  
});

app.post("/register", async (req, res) => {
  try {
    const registerStudent = new Register({
      class: req.body.class,
      school: req.body.school,
      name: req.body.name,
      age: req.body.age,
      phone: req.body.phone,
      address: req.body.address,
      date: req.body.date,
      hobbies: req.body.hobbies,
      file: req.body.file,
    });

    const registered = await registerStudent.save();
    // console.log("the page part : " +registered);

    res.status(201).render("index");
  } catch (e) {
    res.status(400).send(e);
  }
});

app.post("/addschool", async (req, res) => {
  try {
    const registerSchool = new School({
      schoolname: req.body.schoolname
    });

    const registered = await registerSchool.save();
    // console.log("the page part : " +registered);

    res.status(201).render("index");
  } catch (e) {
    res.status(400).send(e);
  }
});

app.get("/displayschool", async (req, res) => {
   School.find({}, function(err, result){
    // console.log(result);
    if (err) {
      console.log(err);
    } else {
    
      res.render("displayschool", {details: result });
    }
  });
});

app.get("/displayschool/:school", async (req, res) => {
  console.log("hello")
  const school = req.params.school
  Class.find({school}, function(err, result){   
    if (err) {
      console.log(err);
    } else {
      console.log(result)
      res.render("showclass", {details: result });
    }
  }).populate("school");  
});

app.get("/addclass", async (req, res) => {
  School.find({}, function(err, result){
    // console.log(result);
    if (err) {
      console.log(err);
    } else {
      res.render("addclass", {details: result });
    }
  });  
  // res.render("addclass");
});

app.post("/addclass", async (req, res) => {
  try {
    console.log(req.body)
    const registerClass = new Class({
      classname: req.body.classname,
      school: req.body.school,
    });
    const schoolname = req.body.school;
    // Class.find({})
    // .populate('school').exec((err, posts) => {
    //   console.log("Populated " );
    // })
    // const registered = await registerClass.populate('school');
    const registered = await registerClass.save();
    registered.populate('school','schoolname');
    // console.log("the page part : " +registered);
    
    res.status(201).render("index");
  } catch (e) {
    res.status(400).send(e);
    console.log(e);
  }
});

app.get("/listschool", async (req, res) => {
  School.find({}, function(err, result){
    if (err) {
      console.log(err);
    } else {
      res.render("listschool", {details: result });
    }
  });  
});


app.get("/edit/:id", async (req, res) => {
  const _id = req.params.id
  const sclname = await Register.findById(_id);
  const schoolname = sclname.school;
  const result1 = await Class.find({schoolname});

  Register.findById(_id, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      res.render("edit", { data:{ details: result, details1:result1 }});
    }
  });
});

app.post("/edit/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const update = req.body;
    const result = await Register.findByIdAndUpdate(_id, update, {$exists: true} );
    Register.find({}, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        // console.log(result);
        res.render("index", { details: result });
      }
    });
  } catch (e) {
    console.log(e);
  }
});

app.get("/delete/:id", async (req, res) => {
  const _id = req.params.id;
  Register.findByIdAndDelete(_id, function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      res.render("index");
    }
  });
});

app.get("/deleteschool", async (req, res) => {
  School.find({}, function(err, result){
    // console.log(result);
    if (err) {
      console.log(err);
    } else {
      res.render("deleteschool", {details: result });
    }
  });
});

app.get("/displayall", async (req, res) => {
  Register.find({}, function(err, result){
    if (err) {
      console.log(err);
    } else {
      //console.log(result)
      res.render("display", {details: result });
    }
  });
});

// app.get("/deleteschool/:schoolname", async (req, res) => {
//   const schoolname = req.params.schoolname;
//   School.remove({schoolname}, function(err, data){
//     if(err){
//       console.log(err);
//     }else{
//       res.render("index")
//     }
//   }); 
// });

app.get("/deleteschool/:schoolname", async (req, res) => {
  const schoolname = req.params.schoolname;
  School.remove({schoolname}, function(err, data){
    if(err){
      console.log(err);
    }else{
      Class.remove({schoolname}, function(err, data){
        if(err){
          console.log(err);
        }else{
          Register.remove({school: schoolname}, function(err, data){
            if(err){
              console.log(err);
            }else{
            res.render("index")
            }
          })
         }

      })     
    }
  }); 
});

app.get("/deleteclass", (req, res) => {
  School.find({}, function(err, result){
    // console.log(result);
    if (err) {
      console.log(err);
    } else {
      res.render("deleteclass", {details: result });
    }
  });
});

app.get("/deleteclass/:schoolname", async (req, res) => {
  const schoolname = req.params.schoolname;
  Class.find({schoolname: schoolname}, function(err, result){
    if (err) {
      console.log(err);
    } else {
      res.render("deleteclass2", { data: { details:result, schoolname: schoolname } });
    }
  });  
});

app.post("/deleteclass", async (req, res) => {
  const classname = req.body.class;
  const schoolname = req.body.school;
  Class.deleteOne({schoolname,classname}, function(err, result){
    if (err) {
      console.log(err);
    } else {
      Register.deleteMany({school:schoolname,class:classname}, function(err, result1){
        if (err) {
          console.log(err);
        } else {
          res.render("index")
        }
      });
    }
  });  
});

app.get("/upload", (req, res) => {
  csv()
  
  .fromFile("kindacode.csv")
  .then(csvData => {
  // res.send(csvData);
      mongodb.connect(
          url,
          (err, client) => {
          if(err) throw err;
          client
          .db("SchoolAdministration")
          .collection("schools")
          .insertMany(csvData, (err, res) =>{
              if (err) throw err;
              console.log(`Inserted: ${res.insertedCount} rows`);
              client.close();
          })
      }
      )
      res.render("index");
  })
});

app.listen(port, () => {
  console.log(`server is running at port ${port}`);
});
