import express from "express";
import {
    add_blog, blogs, update_blog, update_blog_status, delete_blog
} from "../controllers/blogController.js";
import { auth_user, fetch_user } from '../../middleware/auth.js'
import multer from "multer"
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/blog/");
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



const blogRouter = express.Router();
blogRouter.post("/add_blog", fetch_user, upload.single('image'), add_blog)
blogRouter.post("/blogs", blogs)
blogRouter.put("/update_blog", fetch_user, upload.single('image'), update_blog)
blogRouter.put("/update_blog_status", fetch_user, update_blog_status)
blogRouter.put("/delete_blog", fetch_user, delete_blog)

export default blogRouter;
