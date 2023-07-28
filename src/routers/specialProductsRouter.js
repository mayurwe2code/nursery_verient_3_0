import express from "express";
const specialProductsRouter = express.Router()
import { trending_products, add_fetured_product } from "../controllers/specialProductsController.js";
// import { admin_auth } from "../../middleware/auth.js";
import { admin_auth, fetch_user } from '../../middleware/auth.js'



specialProductsRouter.post("/trending_products", fetch_user, trending_products)
specialProductsRouter.post("/add_fetured_product", add_fetured_product)

// specialProductsRouter.post("/vendor_service_area_list", vendor_service_area_list)
// specialProductsRouter.post("/check_vendor_service_avaibility", check_vendor_service_avaibility)

// vendorAreaRouter.get()
// vendorAreaRouter.put()


export default specialProductsRouter