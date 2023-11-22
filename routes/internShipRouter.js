const { Router } = require("express")

const { authorizeroles, isAuthentication } = require("../middleware/authentication.js");
const { newInternship, myInternships, getAllInternships, getAllUnApprovedInternships, updateInternDate,  uploadMyTaskPayment, getAllActiveInternships, getAllSemiActiveInternships, getAllFinalInternships, updateInternStatusToFinal, getSingleInternship, myActiveInternship, verifyInternship} = require("../controllers/InternshipController.js");


const InternShipRouter = Router();

InternShipRouter.post('/internship/new', isAuthentication, newInternship)

InternShipRouter.get('/verify/:id', verifyInternship)

InternShipRouter.get('/myinternships', isAuthentication, myInternships )
    
InternShipRouter.get('/myActiveInternships', isAuthentication, myActiveInternship )

// InternShipRouter.get('/myinternships', isAuthentication, getMyAllInternship)   


InternShipRouter.put('/updatetaskPayment', isAuthentication, uploadMyTaskPayment)   

// InternShipRouter.get('/sendEmail', isAuthentication, sendEmailController)   



InternShipRouter.get('/admin/internships', isAuthentication,authorizeroles("admin"), getAllInternships)   

InternShipRouter.get('/admin/unapprovedinterns', isAuthentication,authorizeroles("admin"), getAllUnApprovedInternships)  

InternShipRouter.put('/admin/updateInternship/:id', isAuthentication, authorizeroles("admin"), updateInternDate)   

InternShipRouter.get('/admin/activeInternships', isAuthentication, authorizeroles("admin"), getAllActiveInternships)   

InternShipRouter.get('/admin/semiactiveInternships', isAuthentication, authorizeroles("admin"), getAllSemiActiveInternships)   



InternShipRouter.get('/admin/finalAllInternship', isAuthentication, authorizeroles("admin"), getAllFinalInternships)   

InternShipRouter.put('/admin/finalupdateInternship/:id', isAuthentication, authorizeroles("admin"), updateInternStatusToFinal)   


InternShipRouter.get('/admin/internshipDetail/:id', isAuthentication, authorizeroles("admin"), getSingleInternship)   



// InternShipRouter.get('/admin/allUsers', isAuthentication,authorizeroles("admin"), getAllUsers)   

// InternShipRouter.get('/admin/user', isAuthentication,authorizeroles("admin"), getUser)  

// InternShipRouter.delete('/admin/deleteUser/:id', isAuthentication,authorizeroles("admin"), deleteUser)   




// orderRouters.put('/admin/order/:id', isAuthentication, authorizeroles("admin"), updateOrderStatus)

// orderRouters.delete('/admin/order/:id', isAuthentication, authorizeroles("admin"), deleteOrder)

module.exports = InternShipRouter;