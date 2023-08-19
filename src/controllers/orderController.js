import connection from "../../Db.js";
import { StatusCodes } from "http-status-codes";
import nodemailer from "nodemailer"
import fetch from 'node-fetch';


// const my_fun = async () => {
//   for (let i = 0; i < 10; i++) {
//     await executeFunction1();
//     await executeFunction2();
//     console.log('Both functions completed');
//   }
// };

// my_fun();
export async function add_order(req, res) {
  const currentDate = new Date();
  const futureDate = new Date(currentDate);
  futureDate.setDate(currentDate.getDate() + 7);
  const formattedDateTime = futureDate.toISOString().slice(0, 19).replace('T', ' ');
  let order_placed = []
  let order_array = req.body["order"];
  let { first_name, last_name, email, phone_no, image, pincode, city, address, user_log, user_lat } = req.body["delivery_address"];

  connection.query("UPDATE `user` SET `pincode`='" + pincode + "',`city`='" + city + "',`address`='" + address + "',`user_log`='" + user_log + "',`user_lat`='" + user_lat + "' WHERE id='" + req.user_id + "'",
    (err, result) => {

    })
  var fcm_tokens = [];
  let response_send = [];
  let all_orders_total = 0, all_orders_total_gst = 0, all_orders_total_sgst = 0, all_orders_total_cgst = 0, all_orders_total_discount = 0, admin_commission_amount = 0, Price_after_removing_admin_commission = 0;
  connection.query("SELECT * FROM user WHERE id='" + req.user_id + "'",
    (err, result) => {
      if (err) {
      } else {
        if (result[0].token_for_notification != "" && result[0].token_for_notification != undefined && result[0].token_for_notification != null) { fcm_tokens.push(result[0].token_for_notification) }
        //-------------------------------------start---new----update----------------------------------------
        order_array.forEach((element_1, count) => {
          let cart_id_array = []
          let { vendor_id, coupan_code } = element_1
          const curr_date = new Date().toISOString().slice(0, 19).replace("T", " ");
          connection.query("SELECT * FROM `used_coupan_by_users` WHERE `coupan_code` = '" + coupan_code + "' AND `user_id` = '" + req.user_id + "'",
            (err, coupan_check) => {
              if (err) {
              } else {
                console.log("coupan_check============")
                console.log(coupan_check)
                if (coupan_check != "") {
                  // already used by user
                } else {
                  connection.query("SELECT * FROM `coupons` where start_date <='" + curr_date + "' AND end_date >='" + curr_date + "' AND code ='" + coupan_code + "'", (err, rows_coup) => {
                    if (err) {

                    } else {
                      // connection.query("SELECT admin_commission FROM `vendor` where vendor.vendor_id = "+vendor_id+"", (err, vendo_pro) => {})

                      connection.query('select cart.id,user_id,cart.product_id AS cart_product_id ,cart.product_verient_id AS cart_product_verient_id ,cart_product_quantity,cart.created_on AS cart_created_on,cart.updated_on AS cart_updated_on,product_view.*, (SELECT owner_name FROM `vendor` where vendor.vendor_id = product_view.vendor_id) AS owner_name,(SELECT admin_commission FROM `vendor` where vendor.vendor_id = product_view.vendor_id) AS admin_commission from cart,product_view where cart.product_verient_id = product_view.product_verient_id AND user_id="' + req.user_id + '" AND verient_is_deleted="0" AND product_view.vendor_id = "' + vendor_id + '"', (err, results) => {
                        if (err) {
                        } else {

                          let products = [];

                          let total_sgst = 0, total_cgst = 0, total_gst = 0, sub_total = 0, total_mrp = 0, total_discount = 0, total_delivery_charge = 0, coupan_discount = 0, coupan_discount_price = 0;
                          let price_x_cart_qty = 0, mrp_x_cart_qty = 0, gst_amount = 0, discount_amount = 0, sgst_amount = 0, cgst_amount = 0, order_product_count = 0;
                          results.forEach((element, index) => {
                            price_x_cart_qty = element["price"] * element["cart_product_quantity"]
                            mrp_x_cart_qty = element["mrp"] * element["cart_product_quantity"]
                            gst_amount = price_x_cart_qty * element["gst"] / 100
                            sgst_amount = price_x_cart_qty * element["sgst"] / 100
                            cgst_amount = price_x_cart_qty * element["cgst"] / 100
                            discount_amount = mrp_x_cart_qty * element["discount"] / 100

                            element["price_x_cart_qty"] = price_x_cart_qty
                            element["mrp_x_cart_qty"] = mrp_x_cart_qty
                            element["cart_gst_amount"] = gst_amount
                            element["cart_sgst_amount"] = sgst_amount
                            element["cart_cgst_amount"] = cgst_amount
                            element["cart_discount_amount"] = discount_amount
                            total_gst += gst_amount
                            total_sgst += sgst_amount
                            total_cgst += cgst_amount
                            sub_total += price_x_cart_qty
                            total_mrp += mrp_x_cart_qty
                            total_discount += discount_amount
                            total_delivery_charge = 100
                            order_product_count += 1
                            if (index == results.length - 1) {
                              let orderno = Math.floor(100000 + Math.random() * 900000);
                              let verify_code = Math.floor(100000 + Math.random() * 900000);
                              all_orders_total += sub_total
                              all_orders_total_gst += total_gst
                              all_orders_total_sgst += total_sgst
                              all_orders_total_cgst += total_cgst
                              all_orders_total_discount += total_discount
                              // console.log(rows_coup) 
                              try {
                                coupan_discount = sub_total * rows_coup[0]["percentage"] / 100
                                coupan_discount_price = sub_total - coupan_discount
                              } catch (e) {
                                coupan_discount = 0;
                                coupan_discount_price = sub_total;
                              }
                              admin_commission_amount = coupan_discount_price * element["admin_commission"] / 100
                              Price_after_removing_admin_commission = coupan_discount_price - admin_commission_amount

                              connection.query(
                                "insert into `order` ( `order_id`, `product_id`,`user_id`, vendor_id, `total_order_product_quantity`,`total_amount`,`total_gst`,`total_cgst`, `total_sgst`,`total_discount`, `shipping_charges`,`invoice_id`, `payment_mode`,`payment_ref_id`,`delivery_date`, `discount_coupon`,`discount_coupon_value`,`delivery_lat`,`delivery_log`, `user_name`, `address`, `email`, `pin_code`, `city`, `user_image`, `phone_no`,`delivery_verify_code`, `only_this_order_product_total`, `only_this_order_product_quantity`, `only_this_product_gst`, `only_this_product_cgst`, `only_this_product_sgst`,`admin_commission_parcent`,`Price_after_removing_admin_commission`,`admin_commission_amount`) VALUES ('" + orderno + "','" + element["product_id"] + "','" + req.user_id + "', '" + vendor_id + "', '" + results["length"] +
                                "','" +
                                all_orders_total +
                                "','" +
                                all_orders_total_gst +
                                "','" +
                                all_orders_total_cgst +
                                "','" +
                                all_orders_total_sgst +
                                "','" +
                                all_orders_total_discount +
                                "','" +
                                total_delivery_charge +
                                "','" +
                                orderno +
                                "','cod','121212','" + formattedDateTime + "','" + coupan_code + "','" +
                                coupan_discount +
                                "'," + user_lat + "," + user_log + ", '" + first_name + "', '" + address + "', '" + email + "', " + pincode + ", '" + city + "', '" + image + "','" + phone_no + "' ,'" + verify_code + "','" + coupan_discount_price + "','" + order_product_count + "','" + total_gst + "','" + total_cgst + "','" + total_sgst + "','" + element["admin_commission"] + "','" + Price_after_removing_admin_commission + "','" + admin_commission_amount + "')",
                                (err, rows) => {
                                  if (err) {
                                    if (order_array.length - 1 == count) {
                                      console.log("order ready ya aaaa")
                                      res.json({ "status": true, response: "placed order successfull", order_placed })
                                    }
                                  } else {
                                    order_placed.push(orderno)
                                    if (order_array.length - 1 == count) {
                                      console.log("order ready ya aaaa")
                                      res.json({ "status": true, response: "placed order successfull", order_placed })
                                    }
                                    if (results != "") {

                                      if (0 < coupan_discount) {
                                        connection.query("INSERT INTO `used_coupan_by_users`(`coupan_code`, `user_id`, `order_id`) VALUES ('" + coupan_code + "','" + req.user_id + "','" + orderno + "')"
                                        );
                                      }
                                    } else {

                                    }
                                    console.log("order_insert_successfull--------" + results)
                                    results.forEach((item_, index_) => {
                                      let update_stock_qty = item_["product_stock_quantity"] - item_["cart_product_quantity"]

                                      connection.query(
                                        "UPDATE `product_verient` SET product_stock_quantity='" + update_stock_qty + "' WHERE product_verient_id='" + item_["product_verient_id"] + "'"
                                      );
                                      connection.query('INSERT INTO order_detaile1 (`id`, `order_id`, `order_cart_count`, `vendor_id`, `name`, `seo_tag`, `brand`, `category`, `is_deleted`, `status`, `review`, `rating`, `description`, `is_active`, `created_by`, `created_by_id`, `created_on`, `updated_on`, `product_verient_id`, `product_id`, `verient_name`, `quantity`, `unit`, `product_stock_quantity`, `price`, `mrp`, `gst`, `sgst`, `cgst`, `verient_is_deleted`, `verient_status`, `discount`, `verient_description`, `verient_is_active`, `verient_created_on`, `verient_updated_on`, `product_height`, `product_width`, `product_Weight`, `all_images_url`, `cover_image`) SELECT `id`, "' + orderno + '", "' + item_["cart_product_quantity"] + '", `vendor_id`, `name`, `seo_tag`, `brand`, `category`, `is_deleted`, `status`, `review`, `rating`, `description`, `is_active`, `created_by`, `created_by_id`, `created_on`, `updated_on`, `product_verient_id`, `product_id`, `verient_name`, `quantity`, `unit`, `product_stock_quantity`, `price`, `mrp`, `gst`, `sgst`, `cgst`, `verient_is_deleted`, `verient_status`, `discount`, `verient_description`, `verient_is_active`, `verient_created_on`, `verient_updated_on`, `product_height`, `product_width`, `product_Weight`, `all_images_url`, `cover_image` FROM	product_view WHERE product_verient_id = ' + item_["product_verient_id"] + ''
                                      );
                                      connection.query("delete from cart where product_verient_id ='" + item_["product_verient_id"] + "' AND user_id='" + req.user_id + "'");
                                    })
                                  }

                                  if (order_array.length - 1 == count) {
                                    connection.query('INSERT INTO `notification`(`actor_id`, `actor_type`, `message`, `status`) VALUES ("' + req.user_id + '","user","successfully placed order,order_no=","unread"),("001","admin","recived order (order_no. =) by ' + first_name + ', user_id ' + req.user_id + '","unread")', (err, rows) => {
                                      if (err) {
                                        //console.log({ "notification": err })
                                      } else {
                                        console.log("_______notification-send__94________")
                                      }
                                    })
                                    const mail_configs = {
                                      from: 'rahul.verma.we2code@gmail.com',
                                      to: email,
                                      subject: 'order status ',
                                      text: "order added successfully",
                                      html: "<h1>order added successfully<h1/>"
                                    }
                                    nodemailer.createTransport({
                                      service: 'gmail',
                                      auth: {
                                        user: "rahul.verma.we2code@gmail.com",
                                        pass: "sfbmekwihdamgxia",
                                      }
                                    })
                                      .sendMail(mail_configs, (err) => {
                                        if (err) {
                                          return //console.log({ "email_error": err });
                                        } else {
                                          return { "send_mail_status": "send successfully" };
                                        }
                                      })
                                  }

                                }
                              );
                            }
                          });
                        }
                      });
                    }
                  })
                }
              }
            }
          );
          // if (order_array.length - 1 == count) {
          //   console.log("order ready ya aaaa")
          //   res.json({ "status": true, response: "placed order successfull", order_placed })
          // }
        });
        //   }
        // })




        //-------------------------------------end------------------------------------
        // const order_insert = (item, index) => {
        //   return new Promise((resolve) => {
        //     console.log("vendore_id_array-and-vendor_id-----------" + index + "---------arraychk")
        //     console.log(vendore_id_array)
        //     console.log(item["vendor_id"])
        //     if (vendore_id_array.includes(item["vendor_id"])) {
        //       console.log("---vendore_id_array.includes(item[vendor_id])--true-")
        //       console.log(vendore_id_array.includes(item["vendor_id"]))
        //       let order_no_old = order_no_obj[item["vendor_id"]]
        //       // let verify_code = JSON.stringify(order_no_old * 13)
        //       // if (verify_code.length > 7) {
        //       //   verify_code = verify_code.substring(0, verify_code.length - 1)
        //       // }
        //       connection.query("SELECT product_stock_quantity FROM `product_verient` WHERE product_verient_id='" + item["product_verient_id"] + "'",
        //         (err, result) => {
        //           if (err) {
        //             console.log(err)
        //             response_send.push({ "product_quantity": err })
        //           } else {
        //             var update_stock_qty = parseInt(result[0]["product_stock_quantity"]) - parseInt(item["cart_qty_of_this_product"])

        //             connection.query('INSERT INTO order_detaile1 (`id`, `order_id`, `order_cart_count`, `vendor_id`, `name`, `seo_tag`, `brand`, `category`, `is_deleted`, `status`, `review`, `rating`, `description`, `is_active`, `created_by`, `created_by_id`, `created_on`, `updated_on`, `product_verient_id`, `product_id`, `verient_name`, `quantity`, `unit`, `product_stock_quantity`, `price`, `mrp`, `gst`, `sgst`, `cgst`, `verient_is_deleted`, `verient_status`, `discount`, `verient_description`, `verient_is_active`, `verient_created_on`, `verient_updated_on`, `product_height`, `product_width`, `product_Weight`, `all_images_url`, `cover_image`) SELECT `id`, "' + order_no_old + '", "' + item["cart_qty_of_this_product"] + '", `vendor_id`, `name`, `seo_tag`, `brand`, `category`, `is_deleted`, `status`, `review`, `rating`, `description`, `is_active`, `created_by`, `created_by_id`, `created_on`, `updated_on`, `product_verient_id`, `product_id`, `verient_name`, `quantity`, `unit`, `product_stock_quantity`, `price`, `mrp`, `gst`, `sgst`, `cgst`, `verient_is_deleted`, `verient_status`, `discount`, `verient_description`, `verient_is_active`, `verient_created_on`, `verient_updated_on`, `product_height`, `product_width`, `product_Weight`, `all_images_url`, `cover_image` FROM	product_view WHERE product_verient_id = ' + item["product_verient_id"] + '', (err, result) => {
        //               if (err) {
        //                 console.log(err)
        //                 response_send.push({ "order_detail_insert_error": err, "index_no": index })
        //               } else {
        //                 console.log("______________product detaile insert  data___line_______106_")
        //                 response_send.push({ "order_detail_insert_successfull": result, "index_no": index })
        //                 console.log(result)

        //                 connection.query(
        //                   "UPDATE `product_verient` SET product_stock_quantity = '" + update_stock_qty + "' WHERE product_verient_id='" + item["product_verient_id"] + "'",
        //                   (err, result) => {
        //                     if (err) {
        //                       console.log(err)
        //                     } else {
        //                       // res.status(200).json({ message: result });

        //                     }
        //                   }
        //                 );
        //                 connection.query("delete from cart where product_verient_id ='" + item["product_verient_id"] + "' AND user_id='" + req.user_id + "'", (err, rows) => {
        //                   if (err) {
        //                     console.log("rows----------------err-------delete---")
        //                     console.log(err)
        //                     console.log({ "response": "delete opration failed", "success": false });
        //                   } else {
        //                     // console.log("rows-----------------------delete---row")
        //                   }
        //                 });
        //                 // only_this_product_gst,only_this_product_cgst,only_this_product_sgst
        //                 connection.query("UPDATE `order` SET `only_this_order_product_total` = " + `${vendor_order_detail_obj[item["vendor_id"]]["total_of_this_prodoct"] += item["total_of_this_prodoct"]}` + " ,`only_this_order_product_quantity`=" + `${vendor_order_detail_obj[item["vendor_id"]]["cart_qty_of_this_product"] += item["cart_qty_of_this_product"]}` + " ,`only_this_product_gst`='" + `${vendor_order_detail_obj[item["vendor_id"]]["only_this_product_gst"] += parseFloat(item["only_this_product_gst"])}` + "' ,`only_this_product_cgst`='" + `${vendor_order_detail_obj[item["vendor_id"]]["only_this_product_cgst"] += parseFloat(item["only_this_product_cgst"])}` + "' , `only_this_product_sgst`='" + `${vendor_order_detail_obj[item["vendor_id"]]["only_this_product_sgst"] += parseFloat(item["only_this_product_sgst"])}` + "'  where `order_id` ='" + order_no_old + "' AND user_id='" + req.user_id + "'", (err, rows) => {
        //                   if (err) {
        //                     console.log("rows----------------err-------delete---")
        //                     console.log(err)
        //                   } else {
        //                   }
        //                   resolve()
        //                 });
        //               }
        //             }
        //             );
        //             //     }
        //             //   }
        //             // );
        //             // } else {
        //             //   // res.send({ "response": "product stock unavailable", "status": false })
        //             //   console.log({ "response": "product stock unavailable", "status": false })
        //             // }

        //           }
        //         }
        //       )
        //     } else {
        //       console.log("---vendore_id_array.includes(item[vendor_id])--false-")
        //       let orderno = Math.floor(100000 + Math.random() * 900000);
        //       const verify_code = Math.floor(100000 + Math.random() * 900000);
        //       vendore_id_array.push(item["vendor_id"])
        //       order_no_obj[item["vendor_id"]] = orderno
        //       vendor_order_detail_obj[item["vendor_id"]] = {}
        //       vendor_order_detail_obj[item["vendor_id"]]["vendor_id"] = item["vendor_id"]
        //       vendor_order_detail_obj[item["vendor_id"]]["order_no"] = orderno
        //       vendor_order_detail_obj[item["vendor_id"]]["total_of_this_prodoct"] = item["total_of_this_prodoct"]
        //       vendor_order_detail_obj[item["vendor_id"]]["cart_qty_of_this_product"] = item["cart_qty_of_this_product"]
        //       vendor_order_detail_obj[item["vendor_id"]]["only_this_product_gst"] = parseFloat(item["only_this_product_gst"])
        //       vendor_order_detail_obj[item["vendor_id"]]["only_this_product_cgst"] = parseFloat(item["only_this_product_cgst"])
        //       vendor_order_detail_obj[item["vendor_id"]]["only_this_product_sgst"] = parseFloat(item["only_this_product_sgst"])
        //       // only_this_product_gst,only_this_product_cgst,only_this_product_sgst

        //       connection.query("SELECT product_stock_quantity FROM product_verient WHERE product_verient_id='" + item["product_verient_id"] + "'",
        //         (err, result) => {
        //           if (err) {
        //             // res.status(500).send(err);
        //             response_send.push({ "get_product_stock_quantity_error": err, "index_no": index })
        //           } else {
        //             var update_stock_qty = parseInt(result[0]["product_stock_quantity"]) - parseInt(item["cart_qty_of_this_product"])
        //             connection.query(
        //               "insert into `order` ( `order_id`, `product_id`,`user_id`, vendor_id, `total_order_product_quantity`,`total_amount`,`total_gst`,`total_cgst`, `total_sgst`,`total_discount`, `shipping_charges`,`invoice_id`, `payment_mode`,`payment_ref_id`,`delivery_date`, `discount_coupon`,`discount_coupon_value`,`delivery_lat`,`delivery_log`, `user_name`, `address`, `email`, `pin_code`, `city`, `user_image`, `phone_no`,`delivery_verify_code`) VALUES ('" + orderno + "','" + item["product_id"] + "','" + req.user_id + "', '" + item["vendor_id"] + "', '" + item["total_order_product_quantity"] +
        //               "','" +
        //               item["total_amount"] +
        //               "','" +
        //               item["total_gst"] +
        //               "','" +
        //               item["total_cgst"] +
        //               "','" +
        //               item["total_sgst"] +
        //               "','" +
        //               item["total_discount"] +
        //               "','" +
        //               item["shipping_charges"] +
        //               "','" +
        //               orderno +
        //               "','" +
        //               item["payment_mode"] +
        //               "','" +
        //               item["payment_ref_id"] + "','" + formattedDateTime + "','" + item["discount_coupon"] + "','" +
        //               item["discount_coupon_value"] +
        //               "'," + user_lat + "," + user_log + ", '" + first_name + "', '" + address + "', '" + email + "', " + pincode + ", '" + city + "', '" + image + "','" + phone_no + "' ,'" + verify_code + "')",
        //               (err, rows) => {
        //                 if (err) {
        //                   console.log(err)
        //                   response_send.push({ "order_insert_error": err, "index_no": index })
        //                 } else {
        //                   console.log("rows=====170")
        //                   console.log(rows)
        //                   response_send.push({ "order_insert_successfull": rows, "index_no": index })
        //                   connection.query(
        //                     "UPDATE `product_verient` SET product_stock_quantity='" + update_stock_qty + "' WHERE product_verient_id='" + item["product_verient_id"] + "'",
        //                     (err, result) => {
        //                       if (err) {
        //                         console.log(err)
        //                       } else {
        //                       }
        //                     }
        //                   );
        //                   connection.query("delete from cart where product_verient_id ='" + item["product_verient_id"] + "' AND user_id='" + req.user_id + "'", (err, rows) => {
        //                     if (err) {
        //                       console.log(err)
        //                     } else {
        //                       // console.log("rows---------205--------------delete---row")
        //                     }
        //                   });
        //                   connection.query('INSERT INTO order_detaile1 (`id`, `order_id`, `order_cart_count`, `vendor_id`, `name`, `seo_tag`, `brand`, `category`, `is_deleted`, `status`, `review`, `rating`, `description`, `is_active`, `created_by`, `created_by_id`, `created_on`, `updated_on`, `product_verient_id`, `product_id`, `verient_name`, `quantity`, `unit`, `product_stock_quantity`, `price`, `mrp`, `gst`, `sgst`, `cgst`, `verient_is_deleted`, `verient_status`, `discount`, `verient_description`, `verient_is_active`, `verient_created_on`, `verient_updated_on`, `product_height`, `product_width`, `product_Weight`, `all_images_url`, `cover_image`) SELECT `id`, "' + orderno + '", "' + item["cart_qty_of_this_product"] + '", `vendor_id`, `name`, `seo_tag`, `brand`, `category`, `is_deleted`, `status`, `review`, `rating`, `description`, `is_active`, `created_by`, `created_by_id`, `created_on`, `updated_on`, `product_verient_id`, `product_id`, `verient_name`, `quantity`, `unit`, `product_stock_quantity`, `price`, `mrp`, `gst`, `sgst`, `cgst`, `verient_is_deleted`, `verient_status`, `discount`, `verient_description`, `verient_is_active`, `verient_created_on`, `verient_updated_on`, `product_height`, `product_width`, `product_Weight`, `all_images_url`, `cover_image` FROM	product_view WHERE product_verient_id = ' + item["product_verient_id"] + '', (err, result) => {
        //                     if (err) {
        //                       console.log(err)
        //                       response_send.push({ "order_detail_insert_error": err, "index_no": index })
        //                     } else {
        //                       response_send.push({ "order_detail_insert_successfull": result, "index_no": index })
        //                       console.log("______________product detaile insert  data___________176")
        //                       console.log(result)
        //                       // only_this_product_gst,only_this_product_cgst,only_this_product_sgst
        //                       connection.query("UPDATE `order` SET `only_this_order_product_total` = " + `${vendor_order_detail_obj[item["vendor_id"]]["total_of_this_prodoct"]}` + " ,`only_this_order_product_quantity`=" + `${vendor_order_detail_obj[item["vendor_id"]]["cart_qty_of_this_product"]}` + " ,`only_this_product_gst`='" + `${vendor_order_detail_obj[item["vendor_id"]]["only_this_product_gst"]}` + "',`only_this_product_cgst`='" + `${vendor_order_detail_obj[item["vendor_id"]]["only_this_product_cgst"]}` + "',`only_this_product_sgst`='" + `${vendor_order_detail_obj[item["vendor_id"]]["only_this_product_sgst"]}` + "' where `order_id` ='" + orderno + "' AND user_id='" + req.user_id + "'", (err, rows) => {
        //                         if (err) {
        //                           console.log("rows----------------err-------delete---")
        //                           console.log(err)
        //                         } else {
        //                         }
        //                         resolve()
        //                       });
        //                     }
        //                   }
        //                   );
        //                   console.log(rows)
        //                 }
        //               }
        //             );
        //           }
        //         }
        //       )
        //     }
        //   });
        // };
        // product_array.forEach(async (item, index) => {

        //   await order_insert(item, index)

        //   if (index === product_array.length - 1) {
        //     console.log(response_send)
        //     var order_ar = []
        //     for (var k in order_no_obj) {
        //       order_ar.push(order_no_obj[k])
        //     }
        //     connection.query('INSERT INTO `notification`(`actor_id`, `actor_type`, `message`, `status`) VALUES ("' + req.user_id + '","user","successfully placed order,order_no=","unread"),("001","admin","recived order (order_no. =) by ' + first_name + ', user_id ' + req.user_id + '","unread")', (err, rows) => {
        //       if (err) {
        //         //console.log({ "notification": err })
        //       } else {
        //         console.log("_______notification-send__94________")
        //       }
        //     })
        //     const mail_configs = {
        //       from: 'rahul.verma.we2code@gmail.com',
        //       to: email,
        //       subject: 'order status ',
        //       text: "order added successfully",
        //       html: "<h1>order added successfully<h1/>"
        //     }
        //     nodemailer.createTransport({
        //       service: 'gmail',
        //       auth: {
        //         user: "rahul.verma.we2code@gmail.com",
        //         pass: "sfbmekwihdamgxia",
        //       }
        //     })
        //       .sendMail(mail_configs, (err) => {
        //         if (err) {
        //           console.log(vendor_order_detail_obj)

        //           // res.status(StatusCodes.OK).json({ "status": "ok", "response": "order successfully added", "order_id": order_ar, "vendors_order_detailes": vendor_order_detail_obj, "success": true });
        //           return //console.log({ "email_error": err });
        //         } else {
        //           console.log(vendor_order_detail_obj)
        //           // res.status(StatusCodes.OK).json({ "status": "ok", "response": "order successfully added", "order_id": order_ar, "vendors_order_detailes": vendor_order_detail_obj, "success": true });

        //           return { "send_mail_status": "send successfully" };
        //         }
        //       })

        //     res.status(StatusCodes.OK).json({ "status": "ok", "response": "order successfully added", "order_id": order_ar, "vendors_order_detailes": vendor_order_detail_obj, "success": true });
        //     if (fcm_tokens != "") {
        //       var notification = {
        //         "title": "nurser_live order notification",
        //         "text": "order placed successfull"
        //       }

        //       // var fcm_tokens = ["e42h1iTmRwGlyuwn9nGqu4:APA91bH6_qHLmPMYCjrkI1-l2eswwsWMxZJeMz9WRozFYA-DzNOCS58L9HPGaRWTaxKj7Zg4pJx2TRgZPU4O8IY7UgqJ5S6A8DY4BODWfQDdlFNZLaZmz5heuAlJdxI2Y-XVFcjNimDh"]

        //       var notification_body = {
        //         "notification": notification,
        //         "registrations_ids": fcm_tokens
        //       }
        //       // fetch("https://fcm.googleapis.com/fcm/send", { "method": "POST", "headers": { "authorization": "keys=" + "AAAABsq8jZc:APA91bG99gTYMmsMI_vlIJhjAxU6ta8j24v4dg-tInV4dKDUXqBzx3ORj_n0aI5k7opUvuyKI0nGhulfolpJgSFf2d5rnMfrN5CGA2fkpbCqTIlaidCChdDa5Gs7ymScojbL5pC93B54", "Content-Type": "application/json" }, "body": notification_body }).then(() => {
        //       //   console.log("notification send successfully")
        //       // }).catch((err) => { console.log(err) })
        //     }



        //   }
        // })
      }
    })
}

