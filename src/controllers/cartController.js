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

    console.log("------check-already-exist-or-not-query--------SELECT * FROM cart WHERE user_id ='" + req.user_id + "' AND product_id = '" + product_id + "' AND product_verient_id='" + product_verient_id + "'")
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

  var str_cart = 'select cart.id,user_id,cart.product_id,cart.product_verient_id,cart_product_quantity,cart.created_on AS cart_created_on,cart.updated_on AS cart_updated_on,is_status,vendor_id,name,seo_tag,brand,category,category_name,is_deleted,status,review,rating,description,care_and_Instructions,benefits,is_active,created_by,created_by_id,product_view.created_on,product_view.updated_on,verient_name,quantity,unit,product_stock_quantity,price,mrp,gst,sgst,cgst,verient_is_deleted,verient_status,discount,verient_description,verient_is_active,verient_created_on,verient_updated_on,product_height,product_width,product_Weight,all_images_url,is_fetured,cover_image,avgRatings  from cart,product_view where cart.product_verient_id = product_view.product_verient_id AND user_id="' + req.user_id + '"'

  console.log(str_cart)
  connection.query(str_cart, (err, rows) => {
    if (err) {
      console.log("err---------------------63-----")
      console.log(err)
      res
        .status(200)
        .json({ message: "something went wrong" });
    } else {
      res.status(StatusCodes.OK).json(rows);
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


