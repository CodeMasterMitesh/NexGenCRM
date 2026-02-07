import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./auth/AuthContext.jsx";

export const Nav = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/", { replace: true });
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark crm-navbar">
            <div className="container-fluid">
                <Link className="navbar-brand fw-bold" to="/dashboard">NextGenCRM</Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#crmNavbar"
                    aria-controls="crmNavbar"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="crmNavbar">
                    <NavLinks />
                    {isAuthenticated ? (
                        <div className="d-flex align-items-center gap-2 ms-lg-3">
                            <span className="navbar-text text-white small d-none d-lg-inline">
                                Hi, {user?.name || "User"}
                            </span>
                            <button
                                type="button"
                                className="btn btn-outline-light btn-sm"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    ) : null}
                </div>
            </div>
        </nav>
    )
}

const NavLinks = () => {
    return (
        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <Links link="/dashboard" name="Dashboard" />
            <Links link="/users" name="Users" />
            <Links link="/leads" name="Leads" />
            <Links link="/lead-source" name="Lead Sources" />
            <Links link="/customers" name="Customers" />
            <Links link="/reports" name="Reports" />
        </ul>
    )
}

// Simple link component using React Router
const Links = ({link, name}) => {
    return (
        <li className="nav-item">
            <Link className="nav-link" to={link}>{name}</Link>
        </li>
    )
}