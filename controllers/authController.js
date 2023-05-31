// import { validationResult } from 'express-validator';
import userModel from '../models/userModel.js';
import { comparePassword, hashPassword } from '../helpers/authHelper.js';
import JWT from 'jsonwebtoken';
import orderModel from '../models/orederModel.js';

//register  POST
export const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address, answer } = req.body;

        //validation
        if (!name) { return res.send({ success: false, message: "name is required!" }) }
        if (!email) { return res.send({ success: false, message: "email is required!" }) }
        if (!password) { return res.send({ success: false, message: "password is required!" }) }
        if (!phone) { return res.send({ success: false, message: "phone nmumber is required!" }) }
        if (!address) { return res.send({ success: false, message: "address is required!" }) }
        if (!answer) { return res.send({ success: false, message: "Answer is required!" }) }
        // const errors = validationResult(req);
        // if (!errors.isEmpty()) {
        //     return res.status(400).send({ errors: errors.array() });
        // }


        //check user
        let exisitinguser = await userModel.findOne({ email });
        //existing user 
        if (exisitinguser) {
            return res.status(404).send({ success: false, message: "User is Already Registerd, Please Login!" })
        }
        //register user
        const hashedPassword = await hashPassword(password);
        //save
        const user = await new userModel({ name, email, phone, address, password: hashedPassword, answer }).save();
        res.status(201).send({
            success: true,
            message: "User Registerd Successfully!",
            user
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "error in Registration",
            error
        });
    }
};

// POST Login
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        //validation
        if (!email || !password) {
            return res.status(401).send({
                success: false,
                message: "Invalid email or password"
            })
        }
        //check user
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(401).send({
                success: false,
                message: "Email is not register",
            })
        }
        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(401).send({
                success: false,
                message: "Invalid email or password",
            })
        }
        //token 
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.status(200).send({
            success: true,
            message: "Login Successfully !",
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
            },
            token
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "error in Login",
            error
        });
    }
};

//test controller
export const testController = (req, res) => {
    try { res.send({ test: 'protected routes' }); }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Internal Server Error",
            error
        });
    }
}


//forgotPasswordController
export const forgotPasswordController = async (req, res) => {
    try {
        const { email, answer, newPassword } = req.body;
        if (!email) {
            res.status(401).send({
                message: "email is Required!",
                success: false
            })
        }
        if (!answer) {
            res.status(401).send({
                message: "answer is Required!",
                success: false
            })
        }
        if (!newPassword) {
            res.status(401).send({
                message: "new password is Required!",
                success: false
            })
        }

        //check

        const user = await userModel.findOne({ email, answer })
        //validation
        if (!user) {
            res.status(401).send({
                message: "Wrong Email or Answer!",
                success: false
            })
        }

        const hashed = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id, { password: hashed });
        res.status(200).send({
            success: true,
            message: "Password reset SuccessFully!",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Internal Server Error",
            error
        });
    }
}
//update prfole
export const updateProfileController = async (req, res) => {
    try {
        const { name, email, password, address, phone } = req.body;
        const user = await userModel.findById(req.user._id);
        //password
        if (password && password.length < 4) {
            return res.json({ error: "Passsword is required and 6 character long" });
        }
        const hashedPassword = password ? await hashPassword(password) : undefined;
        const updatedUser = await userModel.findByIdAndUpdate(
            req.user._id,
            {
                name: name || user.name,
                password: hashedPassword || user.password,
                phone: phone || user.phone,
                address: address || user.address,
            },
            { new: true }
        );
        res.status(200).send({
            success: true,
            message: "Profile Updated SUccessfully",
            updatedUser,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error WHile Update profile",
            error,
        });
    }
};

// get all orders
export const getOrdersController = async (req, res) => {
    try {
        const orders = await orderModel
            .find({ buyer: req.user._id })
            .populate("products", "-photo")
            .populate("buyer", "name");
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error WHile Geting Orders",
            error,
        });
    }
};

//orders
export const getAllOrdersController = async (req, res) => {
    try {
        const orders = await orderModel
            .find({})
            .populate("products", "-photo")
            .populate("buyer", "name")
            .sort({ createdAt: "-1" });
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error WHile Geting Orders",
            error,
        });
    }
};

//order status
export const orderStatusController = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const orders = await orderModel.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error While Updateing Order",
            error,
        });
    }
};