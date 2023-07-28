
import express from "express";
import {
    filter_list
} from "../controllers/filter_list_controller.js";
const filter_list_router = express.Router();
filter_list_router.get("/filter_list", filter_list);

export default filter_list_router;
