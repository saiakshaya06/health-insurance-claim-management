import { useNavigate } from "react-router-dom";

function CustomerDashboard() {

    const username = localStorage.getItem("username");

    const navigate = useNavigate();

    return (
        <div>

            <h1>Customer Dashboard</h1>

            <h2>Welcome, {username}</h2>

            <p>
                Welcome to your Health Insurance Dashboard.
            </p>

            <div>

                <button
                    onClick={() =>
                        navigate("/customer/profile")
                    }
                >
                    My Profile
                </button>

                <button
                    onClick={() =>
                        navigate("/customer/policies")
                    }
                >
                    My Policies
                </button>

                <button
                    onClick={() =>
                        navigate("/customer/claims")
                    }
                >
                    My Claims
                </button>

                <button
                    onClick={() =>
                        navigate("/customer/submit-claim")
                    }
                >
                    Submit Claim
                </button>

            </div>

        </div>
    );
}

export default CustomerDashboard;
