
import connection from "../../Db.js";

export function vendor_select_area(req, res) {
    console.log(req.body)
    let respo_array = []
    let { pin } = req.body
    connection.query("SELECT * FROM `vendor_service_area` where pin = " + pin + "", (err, rows, fields) => {
        if (err) {
            console.log(err)
            res.status(200).send({ "status": false, "response": "find some error" })
        } else {
            // res.status(200).send({ "status": true, "response": rows })
            console.log(rows.length)
            let pin_area_length = rows.length
            if (rows.length) {
                rows.forEach((item, index) => {
                    let { area_id, pin, city, status, area_name, vendors_id } = item

                    // let { area_id, pin, city, status, area_name, vendors_id } = rows[0]
                    let st = vendors_id.substring(0, vendors_id.length - 1)
                    let vendors_id_array = st.split(",");
                    console.log("vendors_id_array" + "0000000000000000")
                    console.log(vendors_id_array)
                    if (vendors_id_array.includes(`${req.vendor_id}`)) {
                        if (index === pin_area_length - 1) {
                            res.status(200).json({ status: true, response: "already selected" })
                        }
                    } else {
                        let new_str = vendors_id + req.vendor_id + ","
                        //=====================================================================
                        connection.query("UPDATE `vendor_service_area` SET `vendors_id` ='" + new_str + "' where area_id = " + area_id + "", (err, rows, fields) => {
                            if (err) {
                                console.log(err)
                                // res.status(200).send({ "status": false, "response": "find some error" })
                                // res.status(200).json({ status: false, response: "succefull added your sevice area", your_service_area_list: respo_array })
                                if (index === pin_area_length - 1) {
                                    res.status(200).json({ status: false, response: "find some error" })
                                }
                            } else {
                                // res.status(200).send({ "status": true, "response": "add service area successfull" })
                                respo_array.push({ area_id, pin, city, status, area_name })
                                if (index === pin_area_length - 1) {
                                    res.status(200).json({ status: true, response: "succefull added your sevice area", your_service_area_list: [respo_array[0]] })
                                }
                            }
                        })
                        console.log("false------------------------")
                    }
                });
            } else {
                res.status(200).send({ "status": false, "response": "area_id not matched" })
            }

        }
    })
}
export function vendor_service_area_list(req, res) {

    if (req.vendor_id) {
        console.log("vendor_selected_areas-------------")
        connection.query("SELECT * FROM vendor_service_area WHERE FIND_IN_SET('" + req.vendor_id + "', vendors_id);", (err, rows, fields) => {
            if (err) {
                console.log(err)
                res.status(200).send({ "status": false, "response": "find some error" })
            } else {
                res.status(200).send({ "status": true, "response": rows })
            }
        })
    } else {
        let query_ = "SELECT * FROM `vendor_service_area` WHERE status = 1 "
        console.log(req.body)
        for (let k in req.body) {
            query_ += `AND  ${k} LIKE '%${req.body[k]}%'`
        }
        console.log(query_ + "group by pin")
        // return false
        connection.query(query_ + "group by pin", (err, rows, fields) => {
            if (err) {
                console.log(err)
                res.status(200).send({ "status": false, "response": "find some error" })
            } else {
                // res.status(200).send({ "status": true, "response": rows })
                console.log(rows)
                res.status(200).send({ "status": true, "response": rows })

            }
        })
    }
}

export function check_vendor_service_avaibility(req, res) {
    console.log("check_vendor_service_avaibility------------")
    let { pin, vendor_id } = req.body

    connection.query("SELECT * FROM `vendor_service_area` where pin = " + pin + "", (err, rows, fields) => {
        if (err) {
            console.log(err)
            res.status(200).send({ "status": false, "response": "find some error" })
        } else {
            // res.status(200).send({ "status": true, "response": rows })
            console.log(rows.length)
            let pin_area_length = rows.length
            if (rows.length) {
                rows.forEach((item, index) => {
                    let { area_id, pin, city, status, area_name, vendors_id } = item

                    let st = vendors_id.substring(0, vendors_id.length - 1)
                    let vendors_id_array = st.split(",");

                    var presentValues = vendor_id.filter(value => vendors_id_array.includes(value));
                    var absentValues = vendor_id.filter(value => !vendors_id_array.includes(value));

                    if (index === pin_area_length - 1) {
                        var status_
                        if (presentValues == "") {
                            status_ = false
                        } else {
                            status_ = true
                        }
                        res.status(200).json({ "status": status_, "service_available": presentValues, "service_not_available": absentValues })
                    }
                });
            } else {
                res.status(200).send({ "status": false, "service_available": [], "response": "area_id not matched" })
            }
        }
    })
}

export function vendor_selected_areas(req, res) {
    console.log("vendor_selected_areas-------------")
    connection.query("SELECT * FROM vendor_service_area WHERE FIND_IN_SET('" + req.vendor_id + "', vendors_id);", (err, rows, fields) => {
        if (err) {
            console.log(err)
            res.status(200).send({ "status": false, "response": "find some error" })
        } else {
            res.status(200).send({ "status": true, "response": rows })
        }
    })
}