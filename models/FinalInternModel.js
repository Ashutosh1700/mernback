const mongoose = require("mongoose")
const validator = require("validator")

const InternshipSchema = new mongoose.Schema({
    Fname: {
        type: String,
    },
    Lname: {
        type: String,
    },
    Email: {
        type: String,
    },
    Gender: {
        type: String,
    },
    
    Institute: {
        type: String,
    },
    Course: {
        type: String,
    },
    Branch: {
        type: String,
    },
    Mobile: {
        type: Number,
    },
    LinkedIn: {
        type: String,
    },
    GitHub: {
        type: String,
    },
    Project: {
        type: String,
        
    },
    Level: {
        type: String,
        
    },
    InternshipId: {
        type: String,
    },

    user: {
        type: mongoose.Schema.ObjectId,
    },
    status: {
        type: Number,
        default: 0,
    },
    startDate:{
        type: Date,
        default: null,
    },
    finishedDate: {
        type: Date,
        default: null,
    },
    Field: {
        type: Number,
    },
    TaskLink:{
        type: Array,
        default: [],
    },
    Payment:{
        type: Array,
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    
})

module.exports = mongoose.model('FinalInternships', InternshipSchema);