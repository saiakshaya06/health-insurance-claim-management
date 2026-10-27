import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Home from "./pages/Home";

import CustomerDashboard from "./pages/customer/CustomerDashboard";
import CustomerProfile from "./pages/customer/CustomerProfile";
import MyPolicies from "./pages/customer/MyPolicies";
import MyClaims from "./pages/customer/MyClaims";
import SubmitClaim from "./pages/customer/SubmitClaim";

import AgentClaims from "./pages/agent/AgentClaims";
import AgentDashboard from "./pages/agent/AgentDashboard";
import AgentCustomers from "./pages/agent/AgentCustomers";
import AgentPolicies from "./pages/agent/AgentPolicies";


import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminPolicies from "./pages/admin/AdminPolicies";
import AdminHospitals from "./pages/admin/AdminHospitals";
import AdminClaims from "./pages/admin/AdminClaims";

function App() {

    return (
        <BrowserRouter>

            <Routes>

                {/* LOGIN */}

                <Route
                    path="/"
                    element={<Login />}
                />

                {/* HOME */}

                <Route
                    path="/home"
                    element={<Home />}
                />

                {/* CUSTOMER */}

                <Route
                    path="/customer/dashboard"
                    element={<CustomerDashboard />}
                />

                <Route
                    path="/customer/profile"
                    element={<CustomerProfile />}
                />

                <Route
                    path="/customer/policies"
                    element={<MyPolicies />}
                />

                <Route
                    path="/customer/claims"
                    element={<MyClaims />}
                />

                <Route
                    path="/customer/submit-claim"
                    element={<SubmitClaim />}
                />

                {/* AGENT */}

                <Route
                    path="/agent/dashboard"
                    element={<AgentDashboard />}
                />

                <Route
                    path="/agent/customers"
                    element={<AgentCustomers />}
                />

                <Route
                    path="/agent/policies"
                    element={<AgentPolicies />}
                />
                <Route
                    path="/agent/claims"
                    element={<AgentClaims />}
                />

                {/* ADMIN */}
                <Route
                    path="/admin/dashboard"
                    element={<AdminDashboard />}
                />
                <Route
                  path="/admin/customers"
                  element={<AdminCustomers />}
                />
                <Route 
                  path="/admin/policies"
                  element = {<AdminPolicies/>}
                />
                <Route
                  path="/admin/hospitals"
                  element={<AdminHospitals />}
                />
                <Route
                  path="/admin/claims"
                  element = {<AdminClaims/>}
                /> 


            </Routes>

        </BrowserRouter>
    );
}

export default App;