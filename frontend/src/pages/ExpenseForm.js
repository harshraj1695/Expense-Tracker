import React, { useState } from 'react';
import { handleError } from '../utils';

function ExpenseForm({ addTransaction }) {

    const [expenseInfo, setExpenseInfo] = useState({
        amount: '',
        text: '',
        type: '',
        date: ''  // New field for date
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        const copyExpenseInfo = { ...expenseInfo };
        copyExpenseInfo[name] = value;
        setExpenseInfo(copyExpenseInfo);
    }

    const addExpenses = (e) => {
        e.preventDefault();
        const { amount, text, type, date } = expenseInfo;
        if (!amount || !text || !type || !date) {  // Check if date is provided
            handleError('Please add all Expense Details');
            return;
        }

        // Check if it's an income type (Salary or Tip)
        const amountValue = parseFloat(amount);
        let finalAmount = amountValue;
        if (type === 'Salary' || type === 'Tip') {
            // For income types, keep the amount as positive
            finalAmount = amountValue;
        } else {
            // For expense types, keep the amount as negative
            finalAmount = -amountValue;
        }

        // Add transaction with positive or negative amount based on type
        addTransaction({ ...expenseInfo, amount: finalAmount });
        setExpenseInfo({ amount: '', text: '', type: '', date: '' }); // Reset the fields
    }

    return (
        <div className='container'>
            <h1>Expense Tracker</h1>
            <form onSubmit={addExpenses}>
                <div>
                    <label htmlFor='text'>Expense Detail</label>
                    <input
                        onChange={handleChange}
                        type='text'
                        name='text'
                        placeholder='Enter your Expense Detail...'
                        value={expenseInfo.text}
                    />
                </div>
                <div>
                    <label htmlFor='amount'>Amount</label>
                    <input
                        onChange={handleChange}
                        type='number'
                        name='amount'
                        placeholder='Enter your Amount...'
                        value={expenseInfo.amount}
                    />
                </div>
                <div>
                    <label htmlFor='type'>Type of Expense</label>
                    <select
                        onChange={handleChange}
                        name='type'
                        value={expenseInfo.type}
                    >
                        <option value=''>Select Type</option>
                        <option value='Food'>Food</option>
                        <option value='Transport'>Transport</option>
                        <option value='Entertainment'>Entertainment</option>
                        <option value='Health'>Health</option>
                        <option value='Other'>Other</option>
                        <option value='Salary'>Salary</option>    {/* Income */}
                        <option value='Tip'>Tip</option>          {/* Income */}
                    </select>
                </div>
                <div>
                    <label htmlFor='date'>Date</label>
                    <input
                        onChange={handleChange}
                        type='date'
                        name='date'
                        value={expenseInfo.date}
                    />
                </div>
                <button type='submit'>Add Expense</button>
            </form>
        </div>
    );
}

export default ExpenseForm;
