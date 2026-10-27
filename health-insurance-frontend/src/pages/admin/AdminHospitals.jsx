import { useEffect, useState } from "react";
import api from "../../services/api";

const emptyForm = {
    hospitalName: "",
    hospitalCode: "",
    address: "",
    city: "",
    phone: "",
    email: ""
};

function AdminHospitals() {
    const [hospitals, setHospitals] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const getHospitals = async () => {
        try {
            const response = await api.get("/hospitals");
            setHospitals(response.data);
            setError("");
        } catch (error) {
            console.error(error);
            setError("Unable to load hospitals.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getHospitals();
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

    const openEditForm = (hospital) => {
        setForm({
            hospitalName: hospital.hospitalName || hospital.name || "",
            hospitalCode: hospital.hospitalCode || "",
            address: hospital.address || "",
            city: hospital.city || "",
            phone: hospital.phone || "",
            email: hospital.email || ""
        });

        setEditingId(hospital.id);
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
            const hospitalData = {
                hospitalName: form.hospitalName.trim(),
                hospitalCode: form.hospitalCode.trim(),
                address: form.address.trim(),
                city: form.city.trim(),
                phone: form.phone.trim(),
                email: form.email.trim()
            };

            if (editingId !== null) {
                await api.put(`/hospitals/${editingId}`, hospitalData);
                setMessage("Hospital updated successfully.");
            } else {
                await api.post("/hospitals", hospitalData);
                setMessage("Hospital added successfully.");
            }

            setShowForm(false);
            setEditingId(null);
            setForm(emptyForm);
            await getHospitals();
        } catch (error) {
            console.error(error);
            setError(
                error.response?.data?.message ||
                "Unable to save hospital. Please check the details."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (hospital) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${hospital.hospitalName || hospital.name}?`
        );

        if (!confirmed) {
            return;
        }

        setError("");
        setMessage("");

        try {
            await api.delete(`/hospitals/${hospital.id}`);
            setMessage("Hospital deleted successfully.");
            await getHospitals();
        } catch (error) {
            console.error(error);
            setError(
                error.response?.data?.message ||
                "Unable to delete hospital. It may be linked to existing claims."
            );
        }
    };

    if (loading) {
        return <h2>Loading hospitals...</h2>;
    }

    return (
        <div>
            <h1>Admin - Manage Hospitals</h1>

            {message && <p style={{ color: "green" }}>{message}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <button onClick={openAddForm}>Add Hospital</button>
            {" "}
            <button onClick={getHospitals}>Refresh Hospitals</button>

            {showForm && (
                <div>
                    <h2>
                        {editingId !== null
                            ? "Edit Hospital"
                            : "Add New Hospital"}
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>Hospital Name:</label>
                            <br />
                            <input
                                name="hospitalName"
                                value={form.hospitalName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <br />

                        <div>
                            <label>Hospital Code:</label>
                            <br />
                            <input
                                name="hospitalCode"
                                value={form.hospitalCode}
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
                            <label>City:</label>
                            <br />
                            <input
                                name="city"
                                value={form.city}
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

                        <button type="submit" disabled={saving}>
                            {saving
                                ? "Saving..."
                                : editingId !== null
                                ? "Update Hospital"
                                : "Save Hospital"}
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

            {hospitals.length === 0 ? (
                <p>No hospitals found.</p>
            ) : (
                <div>
                    {hospitals.map((hospital) => (
                        <div key={hospital.id}>
                            <h2>
                                {hospital.hospitalName || hospital.name}
                            </h2>

                            <p>
                                <strong>Hospital ID:</strong> {hospital.id}
                            </p>

                            <p>
                                <strong>Hospital Code:</strong>{" "}
                                {hospital.hospitalCode}
                            </p>

                            <p>
                                <strong>Address:</strong> {hospital.address}
                            </p>

                            <p>
                                <strong>City:</strong> {hospital.city}
                            </p>

                            <p>
                                <strong>Phone:</strong> {hospital.phone}
                            </p>

                            <p>
                                <strong>Email:</strong> {hospital.email}
                            </p>

                            <button onClick={() => openEditForm(hospital)}>
                                Edit
                            </button>
                            {" "}
                            <button onClick={() => handleDelete(hospital)}>
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

export default AdminHospitals;
