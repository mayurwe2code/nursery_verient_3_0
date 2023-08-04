import connection from "../../Db.js";

export function add_remove_to_wishlist(req, res) {
    let { product_id, product_verient_id } = req.body
    connection.query("SELECT * FROM wishlist WHERE user_id ='" + req.user_id + "' AND product_id = '" + product_id + "' AND product_verient_id='" + product_verient_id + "'",
        (err, rows) => {
            if (err) {
                console.log(err)
                res
                    .status(200)
                    .json({ "success": false, "response": "something went wrong" });
            } else {
                if (rows == "") {
                    connection.query("INSERT INTO `wishlist`( `user_id`, `product_id`, `product_verient_id`) VALUES ('" + req.user_id + "','" + product_id + "','" + product_verient_id + "')",
                        (err, rows) => {
                            if (err) {

                            } else {
                                res.status(200).json({ "success": true, "response": "added in wishlist" });
                            }
                        })
                } else {
                    connection.query("DELETE FROM `wishlist` WHERE user_id ='" + req.user_id + "' AND product_id = '" + product_id + "' AND product_verient_id='" + product_verient_id + "'",
                        (err, rows) => {
                            if (err) {
                            } else {
                                res.status(200).json({ "success": true, "response": "already add in wishlist remove product to wishlist" });
                            }
                        })
                }
            }
        })
}
export function wishlist(req, res) {
    //
    //"SELECT * FROM wishlist WHERE user_id ='" + req.user_id + "' AND product_id = '" + product_id + "' AND product_verient_id='" + product_verient_id + "'"

    let today = new Date();
    let sevenDaysAgo = new Date(today);
    let to_date = today.toISOString().slice(0, 19).replace("T", " ");
    sevenDaysAgo.setDate(today.getDate() - 30);
    let from_date = sevenDaysAgo.toISOString().slice(0, 19).replace("T", " ");

    connection.query('SELECT wishlist.id AS wishlist_id,wishlist.created_on AS wishlist_created_on, product_view.*,(SELECT IF(COUNT(`order`.product_id)>10,"YES","NO") From `order` WHERE product_view.product_id=`order`.product_id AND (`order`.created_on BETWEEN "' + from_date + '" AND "' + to_date + '")) AS is_trending ,(SELECT cart_product_quantity FROM cart WHERE cart.product_verient_id = product_view.product_verient_id AND user_id = "' + req.user_id + '") AS cart_count FROM product_view , wishlist where wishlist.product_verient_id=product_view.product_verient_id AND verient_is_deleted ="0"',
        (err, rows) => {
            if (err) {
                console.log(err)
                res.status(200).json({ status: false, res_msg: "find error" })
            } else {
                rows != "" ? res.status(200).json({ status: true, res_msg: "success", response: rows }) : res.status(200).json({ status: true, res_msg: "wishlist list empty", response: rows })


            }
        })
}