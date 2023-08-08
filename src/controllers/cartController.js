import connection from "../../Db.js";
import { StatusCodes } from "http-status-codes";

export async function add_to_cart(req, res) {
  console.log("----------------------wel-come-add-cart---------------------------------")
  var { product_id, product_verient_id, cart_product_quantity } = req.body;
  const check = parseInt(cart_product_quantity)
  console.log(req.body)
  console.log(check < 1)
  if (check == "0") {
    res.status(200).send({ "success": false, "response": "please cart quantity add greater then 1" })
  } else {

    connection.query("SELECT * FROM cart WHERE user_id ='" + req.user_id + "' AND product_id = '" + product_id + "' AND product_verient_id='" + product_verient_id + "'",
      (err, rows) => {
        if (err) {
          console.log("err---------------------13-----")
          console.log(err)
          res
            .status(StatusCodes.INSUFFICIENT_STORAGE)
            .json({ "success": false, "response": "something went wrong" });
        } else {
          console.log(rows + "=result====check-already-exist-or-not================")
          console.log(rows)
          if (rows != "") {
            console.log("cart-update--query-------update cart set cart_product_quantity='" + check + "' where user_id='" + req.user_id + "' AND product_id='" + product_id + "' AND product_verient_id='" + product_verient_id + "'")
            connection.query(
              "update cart set cart_product_quantity='" + check + "' where user_id='" + req.user_id + "' AND product_id='" + product_id + "' AND product_verient_id='" + product_verient_id + "'", (err, rows) => {
                if (err) {
                  console.log("err---------------------21-----")
                  console.log(err)
                  res
                    .status(StatusCodes.INTERNAL_SERVER_ERROR)
                    .json({ "response": "something went wrong", "success": false });
                } else {
                  rows.affectedRows == "1" ? res.status(200).json({ "response": "update successfull", "success": true }) : res.status(200).json({ "response": "something went wrong", "success": false })
                }
              }
            );
          } else {

            console.log("----isert-cart-query-------insert into cart (`user_id`, `product_id`,`product_verient_id`,`cart_product_quantity` )  VALUES ('" +
              req.user_id +
              "', '" +
              product_id +
              "', '" +
              product_verient_id +
              "','" +
              cart_product_quantity +
              "')")
            connection.query(
              "insert into cart (`user_id`, `product_id`,`product_verient_id`,`cart_product_quantity` )  VALUES ('" +
              req.user_id +
              "', '" +
              product_id +
              "', '" +
              product_verient_id +
              "','" +
              cart_product_quantity +
              "')",
              (err, rows) => {
                if (err) {
                  console.log("err---------------------42-----")
                  console.log(err)
                  res
                    .status(StatusCodes.INSUFFICIENT_STORAGE)
                    .json({ "success": false, "response": "something went wrong" });
                } else {
                  res.status(StatusCodes.OK).json({ "success": true, "response": "add product successfull" });
                }
              }
            );
          }
        }
      }
    );
  }

}
// (select count(*) cart where  user_id="' + req.user_id + '") AS cart_count, 
export function cart_list(req, res) {
  // var str_cart = 'select *, (SELECT GROUP_CONCAT(product_image_path) FROM product_images WHERE product_images.product_id = cart_view_1.product_id) AS all_images_url, (SELECT GROUP_CONCAT(product_image_path) FROM product_images WHERE product_images.product_id = cart_view_1.product_id AND image_position = "cover" group by product_images.product_id) AS cover_image from cart_view_1 where user_id="' + req.user_id + '"'

  var str_cart = 'select cart.id,user_id,cart.product_id AS cart_product_id ,cart.product_verient_id AS cart_product_verient_id ,cart_product_quantity,cart.created_on AS cart_created_on,cart.updated_on AS cart_updated_on,product_view.*, (SELECT owner_name FROM `vendor` where vendor.vendor_id = product_view.vendor_id) AS owner_name,(SELECT id FROM wishlist WHERE wishlist.product_verient_id = product_view.product_verient_id AND user_id = "' + req.user_id + '") AS wishlist from cart,product_view where cart.product_verient_id = product_view.product_verient_id AND user_id="' + req.user_id + '" AND verient_is_deleted="0"'

  console.log("---------cartlist-------" + str_cart)
  connection.query(str_cart, (err, rows) => {
    if (err) {
      console.log("err---------------------63-----")
      console.log(err)
      res
        .status(200)
        .json({ message: "something went wrong" });
    } else {
      console.log(err)
      var vendor_id_chk = [];
      var result_res = [];
      var total_gst = 0;
      var sub_total = 0;
      var total_discount = 0;
      var total_delivery_charge = 0;
      try {
        if (rows.length) {
          rows.forEach((item, index) => {
            if (vendor_id_chk.includes(item["vendor_id"])) {

            } else {
              total_delivery_charge += 100
              var obje = { owner_name: item["owner_name"], vendor_id: item["vendor_id"], "cart_products": [] }
              rows.forEach((element, counts) => {
                if (item["vendor_id"] === element["vendor_id"]) {
                  //new--------------------
                  let price_x_cart_qty = element["price"] * element["cart_product_quantity"]
                  let mrp_x_cart_qty = element["mrp"] * element["cart_product_quantity"]
                  var gst_amount = price_x_cart_qty * element["gst"] / 100
                  var discount_amount = mrp_x_cart_qty * element["discount"] / 100

                  // var gst_amount = element["price"] / element["gst"]
                  // var discount_amount = element["mrp"] / element["discount"]
                  element["price_x_cart_qty"] = price_x_cart_qty;
                  element["mrp_x_cart_qty"] = mrp_x_cart_qty
                  element["gst_amount"] = gst_amount;
                  element["discount_amount"] = discount_amount
                  total_gst += gst_amount
                  total_discount += discount_amount
                  sub_total += price_x_cart_qty

                  obje["cart_products"].push(element)
                }
                if (counts == rows.length - 1) {
                  result_res.push(obje)
                }
              });
              vendor_id_chk.push(item["vendor_id"])
            }
            if (index == rows.length - 1) {
              console.log(result_res);
              res.status(StatusCodes.OK).json({ status: true, response: result_res, total_gst, sub_total, total_discount, total_delivery_charge });
            }



            // if (vendor_id_chk.includes(item["vendor_id"])) {
            //   var gst_amount = item["price"] / item["gst"]
            //   var discount_amount = item["mrp"] / item["discount"]
            //   item["gst_amount"] = gst_amount
            //   item["discount_amount"] = discount_amount
            //   result_res[item["vendor_id"]].push(item)
            // } else {
            //   var gst_amount = item["price"] / item["gst"]
            //   var discount_amount = item["mrp"] / item["discount"]
            //   item["gst_amount"] = gst_amount
            //   item["discount_amount"] = discount_amount
            //   result_res[item["vendor_id"]] = []
            //   result_res[item["vendor_id"]].push(item)
            //   vendor_id_chk.push(item["vendor_id"])
            // }
            // if (index == rows.length - 1) { console.log(result_res); res.status(StatusCodes.OK).json({ status: true, response: result_res }); }
          });
        } else {
          res.status(StatusCodes.OK).json({ status: false, response: [] })
        }

      } catch (e) {
        console.log(e)
        res.status(StatusCodes.OK).json({ status: false, response: result_res })
      }

    }
  });
}

