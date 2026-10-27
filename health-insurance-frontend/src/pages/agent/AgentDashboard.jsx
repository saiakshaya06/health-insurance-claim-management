function AgentDashboard() {

    const username = localStorage.getItem("username");

    return (
        <div>

            <h1>Agent Dashboard</h1>

            <h2>Welcome, {username}</h2>

            <p>
                Welcome to the Health Insurance Agent Dashboard.
            </p>

            <p>
                From here, you can manage customers,
                policies, and claims.
            </p>

        </div>
    );
}

export default AgentDashboard;
