const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
const userSchema = require('../schemas/userSchema'); // importing schema
const User = new mongoose.model("User", userSchema); // creating Todo Model to interect with Mondo database

// Sign up route
router.post("/signup", async (req, res)=>{
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            name: req.body.name,
            username: req.body.username,
            password: hashedPassword
        });
        await newUser.save();

        res.status(200).json({ message: `User created successfully! Username: ${req.body.username}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login route
router.post("/login", async (req, res)=>{
    try{
        const user = await User.find({ username: req.body.username });
        if(user && user.length > 0){
            const isValidPassword = await bcrypt.compare(req.body.password, user[0].password);
            if(isValidPassword){
                // generate token
                const userToken = jwt.sign({
                    username: user[0].username,
                    userId: user[0]._id
                }, process.env.JWT_SECRET, {
                    expiresIn: '1h'
                });
                
                res.status(200).json({
                    "access_token": userToken,
                    "message": "Login Successful!"
                });
            } else {
            res.status(401).json({"err": "Authentication failed! 1"});
        }
        } else {
            res.status(401).json({"err": "Authentication failed! 2"});
        }
    } catch (err) {
        res.status(401).json({"err": "Authentication failed!"});
    }

    // try {
    //     res.status(200).json({ message: `User created successfully! Username: ${req.body.username}` });
    // } catch (err) {
    //     res.status(500).json({ error: err.message });
    // }

});

// Get all todos of user
router.get("/all", async (req, res)=>{
    try {
        const users = await User.find().populate("todos");

        res.status(200).json({ data: users, message: "Success" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
