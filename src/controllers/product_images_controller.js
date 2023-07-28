import connection from "../../Db.js";
import fs from 'fs'
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export function add_product_image(req, res) {

  console.log("add_product_image________________________________________check")
  var res_data_arr = []
  var base64_images = req.body
  // console.log(base64_images)
  let iterations = base64_images.length - 1;
  var product_image_data = Array()
  base64_images.forEach(function (item, index) {
    var imgBase64 = item.img_64
    var img_num = Math.floor(100000 + Math.random() * 900000);

    if (item["image_position"] == "cover") {
      connection.query(`UPDATE \`product_images\` SET \`image_position\`='' WHERE product_verient_id =${item["product_verient_id"]} AND product_id = ${item["product_id"]} AND vendor_id = ${req.vendor_id}`, (err, rows, fields) => {
      })
    }

    try {
      // var base64Data = imgBase64.replace("data:image/png;base64,", "");
      var name_str = "" + item["product_image_name"] + "_" + img_num + ""
      console.log("chkkkkkkkkkkkkk--------------------20")
      console.log(name_str)
      fs.writeFileSync(path.join(__dirname, '../../') + 'public/product_images/' + name_str + ".png", imgBase64, 'base64');
      connection.query('INSERT INTO `product_images`(`product_id`,`vendor_id`,`product_verient_id`, `product_description`,`product_image_name`, `product_image_path`, `image_position`) VALUES ("' + item.product_id + '", "' + req.vendor_id + '","' + item.product_verient_id + '","' + item.product_description + '", "' + name_str + '.png", "' + req.protocol + "://" + req.headers.host + "/product_images/" + name_str + '.png", "' + item.image_position + '")', (err, rows, fields) => {
        if (err) {
          console.log("add-image--error--data--------")
          console.log(err)
          //res.status(200).send(err)
        } else {
          console.log("add-image--result--data--------")
          console.log(rows)
          var obj_i = {}
          obj_i["product_id"] = item["product_id"]
          obj_i["product_verient_id"] = item["product_verient_id"]
          obj_i["product_image_id"] = rows["insertId"]
          obj_i["product_image_path"] = req.protocol + "://" + req.headers.host + '/product_images/' + name_str + '.png'
          obj_i["image_position"] = item["image_position"]
          console.log(obj_i)
          product_image_data[index] = obj_i
        }
        console.log(index + " =first= " + iterations);
        if (index === iterations) {

          console.log(index + " == " + iterations)
          console.log("product_image_data------------check-----------46-------test====")
          console.log(product_image_data)
          res.status(200).json({ status: true, "response": "successfully add images", product_image_data })
        }
      })
    } catch (err) {
      console.log(err)
    }
    //console.log(item.vendor_id)

  })
}

export function product_image_update(req, res) {
  console.log("product_image_________________________________________-")
  var query_ = ""
  let base64_images = req.body
  // console.log(base64_images)
  let iterations = base64_images.length - 1;
  base64_images.forEach(function (item, index) {

    if (item["image_position"] == "cover") {
      connection.query(`UPDATE \`product_images\` SET \`image_position\`='' WHERE product_verient_id =${item["product_verient_id"]} AND product_id = ${item["product_id"]} `, (err, rows, fields) => {
      })
    }
    try {
      let imgBase64 = item.img_64
      let img_num = Math.floor(100000 + Math.random() * 900000);
      var base64Data = imgBase64.replace("data:image/png;base64,", "");
      var name_str = "" + item.product_image_name.split(" ").join("") + "_" + img_num + ""

      fs.writeFileSync(path.join(__dirname, '../../') + 'public/product_images/' + name_str + ".png", base64Data, 'base64');

      query_ = 'UPDATE `product_images` SET `product_image_name`="' + name_str + '.png",`product_image_path`= "' + req.protocol + "://" + req.headers.host + name_str + '.png",`image_position`="' + item.image_position + '" WHERE product_image_id = "' + item.product_image_id + '" AND product_id = "' + item.product_id + '" AND product_verient_id ="' + item.product_verient_id + '"'
    } catch (err) {
      console.log(err)
      query_ = 'UPDATE `product_images` SET `image_position`="' + item.image_position + '" WHERE product_image_id = "' + item.product_image_id + '" AND product_id = "' + item.product_id + '" AND product_verient_id ="' + item.product_verient_id + '"'
    }

    //console.log(item.vendor_id)
    //'UPDATE `product_images` SET `product_description`="' + item.product_description + '",`product_image_name`="' + name_str + '.png",`product_image_path`= "' + req.protocol + "://" + req.headers.host + name_str + '.png",`image_position`="' + item.image_position + '" WHERE product_image_id = "' + item.product_image_id + '" AND product_id = "' + item.product_id + '" AND product_verient_id ="' + item.product_verient_id + '"'
    connection.query(query_, (err, rows, fields) => {
      if (err) {
        console.log(err)
        //res.status(200).send(err)
      } else {
        console.log(rows)
      }
    })

    if (index == iterations) {
      console.log(index + " == " + iterations)
      res.status(200).send({ "response": "successfully update images" })
    }
  })
}



