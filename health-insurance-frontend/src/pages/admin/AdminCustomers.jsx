import { useEffect, useState } from "react";
import api from "../../services/api";

const emptyForm = {
    name: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: ""
};

function AdminCustomers() {
    const [customers, setCustomers] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const getCustomers = async () => {
        try {
            setError("");
            const response = await api.get("/customers");
            setCustomers(response.data);
        } catch (error) {
            console.error(error);
            setError("Unable to load customers.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
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
        setMessage("");
        setError("");
        setShowForm(true);
    };

    const openEditForm = (customer) => {
        setForm({
            name: customer.name || "",
            email: customer.email || "",
            phone: customer.phone || "",
            address: customer.address || "",
            dateOfBirth: customer.dateOfBirth
                ? String(customer.dateOfBirth).slice(0, 10)
                : ""
        });

        setEditingId(customer.id);
        setMessage("");
        setError("");
        setShowForm(true);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError("");
        setMessage("");

        try {
            const customerData = {
                ...form,
                dateOfBirth: form.dateOfBirth || null
            };

            if (editingId !== null) {
                await api.put(`/customers/${editingId}`, customerData);
                setMessage("Customer updated successfully.");
            } else {
                await api.post("/customers", customerData);
                setMessage("Customer added successfully.");
            }

            setForm(emptyForm);
            setEditingId(null);
            setShowForm(false);
            await getCustomers();
        } catch (error) {
            console.error(error);
            setError(
                error.response?.data?.message ||
                "Unable to save customer. Please check the details."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (customer) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${customer.name}?`
        );

        if (!confirmed) {
            return;
        }

        setError("");
        setMessage("");

        try {
            await api.delete(`/customers/${customer.id}`);
            setMessage("Customer deleted successfully.");
            await getCustomers();
        } catch (error) {
            console.error(error);
            setError(
                error.response?.data?.message ||
                "Unable to delete customer. They may have related policies or claims."
            );
        }
    };

    if (loading) {
        return <h2>Loading customers...</h2>;
    }

    return (
        <div>
            <h1>All Customers</h1>

            {message && <p style={{ color: "green" }}>{message}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <button onClick={openAddForm}>
                Add Customer
            </button>

            {" "}

            <button onClick={getCustomers}>
                Refresh Customers
            </button>

            {showForm && (
                <div>
                    <h2>
                        {editingId !== null
                            ? "Edit Customer"
                            : "Add New Customer"}
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>Name:</label>
                            <br />
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <br />

                        <div>
                            <label>Email:</label>
                            <br />
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <br />

                        <div>
                            <label>Phone:</label>
                            <br />
                            <input
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <br />

                        <div>
                            <label>Address:</label>
                            <br />
                            <textarea
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <br />

                        <div>
                            <label>Date of Birth:</label>
                            <br />
                            <input
                                type="date"
                                name="dateOfBirth"
                                value={form.dateOfBirth}
                                onChange={handleChange}
                            />
                        </div>

                        <br />

                        <button type="submit" disabled={saving}>
                            {saving
                                ? "Saving..."
                                : editingId !== null
                                ? "Update Customer"
                                : "Save Customer"}
                        </button>

                        {" "}

                        <button
                            type="button"
                            onClick={() => {
                                setShowForm(false);
                                setEditingId(null);
                                setForm(emptyForm);
                            }}
                            disabled={saving}
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            )}

            <hr />

            {customers.length === 0 ? (
                <p>No customers found.</p>
            ) : (
                <div>
                    {customers.map((customer) => (
                        <div key={customer.id}>
                            <h2>{customer.name}</h2>

                            <p>
                                <strong>Customer ID:</strong>{" "}
                                {customer.id}
                            </p>

                            <p>
                                <strong>Email:</strong>{" "}
                                {customer.email}
                            </p>

                            <p>
                                <strong>Phone:</strong>{" "}
                                {customer.phone}
                            </p>

                            <p>
                                <strong>Address:</strong>{" "}
                                {customer.address}
                            </p>

                            <button
                                onClick={() => openEditForm(customer)}
                            >
                                Edit
                            </button>

                            {" "}

                            <button
                                onClick={() => handleDelete(customer)}
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

export default AdminCustomers;
