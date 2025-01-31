const UserModel = require("../Models/User");

const addTransaction = async (req, res) => {
    const { _id } = req.user;
    const { text, amount, type, date } = req.body; // Destructure the new 'date' field

    // Check if all required fields are provided
    if (!text || !amount || !type) {
        return res.status(400).json({
            message: "Please provide all expense details (text, amount, type)",
            success: false
        });
    }

    // If no date is provided, use the current date
    const transactionDate = date ? new Date(date) : new Date();

    try {
        const userData = await UserModel.findByIdAndUpdate(
            _id,
            { $push: { expenses: { text, amount, type, date: transactionDate } } }, // Add 'date' in the expense object
            { new: true } // To return the updated document
        );
        
        res.status(200).json({
            message: "Expense added successfully",
            success: true,
            data: userData?.expenses
        });
    } catch (err) {
        return res.status(500).json({
            message: "Something went wrong",
            error: err,
            success: false
        });
    }
};

const getAllTransactions = async (req, res) => {
    const { _id } = req.user;
    try {
        const userData = await UserModel.findById(_id).select('expenses');
        res.status(200).json({
            message: "Fetched Expenses successfully",
            success: true,
            data: userData?.expenses
        });
    } catch (err) {
        return res.status(500).json({
            message: "Something went wrong",
            error: err,
            success: false
        });
    }
};

const deleteTransaction = async (req, res) => {
    const { _id } = req.user;
    const expenseId = req.params.expenseId;
    try {
        const userData = await UserModel.findByIdAndUpdate(
            _id,
            { $pull: { expenses: { _id: expenseId } } },
            { new: true } // To return the updated document
        );
        
        res.status(200).json({
            message: "Expense Deleted successfully",
            success: true,
            data: userData?.expenses
        });
    } catch (err) {
        return res.status(500).json({
            message: "Something went wrong",
            error: err,
            success: false
        });
    }
};

module.exports = {
    addTransaction,
    getAllTransactions,
    deleteTransaction
};
