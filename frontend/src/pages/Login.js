import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { APIUrl, handleError, handleSuccess } from '../utils';
import './Login.css'; // Assuming we'll create a separate CSS file for Login-specific styles

const Login = () => {
    const [loginInfo, setLoginInfo] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setLoginInfo((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!loginInfo.email || !loginInfo.password) {
            return handleError('Email and password are required');
        }

        try {
            const response = await fetch(`${APIUrl}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginInfo),
            });

            const result = await response.json();
            if (result.success) {
                handleSuccess(result.message);
                localStorage.setItem('token', result.jwtToken);
                localStorage.setItem('loggedInUser', result.name);
                setTimeout(() => navigate('/home'), 1000);
            } else {
                handleError(result.error?.details?.[0]?.message || result.message);
            }
        } catch (err) {
            handleError('Something went wrong. Please try again.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1 className="login-header">Login</h1>
                <form onSubmit={handleLogin} className="login-form">
                    <div className="input-group">
                        <label htmlFor="email" className="input-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email..."
                            value={loginInfo.email}
                            onChange={handleChange}
                            required
                            className="input-field"
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password" className="input-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password..."
                            value={loginInfo.password}
                            onChange={handleChange}
                            required
                            className="input-field"
                        />
                    </div>
                    <button
                        type="submit"
                        className="submit-button"
                    >
                        Login
                    </button>
                </form>
                <div className="signup-link">
                    Don't have an account?{' '}
                    <Link to="/signup" className="signup-text">
                        Sign up
                    </Link>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Login;
