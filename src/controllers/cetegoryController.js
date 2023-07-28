import connection from "../../Db.js";

export function add_category(req, res) {
    let newlevel = 1
    var { parent_id, level, all_parent_id, category_name, image, category_type, all_category_name } = req.body
    if (parent_id != '' && level != '' && all_parent_id != '' && category_name != '' && category_type != '') {

        if (req.file == undefined || req.file == '') {
            image = "no image"
        } else {
            var image = req.protocol + "://" + req.headers.host + "/catgory_images/" + req.file.filename;
        }
        //if(level>1){
        newlevel = parseInt(level) + 1
        //}else{
        //newlevel = level
        //}

        if (newlevel == 1) {
            if (parent_id != 0 && all_parent_id != 0) {
                parent_id = 0;
                all_parent_id = 0;
                all_category_name = "no"
            }
        }
        connection.query('INSERT INTO `category`(`parent_id`,`all_parent_id`,`level`,`category_name`,`category_type`,`image`,`is_active`, `all_category_name`) VALUES (' + parent_id + ',"' + all_parent_id + '",' + newlevel + ',"' + category_name + '","' + category_type + '","' + image + '",' + 1 + ',"' + all_category_name + '")', (err, rows, fields) => {
            if (err) {
                console.log("/add_category_error" + err)
                res.status(200).send(err)
            } else {
                //console.log("_____")
                res.status(201).send({ "message": "Succesfully Add Category" })
            }
        })
    } else { res.send({ "response": "please fill all inputs" }) }
}


export function update_category(req, res) {
    //console.log("req.body")

    var { id, parent_id, level, all_parent_id, category_name, category_type, image } = req.body;
    var newdate = new Date();
    var category_newdate = newdate.getFullYear() + "-" + (newdate.getMonth() + 1) + "-" + newdate.getDate();
    if (id != '' && parent_id != '' && level != '' && all_parent_id != '' && category_name != '' && category_type != '') {

        if (req.file == undefined || req.file == '') {
            // image = "no image"
            connection.query('UPDATE `category` SET `parent_id`="' + parent_id + '",`all_parent_id`="' + all_parent_id + '",`level`="' + level + '",`category_name`="' + category_name + '", `category_type`="' + category_type + '", `is_active`= "' + 1 + '",`updated_on`="' + category_newdate + '" WHERE `id`= "' + id + '"', (err, rows, fields) => {
                if (err) {
                    //console.log("/category_error" + err)
                    res.status(500).send(err)
                } else {
                    res.status(200).send({ "message": "Succesfully Update Category" })
                }
            })
        } else {
            var image = req.protocol + "://" + req.headers.host + "/catgory_images/" + req.file.filename;
            //console.log(image)

            connection.query('UPDATE `category` SET `parent_id`="' + parent_id + '",`all_parent_id`="' + all_parent_id + '",`level`="' + level + '",`category_name`="' + category_name + '", `category_type`="' + category_type + '",`image`="' + image + '", `is_active`= "' + 1 + '",`updated_on`="' + category_newdate + '" WHERE `id`= "' + id + '"', (err, rows, fields) => {
                if (err) {
                    //console.log("/category_error" + err)
                    res.status(500).send(err)
                } else {
                    res.status(200).send({ "message": "Succesfully Update Category" })
                }
            })
        }
    } else {
        res.send({ "response": "please fill all inputs" })
    }

}


export function category_list(req, res) {
    let query_ = ""
    console.log(req.query.category)
    if (req.query.category == "with_sub_category") {
        query_ = 'SELECT t1.id, t1.level, t1.category_name, t2.id AS sub_category_id, t2.level AS sub_category_level, t2.parent_id, t2.category_name AS sub_category_name,(CONCAT(t1.category_name,",",t2.category_name)) AS all_category_name FROM category AS t1, category AS t2 WHERE t1.id = t2.parent_id '

        for (let k in req.body) {
            if (req.body[k]) {
                query_ += ` AND t1.${k} = "${req.body[k]}"`
            }
        }

    } else {
        query_ = 'SELECT * FROM category  WHERE is_active = "1" '

        for (let k in req.body) {
            if (req.body[k] || req.body[k] == 0) {
                query_ += ` AND ${k} = "${req.body[k]}"`
            }
        }

    }


    console.log(query_)
    connection.query(query_, (err, rows, fields) => {
        if (err) {
            console.log("/category_error" + err)
            res.status(500).send({ "status": false, "response": "find some error" })
        } else {
            res.status(200).send({ "status": true, "response": rows })
        }
    })
}