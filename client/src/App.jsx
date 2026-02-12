import {Gbtn,FbBtn,InBtn} from "./compenents/Button.jsx";
import {Nav} from "./compenents/Nav.jsx";
import Footer from "./compenents/Footer.jsx";
import {LoginPage} from "./compenents/Login.jsx";
import Layout from "./compenents/Layout.jsx";
import "./compenents/Layout.css";
import { AuthProvider } from "./compenents/auth/AuthContext.jsx";
import ProtectedRoute from "./compenents/auth/ProtectedRoute.jsx";
import Dashboard from "./Dashboard.jsx";
import Users from "./Users.jsx";
import AddUser from "./AddUser.jsx";
import Leads from "./Leads.jsx";
import AddLead from "./AddLead.jsx";
import LeadFollowup from "./LeadFollowup.jsx";
import Customers from "./Customer.jsx";
import LeadSource from "./LeadsSource.jsx";
import Tasks from "./Tasks.jsx";
import AddCustomer from "./AddCustomer.jsx";
import AddLeadSource from "./AddLeadSource.jsx";
import Products from "./Products.jsx";
import AddProduct from "./AddProduct.jsx";
import Inquiries from "./Inquiries.jsx";
import AddInquiry from "./AddInquiry.jsx";
import InquiryFollowup from "./InquiryFollowup.jsx";
import Quotations from "./Quotations.jsx";
import AddQuotation from "./AddQuotation.jsx";
import ProformaInvoices from "./ProformaInvoices.jsx";
import AddProformaInvoice from "./AddProformaInvoice.jsx";
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
      path: "/login",
      element: <LoginPage/>,
    },
    {
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
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
          path: "/edit-user/:id",
          element: <AddUser/>,
        },
        {
          path: "/leads",
          element: <Leads/>,
        },
        {
          path: "/add-lead",
          element: <AddLead/>,
        },
        {
          path: "/edit-lead/:id",
          element: <AddLead/>,
        },
        {
          path: "/lead-followup/:id",
          element: <LeadFollowup/>,
        },
        {
          path: "/customers",
          element: <Customers/>,
        },
        {
          path: "/add-customer",
          element: <AddCustomer/>,
        },
        {
          path: "/edit-customer/:id",
          element: <AddCustomer/>,
        },
        {
          path: "/lead-source",
          element: <LeadSource/>,
        },
        {
          path: "/add-lead-source",
          element: <AddLeadSource/>,
        },
        {
          path: "/edit-lead-source/:id",
          element: <AddLeadSource/>,
        },
        {
          path: "/tasks",
          element: <Tasks/>,
        },
        {
          path: "/products",
          element: <Products/>,
        },
        {
          path: "/add-product",
          element: <AddProduct/>,
        },
        {
          path: "/edit-product/:id",
          element: <AddProduct/>,
        },
        {
          path: "/inquiries",
          element: <Inquiries/>,
        },
        {
          path: "/add-inquiry",
          element: <AddInquiry/>,
        },
        {
          path: "/edit-inquiry/:id",
          element: <AddInquiry/>,
        },
        {
          path: "/inquiry-followup/:id",
          element: <InquiryFollowup/>,
        },
        {
          path: "/quotations",
          element: <Quotations/>,
        },
        {
          path: "/add-quotation",
          element: <AddQuotation/>,
        },
        {
          path: "/edit-quotation/:id",
          element: <AddQuotation/>,
        },
        {
          path: "/proforma-invoices",
          element: <ProformaInvoices/>,
        },
        {
          path: "/add-proforma-invoice",
          element: <AddProformaInvoice/>,
        },
        {
          path: "/edit-proforma-invoice/:id",
          element: <AddProformaInvoice/>,
        },
      ],
    },
]);

const App = () =>{
  return (
   <AuthProvider>
     <RouterProvider router={router} />
   </AuthProvider>
  )
}

export default App