export async function order_list(req, res) {

  if (req.for_ == 'admin') {
    if (user_id != '') {
      str_order = "select * ,(select delivered_date from `order_delivery_details` where `order`.order_id = `order_delivery_details`.order_id) AS delivered_date from `order` where user_id='" + user_id + "'"
    } else {
      str_order = "select * ,(select delivered_date from `order_delivery_details` where `order`.order_id = `order_delivery_details`.order_id) AS delivered_date from `order`"
    }
  } else {
    if (req.for_ == 'user') {
      user_id = ""
      str_order = "select *,(select delivered_date from `order_delivery_details` where `order`.order_id = `order_delivery_details`.order_id) AS delivered_date from `order` where user_id='" + req.user_id + "'"
    }
  }
  connection.query(str_order, (err, rows) => {
    if (err) {
      res.status(StatusCodes.INSUFFICIENT_STORAGE).json({ "response": "find error", "status": false });
    } else {
      res.status(StatusCodes.OK).json(rows);
    }
  });
}

export async function order_details(req, res) {
  const id = req.query.id;
  let resp_obj = {}
  let query_ = ''
  let chek_token = true;
  if ("admin_token" in req.headers) {
    chek_token = false;
    query_ += 'SELECT *,(select delivered_date from `order_delivery_details` where `order`.order_id = `order_delivery_details`.order_id) AS delivered_date FROM `order` WHERE order_id ="' + id + '" '
  } else if (req.user_id) {
    query_ += 'SELECT *,(select delivered_date from `order_delivery_details` where `order`.order_id = `order_delivery_details`.order_id) AS delivered_date FROM `order` WHERE order_id ="' + id + '" AND user_id ="' + req.user_id + '" '
  }
  else {
    if (req.vendor_id) {
      query_ += 'SELECT *,(select delivered_date from `order_delivery_details` where `order`.order_id = `order_delivery_details`.order_id) AS delivered_date FROM `order` WHERE order_id ="' + id + '" AND vendor_id ="' + req.vendor_id + '" '
    }
  }
  // if("user_token" in req.headers){

  // }

  connection.query(query_,
    (err, rows) => {
      if (err) {
        console.log(err)
        res.status(StatusCodes.INSUFFICIENT_STORAGE).json(err);
      } else {
        if (rows != "") {
          resp_obj["success"] = true
          resp_obj["order_detaile"] = rows
          req.user_id = rows[0]["user_id"]
          connection.query('SELECT * FROM `order_detaile1` where order_id =' + id + '',
            (err, rows) => {
              if (err) {
                console.log(err)
                res.status(StatusCodes.INSUFFICIENT_STORAGE).json(err);
              } else {
                resp_obj["success"] = true
                resp_obj["order_product_detaile"] = rows
                // res.status(StatusCodes.OK).json(resp_obj);        
                // if (chek_token) {
                connection.query("select * from user where id= '" + req.user_id + "'", (err, rows) => {
                  if (err) {
                    res
                      .status(StatusCodes.INTERNAL_SERVER_ERROR)
                      .json({ message: "something went wrong", "status": false });
                  } else {
                    resp_obj["user_detaile"] = rows
                    res.status(StatusCodes.OK).json(resp_obj);
                  }
                })
                // } else {
                //   res.status(StatusCodes.OK).json(resp_obj);
                // }

              }
            }
          );
        } else {
          res.status(200).json({ "success": false, "response": "not found" });
        }
      }
    }
  )
}
// export async function order_details(req, res) {
//   let { id, invoice_id } = req.query
//   console.log(req.query)
//   let condition_ = ""
//   let resp_obj = {}
//   let query_ = ''
//   let chek_token = true;
//   if (invoice_id) {
//     condition_ = " `order`.`invoice_id` = '" + invoice_id + "' "
//   }
//   if (id) {
//     condition_ = " `order`.`order_id` = '" + id + "' "
//   }

