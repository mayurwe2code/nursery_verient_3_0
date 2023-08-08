import express from "express";
import {
    orders_report
} from "../controllers/report_controller.js";
import { auth_user, fetch_user, admin_auth } from '../../middleware/auth.js'
const reportRouter = express.Router();
reportRouter.post("/orders_report", admin_auth, orders_report);
export default reportRouter;


// SELECT vendor_id, ROUND(SUM(only_this_order_product_total),2) AS total_amount,COUNT(order_id) AS total_deliverd_order ,COUNT(only_this_order_product_quantity) AS total_deliverd_products,ROUND(SUM(only_this_product_gst),2) AS total_gst,ROUND(SUM(only_this_product_cgst),2) AS total_cgst,ROUND(SUM(only_this_product_sgst),2)AS total_sgst FROM `order` GROUP BY vendor_id;