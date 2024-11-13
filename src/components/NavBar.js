import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./NavBar.css";

function NavBar() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove token from local storage
        navigate('/login'); // Redirect to login page after logout
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