//   if ("admin_token" in req.headers) {
//     chek_token = false;
//     query_ += 'SELECT *,(select delivered_date from `order_delivery_details` where `order`.order_id = `order_delivery_details`.order_id) AS delivered_date FROM `order` WHERE ' + condition_ + ' '

//   } else if (req.user_id) {
//     query_ += 'SELECT *,(select delivered_date from `order_delivery_details` where `order`.order_id = `order_delivery_details`.order_id) AS delivered_date FROM `order` WHERE ' + condition_ + ' AND user_id ="' + req.user_id + '" '
//   }
//   else {
//     if (req.vendor_id) {
//       query_ += 'SELECT *,(select delivered_date from `order_delivery_details` where `order`.order_id = `order_delivery_details`.order_id) AS delivered_date FROM `order` WHERE ' + condition_ + ' AND vendor_id ="' + req.vendor_id + '" '
//     }
//   }
//   // if("user_token" in req.headers){

//   // }
//   console.log("-------" + query_)
//   connection.query(query_,
//     (err, rows) => {
//       if (err) {
//         console.log(err)
//         res.status(StatusCodes.INSUFFICIENT_STORAGE).json(err);
//       } else {
//         if (rows != "") {
//           resp_obj["success"] = true
//           resp_obj["order_detaile"] = rows
//           req.user_id = rows[0]["user_id"]
//           let order_id = rows[0]["order_id"]
//           connection.query('SELECT * FROM `order_detaile1` where order_id =' + order_id + '',
//             (err, rows) => {
//               if (err) {
//                 console.log(err)
//                 res.status(StatusCodes.INSUFFICIENT_STORAGE).json(err);
//               } else {
//                 resp_obj["success"] = true
//                 resp_obj["order_product_detaile"] = rows
//                 // res.status(StatusCodes.OK).json(resp_obj);        
//                 // if (chek_token) {
//                 connection.query("select * from user where id= '" + req.user_id + "'", (err, rows) => {
//                   if (err) {
//                     res
//                       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//                       .json({ message: "something went wrong", "status": false });
//                   } else {
//                     resp_obj["user_detaile"] = rows
//                     res.status(StatusCodes.OK).json(resp_obj);
//                   }
//                 })
//                 // } else {
//                 //   res.status(StatusCodes.OK).json(resp_obj);
//                 // }

