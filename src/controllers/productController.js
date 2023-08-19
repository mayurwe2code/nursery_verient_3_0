import connection from "../../Db.js";
import { StatusCodes } from "http-status-codes";

export async function addproduct(req, res) {
  var { name, seo_tag, brand, review, rating, description, category, care_and_Instructions, benefits } = req.body;
  console.log("body--" + JSON.stringify(req.body));
  console.log(req.body);
  console.log("vvvvvvvvvvvvvv" + req.vendor_id)
  if (req.vendor_id != "" && req.vendor_id != undefined) {
    console.log('INSERT INTO `product` (`vendor_id`,`name`,`seo_tag`,`category`,`description`,`care_and_Instructions`,`benefits`,`created_by`, `created_by_id`) values ("' + req.vendor_id + '","' + name + '","' + seo_tag + '","' + category + '","' + description + '","' + care_and_Instructions + '","' + benefits + '","' + req.created_by + '","' + req.created_by_id + '")')
    connection.query(
      'INSERT INTO `product` (`vendor_id`,`name`,`seo_tag`,`category`,`description`,`care_and_Instructions`,`benefits`,`created_by`, `created_by_id`) values ("' + req.vendor_id + '","' + name + '","' + seo_tag + '","' + category + '","' + description + '","' + care_and_Instructions + '","' + benefits + '","' + req.created_by + '","' + req.created_by_id + '")',
      (err, result) => {
        if (err) {
          console.log(err)
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ "response": "find error", "status": false });
        } else {
          console.log("chk------------------70")
          console.log(result)
          res.status(StatusCodes.OK).json({ "response": "add successfull", "message": result, "status": true });
        }
      }
    );
  } else {
    res.send({ "response": "vendor_id undifined", "status": false })
  }

}

export async function getallProduct(req, res) {
  connection.query("select * from product", (err, result) => {
    if (err) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "someting went wrong" });
    } else {
      res.status(StatusCodes.OK).json(result);
    }
  });
}

export async function getProductbyId(req, res) {
  connection.query(
    "select * from product where id='" + req.params.id + "'",
    (err, result) => {
      if (err) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "someting went wrong" });
      } else {
        res.status(StatusCodes.OK).json(result);
      }
    }
  );
}

export async function update_Product(req, res) {
  let req_obj = req.body;
  var updat_str = "update `product` set "
  var k = ""
  if (req_obj.id !== undefined && req_obj.id !== "") {
    for (k in req_obj) {

      if (!["updated_on", "id", "vendor_id", "all_images_url", "cover_image", "created_on", "created_by", "is_active", "status", "is_deleted", "product_verient_id", "product_id", "verient_name", "quantity", "unit", "product_stock_quantity", "price", "mrp", "gst", "sgst", "cgst", "verient_is_deleted", "verient_status", "discount", "verient_description", "verient_is_active", "verient_created_on", "verient_updated_on", "product_height", "product_width", "product_Weight"].includes(k)) {
        if (req_obj[k] != null && req_obj[k] != "null") {
          updat_str += ` ${k} = "${req_obj[k]}", `
          console.log(k)
        }
      }
    }
    updat_str = updat_str.substring(0, updat_str.length - 2);

    if (req.headers.admin_token) {
      updat_str += "  where id = '" + req_obj.id + "'"
      console.log("_________________________updat_str_________________________")
      console.log(updat_str)
      connection.query(updat_str,
        (err, result) => {
          if (err) {
            res.status(500).send({ "response": "error - opration failed", "status": false });
            console.log(err)
          } else {
            result.affectedRows == "1" ? res.status(200).json({ "response": result, "message": "update successfull", "status": true })
              : res.status(500).send({ "response": "error - opration failed", "status": false })

          }
        }
      );

    } else if (req.headers.vendor_token) {
      updat_str += "  where id = '" + req_obj.id + "' AND vendor_id = '" + req.vendor_id + "'"
      console.log("_________________________updat_str_________________________")
      console.log(updat_str)
      connection.query(updat_str,
        (err, result) => {
          if (err) {
            res.status(500).send({ "response": "error - opration failed", "status": false });
            console.log(err)
          } else {
            result.affectedRows == "1" ? res.status(200).json({ "response": result, "message": "update successfull", "status": true })
              : res.status(500).send({ "response": "error - opration failed", "status": false })
          }
        }
      );
    } else {
      console.log("_____________________check_token----- send token admin_token or vendor_token ")
      res.send({ "response": "please send admin_token or vendor_token", "status": false })

    }

  } else {
    res.send({ "response": "please send product identity", "status": false })
  }
}



