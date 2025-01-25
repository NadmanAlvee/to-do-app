const express = require('express');
const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    status: {
        type: String,
        enum: ["active", "inactive"],
    },
    date: {
        type: Date,
        default: Date.now,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    }
});

// Instance method
todoSchema.methods.findActive = function () {
    return this.model("Todo").find({ status: "active" });
};


// Static method
todoSchema.query.byLanguage = function (language) {
    return this.find({title: new RegExp(language, "gi")});
};

// Static method
todoSchema.statics.findByJs = function () {
    return this.find({title: /js/i});
};

module.exports = todoSchema;