//               }
//             }
//           );
//         } else {
//           res.status(200).json({ "success": false, "response": "not found" });
//         }
//       }
//     }
//   )
// }

export async function order_update(req, res) {
  var {
    user_id,
    total_quantity,
    total_amount,
    total_gst,
    total_cgst,
    total_sgst,
    total_discount,
    shipping_charges,
    invoice_id,
    payment_mode,
    payment_ref_id,
    discount_coupon,
    discount_coupon_value,
  } = req.body;

  const id = req.params.id;

  connection.query(
    "update `order` set user_id ='" +
    user_id +
    "', total_quantity='" +
    total_quantity +
    "' , total_amount='" +
    total_amount +
    "', total_gst='" +
    total_gst +
    "', total_sgst='" +
    total_sgst +
    "', total_cgst='" +
    total_cgst +
    "', total_discount='" +
    total_discount +
    "', shipping_charges='" +
    shipping_charges +
    "', invoice_id='" +
    invoice_id +
    "', payment_mode='" +
    payment_mode +
    "', payment_ref_id='" +
    payment_ref_id +
    "', discount_coupon='" +
    discount_coupon +
    "', discount_coupon_value='" +
    discount_coupon_value +
    "'  where id ='" +
    req.user +
    "' ",
    (err, rows) => {
      if (err) {
        res.status(StatusCodes.INSUFFICIENT_STORAGE).json(err);
      } else {
        res.status(StatusCodes.OK).json(rows);
      }
    }
  );
}

