import connection from "../../Db.js";

function add_blog(req, res) {

    console.log(req.created_by_id)
    var { admin_id, title, description, category, product_tag, publish_date } = req.body;

    if (req.file == undefined || req.file == '') {
        image = "no image"
    } else {
        var image = req.protocol + "://" + req.headers.host + "/blog/" + req.file.filename;
        //console.log(image)
    }

    connection.query('INSERT INTO `blog`(`actor_id`,`actor_type`, `image`, `title`, `description`, `category`, `product_tag`,`publish_date`) VALUES ("' + req.created_by_id + '","' + req.actor_type + '","' + image + '","' + title + '","' + description + '","' + category + '","' + product_tag + '","' + publish_date + '")', (err, rows, fields) => {
        if (err) {
            res.status(200).send(err)
        } else {
            res.status(201).send({ "message": "add blog Succecsfully" })
        }
    })

}

function blogs(req, res) {
    var query_flg = false
    var { id, recent, category, product_tag, for_ } = req.body
    // if (for_ == 'user') {
    //     var str_blog = 'SELECT * FROM `blog` WHERE is_delete=1 AND status="published"'
    // }
    // if (for_ == 'admin') {
    //     var str_blog = 'SELECT * FROM `blog` WHERE is_delete=1'
    // }
    var str_blog = 'SELECT * FROM `blog` WHERE is_delete=1'
    if (id == '' && recent == '' && category == '' && product_tag == '') {
        query_flg = true
    } else {
        query_flg = true
        if (id != '') {
            str_blog += ' AND id = ' + id + ''
        } else {

            if (category != '') {
                var category_ar = JSON.stringify(category);
                var category_arr = "'" + category_ar + "'"
                var category_arr = category_arr.substring(category_arr.lastIndexOf("'[") + 2, category_arr.indexOf("]'"));
                //console.log("__" + category_arr + "__")
                str_blog += ' AND category IN (' + category_arr + ')'
            } else {
                //console.log("category_null")
            }
            //category != '' ? str_blog += ' AND category = "' + category + '"' : console.log("category_null")
            product_tag != '' ? str_blog += ' AND product_tag LIKE "%' + product_tag + '%"' : console.log("product_tag_null")
            recent != '' ? str_blog += ' AND created_on >= ( CURDATE() - INTERVAL ' + recent + ' DAY ) ORDER BY id DESC' : console.log("recent_null")
        }
    }
    if (query_flg) {
        //console.log(str_blog)
        connection.query('' + str_blog + ' ORDER BY `updated_on` DESC', (err, rows, fields) => {
            if (err) {
                res.status(200).send(err)
            } else {
                //console.log("_____")
                if (rows != '') {
                    res.status(200).send(rows)
                } else {
                    res.status(200).send({ message: "No blogs Data" })
                }

            }
        })
    }
}

function update_blog(req, res) {
    //console.log("req.body")
    if (req.headers.admin_token != '' && req.headers.admin_token != undefined) {
        console.log("req.admin_vendor_com_id+++++++++++")
        console.log(req.admin_vendor_com_id)
        var { id, admin_id, title, description, category, product_tag, publish_date } = req.body;
        var newdate = new Date();
        var blog_newdate = newdate.getFullYear() + "-" + (newdate.getMonth() + 1) + "-" + newdate.getDate();
        if (req.file == undefined || req.file == '') {
            // image = "no image"
            connection.query('UPDATE `blog` SET `title`="' + title + '",`description`="' + description + '",`category`="' + category + '",`product_tag`="' + product_tag + '",`publish_date`="' + publish_date + '",`updated_on`="' + blog_newdate + '" WHERE admin_id="' + admin_id + '" AND id="' + id + '"', (err, rows, fields) => {
                if (err) {
                    res.status(200).send(err)
                } else {
                    rows.affectedRows == '1' ? res.status(200).send({ "message": "update_blog_successfully" }) : res.status(200).send({ "message": "invalid_id" })
                }
            })
        } else {
            var image = "http://192.168.29.109:8000/catgory_images/" + req.file.filename;
            //console.log(image)
            //console.log("pass+++++++")
            connection.query('UPDATE `blog` SET `image`="' + image + '",`title`="' + title + '",`description`="' + description + '",`category`="' + category + '",`product_tag`="' + product_tag + '",`publish_date`="' + publish_date + '",`updated_on`="' + blog_newdate + '" WHERE admin_id="' + admin_id + '" AND id="' + id + '"', (err, rows, fields) => {
                if (err) {
                    res.status(200).send(err)
                } else {
                    rows.affectedRows == '1' ? res.status(200).send({ "message": "update_blog_successfully" }) : res.status(200).send({ "message": "invalid_id" })
                }
            })
        }

    } else {
        res.status(200).send({ "response": "please send vendor or admin token" })
    }
}

function update_blog_status(req, res) {
    //console.log("update_blog_status")
    //console.log("pass+++++++")
    if (req.headers.admin_token != '' && req.headers.admin_token != undefined) {

        connection.query('UPDATE `blog` SET `status`="' + req.body.status + '" WHERE id=' + req.body.id + '', (err, rows, fields) => {
            if (err) {
                res.status(200).send(err)
            } else {
                rows.affectedRows == '1' ? res.status(200).send({ "message": "update_status_successfully" }) : res.status(200).send({ "message": "invalid_id" })
            }
        })
    } else {
        res.status(200).send({ "response": "please send vendor or admin token" })
    }
}

function delete_blog(req, res) {
    //console.log("req.body")
    //console.log("pass+++++++")
    if (req.headers.admin_token != '' && req.headers.admin_token != undefined) {

        if (req.body.is_delete == '0') {
            connection.query('UPDATE `blog` SET `is_delete`="' + req.body.is_delete + '" WHERE id=' + req.body.id + '', (err, rows, fields) => {
                if (err) {
                    res.status(200).send(err)
                } else {
                    rows.affectedRows == '1' ? res.status(200).send({ "message": "delete_blog_successfully" }) : res.status(200).send({ "message": "invalid_id" })
                }
            })
        } else {
            res.send("invalid_data")
        }
    } else {
        res.status(200).send({ "response": "please send vendor or admin token" })
    }
}

export { add_blog, blogs, update_blog, update_blog_status, delete_blog }




