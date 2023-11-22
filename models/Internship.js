const mongoose = require("mongoose")
const validator = require("validator")

const InternshipSchema = new mongoose.Schema({
    Fname: {
        type: String,
        required: [true, 'Please Enter your First Name'],
    },
    Lname: {
        type: String,
        require: [true, 'Please Enter your Last Name'],
    },
    Email: {
        type: String,
        required: [true, 'Please Enter your Email'],
        validate: [validator.isEmail, "Please Enter a valid Email"]
    },
    Gender: {
        type: String,
        required: [true, 'Please Chose your Gender'],
    },
    
    Institute: {
        type: String,
        required: [true, 'Please Enter you College Name'],
    },
    Course: {
        type: String,
        required: [true, 'Please Chose your Course'],
    },
    Branch: {
        type: String,
        required: [true, 'Please Enter your Branch'],
    },
    Mobile: {
        type: Number,
        required: [true, 'Please Enter your Contact Number'],
        maxLength: [10, 'Number should have maximun 10 digit'],
        minLength: [10, "Number should have maximun 10 digit"]
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
        ref: "User",
        required: true,
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

module.exports = mongoose.model('Internships', InternshipSchema);