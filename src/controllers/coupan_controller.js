import connection from "../../Db.js";
import { StatusCodes } from "http-status-codes";


export async function coupan_verify(req, res) {
    let { coupan_code, vendor_id } = req.body
    connection.query("SELECT * FROM `used_coupan_by_users` WHERE `coupan_code` = '" + coupan_code + "' AND `user_id` = '" + req.user_id + "'",
        (err, coupan_check) => {
            if (err) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "res_msg": "find error", "success": false });
            } else {
                if (coupan_check != "") {
                    res.status(200).json({ "res_msg": "coupan alrady used", "success": false });
                } else {
                    const curr_date = new Date().toISOString().slice(0, 19).replace("T", " ");
                    connection.query("SELECT * FROM `coupons` where start_date <='" + curr_date + "' AND end_date >='" + curr_date + "' AND code ='" + coupan_code + "' AND is_active = '1' ", (err, rows) => {
                        if (err) {
                            console.log(err)
                            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "response": "find error", "status": false });
                        } else {
                            if (rows != "") {
                                console.log("coupan-------data--------")
                                console.log(rows)
                                let { coupan_code, vendor_id } = req.body

                                connection.query('select cart.id,user_id,cart.product_id AS cart_product_id ,cart.product_verient_id AS cart_product_verient_id ,cart_product_quantity,cart.created_on AS cart_created_on,cart.updated_on AS cart_updated_on,product_view.*, (SELECT owner_name FROM `vendor` where vendor.vendor_id = product_view.vendor_id) AS owner_name from cart,product_view where cart.product_verient_id = product_view.product_verient_id AND user_id="' + req.user_id + '" AND verient_is_deleted="0" AND product_view.vendor_id = "' + vendor_id + '"', (err, results) => {
                                    if (err) {
                                        console.log(err)
                                        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "res_msg": "find error", "success": false });
                                    } else {
                                        if (results != []) {
                                            let products = [];
                                            let total_gst = 0, sub_total = 0, total_mrp = 0, total_discount = 0, total_delivery_charge = 0, coupan_discount = 0, coupan_discount_price = 0;
                                            let price_x_cart_qty = 0, mrp_x_cart_qty = 0, gst_amount = 0, discount_amount = 0;
                                            results.forEach((element, index) => {
                                                price_x_cart_qty = element["price"] * element["cart_product_quantity"]
                                                mrp_x_cart_qty = element["mrp"] * element["cart_product_quantity"]
                                                gst_amount = price_x_cart_qty * element["gst"] / 100
                                                discount_amount = mrp_x_cart_qty * element["discount"] / 100

                                                element["price_x_cart_qty"] = price_x_cart_qty
                                                element["mrp_x_cart_qty"] = mrp_x_cart_qty
                                                element["cart_gst_amount"] = gst_amount
                                                element["cart_discount_amount"] = discount_amount
                                                total_gst += gst_amount
                                                sub_total += price_x_cart_qty
                                                total_mrp += mrp_x_cart_qty
                                                total_discount += discount_amount
                                                total_delivery_charge = 100
                                                products.push(element)
                                                if (index == results.length - 1) {
                                                    coupan_discount = sub_total * rows[0]["percentage"] / 100
                                                    coupan_discount_price = sub_total - coupan_discount

                                                    if (rows[0]["minimum_amount"] <= sub_total && sub_total <= rows[0]["maximum_amount"]) {
                                                        res.status(200).json({ status: true, response: { products, coupan_price: { total_gst, sub_total, total_mrp, total_discount, total_delivery_charge, coupan_discount, coupan_discount_price } } })
                                                    } else {
                                                        res.status(200).json({ "status": true, "res_msg": "coupan use for beetween (minmum:" + rows[0]["minimum_amount"] + " and maximum:" + rows[0]["maximum_amount"] + ") amount order " })
                                                    }

                                                }
                                            });
                                        } else {
                                            res.status(200).json({ "res_msg": "not data found", "status": false });
                                        }

                                    }
                                });
                            } else {
                                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "res_msg": "invalid coupan", "status": false });
                            }
                        }
                    });

                }
            }
        })
}


export function add_coupan(req, res) {
    console.log(req.body)
    let { campaign_name, code, product_type, start_date, end_date, minimum_amount, maximum_amount, percentage, status, image } = req.body
    if (campaign_name, code, product_type, start_date, end_date, minimum_amount, maximum_amount, percentage) {
        try {
            var srt_values = `"${req.protocol + "://" + req.headers.host}/coupan_images/${req.files["image"][0]["filename"]}"`
        } catch (e) {
            var srt_values = ``
        }

        connection.query(`INSERT INTO \`coupons\`(\`campaign_name\`, \`code\`, \`product_type\`, \`start_date\`, \`end_date\`, \`minimum_amount\`, \`maximum_amount\`, \`percentage\`, \`image\`) VALUES ('${campaign_name}','${code}','${product_type}','${start_date}','${end_date}','${minimum_amount}','${maximum_amount}','${percentage}','${srt_values}')`, (err, rows) => {
            if (err) {
                console.log(err)
                if (err["code"] == "ER_DUP_ENTRY") {
                    res.status(200).json({ "response": "coupan code already exists", "status": false });
                } else {
                    res.status(200).json({ "response": "find error", "status": false });
                }
            } else {
                res.status(200).json({ "response": "added coupan succefull ", "status": true });
            }
        })
    } else {
        res.status(200).json({ "response": "please fill all feilds", "status": false });

    }
}

export function update_coupan(req, res) {
    console.log(req.body)
    let obj_req = req.body
    let obj_req_length = Object.keys(obj_req).length
    let query_ = `UPDATE \`coupons\` SET  `
    let count = 1;

    for (let k in obj_req) {
        if (["product_type", "start_date", "end_date", "minimum_amount", "maximum_amount", "percentage", "status", "is_active"].includes(k)) {
            console.log(count + "==" + obj_req_length)
            if (count == obj_req_length) {
                try {
                    query_ += ` image = "${req.protocol + "://" + req.headers.host}/coupan_images/${req.files["image"][0]["filename"]}" , `
                    query_ += ` \`${k}\` = '${obj_req[k]}' where id ='${req.body.id}' `
                } catch (e) {
                    query_ += ` \`${k}\` = '${obj_req[k]}' where id ='${req.body.id}' `
                }

            } else {
                query_ += ` \`${k}\` = '${obj_req[k]}' , `
            }
        }
        count++
    }
    // res.send(query_)
    // return false
    console.log(query_)
    connection.query(query_, (err, rows) => {
        if (err) {
            console.log(err)
            res.status(200).json({ "response": "find error", "status": false });
        } else {
            console.log(rows)
            if (rows["changedRows"] > 0) {
                res.status(200).json({ "response": "coupan updated succefully ", "status": true });
            } else {
                res.status(200).json({ "response": "error find or no new changes", "status": false });
            }
        }
    })

}

export function coupan_list(req, res) {
    let { search } = req.body
    let query_ = ""
    if (search) {
        query_ = `SELECT * FROM \`coupons\` WHERE \`code\` LIKE '%${search}%' OR \`campaign_name\` LIKE '%${search}%' ORDER BY updated_on DESC `;
    } else {
        query_ = "SELECT * FROM `coupons` ORDER BY updated_on DESC"
    }
    connection.query(query_, (err, rows) => {
        if (err) {
            console.log(err)
            res.status(200).json({ "response": "find error", "status": false });
        } else {
            res.status(200).json({ "status": true, "response": rows, });
        }
    })
}