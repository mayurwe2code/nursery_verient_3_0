import express from 'express'
import { payment, transaction_list } from '../controllers/transactionCotroller.js'

let transactionRouter = express.Router();

transactionRouter.post("/payment", payment)
transactionRouter.get("/transaction_list", transaction_list)

export default transactionRouter