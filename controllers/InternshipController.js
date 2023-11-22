const FinalIntern = require("../models/FinalInternModel.js");
const { v4: uuidv4 } = require('uuid');

var Internships = require("../models/Internship.js");
const ErrorHandler = require("../utils/errorHandler.js");
const sendEmail = require("../utils/sendEmail.js");
const tryCatch = require("./utils/tryCatch.js")
// const Product = require("../models/ProductData.js")
// create new order


function generateRandomThreeCharacterString() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < 3; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}


exports.newInternship = tryCatch(async (req, res, next) => {
    // const {Email} = req.body;
    const intern = await Internships.findOne({
        user: req.user._id
      });
      
    if(intern)
      return next(new ErrorHandler("You have an active Internship", 404))
  
    // Generate a random UUID
    const uniqueId = uuidv4();

    // console.log(uniqueId);
    
    
    const randomString = generateRandomThreeCharacterString();

    // console.log(randomString);
    req.body.user = req.user.id;
    req.body.InternshipId = uniqueId +'-' + randomString;
    const internship = await Internships.create(req.body) 

    // await sendEmail({
    //   email: [Email],
    //   subject: "Thank you for apply",
    //   message: "Your have applied for web dev internship."
    // })
    res.status(201).json({ success: true, internship });
})



// get my all finished internship -- user
exports.myInternships = tryCatch(async (req, res, next) => {

    const interns = await FinalIntern.find({ user: req.user._id })
    if(interns.length === 0)
    return next(new ErrorHandler("You don't have any completeed Internship", 404))


    res.status(200).json({ success: true, interns })
})

// get my active Internships -- user
exports.myActiveInternship = tryCatch(async (req, res, next) => {
    const internship = await Internships.findOne({ user: req.user._id })
    // console.log('hh')

    if(!internship)
    return next(new ErrorHandler("You don't have any active Internship", 404))

    var isIntern = true;
    if(!internship)
        isIntern = false;
    res.status(200).json({ success: true, isIntern, internship })
})


// get all internship for user -- user

// exports.getMyAllInternship = tryCatch(async (req, res, next) => {
//   const interns = await Internships.find({ user: req.user._id })
//   console.log('hh')

//   const currentDate = new Date();
//   console.log(currentDate)
//   const targetDate = new Date(currentDate);
//   targetDate.setMonth(currentDate.getMonth() - 1);
//   targetDate.setDate(currentDate.getDate() - 15);

//   console.log("target date", targetDate)


//   const internships = interns.filter(intern => {
//       console.log("comparison date",intern.createdAt)
//       return new Date(intern.createdAt) < targetDate;
//     });
//   //   if(filteredInternships.length !== 0){
//   //     //   console.log(filteredInternships)
//   //       return next(new ErrorHandler("Intership cool down time", 401))
//   //   }

//   res.status(200).json({ success: true, internships })
// })


exports.uploadMyTaskPayment = tryCatch(async(req, res, next)=>{
    const {id, link, paymentDetails} = req.body;
    
    // console.log(id)
    
    const internship = await Internships.findById(id);
    if(!internship)
      return next(new ErrorHandler("Internship not found", 404))
    internship.TaskLink = link;
    internship.Payment = paymentDetails;
    internship.status = 2;
    await internship.save({validateBeforeSave: false});

    res.status(200).json({
      success : true,
      message : "Your Task has been submitted Thankyou."
    })
})
// get all internship for admin -- admin
exports.getAllInternships = tryCatch(async (req, res, next) => {
    const interns = await FinalIntern.find()
    res.status(200).json({ success: true, interns })
})

// get all unapproved internship -- admin
exports.getAllUnApprovedInternships = tryCatch(async (req, res, next)=>{
    const interns = await Internships.find({ status: { $eq: 0 } })
    res.status(200).json({success: true, interns})
})
// get all active internship -- admin
exports.getAllActiveInternships = tryCatch(async (req, res, next)=>{
    const interns = await Internships.find({ status: { $eq:  1} })
    res.status(200).json({success: true, interns})
})
// get all semi active internship -- admin
exports.getAllSemiActiveInternships = tryCatch(async (req, res, next)=>{
    const interns = await Internships.find({ status: { $eq:  2} })
    res.status(200).json({success: true, interns})
})


// update internship -- admin 
exports.updateInternDate = tryCatch(async (req, res, next) => {
    const intern = await Internships.findOne({InternshipId: req.params.id})
    // console.log(req.body)
    intern.status = 1
    
      intern.startDate = Date.now()
      var future = new Date();
      future.setDate(future.getDate() + 30);
      intern.finishedDate = future
    
   
    await intern.save({ validateBeforeSave: false });
    

    res.status(200).json({ success: true })
})


exports.updateInternStatusToFinal = tryCatch(async (req, res, next)=>{
    const interns = await Internships.findOne({InternshipId: req.params.id})
    // console.log(req.body)
    if(!interns)
      return next(new ErrorHandler("Internship Not fount ", 404))
    interns.status = 3
    
    const {Fname, Lname, Email, Gender, Institute, Course, Branch, Mobile, LinkedIn, GitHub, Project, Level, InternshipId, user, status, startDate, finishedDate, Field, TaskLink, Payment, createdAt} = interns

    const newIntern = await FinalIntern.create({Fname, Lname, Email, Gender, Institute, Course, Branch, Mobile, LinkedIn, GitHub, Project, Level, InternshipId, user, status, startDate, finishedDate, Field, TaskLink, Payment, createdAt});

    if(!newIntern){
      return next(new ErrorHandler("Internship counld not updated, Please Update again", 304))
    }

    await Internships.findOneAndDelete({InternshipId: req.params.id});


    res.status(200).json({success: true,})
})

// get all finished internships -- admin
exports.getAllFinalInternships = tryCatch(async (req, res, next) => {
  const interns = await FinalIntern.find({InternshipId: req.params.id})
  res.status(200).json({ success: true, interns })
})

exports.getSingleInternship = tryCatch(async (req, res, next) => {
  const intern = await Internships.findOne({InternshipId: req.params.id})
  res.status(200).json({ success: true, intern })
})


// VERIFY CERTIFICATE
exports.verifyInternship = tryCatch(async (req, res, next)=>{
  console.log(req.params.id)
  const internDetail = await FinalIntern.findOne({InternshipId: req.params.id})
  console.log(internDetail)
  // console.log("hello")
  if(!internDetail){
    return next(new ErrorHandler("Sorry, It is not a valid Certificate Id", 400))
  }

  res.status(200).json({success: true, internDetail})
})