export async function order_delete(req, res) {
  const id = req.params.id;

  connection.query(
    "delete from `order` where id ='" + id + "' ",
    (err, rows) => {
      if (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
      } else {
        res.status(StatusCodes.OK).json(rows);
      }
    }
  );
}

export async function order_search(req, res) {
  let search_obj = Object.keys(req.body)
  // var search_string = "where ";
  var search_string = ""
  console.log(req.user_id)
  let group_by = " "
  if (req.query.group == "yes") {
    group_by = " group by order_id "
  }
  if (req.for_ == 'admin') {
    if (req.body.user_id != '' && req.body.user_id != undefined) {
      // search_string += 'SELECT *, (SELECT GROUP_CONCAT(product_image_path) FROM product_images WHERE product_images.product_id = order_view.product_id) AS all_images_url, (SELECT GROUP_CONCAT(product_image_path) FROM product_images WHERE product_images.product_id = order_view.product_id AND image_position = "cover" group by product_images.product_id) AS cover_image  FROM order_view where'
      search_string += 'SELECT *,(select delivered_date from `order_delivery_details` where `order_view`.order_id = `order_delivery_details`.order_id) AS delivered_date FROM order_view where'
    } else {
      // search_string += 'SELECT *, (SELECT GROUP_CONCAT(product_image_path) FROM product_images WHERE product_images.product_id = order_view.product_id) AS all_images_url, (SELECT GROUP_CONCAT(product_image_path) FROM product_images WHERE product_images.product_id = order_view.product_id AND image_position = "cover" group by product_images.product_id) AS cover_image FROM `order` where'
      search_string += 'SELECT *,(select delivered_date from `order_delivery_details` where `order_view`.order_id = `order_delivery_details`.order_id) AS delivered_date FROM `order_view` where'
    }
  } else {
    if (req.for_ == 'user') {
      // search_string = 'SELECT *,(SELECT GROUP_CONCAT(product_image_path) FROM product_images WHERE product_images.product_id = order_view.product_id) AS all_images_url, (SELECT GROUP_CONCAT(product_image_path) FROM product_images WHERE product_images.product_id = order_view.product_id AND image_position = "cover" group by product_images.product_id) AS cover_image   FROM order where user_id="' + req.user_id + '" AND '
      search_string = 'SELECT * ,(select delivered_date from `order_delivery_details` where `order_view`.order_id = `order_delivery_details`.order_id) AS delivered_date FROM `order_view` where user_id="' + req.user_id + '" AND '
    }
  }


  console.log(search_obj)
  for (var i = 0; i <= search_obj.length - 1; i++) {
    if (i == 0) {
      if (req.body[search_obj[i]] != "") {
        search_string += ` name LIKE "%${req.body[search_obj[i]]}%" AND `
      }
    } else {

      if (req.body[search_obj[i]] != "") {
        search_string += ` ${search_obj[i]} = "${req.body[search_obj[i]]}" AND `
      }
    }
    if (i === search_obj.length - 1) {
      search_string = search_string.substring(0, search_string.length - 5);
    }
  }

  console.log(search_string)
  var pg = req.query;
  var numRows;

  var numPerPage = pg.per_page;
  var page = parseInt(pg.page, pg.per_page) || 0;
  var numPages;
  var skip = page * numPerPage;
  // Here we compute the LIMIT parameter for MySQL query
  var limit = skip + "," + numPerPage;

  connection.query(
    "SELECT count(*) as numRows FROM product",
    (err, results) => {
      if (err) {
      } else {
        numRows = results[0].numRows;
        numPages = Math.ceil(numRows / numPerPage);

        connection.query(search_string + group_by +
          " ORDER BY created_on DESC LIMIT " +
          limit +
          "",
          (err, results) => {
            if (err) {
              //console.log(err)
              res.status(502).send(err);
            } else {
              // //console.log("_____")
              var responsePayload = {
                results: results,
              };
              if (page < numPages) {
                responsePayload.pagination = {
                  current: page,
                  perPage: numPerPage,
                  previous: page > 0 ? page - 1 : undefined,
                  next: page < numPages - 1 ? page + 1 : undefined,
                };
              } else
                responsePayload.pagination = {
                  err:
                    "queried page " +
                    page +
                    " is >= to maximum page number " +
                    numPages,
                };
              // //console.log("responsePayload++++++++++++++++++++++++++++++++++++++++");
              ////console.log(responsePayload);
              res.status(200).send(responsePayload);
            }
          }
        );
      }
    }
  );
  // }
}

