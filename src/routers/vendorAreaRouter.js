import express from "express";
const vendorAreaRouter = express.Router()
import { vendor_select_area, vendor_service_area_list, check_vendor_service_avaibility, vendor_selected_areas } from "../controllers/vendorAreaController.js";
import { admin_auth } from "../../middleware/auth.js";


vendorAreaRouter.post("/vendor_select_area", admin_auth, vendor_select_area)
vendorAreaRouter.post("/vendor_service_area_list", (req, res, next) => {
    if (req.headers.vendor_token) {
        console.log("chk------1--pass")
        admin_auth(req, res, next)
    } else {
        next()
    }
}, vendor_service_area_list)
vendorAreaRouter.post("/check_vendor_service_avaibility", check_vendor_service_avaibility)
vendorAreaRouter.get("/vendor_selected_areas", admin_auth, vendor_selected_areas)

// vendorAreaRouter.get()
// vendorAreaRouter.put()


export default vendorAreaRouter