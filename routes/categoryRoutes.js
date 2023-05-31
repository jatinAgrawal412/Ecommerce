import express from 'express';
import { isAdmin, requireSignIn } from '../middelwares/authMiddelware.js';
import { categoryControlller, createCategoryController, deleteCategoryCOntroller, singleCategoryController, updateCategoryController } from '../controllers/categoryController.js';

const router = express.Router();

//routes
//create category
router.post('/create-category', requireSignIn, isAdmin, createCategoryController);

//update Category
router.put('/update-category/:id', requireSignIn, isAdmin, updateCategoryController);

//get All categorys
router.get('/get-category', categoryControlller);

//single categorys
router.get('/single-category/:slug', singleCategoryController);

//delete categorys
router.delete('/delete-category/:id', deleteCategoryCOntroller);

export default router;