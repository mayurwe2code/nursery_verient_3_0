import express from "express";
import multer from "multer"
import { add_category, update_category, category_list } from '../controllers/cetegoryController.js'
const categoryRouter = express.Router()

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/catgory_images/");
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1];
        cb(null, `${file.fieldname}${Date.now()}.${ext}`);
    },
});

const upload = multer({
    storage: multerStorage,
    // fileFilter: multerFilter,
});


categoryRouter.post("/add_category", upload.single('image'), add_category)
categoryRouter.put("/update_category", upload.single('image'), update_category)
categoryRouter.post("/category_list", category_list)



export default categoryRouter; 