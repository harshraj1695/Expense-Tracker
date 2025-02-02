import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { APIUrl, handleError, handleSuccess } from '../utils';
import './Signup.css'; // Assuming we'll create a separate CSS file for Login-specific styles


const Signup = () => {
    const [signupInfo, setSignupInfo] = useState({
        name: '',
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSignupInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        const { name, email, password } = signupInfo;

        if (!name || !email || !password) {
            return handleError('Name, email, and password are required.');
        }

        try {
            const response = await fetch(`${APIUrl}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(signupInfo),
            });

            const result = await response.json();
            const { success, message, error } = result;

            if (success) {
                handleSuccess(message);
                setTimeout(() => navigate('/login'), 1000);
            } else {
                handleError(error?.details?.[0]?.message || message);
            }
        } catch (err) {
            handleError('Something went wrong. Please try again.');
        }
    };

    return (
        <div className="signup-box">
            <h1 className="signup-header">Sign Up</h1>
            <form onSubmit={handleSignup} className="signup-form">
                <div className="input-group">
                    <label htmlFor="name" className="input-label">Name</label>
                    <input
                        onChange={handleChange}
                        type="text"
                        name="name"
                        placeholder="Enter your name..."
                        value={signupInfo.name}
                        className="input-field"
                        required
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="email" className="input-label">Email</label>
                    <input
                        onChange={handleChange}
                        type="email"
                        name="email"
                        placeholder="Enter your email..."
                        value={signupInfo.email}
                        className="input-field"
                        required
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="password" className="input-label">Password</label>
                    <input
                        onChange={handleChange}
                        type="password"
                        name="password"
                        placeholder="Enter your password..."
                        value={signupInfo.password}
                        className="input-field"
                        required
                    />
                </div>

                <button type="submit" className="submit-button">Sign Up</button>
                <div className="signup-link">
                    Already have an account? <Link to="/login" className="signup-text">Login</Link>
                </div>
            </form>
            <ToastContainer />
        </div>
    );
};

export default Signup;