export async function update_Product_verient(req, res) {
  let req_obj = req.body;
  var updat_str = "update `product_verient` set "
  var k = ""
  if (req_obj.product_verient_id !== undefined && req_obj.product_verient_id !== "") {
    for (k in req_obj) {
      if (!["care_and_Instructions", "benefits", "all_images_url", "cover_image", "verient_created_on", "verient_updated_on", "product_verient_id", "product_id", "verient_is_active", "verient_status", "verient_is_deleted", "id", "vendor_id", "name", "seo_tag", "brand", "category", "is_deleted", "status", "review", "rating", "description", "is_active", "created_by", "created_by_id", "created_on", "updated_on"].includes(k)) {
        if (req_obj[k] != null && req_obj[k] != "null") {
          updat_str += ` ${k} = "${req_obj[k]}", `
          console.log(k)
        }
      }
    }
    updat_str = updat_str.substring(0, updat_str.length - 2);

    if (req.headers.admin_token) {
      updat_str += "  where product_verient_id = '" + req_obj.product_verient_id + "'"
      console.log("_________________________updat_str_________________________")
      console.log(updat_str)
      connection.query(updat_str,
        (err, result) => {
          if (err) {
            res.status(500).send({ "response": "error - opration failed", "status": false });
            console.log(err)
          } else {
            result.affectedRows == "1" ? res.status(200).json({ "response": result, "message": "update successfull", "status": true })
              : res.status(500).send({ "response": "error - opration failed", "status": false })

          }
        }
      );

    } else if (req.headers.vendor_token) {
      updat_str += "  where product_verient_id = '" + req_obj.product_verient_id + "' AND vendor_id = '" + req.vendor_id + "'"
      console.log("_________________________updat_str_________________________")
      console.log(updat_str)
      connection.query(updat_str,
        (err, result) => {
          if (err) {
            res.status(500).send({ "response": "error - opration failed", "status": false });
            console.log(err)
          } else {
            result.affectedRows == "1" ? res.status(200).json({ "response": result, "message": "update successfull", "status": true })
              : res.status(500).send({ "response": "error - opration failed", "status": false })

          }
        }
      );
    } else {
      console.log("_____________________check_token----- send token admin_token or vendor_token ")
      res.send({ "response": "please send admin_token or vendor_token", "status": false })

    }

  } else {
    res.send({ "response": "please send product identity", "status": false })
  }
}
export async function delete_product(req, res) {
  let { is_deleted, id } = req.body
  let dlt_query = ""
  let dlt_verient_query = ""
  if (req.headers.admin_token != "" && req.headers.admin_token != undefined) {
    dlt_verient_query += "UPDATE `product_verient` SET `verient_is_deleted` = " + is_deleted + " WHERE `product_verient`.`product_id` = " + id + ""
    dlt_query += "UPDATE `product` SET `is_deleted` = " + is_deleted + " WHERE `product`.`id` = " + id + ""
    // dlt_query += "delete  from product where id ='" + req.body.id + "' AND vendor_id = '" + req.vendor_id + "'"
  } else if (req.headers.vendor_token != "" && req.headers.vendor_token != undefined) {
    dlt_query += "UPDATE `product` SET `is_deleted` = " + is_deleted + " WHERE `product`.`id` = " + id + " AND `product`.`vendor_id` = " + req.vendor_id + ""
    dlt_verient_query += "UPDATE `product_verient` SET `verient_is_deleted` = " + is_deleted + " WHERE `product_verient`.`product_id` = " + id + " AND `product_verient`.`vendor_id` = " + req.vendor_id + ""
    // dlt_query += "delete  from product where id ='" + req.body.id + "'"
  } else {
    dlt_verient_query = ""
  }

  if (is_deleted && id) {
    connection.query(dlt_query, (err, result) => {
      if (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ "response": "not delete ", "status": false });
      } else {
        if (result.affectedRows >= 1) {
          connection.query(dlt_verient_query, (err, result) => {
            if (err) {
              res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ "response": "not delete ", "status": false });
            } else {
              res.status(StatusCodes.OK).json({ "response": "update successfully", "status": true })
            }
          }
          );
        } else { res.status(StatusCodes.OK).json({ "response": "not delete ", "status": false }); }
      }
    }
    );
  } else {
    res.status(StatusCodes.OK).json({ "response": "please fill all inputs", "status": false });
  }

}

