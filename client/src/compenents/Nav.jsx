import { Link } from "react-router-dom";

export const Nav = () => {
    return (
        <nav>
            <div className="logo">
                <h2>NextGenCRM</h2>
            </div>
            <div className="nav-links">
                <NavLinks />
            </div>
        </nav>
    )
}

const NavLinks = () => {
    return (
        <ul>
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
        <li><Link to={link}>{name}</Link></li>
    )
}