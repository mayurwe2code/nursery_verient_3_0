import connection from "../../Db.js";
import { StatusCodes } from "http-status-codes";

export function orders_report(req, res) {
    console.log(req.body)
    let { from_date, to_date, vendor_id } = req.body

    let query_ = ""
    if (req.headers.vendor_token) {
        query_ += "SELECT vendor_id, ROUND(SUM(only_this_order_product_total),2) AS total_amount,COUNT(order_id) AS total_deliverd_order ,SUM(only_this_order_product_quantity) AS total_deliverd_products,ROUND(SUM(only_this_product_gst),2) AS total_gst,ROUND(SUM(only_this_product_cgst),2) AS total_cgst,ROUND(SUM(only_this_product_sgst),2)AS total_sgst ,ROUND(SUM(discount_coupon_value),2)AS total_discount_by_coupan,ROUND(SUM(total_discount),2)AS total_discount,ROUND(SUM(shipping_charges),2) AS total_shipping_charges, ROUND(SUM(admin_commission_parcent),2) AS total_admin_commission_parcent,ROUND(SUM(Price_after_removing_admin_commission),2) AS total_Price_after_removing_admin_commission,ROUND(SUM(admin_commission_amount),2) AS total_admin_commission_amount FROM `order` WHERE status_order = 'Delivered' AND vendor_id = '" + req.vendor_id + "' AND "
    }
    // admin_commission_parcent,Price_after_removing_admin_commission	,admin_commission_amount
    if (req.headers.admin_token) {
        query_ += "SELECT vendor_id, ROUND(SUM(only_this_order_product_total),2) AS total_amount,COUNT(order_id) AS total_deliverd_order ,SUM(only_this_order_product_quantity) AS total_deliverd_products,ROUND(SUM(only_this_product_gst),2) AS total_gst,ROUND(SUM(only_this_product_cgst),2) AS total_cgst,ROUND(SUM(only_this_product_sgst),2)AS total_sgst ,ROUND(SUM(discount_coupon_value),2)AS total_discount_by_coupan,ROUND(SUM(total_discount),2)AS total_discount,ROUND(SUM(shipping_charges),2) AS total_shipping_charges , ROUND(SUM(admin_commission_parcent),2) AS total_admin_commission_parcent,ROUND(SUM(Price_after_removing_admin_commission),2) AS total_Price_after_removing_admin_commission,ROUND(SUM(admin_commission_amount),2) AS total_admin_commission_amount FROM `order` WHERE status_order = 'Delivered' AND "
        if (vendor_id) { query_ += "vendor_id = '" + vendor_id + "' AND " }
    }

    if (from_date && to_date) {
        query_ += '`order`.updated_on BETWEEN "' + from_date + ' 12:00:00" AND "' + to_date + ' 23:59:00"'
    } else {
        var today = new Date();
        var thirtyDaysAgo = new Date(today);
        to_date = today.toISOString().slice(0, 19).replace("T", " ");
        thirtyDaysAgo.setDate(today.getDate() - 30);
        from_date = thirtyDaysAgo.toISOString().slice(0, 19).replace("T", " ");
        query_ += "(`order`.updated_on BETWEEN '" + from_date + "' AND '" + to_date + "')"
    }
    console.log(query_)
    // res.json(query_)
    connection.query(
        query_ + " GROUP BY vendor_id ",
        (err, rows) => {
            if (err) {
                console.log(err)
                res
                    .status(200)
                    .json({ status: false, res_msg: "something went wrong" });
            } else {
                res.status(200).json({ status: true, res_msg: "ok", response: rows });
            }
        }
    );
    // SELECT vendor_id, ROUND(SUM(only_this_order_product_total),2) AS total_amount,COUNT(order_id) AS total_deliverd_order ,COUNT(only_this_order_product_quantity) AS total_deliverd_products,ROUND(SUM(only_this_product_gst),2) AS total_gst,ROUND(SUM(only_this_product_cgst),2) AS total_cgst,ROUND(SUM(only_this_product_sgst),2)AS total_sgst FROM `order` GROUP BY vendor_id;
}