import express from 'express'
import { review_rating, review_approved, review_list } from '../controllers/reviewController.js'
import { auth_user, admin_auth } from "../../middleware/auth.js";
let reviewRouter = express.Router();

reviewRouter.post("/review_rating", auth_user, review_rating)
reviewRouter.put("/review_approved", admin_auth, review_approved)
reviewRouter.post("/review_list", review_list)
// reviewRouter.post("/review_list", fetchuser, review_list)
// reviewRouter.get("/review_detaile", fetchuser, review_detaile)
// reviewRouter.post("/ratings_review_get", ratings_review_get)
export default reviewRouter