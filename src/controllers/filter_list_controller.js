import connection from "../../Db.js";

export function filter_list(req, res) {
  var response_array = {}
  // var pathname = url.parse(req.url).pathname;
  console.log("----" + req.protocol + "://" + req.headers.host)
  // console.log(pathname)
  connection.query('SELECT DISTINCT brand FROM product WHERE 1', (err, rows, fields) => {
    if (err) {
      //console.log("/brand_list"+err)
      res.status(200).send(err)
    } else {
      console.log(rows)
      response_array["brand_data"] = rows
      connection.query('SELECT DISTINCT category FROM product WHERE 1', (err, rows, fields) => {
        if (err) {
          //console.log("/brand_list"+err)
          res.status(200).send(err)
        } else {
          //console.log("_____")
          //   res.status(200).send(rows)
          response_array["category_data"] = rows
          res.status(200).send(response_array)
        }
      })
    }
  })
}