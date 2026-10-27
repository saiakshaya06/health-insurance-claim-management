import { useEffect, useState } from "react";
import api from "../../services/api";

const emptyForm = {
    policyNumber: "",
    policyType: "",
    premiumAmount: "",
    coverageAmount: "",
    startDate: "",
    endDate: "",
    status: "ACTIVE",
    customerId: ""
};

function AgentPolicies() {
    const [policies, setPolicies] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const getPolicies = async () => {
        try {
            const response = await api.get("/policies");
            setPolicies(response.data);
            setError("");
        } catch (error) {
            console.error(error);
            setError("Unable to load policies.");
        } finally {
            setLoading(false);
        }
    };

    const getCustomers = async () => {
        try {
            const response = await api.get("/customers");
            setCustomers(response.data);
        } catch (error) {
            console.error(error);
            setError("Unable to load customers for policy assignment.");
        }
    };

    useEffect(() => {
        getPolicies();
        getCustomers();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const openAddForm = () => {
        setForm(emptyForm);
        setEditingId(null);
        setError("");
        setMessage("");
        setShowForm(true);
    };

    const openEditForm = (policy) => {
        setForm({
            policyNumber: policy.policyNumber || "",
            policyType: policy.policyType || "",
            premiumAmount: policy.premiumAmount ?? "",
            coverageAmount: policy.coverageAmount ?? "",
            startDate: policy.startDate
                ? String(policy.startDate).slice(0, 10)
                : "",
            endDate: policy.endDate
                ? String(policy.endDate).slice(0, 10)
                : "",
            status: policy.status || "ACTIVE",
            customerId: policy.customer?.id
                ? String(policy.customer.id)
                : ""
        });

        setEditingId(policy.id);
        setError("");
        setMessage("");
        setShowForm(true);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError("");
        setMessage("");

        try {
            const policyData = {
                policyNumber: form.policyNumber.trim(),
                policyType: form.policyType.trim(),
                premiumAmount: Number(form.premiumAmount),
                coverageAmount: Number(form.coverageAmount),
                startDate: form.startDate,
                endDate: form.endDate,
                status: form.status,
                customer: form.customerId
                    ? { id: Number(form.customerId) }
                    : null
            };

            if (editingId !== null) {
                await api.put(`/policies/${editingId}`, policyData);
                setMessage("Policy updated successfully.");
            } else {
                await api.post("/policies", policyData);
                setMessage("Policy added successfully.");
            }

            setShowForm(false);
            setEditingId(null);
            setForm(emptyForm);
            await getPolicies();
        } catch (error) {
            console.error(error);
            setError(
                error.response?.data?.message ||
                "Unable to save policy. Check the entered details."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (policy) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete policy ${policy.policyNumber}?`
        );

        if (!confirmed) return;

        setError("");
        setMessage("");

        try {
            await api.delete(`/policies/${policy.id}`);
            setMessage("Policy deleted successfully.");
            await getPolicies();
        } catch (error) {
            console.error(error);
            setError(
                error.response?.data?.message ||
                "Unable to delete the policy. It may have related claims."
            );
        }
    };

    if (loading) {
        return <h2>Loading policies...</h2>;
    }

    return (
        <div>
            <h1>Agent - Manage Policies</h1>

            {message && (
                <p style={{ color: "green" }}>{message}</p>
            )}

            {error && (
                <p style={{ color: "red" }}>{error}</p>
            )}

            <button type="button" onClick={openAddForm}>
                Add Policy
            </button>{" "}

            <button type="button" onClick={getPolicies}>
                Refresh Policies
            </button>

            {showForm && (
                <div>
                    <h2>
                        {editingId !== null ? "Edit Policy" : "Add New Policy"}
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>Policy Number:</label><br />
                            <input
                                name="policyNumber"
                                value={form.policyNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <br />

                        <div>
                            <label>Policy Type:</label><br />
                            <input
                                name="policyType"
                                value={form.policyType}
                                onChange={handleChange}
                                placeholder="For example, Health Insurance"
                                required
                            />
                        </div>

                        <br />

                        <div>
                            <label>Premium Amount (₹):</label><br />
                            <input
                                type="number"
                                name="premiumAmount"
                                value={form.premiumAmount}
                                onChange={handleChange}
                                min="0.01"
                                step="0.01"
                                required
                            />
                        </div>

                        <br />

                        <div>
                            <label>Coverage Amount (₹):</label><br />
                            <input
                                type="number"
                                name="coverageAmount"
                                value={form.coverageAmount}
                                onChange={handleChange}
                                min="0.01"
                                step="0.01"
                                required
                            />
                        </div>

                        <br />

                        <div>
                            <label>Start Date:</label><br />
                            <input
                                type="date"
                                name="startDate"
                                value={form.startDate}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <br />

                        <div>
                            <label>End Date:</label><br />
                            <input
                                type="date"
                                name="endDate"
                                value={form.endDate}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <br />

                        <div>
                            <label>Status:</label><br />
                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                required
                            >
                                <option value="ACTIVE">ACTIVE</option>
                                <option value="INACTIVE">INACTIVE</option>
                                <option value="EXPIRED">EXPIRED</option>
                            </select>
                        </div>

                        <br />

                        <div>
                            <label>Assign Customer:</label><br />
                            <select
                                name="customerId"
                                value={form.customerId}
                                onChange={handleChange}
                            >
                                <option value="">No customer selected</option>

                                {customers.map((customer) => (
                                    <option
                                        key={customer.id}
                                        value={customer.id}
                                    >
                                        {customer.name} (ID: {customer.id})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <br />

                        <button type="submit" disabled={saving}>
                            {saving
                                ? "Saving..."
                                : editingId !== null
                                    ? "Update Policy"
                                    : "Save Policy"}
                        </button>{" "}

                        <button
                            type="button"
                            disabled={saving}
                            onClick={() => {
                                setShowForm(false);
                                setEditingId(null);
                                setForm(emptyForm);
                                setError("");
                            }}
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            )}

            <hr />

            <h2>All Policies</h2>

            {policies.length === 0 ? (
                <p>No policies found.</p>
            ) : (
                <div>
                    {policies.map((policy) => (
                        <div key={policy.id}>
                            <h3>{policy.policyType || "Insurance Policy"}</h3>

                            <p>
                                <strong>Policy ID:</strong> {policy.id}
                            </p>

                            <p>
                                <strong>Policy Number:</strong>{" "}
                                {policy.policyNumber}
                            </p>

                            <p>
                                <strong>Policy Type:</strong>{" "}
                                {policy.policyType}
                            </p>

                            <p>
                                <strong>Coverage Amount:</strong>{" "}
                                ₹{policy.coverageAmount}
                            </p>

                            <p>
                                <strong>Premium:</strong>{" "}
                                ₹{policy.premiumAmount}
                            </p>

                            <p>
                                <strong>Status:</strong> {policy.status}
                            </p>

                            <p>
                                <strong>Customer:</strong>{" "}
                                {policy.customer?.name || "Not assigned"}
                            </p>

                            <p>
                                <strong>Start Date:</strong>{" "}
                                {policy.startDate || "Not specified"}
                            </p>

                            <p>
                                <strong>End Date:</strong>{" "}
                                {policy.endDate || "Not specified"}
                            </p>

                            <button
                                type="button"
                                onClick={() => openEditForm(policy)}
                            >
                                Edit
                            </button>{" "}

                            <button
                                type="button"
                                onClick={() => handleDelete(policy)}
                            >
                                Delete
                            </button>

                            <hr />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AgentPolicies;