import {Gbtn,FbBtn,InBtn} from "./compenents/Button.jsx";
import {Nav} from "./compenents/Nav.jsx";
import Footer from "./compenents/Footer.jsx";
import {LoginPage} from "./compenents/Login.jsx";
import Layout from "./compenents/Layout.jsx";
import "./compenents/Layout.css";
import Dashboard from "./Dashboard.jsx";
import Users from "./Users.jsx";
import AddUser from "./AddUser.jsx";
import Leads from "./Leads.jsx";
import Customers from "./Customer.jsx";
import LeadSource from "./LeadsSource.jsx";
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
      element: <Layout />,
      children: [
        {
          path: "/dashboard",
          element: <Dashboard/>,
        },
        {
          path: "/users",
          element: <Users/>,
        },
        {
          path: "/add-user",
          element: <AddUser/>,
        },
        {
          path: "/leads",
          element: <Leads/>,
        },
        {
          path: "/customers",
          element: <Customers/>,
        },
        {
          path: "/lead-source",
          element: <LeadSource/>,
        },
      ],
    },
]);

const App = () =>{
  return (
   <RouterProvider router={router} />
  )
}

export default App