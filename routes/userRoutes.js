const { Router } = require("express")
const { deleteUser, getAllUsers, getSingleUser, getUserDetails, logOut, loginUser, registerUser, updatePassword, updateProfile, updateUserRole, getUser, forgotPassword, resetPassword, updateProfileImage } = require("../controllers/userController.js")
const { authorizeroles, isAuthentication } = require("../middleware/authentication.js")





const UserRouters = Router();

UserRouters.post('/register', registerUser);

UserRouters.post('/login', loginUser);

// UserRouters.post('/password/forgot', forgotPassword)

UserRouters.get('/logout', logOut)

UserRouters.get('/me', isAuthentication, getUserDetails)

UserRouters.put('/password/update', isAuthentication, updatePassword)

UserRouters.post('/password/forgot', forgotPassword)
UserRouters.put('/password/reset/:token', resetPassword)

UserRouters.put('/me/update', isAuthentication, updateProfile)
UserRouters.put('/me/updateProfileimage', isAuthentication, updateProfileImage)

UserRouters.get('/admin/users', isAuthentication, authorizeroles("admin"), getAllUsers)

UserRouters.get('/admin/user/:id', isAuthentication, authorizeroles("admin"), getSingleUser)

UserRouters.get('/admin/user', isAuthentication, authorizeroles("admin"), getUser)

UserRouters.put('/admin/userUpdate/:id', isAuthentication, authorizeroles("admin"), updateUserRole)

UserRouters.delete('/admin/user/:id', isAuthentication, authorizeroles("admin"), deleteUser)


// //to delete product
// productRouters.delete('/product/:id', deleteProduct)

// //to get detils of a product
// productRouters.get('/product/:id', productDetails)

module.exports = UserRouters 