import express from "express";
import multer from "multer";
import bodyParser from "body-parser";
import path from "path";
import { addproduct, delete_product, getallProduct, getProductbyId, search_product, update_Product, add_product_verient, update_Product_verient, delete_restore_product_verient } from "../controllers/productController.js";
import { admin_auth, fetch_user } from '../../middleware/auth.js'
const app = express();
app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);
app.use(express.static("public"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/product_images/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = Date.now();
    cb(null, name + ext);
  },
});





const upload = multer({ storage: storage });

const productRouter = express.Router();
productRouter.post("/addProduct", admin_auth, addproduct);
productRouter.post("/add_product_verient", admin_auth, add_product_verient);
productRouter.put("/update_product", admin_auth, update_Product);
productRouter.put("/update_Product_verient", admin_auth, update_Product_verient);
productRouter.get("/getproduct", getallProduct);
productRouter.get("/getproduct/:id", getProductbyId);
productRouter.put("/delete_product", admin_auth, delete_product);
productRouter.put("/delete_restore_product_verient", admin_auth, delete_restore_product_verient);
productRouter.post("/search", fetch_user, search_product);
export default productRouter;
