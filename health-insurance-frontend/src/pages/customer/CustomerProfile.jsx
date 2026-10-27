import { useEffect, useState } from "react";
import api from "../../services/api";

function CustomerProfile() {
    const [customer, setCustomer] = useState(null);

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        getProfile();
    }, []);

    const getProfile = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await api.get("/customers/me");
            const data = response.data;

            setCustomer(data);

            setForm({
                name: data.name || "",
                email: data.email || "",
                phone: data.phone || "",
                address: data.address || "",
            });
        } catch (err) {
            console.error("Profile loading error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load profile."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleEdit = () => {
        setForm({
            name: customer.name || "",
            email: customer.email || "",
            phone: customer.phone || "",
            address: customer.address || "",
        });

        setError("");
        setMessage("");
        setEditing(true);
    };

    const handleCancel = () => {
        setForm({
            name: customer.name || "",
            email: customer.email || "",
            phone: customer.phone || "",
            address: customer.address || "",
        });

        setEditing(false);
        setError("");
        setMessage("");
    };

    const handleSave = async (e) => {
        e.preventDefault();

        if (!form.name.trim() || !form.email.trim()) {
            setError("Name and email are required.");
            return;
        }

        setSaving(true);
        setError("");
        setMessage("");

        try {
            // Customer updates their own profile
            const response = await api.put("/customers/me", {
                name: form.name.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
                address: form.address.trim(),
            });

            const updatedCustomer = response.data;

            setCustomer(updatedCustomer);

            setForm({
                name: updatedCustomer.name || "",
                email: updatedCustomer.email || "",
                phone: updatedCustomer.phone || "",
                address: updatedCustomer.address || "",
            });

            setEditing(false);
            setMessage("Profile updated successfully!");
        } catch (err) {
            console.error("Profile update error:", err);

            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Unable to update profile. Please try again."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <h2>Loading profile...</h2>;
    }

    if (!customer) {
        return (
            <div style={{ padding: "20px" }}>
                <h1>My Profile</h1>
                <p style={{ color: "red" }}>
                    {error || "Customer profile not found."}
                </p>

                <button type="button" onClick={getProfile}>
                    Try Again
                </button>
            </div>
        );
    }

    const inputStyle = {
        display: "block",
        width: "100%",
        padding: "10px",
        marginTop: "6px",
        border: "1px solid #ccc",
        borderRadius: "6px",
        boxSizing: "border-box",
        fontSize: "15px",
    };

    const fieldStyle = {
        marginBottom: "18px",
    };

    const buttonStyle = {
        padding: "10px 18px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "14px",
        marginRight: "10px",
    };

    return (
        <div
            style={{
                maxWidth: "650px",
                margin: "20px auto",
                padding: "20px",
            }}
        >
            <h1>My Profile</h1>

            <p>View and manage your personal details.</p>

            {message && (
                <p
                    role="status"
                    style={{
                        color: "green",
                        backgroundColor: "#e8f5e9",
                        padding: "12px",
                        borderRadius: "6px",
                    }}
                >
                    {message}
                </p>
            )}

            {error && (
                <p
                    role="alert"
                    style={{
                        color: "#b91c1c",
                        backgroundColor: "#fee2e2",
                        padding: "12px",
                        borderRadius: "6px",
                    }}
                >
                    {error}
                </p>
            )}

            {!editing ? (
                <div
                    style={{
                        border: "1px solid #ddd",
                        borderRadius: "10px",
                        padding: "24px",
                        backgroundColor: "#fff",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    }}
                >
                    <p>
                        <strong>Full Name:</strong>{" "}
                        {customer.name || "-"}
                    </p>

                    <p>
                        <strong>Email:</strong>{" "}
                        {customer.email || "-"}
                    </p>

                    <p>
                        <strong>Phone:</strong>{" "}
                        {customer.phone || "-"}
                    </p>

                    <p>
                        <strong>Address:</strong>{" "}
                        {customer.address || "-"}
                    </p>

                    <button
                        type="button"
                        onClick={handleEdit}
                        style={{
                            ...buttonStyle,
                            backgroundColor: "#2563eb",
                            color: "#fff",
                        }}
                    >
                        Edit Profile
                    </button>
                </div>
            ) : (
                <form
                    onSubmit={handleSave}
                    style={{
                        border: "1px solid #ddd",
                        borderRadius: "10px",
                        padding: "24px",
                        backgroundColor: "#fff",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    }}
                >
                    <div style={fieldStyle}>
                        <label htmlFor="name">
                            Full Name
                        </label>

                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            required
                            style={inputStyle}
                        />
                    </div>

                    <div style={fieldStyle}>
                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                            style={inputStyle}
                        />
                    </div>

                    <div style={fieldStyle}>
                        <label htmlFor="phone">
                            Phone
                        </label>

                        <input
                            id="phone"
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="Enter your phone number"
                            style={inputStyle}
                        />
                    </div>

                    <div style={fieldStyle}>
                        <label htmlFor="address">
                            Address
                        </label>

                        <textarea
                            id="address"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            placeholder="Enter your address"
                            rows={3}
                            style={inputStyle}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        style={{
                            ...buttonStyle,
                            backgroundColor: saving
                                ? "#93c5fd"
                                : "#16a34a",
                            color: "#fff",
                            cursor: saving
                                ? "not-allowed"
                                : "pointer",
                        }}
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>

                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={saving}
                        style={{
                            ...buttonStyle,
                            backgroundColor: "#e5e7eb",
                            color: "#111827",
                        }}
                    >
                        Cancel
                    </button>
                </form>
            )}
        </div>
    );
}

export default CustomerProfile;