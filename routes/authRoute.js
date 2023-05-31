import express from "express";
import { forgotPasswordController, loginController, registerController, testController, updateProfileController, getOrdersController, getAllOrdersController, orderStatusController } from "../controllers/authController.js"
import { isAdmin, requireSignIn } from "../middelwares/authMiddelware.js";
// import { body } from 'express-validator';
const router = express.Router();


//router object
//REGISTER  || method = post
router.post("/register", registerController);

//LOGIN  || method = post
router.post("/login", loginController);

//Test Routs  || method = get
router.get("/test", requireSignIn, isAdmin, testController);

//forgot password || POST 
router.post("/forgot-password", forgotPasswordController)

//proteccted user route auth
router.get("/user-auth", requireSignIn, (req, res) => {
    res.status(200).send({ ok: true });
});
//proteccted admin route auth
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ ok: true });
});

//update profile
router.put("/profile", requireSignIn, updateProfileController);

//orders
router.get("/orders", requireSignIn, getOrdersController);

//get all orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

//order status
router.put("/order-status/:orderId", requireSignIn, isAdmin, orderStatusController);

export default router;





























// router.post("/register",
//     [
//         body('name', 'Enter a valid name').isLength({ min: 3 }),
//         body('password', 'password must be atleast 5 characters').isLength({ min: 5 }),
//         body('email', 'Enter a valid email').isEmail(),
//         body('phone', 'Enter valid Phone number').isLength({ min: 10 }),
//         body('address', 'Enter valid Address').isLength({ min: 3 })
//     ], registerController);
// export default router;