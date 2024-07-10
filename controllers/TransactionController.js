import Product from "../models/ProductModel.js";
import User from "../models/UserModel.js";
import Transaction from "../models/TransactionModel.js";
import midtransClient from 'midtrans-client';
import Cart from "../models/CartModel.js";

export const createTransaction = async (req, res) => {
    const { productList, deduction, quantity } = req.body;
    const userId = req.user.userId;

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // product list :
        // [
        //     {
        //         "productName": "Kanvas A5",
        //         "productPrice": "90000",
        //         "quantity": 3
        //     },
        //     {
        //         "productName": "Kanvas",
        //         "productPrice": "20000",
        //         "quantity": 1
        //     }
        // ]

        const total = productList.reduce((acc, item) => {
            return acc + item.productPrice * item.quantity;
        }, 0);

        const transaction = await Transaction.create({
            userId,
            productList,
            deduction,
            quantity,
            total,
        });

        const snap = new midtransClient.Snap({
            isProduction: false,
            serverKey: process.env.MIDTRANS_SERVER_KEY,
            clientKey: process.env.MIDTRANS_CLIENT_KEY,
        });

        const parameter = {
            transaction_details: {
                order_id: transaction.id,
                gross_amount: total,
            },
            customer_details: {
                first_name: user.firstName,
                last_name: user.lastName,
                email: user.email,
            },
        };

        snap.createTransaction(parameter).then((transaction) => {
            const dataPayment = {
                response: JSON.stringify(transaction),
            };

            const token = transaction.token

            res.status(200).json({
                message: "Transaction created successfully",
                token: token,
                dataPayment,
                transaction,
            });
        })

        Cart.destroy({
            where: {
                userId,
            },
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const midtransNotification = async (req, res) => {
    const { orderId } = req.body;

    try {
        const Transaction = await Transaction.findByPk(orderId);

        const Total = Transaction.productList.reduce((acc, item) => {
            return acc + item.productPrice * item.quantity;
        }, 0);

        const snap = new midtransClient.Snap({
            isProduction: false,
            serverKey: process.env.MIDTRANS_SERVER_KEY,
            clientKey: process.env.MIDTRANS_CLIENT_KEY,
        });

        snap.transaction.notification(req.body).then((statusResponse) => {
            if (statusResponse.transaction_status == 'capture') {
                if (statusResponse.gross_amount == Total) {
                    if (statusResponse.fraud_status == 'accept') {
                        Transaction.status = 'success';
                        Transaction.save();
                    }
                }
            } else if (statusResponse.transaction_status == 'settlement') {
                Transaction.status = 'success';
                Transaction.save();
            } else if (statusResponse.transaction_status == 'cancel' || statusResponse.transaction_status == 'deny' || statusResponse.transaction_status == 'expire') {
                Transaction.status = 'failed';
                Transaction.save();
            }
        });


    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const updateTransactionStatus = async (req, res) => {
    const { orderId, status } = req.body;

    try {
        const transaction = await Transaction.findByPk(orderId);
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        transaction.status = status;
        await transaction.save();

        res.status(200).json({ message: "Transaction updated successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


export const transactionListByuser = async (req, res) => {
    const userId = req.user.userId;

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const transactions = await Transaction.findAll({
            where: {
                userId,
            },
        });

        res.status(200).json({ transactions });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

}