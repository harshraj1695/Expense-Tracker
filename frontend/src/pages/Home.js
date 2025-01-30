import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APIUrl, handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import ExpenseTable from './ExpenseTable';
import ExpenseDetails from './ExpenseDetails';
import ExpenseForm from './ExpenseForm';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, Filler } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, Filler);

function Home() {
    const [loggedInUser, setLoggedInUser] = useState('');
    const [expenses, setExpenses] = useState([]);
    const [incomeAmt, setIncomeAmt] = useState(0);
    const [expenseAmt, setExpenseAmt] = useState(0);
    const [expenseTypes, setExpenseTypes] = useState({});
    const [loading, setLoading] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [expenseToDelete, setExpenseToDelete] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser'));
    }, []);

    const handleLogout = (e) => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handleSuccess('User Loggedout');
        setTimeout(() => {
            navigate('/login');
        }, 1000);
    };

    useEffect(() => {
        const amounts = expenses.map(item => item.amount);
        const income = amounts.filter(item => item > 0)
            .reduce((acc, item) => (acc += item), 0);
        const exp = amounts.filter(item => item < 0)
            .reduce((acc, item) => (acc += item), 0) * -1;
        setIncomeAmt(income);
        setExpenseAmt(exp);

        // Calculate the expense types distribution
        const types = expenses.reduce((acc, expense) => {
            if (expense.type) {
                acc[expense.type] = (acc[expense.type] || 0) + expense.amount;
            }
            return acc;
        }, {});
        setExpenseTypes(types);
    }, [expenses]);

    const deleteExpens = async () => {
        try {
            setLoading(true);
            const url = `${APIUrl}/expenses/${expenseToDelete}`;
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token'),
                },
                method: "DELETE",
            };
            const response = await fetch(url, headers);
            if (response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }
            const result = await response.json();
            handleSuccess(result?.message);
            setExpenses(result.data);
            setShowConfirmation(false);
        } catch (err) {
            handleError(err);
            setShowConfirmation(false);
        } finally {
            setLoading(false);
        }
    };

    const fetchExpenses = async () => {
        try {
            setLoading(true);
            const url = `${APIUrl}/expenses`;
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token'),
                },
            };
            const response = await fetch(url, headers);
            if (response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }
            const result = await response.json();
            setExpenses(result.data);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    };

    const addTransaction = async (data) => {
        try {
            setLoading(true);
            const url = `${APIUrl}/expenses`;
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token'),
                    'Content-Type': 'application/json',
                },
                method: "POST",
                body: JSON.stringify(data),
            };
            const response = await fetch(url, headers);
            if (response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }
            const result = await response.json();
            handleSuccess(result?.message);
            setExpenses(result.data);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    // Prepare data for the bar chart
    const chartData = {
        labels: ['Income', 'Expenses'],
        datasets: [
            {
                label: 'Amount',
                data: [incomeAmt, expenseAmt],
                backgroundColor: ['#4CAF50', '#FF5733'],
                borderRadius: 10,
                barPercentage: 0.5,
            },
        ],
    };

   // Prepare data for the pie chart (expense type distribution)
const pieChartData = {
    labels: Object.keys(expenseTypes),
    datasets: [
        {
            label: 'Expense Types',
            data: Object.values(expenseTypes),
            backgroundColor: Object.keys(expenseTypes).map((type, index) => {
                // Assign a different color for each type (you can customize this list)
                const colors = [
                    '#FF6347', '#4682B4', '#FF8C00', '#8A2BE2', '#3CB371', '#FFD700', '#D2691E', '#FF1493',
                    '#20B2AA', '#B22222', '#32CD32', '#8B008B', '#E9967A', '#800080', '#00CED1'
                ];
                return colors[index % colors.length];  // Loop through the colors array
            }),
            borderColor: '#ffffff',
            borderWidth: 2,
        },
    ],
};


    return (
        <div className="home-container">
            <div className="user-section">
                <h1>Welcome {loggedInUser}</h1>
                <button onClick={handleLogout}>Logout</button>
            </div>

            <div className="content-container">
                {/* Left Section: Income vs Expenses Graph */}
                <div className="graph-section">
                    <h2>Income vs Expenses</h2>
                    <Bar data={chartData} />
                </div>

                {/* Right Section: Expense Type Pie Chart */}
                {Object.keys(expenseTypes).length > 0 && (
                    <div className="pie-chart-section">
                        <h2>Expense Type Distribution</h2>
                        <Pie data={pieChartData} />
                    </div>
                )}

                {/* Middle Section: Expense Details and Form */}
                <div className="form-section">
                    <ExpenseDetails incomeAmt={incomeAmt} expenseAmt={expenseAmt} />
                    <ExpenseForm addTransaction={addTransaction} />
                </div>

                {/* Right Section: Expense Table */}
                <div className="table-section">
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        <ExpenseTable
                            expenses={expenses}
                            deleteExpens={(id) => {
                                setExpenseToDelete(id);
                                setShowConfirmation(true);
                            }}
                        />
                    )}
                    {showConfirmation && (
                        <div className="confirmation-popup">
                            <p>Are you sure you want to delete this expense?</p>
                            <button onClick={deleteExpens}>Yes</button>
                            <button onClick={() => setShowConfirmation(false)}>No</button>
                        </div>
                    )}
                </div>
            </div>

            <ToastContainer />
        </div>
    );
}

export default Home;
