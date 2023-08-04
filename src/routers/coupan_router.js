import express from "express";
import { auth_user, fetch_user } from '../../middleware/auth.js'
import { coupan_verify, add_coupan, update_coupan, coupan_list } from '../controllers/coupan_controller.js'
import multer from "multer"
import path from 'path';

const coupanRouter = express.Router();

const imageFilter = function (req, file, cb) {
    // Check if the file is an image
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Only JPG, JPEG, and PNG image files are allowed!'));
    }
};

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'public/coupan_images/');
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + file.originalname);
    }
});
const upload = multer({ storage: storage, fileFilter: imageFilter });
coupanRouter.post("/coupan_verify", auth_user, coupan_verify);
coupanRouter.post("/add_coupan", upload.fields([{ name: 'image', maxCount: 1 }]), add_coupan);
coupanRouter.post("/update_coupan", upload.fields([{ name: 'image', maxCount: 1 }]), update_coupan);
coupanRouter.post("/coupan_list", coupan_list);

export default coupanRouter;