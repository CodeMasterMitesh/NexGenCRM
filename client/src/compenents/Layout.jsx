import { Nav } from "./Nav.jsx";
import Footer from "./Footer.jsx";
import { Outlet } from "react-router-dom";

// Layout component - shows on all pages
const Layout = () => {
    return (
        <div className="app-layout">
            {/* Navigation bar at top */}
            <Nav />
            
            {/* Main content area - changes based on route */}
            <main className="main-content">
                <Outlet />
            </main>
            
            {/* Footer at bottom */}
            <Footer />
        </div>
    );
};

export default Layout;
