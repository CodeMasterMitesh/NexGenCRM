import {Gbtn,FbBtn,InBtn} from "./compenents/Button.jsx";
import {Nav} from "./compenents/Nav.jsx";
import Footer from "./compenents/Footer.jsx";
import {LoginPage} from "./compenents/Login.jsx";
import Dashboard from "./Dashboard.jsx";
import Users from "./Users.jsx";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

let router = createBrowserRouter([
    {
      path: "/",
      element: <LoginPage/>,
    },
    {
      path: "/dashboard",
      element: <Dashboard/>,
    },
    {
      path: "/users",
      element: <Users/>,
    },
]);

const App = () =>{
  return (
   <RouterProvider router={router} />
  )
}

export default App