import connection from "../../Db.js";


export function review_rating(req, res) {
    //console.log("review")
    //console.log("req.body")

    console.log(req.user_id)
    var { product_id, product_name, user_name, review_rating, comment, review_date } = req.body;
    connection.query('SELECT * FROM `review` WHERE user_id="' + req.user_id + '" AND product_id="' + product_id + '"', (err, rows, fields) => {
        if (err) {
            //console.log("/review_error"+err)
            res.status(200).send(err)
        } else {
            if (rows == "") {
                connection.query('INSERT INTO  `review`( `user_id`, `user_name`, `product_id`,`product_name`,`review_date`,`review_rating`, `comment`) VALUES ("' + req.user_id + '","' + user_name + '","' + product_id + '","' + product_name + '","' + review_date + '","' + review_rating + '","' + comment + '")', (err, rows, fields) => {
                    if (err) {
                        res.status(200).send(err)
                    } else {
                        //console.log("review_rating Data Insert Succecsfully")
                        res.status(201).send({ status: true, message: "Review Rating Data Insert Succecsfully" })
                    }
                })
            } else {
                res.status(200).send({ "message": "User already Reviewed", "status": false })
            }

        }
    })

}


export function review_approved(req, res) {

    if (req.headers.admin_token) {
        var { id, status } = req.body;
        connection.query('UPDATE `review` SET `status`="' + status + '" WHERE `id`="' + id + '" ', (err, rows, fields) => {
            if (err) {
                res.status(200).send(err)
            } else {
                //console.log("review_approved update Succecsfully")
                res.status(200).send({ status: true, message: "Review " + status + " Update Succecsfully" })
            }
        })
    } else {
        res.status(200).send({ status: false, "response": "please send admin token" })
    }
}

export function review_list(req, res) {
    //console.log("req.body")
    var { product_name, status, product_id } = req.body;
    if (product_name != '' || status != '') {

        var stringsearch = 'SELECT * FROM `review` WHERE '
        var catobj = req.body;
        //console.log(catobj)
        var objvalue = Object.values(catobj)
        var objkey = Object.keys(catobj)
        for (let m = 0; m < objkey.length; m++) {
            if (objvalue[m] != '') {
                if (m == 0) {
                    stringsearch += "`" + objkey[m] + "` LIKE '%" + objvalue[m] + "%' "
                } else {
                    if (objvalue[0] == '') {
                        stringsearch += "`" + objkey[m] + "` LIKE '%" + objvalue[m] + "%' AND "
                    } else {
                        stringsearch += " AND `" + objkey[m] + "` LIKE '%" + objvalue[m] + "%'"
                    }
                }
            }
        }
        //console.log(stringsearch)
        var lastCharOfHello = stringsearch.slice(-4);
        //console.log("________"+lastCharOfHello+"_______")
        if (lastCharOfHello == "AND ") {
            var id = stringsearch.substring(stringsearch.lastIndexOf(' AND') + 1, stringsearch.indexOf("  "));
            stringsearch = id;
        } else {

            //console.log("no avia")
        }

        connection.query('' + stringsearch + ' ORDER BY id DESC', (err, rows, fields) => {
            if (err) {
                //console.log("/review_error"+err)
                res.status(200).send(err)
            } else {
                res.status(200).send(rows)
            }
        })
    } else if (product_id) {
        connection.query('SELECT * FROM `review` WHERE product_id = "' + product_id + '"  ORDER BY id DESC', (err, rows, fields) => {
            if (err) {
                //console.log("/review_error"+err)
                res.status(200).send(err)
            } else {
                res.status(200).send(rows)
            }
        })
    } else {
        connection.query('SELECT * FROM `review` WHERE 1 ORDER BY id DESC', (err, rows, fields) => {
            if (err) {
                //console.log("/review_error"+err)
                res.status(200).send(err)
            } else {
                res.status(200).send(rows)
            }
        })
    }

}