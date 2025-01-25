const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const todoSchema = require('../schemas/todoSchema'); // importing schema
const Todo = new mongoose.model("Todo", todoSchema); // creating Todo Model to interect with Mondo database
const { authGuard }  = require('../middlewares/authGuard');

// Get all the todos
router.get('/', authGuard, async (req, res)=> {
    console.log(req.username);
    console.log(req.userId);
    
    try {
        const data = await Todo.find().select({
            _id: 0,
            __v: 0
        }).limit(null);

        if(data.length === 0){
            res.status(200).json({ message: "not data was found!"});
        } else{
            console.log(data);
            res.status(200).json({ message: "data found successfully!"});
        }

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get active the todos
router.get('/active', authGuard, async (req, res)=> {
    try {
        const todo = new Todo();
        const data = await todo.findActive().select({
            _id: 0,
            __v: 0
        }).limit(null);

        if(data.length === 0){
            res.status(200).json({ message: "not data was found!"});
        } else{
            console.log(data);
            res.status(200).json({ message: "data found successfully!"});
        }

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get todo includes js
router.get('/findJs', authGuard, async (req, res)=> {
    try {
        const data = await Todo.findByJs();

        if(data.length === 0){
            res.status(200).json({ message: "not data was found!"});
        } else{
            console.log(data);
            res.status(200).json({ message: "data found successfully!"});
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get todo by query
router.get('/search', authGuard, async (req, res) => {
    try {
        console.log("Entered /language route");

        console.log(req.query.search);
        const language = req.query.search || '';
        console.log("Language filter:", language);

        const data = await Todo.find().byLanguage(language);
        console.log("Retrieved data:", data);

        if (data.length === 0) {
            return res.status(200).json({ message: "No data was found!" });
        }

        res.status(200).json({ message: "Data found successfully!", data });
    } catch (err) {
        console.error("Error occurred in /language route:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// Get a the todo through id
router.get('/:id', authGuard, async (req, res)=> {
    try {
        const data = await Todo.find({ _id: req.params.id }).select({
            _id: 0,
            __v: 0
        });
        if(data.length === 0){
            res.status(200).json({ message: "not data was found!"});
        } else{
            console.log(data);
            res.status(200).json({ message: "data found successfully!"});
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Post a todo
router.post('/', async (req, res)=> {
    try {
        const newTodo = new Todo(req.body); // creating an instance newTodo
        await newTodo.save();
        res.status(200).json({ message: "Todo was inserted successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Post multiple todos
router.post('/all', async (req, res)=> {
    try {
        await Todo.insertMany(req.body);
        res.status(200).json({ message: "Todos were inserted successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// update todos
router.put('/:id', authGuard, async (req, res)=> {
    try{
        // await Todo.updateOne({_id: req.params.id}, {
        //     $set: {
        //         status: "active"
        //     }
        // });
        const fetchedData = await Todo.findByIdAndUpdate(
            {_id: req.params.id},
            { $set: { status: "active" } },
            { new: true }
        );
        console.log(fetchedData);
        res.status(200).json({ message: "Todo was updated successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete todo
router.delete('/:id', authGuard, async (req, res)=> {
    try {
        await Todo.deleteOne({_id: req.params.id});
        res.status(200).json({ message: "data deleted successfully!"});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
