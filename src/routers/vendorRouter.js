import express from "express";
import {
    // add_user,
    // delete_restore_user,
    // getalluser,
    // update_user,
    // user_search,
    vendor_signup,
    vendor_otp_verify,
    vendor_login,
    vendor_forgate_password,
    vendor_forgate_password_update,
    vendor_details,
    update_vendor_profile,
    admin_add_vendor,
    vendor_list,
    admin_change_vendor_status,
    search_vendor_product,
    order_verify_by_vendor,
    vendor_orders_status,
    vendor_product_list,
    vendor_update_delivery_boy_pickuped_order
    // user_details,
    // change_user_password,
    // user_forgate_password,
    // admin_login, user_forgate_password_update
} from "../controllers/vendorController.js";
import { auth_user, fetch_user, admin_auth, auth_vendor } from '../../middleware/auth.js'
import multer from "multer"

// const upload = multer({ dest: "/home/we2code/Desktop/nursery_proj/nursery_live/public/product_images/user_profile" });

// const multerFilter = (req, file, cb) => {
//   if (file.mimetype.split("/")[1] === "pdf") {
//     cb(null, true);
//   } else {
//     cb(new Error("Not a PDF File!!"), false);
//   }
// };

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/vendor_shop_img/");
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


const vendor_router = express.Router();

// vendor_router.post("/add_user", add_user);
// vendor_router.get("/all_user", getalluser);
// vendor_router.get("/user_search", user_search);

vendor_router.post("/vendor_signup", vendor_signup);
vendor_router.post("/vendor_otp_verify", vendor_otp_verify);
vendor_router.post("/vendor_login", vendor_login);
vendor_router.post("/vendor_forgate_password", vendor_forgate_password)
vendor_router.put("/vendor_forgate_password_update", auth_vendor, vendor_forgate_password_update)
// // userRouter.post("/user_profile_update", user_profile_update);
// vendor_router.put("/update_user", auth_user, upload.single("image"), update_user);
// vendor_router.put("/delete_restore_user", admin_auth, delete_restore_user);
// vendor_router.post("/user_search", admin_auth, user_search);
vendor_router.get("/vendor_details", auth_vendor, vendor_details);
vendor_router.post("/update_vendor_profile", admin_auth, upload.single("shop_logo"), update_vendor_profile);
vendor_router.post("/admin_add_vendor", admin_auth, upload.single("shop_logo"), admin_add_vendor);
vendor_router.post("/vendor_list", vendor_list);
vendor_router.post("/admin_change_vendor_status", admin_change_vendor_status);
vendor_router.post("/search_vendor_product", fetch_user, search_vendor_product);
vendor_router.put("/order_verify_by_vendor", admin_auth, order_verify_by_vendor);
vendor_router.get("/vendor_orders_status", admin_auth, vendor_orders_status);
vendor_router.post("/vendor_product_list", fetch_user, vendor_product_list);
vendor_router.post("/vendor_update_delivery_boy_pickuped_order", fetch_user, vendor_update_delivery_boy_pickuped_order);



// vendor_router.post("/change_user_password", change_user_password);
// vendor_router.post("/user_forgate_password", user_forgate_password);
// vendor_router.post("/user_forgate_password_update", auth_user, user_forgate_password_update);

// userRouter.post("/admin_login", admin_login);



export default vendor_router;
