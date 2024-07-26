import Product from "../models/ProductModel.js";
import User from "../models/UserModel.js";
import midtransClient from 'midtrans-client';
import Cart from "../models/CartModel.js";
import TransactionModel from "../models/TransactionModel.js";

export const createTransaction = async (req, res) => {
    const { productList, deduction, quantity } = req.body;
    const userId = req.user.userId;

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const total = productList.reduce((acc, item) => {
            return acc + item.productPrice * item.quantity;
        }, 0);

        const transactionLocal = await TransactionModel.create({
            userId,
            productList,
            deduction,
            quantity,
            total,
            status: 'pending',
        });

        const snap = new midtransClient.Snap({
            isProduction: false,
            serverKey: process.env.MIDTRANS_SERVER_KEY,
            clientKey: process.env.MIDTRANS_CLIENT_KEY,
        });

        const parameter = {
            transaction_details: {
                order_id: transactionLocal.id,
                gross_amount: total,
            },
            customer_details: {
                first_name: user.firstName,
                last_name: user.lastName,
                email: user.email,
            },
            callbacks: {
                finish: `${process.env.WEB_URL}/orders`,
                error: `${process.env.WEB_URL}/orders`,
                cancel: `${process.env.WEB_URL}/orders`,
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
                transactionLocal
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
    const { transactionId } = req.body;

    try {
        const transaction = await TransactionModel.findByPk(transactionId);
        console.log(transaction);

        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        const productList = JSON.parse(transaction.productList);

        const total = productList.reduce((acc, item) => {
            return acc + Number(item.productPrice) * item.quantity;
        }, 0);

        const user = await User.findByPk(transaction.userId);

        const snap = new midtransClient.Snap({
            isProduction: false,
            serverKey: process.env.MIDTRANS_SERVER_KEY,
            clientKey: process.env.MIDTRANS_CLIENT_KEY,
        });

        const parameter = {
            transaction_details: {
                order_id: transactionId,
                gross_amount: total,
            },
            customer_details: {
                first_name: user.firstName,
                last_name: user.lastName,
                email: user.email,
            },
            callbacks: {
                finish: `${process.env.WEB_URL}/orders`,
                error: `${process.env.WEB_URL}/orders`,
                cancel: `${process.env.WEB_URL}/orders`,
            },
        };

        // Check if there is already an existing Snap transaction
        if (transaction.dataPayment && transaction.dataPayment.response) {
            const existingTransaction = JSON.parse(transaction.dataPayment.response);
            if (existingTransaction.token) {
                return res.status(200).json({
                    message: "Existing transaction found",
                    token: existingTransaction.token,
                });
            }
        }

        // If no existing transaction, create a new Snap transaction
        snap.createTransaction(parameter).then(async (newTransaction) => {
            const dataPayment = {
                response: JSON.stringify(newTransaction),
            };

            transaction.dataPayment = dataPayment;
            await transaction.save();

            res.status(200).json({
                message: "Transaction created successfully",
                token: newTransaction.token,
                dataPayment,
                transaction,
            });
        }).catch((error) => {
            res.status(500).json({ message: error.message });
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateTransactionStatus = async (req, res) => {
    const { orderId, status } = req.body;
    console.log(req.body);

    try {
        const transaction = await TransactionModel.findByPk(orderId);
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

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { count, rows: transactions } = await TransactionModel.findAndCountAll({
            where: { userId },
            include: [{ model: User, as: 'user', attributes: ['username'] }],
            offset: offset,
            limit: limit,
            order: [["updatedAt", "DESC"]]
        });

        res.status(200).json({
            message: "Transactions fetched successfully",
            transactions: transactions.map(transaction => {
                const { user, ...transactionData } = transaction.toJSON();
                return {
                    ...transactionData,
                    username: user.username,
                    transactionDetails: `${process.env.BASE_URL}/transactions/${transaction.id}`
                };
            }),
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

}

export const transactionAllList = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { count, rows: transactions } = await TransactionModel.findAndCountAll({
            include: [{ model: User, as: "user", attributes: ["username"] }],
            offset: offset,
            limit: limit,
            order: [["createdAt", "DESC"]]
        });

        res.status(200).json({
            message: "Transactions fetched successfully",
            transactions: transactions.map(transaction => {
                const { user, ...transactionData } = transaction.toJSON();
                return {
                    ...transactionData,
                    username: user.username,
                    transactionDetails: `${process.env.BASE_URL}/transactions/${transaction.id}`
                };
            }),
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}