export function product_image(req, res) {
  var { product_id, product_image_id } = req.body
  let img_get_str = 'SELECT * FROM product_images WHERE '
  // if (product_id != "" || product_image_id != "") {
  //   var img_get_str = ' SELECT * FROM product_images WHERE '
  //   if (product_id != "") {
  //     img_get_str += 'product_id = "' + product_id + '" AND '
  //   }
  //   if (product_image_id != "") {
  //     img_get_str += ' product_image_id = "' + product_image_id + '" AND '
  //   }

  for (let k in req.body) {
    if (req.body[k]) {
      img_get_str += `${k} = ${req.body[k]} AND  `
    }
  }
  img_get_str = img_get_str.substring(0, img_get_str.length - 6);
  console.log(img_get_str)
  connection.query(img_get_str, (err, rows, fields) => {
    if (err) {
      console.log(err)
      res.status(500).send({ "error": "server error" })
    } else {
      console.log(rows)
      res.status(200).send(rows)
    }
  })
  // } else {
  //   res.status(200).send({ "error": "please fill all inputs" })
  // }

}


export function add_remove_cover_image(req, res) {
  var { image_position, product_image_id, product_id, product_verient_id } = req.body
  if (image_position == "cover") {
    connection.query(`UPDATE \`product_images\` SET \`image_position\`='' WHERE product_verient_id =${product_verient_id} AND product_id = ${product_id} `, (err, rows, fields) => {
    })
  }
  connection.query(' UPDATE `product_images` SET `image_position`="' + image_position + '" WHERE product_image_id = "' + product_image_id + '" AND product_id = "' + product_id + '" AND product_verient_id="' + product_verient_id + '"', (err, rows, fields) => {
    if (err) {
      console.log(err)
      res.status(200).send({ success: false, message: "opration failed" })
    } else {
      console.log(rows)
      rows.affectedRows ? res.status(200).send({ success: true, message: "updated successfull" }) : res.status(200).send({ success: false, message: "opration failed" })
    }
  })
}


export function product_image_delete(req, res) {
  var { product_image_id, product_id, product_image_name, product_verient_id } = req.body

  connection.query('DELETE FROM `product_images` WHERE `product_image_id` = ' + product_image_id + ' AND product_id = ' + product_id + ' AND product_verient_id=' + product_verient_id + '', (err, rows, fields) => {
    if (err) {
      console.log(err)
      res.status(500).send({ "error": "server error", "status": false })
    } else {
      console.log(rows)
      if (rows.affectedRows == '1') {
        try {
          fs.unlinkSync('/home/we2code/Desktop/nursery_proj/nursery_live/public/product_images/' + product_image_name + '');
          console.log("Delete File successfully.");
        } catch (error) {
          console.log(error);
        }
        res.status(200).send(rows)
      } else {
        res.status(200).send({ "response": "product_id or product_image_id not match", "status": false })
      }
    }
  })



}