export async function delete_restore_product_verient(req, res) {
  let { is_deleted, product_verient_id } = req.body
  let dlt_verient_query = ""
  if (req.headers.admin_token != "" && req.headers.admin_token != undefined) {
    dlt_verient_query += "UPDATE `product_verient` SET `verient_is_deleted` = " + is_deleted + " WHERE `product_verient`.`product_verient_id` = " + product_verient_id + ""
  } else if (req.headers.vendor_token != "" && req.headers.vendor_token != undefined) {
    dlt_verient_query += "UPDATE `product_verient` SET `verient_is_deleted` = " + is_deleted + " WHERE `product_verient`.`product_verient_id` = " + product_verient_id + " AND `product_verient`.`vendor_id` = " + req.vendor_id + ""
  } else {
    dlt_verient_query = ""
  }
  connection.query(dlt_verient_query, (err, result) => {
    if (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ "response": "not delete ", "status": false });
    } else {
      res.status(StatusCodes.OK).json({ "response": "update successfully", "status": true })
    }
  }
  );

}
// (SELECT GROUP_CONCAT(category_name) from category WHERE FIND_IN_SET(id,product_view.category) )AS category_name,
export async function search_product(req, res) {
  var { price_from, price_to } = req.body;
  console.log(req.body)
  let group_by = " "
  let is_featured = ""
  let search_string_asc_desc = ""
  let search_string_asc_desc1 = ""
  if (req.query.group == "yes") {
    group_by = " GROUP BY product_id  "
  } else {
    console.log("------------check--group----------------" + req.query.group)
  }
  if (req.query.is_featured == "yes") {
    is_featured = " is_fetured != 'null' AND   "
  }
  // 'SELECT *, (SELECT id FROM cart WHERE cart.product_id = product.id AND user_id = "' + req.user + '") FROM products  AND '
  if (req.query["DESC"]) {
    search_string_asc_desc1 = group_by + " ORDER BY " + req.query["DESC"] + " DESC "
  } else if (req.query["ASC"]) {
    search_string_asc_desc1 = group_by + " ORDER BY " + req.query["ASC"] + " ASC "
  } else {
    search_string_asc_desc1 = group_by + " ORDER BY verient_created_on  DESC "
  }
  // 'SELECT *, (SELECT id FROM cart WHERE cart.product_id = product.id AND user_id = "' + req.user + '") FROM products  AND '
  // var query_string = "select * from product  where ";
  let search_obj = Object.keys(req.body)
  console.log(req.user_id)


  let today = new Date();
  let sevenDaysAgo = new Date(today);
  let to_date = today.toISOString().slice(0, 19).replace("T", " ");
  sevenDaysAgo.setDate(today.getDate() - 30);
  let from_date = sevenDaysAgo.toISOString().slice(0, 19).replace("T", " ");

  if (req.user_id != "" && req.user_id != undefined) {
    var search_string = 'SELECT *,(SELECT IF(COUNT(`order`.product_id)>10,"YES","NO") From `order` WHERE product_view.product_id=`order`.product_id AND (`order`.created_on BETWEEN "' + from_date + '" AND "' + to_date + '")) AS is_trending ,(SELECT cart_product_quantity FROM cart WHERE cart.product_verient_id = product_view.product_verient_id AND user_id = "' + req.user_id + '") AS cart_count,(SELECT id FROM wishlist WHERE wishlist.product_verient_id = product_view.product_verient_id AND user_id = "' + req.user_id + '") AS wishlist FROM product_view where ' + is_featured + 'verient_is_deleted ="0" AND   ';
  } else {

    if (req.headers.vendor_token != "" && req.headers.vendor_token != undefined) {
      var search_string = 'SELECT *, (SELECT IF(COUNT(`order`.product_id)>10,"YES","NO") From `order` WHERE product_view.product_id=`order`.product_id AND (.created_on BETWEEN "' + from_date + '" AND "' + to_date + '")) AS is_trending FROM product_view where vendor_id = "' + req.vendor_id + '" AND verient_is_deleted ="0" AND ' + is_featured + '  ';
    } else {
      var search_string = 'SELECT *, (SELECT IF(COUNT(`order`.product_id)>10,"YES","NO") From `order` WHERE product_view.product_id=`order`.product_id AND (`order`.created_on BETWEEN "' + from_date + '" AND "' + to_date + '")) AS is_trending FROM product_view where ' + is_featured + ' verient_is_deleted ="0" AND   ';
    }
  }


  console.log(search_obj)
  if (price_from != "" && price_to != "") {
    search_string += '(`price` BETWEEN "' + price_from + '" AND "' + price_to + '") AND   '
  }

  for (var i = 0; i <= search_obj.length - 1; i++) {

    if (i >= 6) {
      if (i == 6) {
        if (req.body[search_obj[i]] != "") {
          search_string += `(name LIKE "%${req.body[search_obj[i]]}%" OR verient_name LIKE "%${req.body[search_obj[i]]}%" OR category_name LIKE "%${req.body[search_obj[i]]}%" OR seo_tag LIKE "%${req.body[search_obj[i]]}%") AND   `
        }
      } else if (i == 7) {

        if (req.body[search_obj[i]] != "") {
          search_string_asc_desc1 = `${group_by} ORDER BY ${req.body[search_obj[i]]} `
        }

      } else {
        // if (req.body[search_obj[i]] != "") {
        //   var arr = JSON.stringify(req.body[search_obj[i]]);
        //   var abc = "'" + arr + "'"
        //   const id = abc.substring(abc.lastIndexOf("'[") + 2, abc.indexOf("]'"));
        //   search_string += ' ' + search_obj[i] + ' IN ' + '(' + id + ') AND   '
        //   // search_string+= `${search_obj[i]} = "${req.body[search_obj[i]]}" AND   `
        // }

        if (req.body[search_obj[i]] != "") {
          var key_for_query = search_obj[i]
          var multi_val_ar = req.body[search_obj[i]]

          if (search_obj[i] == "avgRatings") {
            for (var m = 0; m < multi_val_ar.length; m++) {
              let rat_for = parseFloat(multi_val_ar[m]) - 0.5;
              let rat_to = parseFloat(multi_val_ar[m]) + 0.5;
              search_string += '( `avgRatings` BETWEEN "' + rat_for + '" AND "' + rat_to + '") OR    '
              if (m == multi_val_ar.length - 1) {
                search_string += '( `avgRatings` BETWEEN "' + rat_for + '" AND "' + rat_to + '") AND   '
              }
            };

          } else if (search_obj[i] == "discount_up" || search_obj[i] == "discount_upto") {
            var discount_up_upto = req.body[search_obj[i]]
            console.log("chk---new---filter-----------------")
            if (search_obj[i] == "discount_up") {
              search_string += '( `discount` BETWEEN "' + discount_up_upto + '" AND "100") AND   '
            }
            if (search_obj[i] == "discount_upto") {
              search_string += '( `discount` BETWEEN "1" AND "' + discount_up_upto + '") AND   '
            }
          } else {

            for (var k = 0; k < multi_val_ar.length; k++) {
              if (k == multi_val_ar.length - 1) {
                search_string += `FIND_IN_SET('${multi_val_ar[k]}', ${key_for_query}) AND   `
              } else {
                search_string += `FIND_IN_SET('${multi_val_ar[k]}', ${key_for_query}) OR     `
              }
              // search_string += ' ' + search_obj[i] + ' IN ' + '(' + id + ') AND   '
            };


            // var arr = JSON.stringify(req.body[search_obj[i]]);
            // var abc = "'" + arr + "'"
            // const id = abc.substring(abc.lastIndexOf("'[") + 2, abc.indexOf("]'"));
            // search_string += ' ' + search_obj[i] + ' IN ' + '(' + id + ') AND   '
            // // search_string+= `${search_obj[i]} = "${req.body[search_obj[i]]}" AND   `
          }
        }
      }
    } else {
      if (i > 1) {
        // if (search_obj[i] != undefined && req.body[search_obj[i]] != "") {
        //   search_string_asc_desc = ` ORDER BY ${search_obj[i].replace("__", "")} ${req.body[search_obj[i]]} `
        // }
      }
    }

    // && req.query.is_featured != "yes"
    if (i === search_obj.length - 1) {

      search_string = search_string.substring(0, search_string.length - 7);
      // if (search_obj[2] != undefined && req.body[search_obj[2]] != "") {
      search_string += search_string_asc_desc1
      // }

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
    "SELECT count(*) as numRows FROM product_view " + group_by,
    (err, results) => {
      if (err) {
      } else {
        numRows = results[0].numRows;
        numPages = Math.ceil(numRows / numPerPage);
        var count_rows;
        var new_qry_ = search_string + group_by
        connection.query(new_qry_.replace("*", "count(*) AS `count_rows` "),
          (err, results) => {
            console.log("results---------------------------------------")
            console.log(results)
            try {
              count_rows = results[0]["count_rows"]
            } catch (e) {
              count_rows = "no"
            }

          })

        console.log("" + search_string + " LIMIT " + limit + "")
        connection.query("" + search_string + " LIMIT " + limit + "",
          (err, results) => {
            if (err) {
              console.log("err___________________194")
              console.log(err)
              res.status(200).send({ "response": "find error" });
            } else {
              // //console.log("_____")
              var responsePayload = {
                results: results,
              };
              if (page < numPages) {
                responsePayload.pagination = {
                  count_rows: count_rows,
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
              res.status(200).send(responsePayload);
            }
          }
        );
      }
    }
  );
}

export function add_product_verient(req, res) {
  var { product_id, verient_name, quantity, unit, product_stock_quantity, price, mrp, discount, gst, cgst, sgst, verient_description, product_height, product_width, product_Weight } = req.body;

  connection.query("SELECT * FROM `product` WHERE id=" + product_id + " AND vendor_id = " + req.vendor_id + "", (err, results) => {
    if (err) {
      console.log(err)
      res.send({ "status": false, "response": "find some error" })
    } else {
      if (results != "") {
        console.log("body--" + JSON.stringify(req.body));
        console.log(mrp + " > " + price)
        const n_mrp = parseInt(mrp)
        const n_price = parseInt(price)

        console.log(n_mrp + " > " + n_price)
        console.log(n_mrp > n_price)
        if (n_mrp >= n_price) {
          if (req.vendor_id != "" && req.vendor_id != undefined) {
            connection.query(
              ' INSERT INTO `product_verient` (`product_id`,`vendor_id`, `verient_name`,`quantity`,`unit`,`product_stock_quantity`,`price`,`mrp`,`gst`,`sgst`,`cgst`,`discount`,`verient_description`,`product_height`,`product_width`,`product_Weight`) values ("' +
              product_id +
              '","' + req.vendor_id + '","' +
              verient_name +
              '","' + quantity + '","' + unit + '","' + product_stock_quantity + '","' + price + '","' + mrp + '","' + gst + '","' + sgst +
              '","' +
              cgst +
              '","' +
              discount +
              '","' +
              verient_description +
              '","' + product_height + '","' + product_width + '","' + product_Weight + '") ',
              (err, result) => {
                if (err) {
                  console.log(err)
                  res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ "response": "find error", "status": false });
                } else {
                  console.log("chk------------------70")
                  console.log(result)
                  res.status(StatusCodes.OK).json({ "response": "add successfull", "message": result, "status": true });
                }
              }
            );
          } else {
            res.send({ "response": "vendor_id undifined", "status": false })
          }
        } else {
          res.send({ "response": "product price is always less then product MRP", "status": false })
        }
      } else {
        res.send({ "status": false, "response": "please add product, before verient add" })
      }
    }
  })

}