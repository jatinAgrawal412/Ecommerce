import express from 'express';
import { isAdmin, requireSignIn } from '../middelwares/authMiddelware.js';
import { createProductController, deleteProductController, getProductController, getSingleProductController, productPhotoController, updateProductController, productCountController, productListController, productFiltersController, searchProductController, relatedProductController, productCategoryController, braintreeTokenController, brainTreePaymentController } from '../controllers/productController.js';
import formidable from 'express-formidable'

const router = express.Router();

//routes
router.post('/create-product', requireSignIn, isAdmin, formidable(), createProductController);

//get product
router.get('/get-product', getProductController);

//single product
router.get('/get-product/:slug', getSingleProductController);

//get Photo
router.get('/product-photo/:pid', productPhotoController);

//delete product
router.delete('/delete-product/:pid', deleteProductController);

//update product
router.put('/update-product/:pid', requireSignIn, isAdmin, formidable(), updateProductController);

//filter product
router.post('/product-filters', productFiltersController);

//product count
router.get('/product-count', productCountController);

//product per count
router.get('/product-list/:page', productListController);

//product per count
router.get('/search/:keyword', searchProductController);

//similar product
router.get('/related-product/:pid/:cid', relatedProductController);

//category wise product
router.get('/product-category/:slug', productCategoryController);

//payments routes
//token
router.get('/braintree/token', braintreeTokenController);

//payments
router.post('/braintree/payment', requireSignIn, brainTreePaymentController);


export default router;