import { useNavigate } from "react-router-dom";

function Navigation() {

    const navigate = useNavigate();

    const role = localStorage.getItem("role");
    const username = localStorage.getItem("username");

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("role");

        navigate("/");
    };

    return (
        <div>

            <h2>Welcome, {username}</h2>

            <p>Your Role: {role}</p>

            {/* CUSTOMER NAVIGATION */}

            {role === "CUSTOMER" && (
                <div>

                    <button
                        onClick={() =>
                            navigate("/customer/dashboard")
                        }
                    >
                        Home
                    </button>

                </div>
            )}

            {/* AGENT NAVIGATION */}

            {role === "AGENT" && (
                <div>

                    <button
                        onClick={() =>
                            navigate("/agent/dashboard")
                        }
                    >
                        Agent Dashboard
                    </button>

                    <button
                        onClick={() =>
                            navigate("/agent/customers")
                        }
                    >
                        Customers
                    </button>

                    <button
                        onClick={() =>
                            navigate("/agent/policies")
                        }
                    >
                        Policies
                    </button>

                    <button
                        onClick={() =>
                            navigate("/agent/claims")
                        }
                    >
                        Claims
                    </button>

                </div>
            )}

            {/* ADMIN NAVIGATION */}

            {role === "ADMIN" && (
                <div>

                    <button
                        onClick={() =>
                            navigate("/admin/dashboard")
                        }
                    >
                        Admin Dashboard
                    </button>

                    <button
                        onClick={() =>
                            navigate("/admin/customers")
                        }
                    >
                        Customers
                    </button>

                    <button
                        onClick={() =>
                            navigate("/admin/policies")
                        }
                    >
                        Policies
                    </button>

                    <button
                        onClick={() =>
                            navigate("/admin/hospitals")
                        }
                    >
                        Hospitals
                    </button>

                    <button
                        onClick={() =>
                            navigate("/admin/claims")
                        }
                    >
                        Claims
                    </button>

                </div>
            )}

            <br />

            <button onClick={logout}>
                Logout
            </button>

        </div>
    );
}

export default Navigation;