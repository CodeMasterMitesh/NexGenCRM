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
            <Links link="#home" name="Users" />
            <Links link="#about" name="Lead" />
            <Links link="#services" name="Lead Source" />
            <Links link="#blogs" name="Reason" />
            <Links link="#contact" name="Pipelines" />
        </ul>
    )
}

const Links = ({link, name}) => {
    return (
        <li><a href={link}>{name}</a></li>
    )
}