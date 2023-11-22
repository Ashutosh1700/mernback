const ErrorHandler = require("../utils/errorHandler.js");
const jwt = require("jsonwebtoken");
const tryCatch = require("./utils/tryCatch.js");
const sendToken = require("../utils/jwtToken.js");
const User = require("../models/UserModel.js");
const cloudinary = require("cloudinary");
const sendEmail = require("../utils/sendEmail.js");
const crypto = require("crypto")

exports.registerUser = tryCatch(async (req, res, next) => {
  // console.log(req.body)
  
  const { name, email, password } = req.body;
  // console.log(name, email, password)
  const user = await User.create({
    name,
    email,
    password,
  });


  await sendEmail({
    email: [email],
    subject: "Thank you for Register",
    message: "Your have applied for web dev internship."
  })

  sendToken(user, 201, res);
});

exports.loginUser = tryCatch(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendToken(user, 200, res);
});

exports.logOut = tryCatch(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({ success: true, message: "Logged Out" });
});

// forget password

exports.forgotPassword = tryCatch(async (req, res, next)=>{
  const user = await User.findOne({email: req.body.email});
  if(!user){
    return next(new ErrorHandler("User not found" , 404))
  }

  // get resetpassword token
  const resetToken = user.getResetPasswordToken();
  await user.save({validateBeforeSave: false});

  const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`

  console.log(resetPasswordUrl)
  const messages = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n If you not requested this email then, please ignore it tlnfldsjf.`

  try{
    await sendEmail({
      email: user.email,
      subject: `SpriteEra password Recovery`,
      message: messages,
    })
    res.status(200).json({
      success: true,
      message: `Email sent to ${req.body.email}`
    })
  }catch(error){
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({validateBeforeSave: false})

    return next(new ErrorHandler(error.message, 500))
  }


})

//reset password;

exports.resetPassword = tryCatch(async(req, res, next)=>{
 // creating token hash
 const resetPasswordToken = crypto
 .createHash("sha256")
 .update(req.params.token)
 .digest("hex");

const user = await User.findOne({
 resetPasswordToken,
 resetPasswordExpire: { $gt: Date.now() },
});

if (!user) {
 return next(
   new ErrorHandler(
     "Reset Password Token is invalid or has been expired",
     400
   )
 );
}

if (req.body.password !== req.body.confirmPassword) {
 return next(new ErrorHandler("Password does not matched", 400));
}

user.password = req.body.password;
user.resetPasswordToken = undefined;
user.resetPasswordExpire = undefined;

await user.save();

sendToken(user, 200, res);
})

// get user details

exports.getUserDetails = tryCatch(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, user });
});

// change password

exports.updatePassword = tryCatch(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }
  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }
  user.password = req.body.newPassword;
  await user.save();
  sendToken(user, 200, res);
});

//update profile of user

exports.updateProfile = tryCatch(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  // if (req.body.avatar !== "" && req.body.avatar !== "undefined") {
  //   const user = await User.findById(req.user.id);

  //   const imageId = user.avatar.public_id;

  //   await cloudinary.v2.uploader.destroy(imageId);

  //   const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
  //     folder: "avatars",
  //     width: 150,
  //     crop: "scale",
  //   });

  //   newUserData.avatar = {
  //     public_id: myCloud.public_id,
  //     url: myCloud.secure_url,
  //   };
  // }

  console.log(req.body.profile)

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// update profile image
exports.updateProfileImage = tryCatch(async (req, res, next) => {
  const newUserData = {
    profile: req.body.profile,
  };

  
  console.log(req.body.profile)

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});


// to get all users (admin)

exports.getAllUsers = tryCatch(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({ success: true, users });
});

// to get single user (admin)

exports.getSingleUser = tryCatch(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id ${req.params.id}`)
    );
  }
  res.status(200).json({ success: true, user });
});
// get user by email
exports.getUser = tryCatch(async (req, res, next) => {
  const user = await User.findOne({email: req.body.email});
  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id ${req.params.id}`)
    );
  }
  res.status(200).json({ success: true, user });
});
// update user role -- Admin

exports.updateUserRole = tryCatch(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };
  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({ success: true });
});

// delete user -- Admin

exports.deleteUser = tryCatch(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id : ${req.params.id}`)
    );
  }
  const imageId = user.avatar.public_id;

  await cloudinary.v2.uploader.destroy(imageId);
  await User.deleteOne(user);
  res.status(200).json({ success: true, message: "User deleted successfully" });
});
