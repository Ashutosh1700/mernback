const mongoose = require("mongoose")
const validator = require("validator")
const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please Enter your Name'],
        maxLength: [30, 'Name cannot exceed 30 characters'],
        minLength: [4, "Name should have more than 4 characters"]
    },
    email: {
        type: String,
        required: [true, "Please Enter your email"],
        validate: [validator.isEmail, "Please Enter a valid Email",]
    },
    contactNo: {
        type: String,
        required: [true, "Please Enter your Contact Number"],
    },
    companyVision: {
        type: String,
        required: [true, "Please Enter your Company Vision"]
    },
    projectType: {
        type: String,
        required: [true, "Please choose one of project Type"]
    },
    TypeOf: {
        type: String,
        required: [true, "Please choose one of type of project"]
    },
    description: {
        type: String,
        required: [true, "Please write some description"],
        maxLength: [300, 'Description cannot exceed 30 characters'],
        minLength: [5, "Description should have more than 4 characters"]
    },
})

module.exports = mongoose.model('ClientQuery', clientSchema)