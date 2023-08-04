import express from "express";
import {
  add_to_cart,
  cartById,
  cart_delete,
  cart_list,
  cart_update,
  cart_and_notification_count
} from "../controllers/cartController.js";
import { auth_user, fetch_user } from '../../middleware/auth.js'
const cartRouter = express.Router();
cartRouter.post("/add_to_cart", auth_user, add_to_cart);
cartRouter.get("/cart_list", auth_user, cart_list);
cartRouter.get("/cart_list/:id", fetch_user, cartById);
cartRouter.put("/cart_delete", auth_user, cart_delete);
cartRouter.put("/cart_update", auth_user, cart_update);
cartRouter.get("/cart_and_notification_count", auth_user, cart_and_notification_count);
// cartRouter.post("/coupan_verify", auth_user, coupan_verify);
export default cartRouter;