export async function cartById(req, res) {
  const id = req.params.id;
  connection.query(
    "select * from cart where id= '" + id + "' ",
    (err, rows) => {
      if (err) {
        console.log("err---------------------78-----")
        console.log(err)
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "something went wrong" });
      } else {
        res.status(StatusCodes.OK).json(rows);
      }
    }
  );
}

export async function cart_update(req, res) {
  var { product_verient_id, cart_product_quantity } = req.body;
  const check_1 = parseInt(cart_product_quantity)
  console.log("---update----cart--update---function----------")
  if (check_1 < 1) {
    console.log("--delete-if-true-(check_1 < 1)---cart_product_quantity----" + check_1)
    connection.query("delete from cart where product_verient_id ='" + product_verient_id + "' AND user_id='" + req.user_id + "'", (err, rows) => {
      if (err) {
        console.log("err---------------------94-----")
        console.log(err)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "response": "delete opration failed", "success": false });
      } else {
        rows.affectedRows == "1" ? res.status(200).json({ "response": "delete successfull", "success": true }) : res.status(200).json({ "response": "delete opration failed", "success": false })
      }
    });
  } else {
    console.log("-else--update-cart-----" + check_1)
    connection.query(
      "update cart set cart_product_quantity='" + cart_product_quantity + "' where user_id='" + req.user_id + "' AND product_verient_id='" + product_verient_id + "'", (err, rows) => {
        if (err) {
          console.log("err---------------------105-----")
          console.log(err)
          res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ "response": "something went wrong", "success": false });
        } else {
          rows.affectedRows == "1" ? res.status(200).json({ "response": "update successfull", "success": true }) : res.status(200).json({ "response": "something went wrong", "success": false })

        }
      }
    );
  }

}

export async function cart_delete(req, res) {
  const { product_id, product_verient_id } = req.body
  console.log("cart---delete--function------------")
  console.log("delete from cart where product_id ='" + product_id + "' AND product_verient_id='" + product_verient_id + "' AND user_id='" + req.user_id + "'")
  connection.query("delete from cart where product_id ='" + product_id + "' AND product_verient_id='" + product_verient_id + "' AND user_id='" + req.user_id + "'", (err, rows) => {
    if (err) {
      console.log(err)
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "response": "delete opration failed", "success": false });
    } else {
      rows.affectedRows >= 1 ? res.status(200).json({ "response": "delete successfull", "success": true }) : res.status(200).json({ "response": "delete opration failed", "success": false })
    }
  });
}


