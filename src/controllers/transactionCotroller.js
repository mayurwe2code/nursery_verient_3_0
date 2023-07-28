import connection from "../../Db.js";
import { StatusCodes } from "http-status-codes";

export function payment(req, res) {
    console.log("transactionRouter")
    let { user_id, order_id, amount, payment_method, transection_id, is_payment_done } = req.body

    connection.query("INSERT INTO `transaction`( `user_id`, `order_id`, `amount`, `payment_method`, `transection_id`, `is_payment_done`) VALUES ('" + user_id + "', '" + order_id + "', '" + amount + "','" + payment_method + "', '" + transection_id + "', '" + is_payment_done + "')",
        (err, result) => {
            if (err) {
                res
                    .status(StatusCodes.INTERNAL_SERVER_ERROR)
                    .json({ "status": false, "message": "someting went wrong" });
            } else {
                res.status(StatusCodes.OK).json({ "status": true, "message": "payment done successfully" });
            }
        }
    );
}

export function transaction_list(req, res) {
    console.log("transaction_list--------")
    connection.query("SELECT * FROM transaction WHERE 1",
        (err, result) => {
            if (err) {
                res
                    .status(StatusCodes.INTERNAL_SERVER_ERROR)
                    .json({ "status": false, "message": "someting went wrong" });
            } else {
                res.status(StatusCodes.OK).json({ "status": true, "response": result });
            }
        }
    );
}