export function order_status_update(req, res) {
  console.log("order_status_update-----------------")
  console.log(req.body)
  let { status_order, order_id } = req.body

  console.log("check order_verify_by_admineee" + req.vendor_id)
  let query_ = ""
  if (status_order == "approved") {
    query_ += "UPDATE `order` SET `status_order` = 'approved', `verify_by_vendor` = 'accepted' WHERE `order_id` = '" + order_id + "'"
  } else {
    query_ += "UPDATE `order` SET `status_order` = '" + status_order + "', `verify_by_vendor` = 'pending' WHERE `order_id` = '" + order_id + "'"
  }
  // if (order_verify == "rejected") {
  //     query_ += "UPDATE `order` SET `status_order` = 'rejected_by_vendor', `verify_by_vendor` = '" + order_verify + "' WHERE `order_id` = '" + order_id + "' AND `vendor_id` = '" + req.vendor_id + "'"
  // }
  // if (order_verify == "pending") {
  //     query_ += "UPDATE `order` SET `verify_by_vendor` = '" + order_verify + "' WHERE `order_id` = '" + order_id + "' AND `vendor_id` = '" + req.vendor_id + "'"
  // }
  connection.query(query_, (err, rows, fields) => {
    if (err) {
      console.log(err)
      res.status(200).json({ "response": "status update opration failed", "status": false });
      // res.status(200).send({ "status": false, "response": "find some error" })
    } else {
      if (rows.changedRows >= 1) {
        //  res.status(200).send({ "status": true, "response": "order " + order_verify + " successfull" })
        console.log(rows)

        connection.query("SELECT *,(select delivered_date from `order_delivery_details` where `order`.order_id = `order_delivery_details`.order_id) AS delivered_date FROM `order` WHERE `order_id` = '" + order_id + "'", (err, rows, fields) => {
          if (err) {
            console.log(err)
            // res.status(200).send({ "status": false, "response": "find some error" })
          } else {
            // rows,
            console.log(rows[0])
            let { order_id, product_id, user_id, vendor_id, total_order_product_quantity, total_amount, total_gst, total_cgst, total_sgst, total_discount, shipping_charges, invoice_id, payment_mode, payment_ref_id, order_date, delivery_date, invoice_date, discount_coupon, discount_coupon_value, created_on, updated_on, status_order, delivery_lat, delivery_log, user_name, address, email, pin_code, city, user_image, phone_no, delivery_verify_code, verify_by_vendor, only_this_order_product_total, only_this_order_product_quantity, only_this_product_gst, only_this_product_cgst, only_this_product_sgst } = rows[0]
            // console.log({ order_id, payment, payment_method, order_delivery_confirm_code })
            const dateObject = new Date(delivery_date);
            const formattedDate = dateObject.toISOString().slice(0, 19).replace('T', ' ');
            connection.query('INSERT INTO `notification`(`actor_id`, `actor_type`, `message`, `status`) VALUES ("' + user_id + '","user","order your order current staus is ' + status_order + '","unread"),("001","admin","successfully changed user (user_id ' + user_id + ') order status","unread")', (err, rows) => {
              if (err) {
                //console.log({ "notification": err })
              } else {
                console.log("_______notification-send__94________")
              }
            })
            const mail_configs = {
              from: 'rahul.verma.we2code@gmail.com',
              to: email,
              subject: 'order status change',
              text: "order your order current staus is " + status_order + "",
              html: "<h1> your order current staus is " + status_order + "<h1/>"
            }
            nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: "rahul.verma.we2code@gmail.com",
                pass: "sfbmekwihdamgxia",
              }
            })
              .sendMail(mail_configs, (err) => {
                if (err) {
                  return //console.log({ "email_error": err });
                } else {
                  return { "send_mail_status": "send successfully" };
                }
              })

            if (status_order == "approved") {
              connection.query("INSERT INTO `order_delivery_details`(`order_id`,`order_asign_by`, `payment`,  `payment_method`, `order_delivery_confirm_code`,`order_ready_to_asign_for_delivery_by`,`delivery_date`) VALUES ('" + order_id + "','vendor','" + only_this_order_product_total + "', '" + payment_mode + "', '" + delivery_verify_code + "' ,'" + req.vendor_id + "','" + formattedDate + "')", (err, result) => {
                if (err) {
                  console.log(err)
                  if (err.code == "ER_DUP_ENTRY") {
                    res.status(200).json({ "response": "already exist for delivery", "status": false });
                  } else {
                    res.status(200).json({ "response": "when asgin for delivery admin find some error", "status": false });
                    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "something went wrong", "status": false });
                  }

                } else {
                  // res.status(StatusCodes.OK).json(rows);
                  res.status(200).json({ "response": "status updated successfully", "res_db": result, "status": true });
                  // res.status(200).send({ "status": true, "response": "order " + order_verify + " successfull" })
                }
              });
            } else {
              res.status(200).json({ "response": "status updated successfully", "res_db": row, "status": true });
              // res.status(200).send({ "status": true, "response": "order " + order_verify + " successfull" })
            }

          }
        })

      } else {
        res.status(200).json({ "response": "status update opration failed", "status": false });
        // res.status(200).send({ "status": false, "response": "find some error" })
      }
    }
  })

}