export async function cart_and_notification_count(req, res) {
  let res_array = []
  connection.query("select count(id) AS cart_count from cart where user_id='" + req.user_id + "'", (err, rows) => {
    if (err) {
      console.log(err)
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "response": "find error", "success": false });
    } else {
      res_array.push(rows[0])
      connection.query("select count(id) AS unread_notification_count from notification where actor_id='" + req.user_id + "' AND status ='unread'", (err, rows) => {
        if (err) {
          console.log(err)
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "response": "find error", "success": false });
        } else {
          res_array.push(rows[0])
          res.status(200).json({ "success": true, "response": res_array });
        }
      })
    }
  });
}

// export async function coupan_verify(req, res) {
//   let { coupan_code, vendor_id } = req.body


//   connection.query("SELECT * FROM `used_coupan_by_users` WHERE `coupan_code` = '" + coupan_code + "' AND `user_id` = '" + req.user_id + "'",
//     (err, coupan_check) => {
//       if (err) {
//         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "res_msg": "find error", "success": false });
//       } else {
//         if (coupan_check != "") {
//           res.status(200).json({ "res_msg": "coupan alrady used", "success": false });
//         } else {
//           const curr_date = new Date().toISOString().slice(0, 19).replace("T", " ");
//           connection.query("SELECT * FROM `coupons` where start_date <='" + curr_date + "' AND end_date >='" + curr_date + "' AND code ='" + coupan_code + "'", (err, rows) => {
//             if (err) {
//               console.log(err)
//               res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "response": "find error", "status": false });
//             } else {
//               if (rows != "") {
//                 console.log("coupan-------data--------")
//                 console.log(rows)
//                 let { coupan_code, vendor_id } = req.body

//                 connection.query('select cart.id,user_id,cart.product_id AS cart_product_id ,cart.product_verient_id AS cart_product_verient_id ,cart_product_quantity,cart.created_on AS cart_created_on,cart.updated_on AS cart_updated_on,product_view.*, (SELECT owner_name FROM `vendor` where vendor.vendor_id = product_view.vendor_id) AS owner_name from cart,product_view where cart.product_verient_id = product_view.product_verient_id AND user_id="' + req.user_id + '" AND verient_is_deleted="0" AND product_view.vendor_id = "' + vendor_id + '"', (err, results) => {
//                   if (err) {
//                     console.log(err)
//                     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "res_msg": "find error", "success": false });
//                   } else {
//                     let products = [];
//                     let total_gst = 0, sub_total = 0, total_mrp = 0, total_discount = 0, total_delivery_charge = 0, coupan_discount = 0, coupan_discount_price = 0;
//                     let price_x_cart_qty = 0, mrp_x_cart_qty = 0, gst_amount = 0, discount_amount = 0;
//                     results.forEach((element, index) => {
//                       price_x_cart_qty = element["price"] * element["cart_product_quantity"]
//                       mrp_x_cart_qty = element["mrp"] * element["cart_product_quantity"]
//                       gst_amount = price_x_cart_qty * element["gst"] / 100
//                       discount_amount = mrp_x_cart_qty * element["discount"] / 100

//                       element["price_x_cart_qty"] = price_x_cart_qty
//                       element["mrp_x_cart_qty"] = mrp_x_cart_qty
//                       element["cart_gst_amount"] = gst_amount
//                       element["cart_discount_amount"] = discount_amount
//                       total_gst += gst_amount
//                       sub_total += price_x_cart_qty
//                       total_mrp += mrp_x_cart_qty
//                       total_discount += discount_amount
//                       total_delivery_charge = 100
//                       products.push(element)
//                       if (index == results.length - 1) {
//                         coupan_discount = sub_total * rows[0]["percentage"] / 100
//                         coupan_discount_price = sub_total - coupan_discount

//                         if (rows[0]["minimum_amount"] <= sub_total && sub_total <= rows[0]["maximum_amount"]) {
//                           res.status(200).json({ status: true, response: { products, coupan_price: { total_gst, sub_total, total_mrp, total_discount, total_delivery_charge, coupan_discount, coupan_discount_price } } })
//                         } else {
//                           res.status(200).json({ "status": true, "res_msg": "coupan use for beetween (minmum:" + rows[0]["minimum_amount"] + " and maximum:" + rows[0]["maximum_amount"] + ") amount order " })
//                         }

//                       }
//                     });
//                   }
//                 });
//               } else {
//                 res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "res_msg": "invalid coupan", "status": false });
//               }
//             }
//           });

//         }
//       }
//     })
// }



