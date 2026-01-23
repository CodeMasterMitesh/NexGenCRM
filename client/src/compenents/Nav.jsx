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
            <Links link="#home" name="Home" />
            <Links link="#about" name="About" />
            <Links link="#services" name="Services" />
            <Links link="#blogs" name="Blogs" />
            <Links link="#contact" name="Contact" />
        </ul>
    )
}

const Links = ({link, name}) => {
    return (
        <li><a href={link}>{name}</a></li>
    )
}