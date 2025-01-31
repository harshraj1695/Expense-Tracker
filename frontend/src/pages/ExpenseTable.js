import React from 'react';

const ExpenseTable = ({ expenses, deleteExpens }) => {

    return (
        <div className="expense-list">
            {expenses.map((expense, index) => (
                <div key={index} className="expense-item">
                    <button className="delete-button" onClick={() =>
                        deleteExpens(expense._id)}>X</button>
                    <div className="expense-description">{expense.text}</div>
                    <div className="expense-type">{expense.type}</div>  {/* Displaying the type */}
                    <div
                        className="expense-amount"
                        style={{ color: expense.amount > 0 ? '#27ae60' : '#c0392b' }}
                    >₹{expense.amount}</div>
                    <div className="expense-date">
                        {/* Formatting the date */}
                        {new Date(expense.date).toLocaleDateString('en-IN', { 
                            weekday: 'short', 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ExpenseTable;
