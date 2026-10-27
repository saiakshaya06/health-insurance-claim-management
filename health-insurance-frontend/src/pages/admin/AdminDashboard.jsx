
import { useEffect, useState } from "react";
import api from "../../services/api";

function AdminDashboard() {

    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const getSummary = async () => {

            try {

                const response = await api.get(
                    "/dashboard/summary"
                );

                setSummary(response.data);
                setLoading(false);

            } catch (error) {

                console.log(error);

                setError(
                    "Unable to load dashboard summary."
                );

                setLoading(false);
            }
        };

        getSummary();

    }, []);

    if (loading) {
        return <h2>Loading dashboard...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    if (!summary) {
        return <h2>No dashboard data available.</h2>;
    }

    return (
        <div>

            <h1>Admin Dashboard</h1>

            <p>
                Welcome to the Health Insurance Admin Dashboard.
            </p>

            <h2>System Overview</h2>

            <p>
                <strong>Total Customers:</strong>{" "}
                {summary.totalCustomers}
            </p>

            <p>
                <strong>Total Policies:</strong>{" "}
                {summary.totalPolicies}
            </p>

            <p>
                <strong>Total Hospitals:</strong>{" "}
                {summary.totalHospitals}
            </p>

            <p>
                <strong>Total Claims:</strong>{" "}
                {summary.totalClaims}
            </p>

            <h2>Claim Statistics</h2>

            <p>
                <strong>Pending Claims:</strong>{" "}
                {summary.pendingClaims}
            </p>

            <p>
                <strong>Approved Claims:</strong>{" "}
                {summary.approvedClaims}
            </p>

            <p>
                <strong>Rejected Claims:</strong>{" "}
                {summary.rejectedClaims}
            </p>

        </div>
    );
}

export default AdminDashboard;
