import express from "express";
import {
    add_remove_to_wishlist, wishlist
} from "../controllers/wishlist_controller.js";
import { auth_user, fetch_user } from '../../middleware/auth.js'
const wishlistRouter = express.Router();
wishlistRouter.post("/add_remove_to_wishlist", auth_user, add_remove_to_wishlist);
wishlistRouter.get("/wishlist", auth_user, wishlist);

export default wishlistRouter;
