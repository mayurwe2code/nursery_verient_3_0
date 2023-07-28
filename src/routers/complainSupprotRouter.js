
import express from "express";
import { add_complain, complain_update, complain_search } from "../controllers/complainSupportController.js";
import { admin_auth, auth_user, fetch_user } from "../../middleware/auth.js"

const complainSupportRouter = express.Router()
complainSupportRouter.post("/add_complain", auth_user, add_complain)
complainSupportRouter.put("/complain_update", admin_auth, complain_update)
complainSupportRouter.post("/complain_search", (req, res, next) => {
    if (req.headers.user_token) { auth_user(req, res, next) } else { admin_auth(req, res, next) }
}, complain_search)

export default complainSupportRouter;