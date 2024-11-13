import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./NavBar.css";

function NavBar() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    // Handle logout, remove token from local storage and redirect to login page
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav className="NavBar">
            <div className="nav-left">
                <Link to="/" className="nav-link">
                    wAve
                </Link>
            </div>
            <div className="nav-right">
                {token ?
                    (
                        <>
                            <button onClick={handleLogout} className="nav-link logout-button">
                                Logout
                            </button>
                        </>
                    ) :
                    (
                        <>
                            <Link to="/login" className="nav-link">
                                Login
                            </Link>
                            <Link to="/register" className="nav-link">
                                Register
                            </Link>
                        </>
                    )}
            </div>
        </nav>
    );
}

export default NavBar;
