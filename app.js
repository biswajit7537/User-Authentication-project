//jshint esversion:6
require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const encrypt = require("mongoose-encryption");

const app = express();
app.set('view engine','ejs');
app.use(express.urlencoded({extended : true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser: true,useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
    email : String,
    password : String
});
// adding mongoose-encription //

userSchema.plugin(encrypt,{secret : process.env.SECRET,encryptedFields : ['password']});

const User = new mongoose.model("User",userSchema);

app.get("/",(req,res)=>{
    res.render("home");
})
app.get("/login",(req,res)=>{
    res.render("login");
});
app.get("/register",(req,res)=>{
    res.render("register");
});


// ---- post request ----

app.post("/register",(req,res)=>{
    
    const user = new User({
        email : req.body.username,
        password : req.body.password
    })
    user.save((err)=>{
        if(!err)
        {
            res.render("secrets");
        }
        else
        {
            console.log(err);
        }
    })
});

app.post("/login",(req,res)=>{
    const userName = req.body.username;
    const userPassword = req.body.password;
    User.findOne({email:userName},(err,foundUser)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
            if(foundUser.password === userPassword)
            {
                res.render("secrets");
            }
            else
            {
                res.send("Invalid credentials...");
            }
        }
    })
})





app.listen(3000,()=>{
    console.log("Server is running on the port number 3000");
});