export async function vendor_order_search(req, res) {
  let search_obj = Object.keys(req.body)
  // var search_string = "where ";
  var search_string1 = ""
  console.log(req.vendor_id)
  let group_by = ""
  if (req.query.group == "yes") {
    group_by = " GROUP BY order_id "
  } else {

  }

  if (req.query.delivery_side) {
    search_string1 = 'SELECT * FROM `order_delivery_details`, `order` WHERE `order_delivery_details`.`order_id` = `order`.`order_id` AND `vendor_id` = "' + req.vendor_id + '" AND '
  } else {
    search_string1 = 'SELECT * ,(select delivered_date from `order_delivery_details` where `order_view`.order_id = `order_delivery_details`.order_id) AS delivered_date FROM `order_view` where vendor_id="' + req.vendor_id + '" AND '
  }


  console.log(search_obj)
  for (var i = 0; i <= search_obj.length - 1; i++) {
    if (i == 0) {
      if (req.body[search_obj[i]] != "") {
        search_string1 += ` name LIKE "%${req.body[search_obj[i]]}%" AND `
      }
    } else {

      if (req.body[search_obj[i]] != "") {
        // search_string1 += ` ${search_obj[i]} = "${req.body[search_obj[i]]}" AND `


        var arr = JSON.stringify(req.body[search_obj[i]]);
        var abc = "'" + arr + "'"
        const id = abc.substring(abc.lastIndexOf("'[") + 2, abc.indexOf("]'"));
        search_string1 += ' ' + search_obj[i] + ' IN ' + '(' + id + ') AND '
      }
    }
    if (i === search_obj.length - 1) {
      search_string1 = search_string1.substring(0, search_string1.length - 5);
    }
  }

  console.log(search_string1)
  var pg = req.query;
  var numRows;

  var numPerPage = pg.per_page;
  var page = parseInt(pg.page, pg.per_page) || 0;
  var numPages;
  var skip = page * numPerPage;
  // Here we compute the LIMIT parameter for MySQL query
  var limit = skip + "," + numPerPage;

  connection.query(
    "SELECT count(*) as numRows FROM order_view",
    (err, results) => {
      if (err) {
      } else {
        numRows = results[0].numRows;
        numPages = Math.ceil(numRows / numPerPage);
        console.log(search_string1 + group_by +
          "ORDER BY order_date DESC LIMIT " +
          limit +
          "")
        connection.query(search_string1 + group_by +
          " ORDER BY order_date DESC LIMIT " +
          limit +
          "",
          (err, results) => {
            if (err) {
              //console.log(err)
              res.status(502).send(err);
            } else {
              // //console.log("_____")
              var responsePayload = {
                results: results,
              };
              if (page < numPages) {
                responsePayload.pagination = {
                  current: page,
                  perPage: numPerPage,
                  previous: page > 0 ? page - 1 : undefined,
                  next: page < numPages - 1 ? page + 1 : undefined,
                };
              } else
                responsePayload.pagination = {
                  err:
                    "queried page " +
                    page +
                    " is >= to maximum page number " +
                    numPages,
                };
              // //console.log("responsePayload++++++++++++++++++++++++++++++++++++++++");
              ////console.log(responsePayload);
              res.status(200).send(responsePayload);
            }
          }
        );
      }
    }
  );
  // }
}