import { useEffect, useState } from "react";
import api from "../../services/api";

const initialForm = {
    claimNumber: "",
    claimAmount: "",
    claimDate: "",
    description: "",
    policyId: "",
    hospitalId: "",
    status: "PENDING",
    rejectionReason: "",
};

function AgentClaims() {
    const [claims, setClaims] = useState([]);
    const [policies, setPolicies] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const getArray = (response) => {
        const data = response.data;

        if (Array.isArray(data)) return data;
        if (Array.isArray(data?.content)) return data.content;
        if (Array.isArray(data?.data)) return data.data;

        return [];
    };

    const getPolicyId = (claim) =>
        claim.policyId ?? claim.policy?.id ?? "";

    const getHospitalId = (claim) =>
        claim.hospitalId ?? claim.hospital?.id ?? "";

    const loadData = async () => {
        setLoading(true);
        setError("");

        try {
            const [claimsResponse, policiesResponse, hospitalsResponse] =
                await Promise.all([
                    api.get("/claims"),
                    api.get("/policies"),
                    api.get("/hospitals"),
                ]);

            setClaims(getArray(claimsResponse));
            setPolicies(getArray(policiesResponse));
            setHospitals(getArray(hospitalsResponse));
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message ||
                "Unable to load claims, policies, or hospitals."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const resetForm = () => {
        setForm(initialForm);
        setEditingId(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!form.policyId || !form.hospitalId) {
            setError("Please select both a policy and a hospital.");
            return;
        }

        if (Number(form.claimAmount) <= 0) {
            setError("Claim amount must be greater than zero.");
            return;
        }

        const claimData = {
            claimNumber: form.claimNumber.trim(),
            claimAmount: Number(form.claimAmount),
            claimDate: form.claimDate,
            description: form.description.trim(),
            policyId: Number(form.policyId),
            hospitalId: Number(form.hospitalId),
            status: form.status,
            rejectionReason: form.rejectionReason.trim() || null,
        };

        setSaving(true);
        setError("");
        setMessage("");

        try {
            if (editingId !== null) {
                await api.put(`/claims/${editingId}`, claimData);
                setMessage("Claim updated successfully.");
            } else {
                await api.post("/claims", claimData);
                setMessage("Claim added successfully.");
            }

            resetForm();
            await loadData();
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Unable to save the claim."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (claim) => {
        setForm({
            claimNumber: claim.claimNumber || "",
            claimAmount: claim.claimAmount ?? "",
            claimDate: claim.claimDate
                ? String(claim.claimDate).slice(0, 10)
                : "",
            description: claim.description || "",
            policyId: String(getPolicyId(claim) || ""),
            hospitalId: String(getHospitalId(claim) || ""),
            status: claim.status || "PENDING",
            rejectionReason: claim.rejectionReason || "",
        });

        setEditingId(claim.id);
        setError("");
        setMessage("");

        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this claim?")) {
            return;
        }

        setError("");
        setMessage("");

        try {
            await api.delete(`/claims/${id}`);
            setMessage("Claim deleted successfully.");

            if (editingId === id) {
                resetForm();
            }

            await loadData();
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message ||
                "Unable to delete the claim."
            );
        }
    };

    const handleApprove = async (id) => {
        if (!window.confirm("Approve this claim?")) return;

        setError("");
        setMessage("");

        try {
            await api.put(`/claims/${id}/approve`);
            setMessage("Claim approved successfully.");
            await loadData();
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message ||
                "Unable to approve the claim."
            );
        }
    };

    const handleReject = async (id) => {
        const reason = window.prompt("Enter the rejection reason:");

        if (reason === null) return;

        if (!reason.trim()) {
            setError("Rejection reason is required.");
            return;
        }

        setError("");
        setMessage("");

        try {
            await api.put(`/claims/${id}/reject`, {
                reason: reason.trim(),
            });

            setMessage("Claim rejected successfully.");
            await loadData();
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message ||
                "Unable to reject the claim."
            );
        }
    };

    const handleProcess = async (id) => {
        if (!window.confirm("Process this claim automatically?")) return;

        setError("");
        setMessage("");

        try {
            await api.put(`/claims/${id}/process`);
            setMessage("Automatic claim processing completed.");
            await loadData();
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message ||
                "Unable to process the claim."
            );
        }
    };

    const getPolicyLabel = (policy) => {
        const number = policy.policyNumber || `Policy ID ${policy.id}`;
        const type = policy.policyType || "Health Insurance";
        const status = policy.status ? ` - ${policy.status}` : "";

        return `${number} - ${type}${status}`;
    };

    const getHospitalLabel = (hospital) => {
        const name =
            hospital.hospitalName || `Hospital ID ${hospital.id}`;

        return hospital.city ? `${name} - ${hospital.city}` : name;
    };

    return (
        <div>
            <h1>Agent - Manage Claims</h1>

            {message && <p style={{ color: "green" }}>{message}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <h2>{editingId !== null ? "Edit Claim" : "Add New Claim"}</h2>

                <div>
                    <label>Claim Number</label><br />
                    <input
                        name="claimNumber"
                        value={form.claimNumber}
                        onChange={handleChange}
                        placeholder="Enter claim number"
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Claim Amount (₹)</label><br />
                    <input
                        type="number"
                        name="claimAmount"
                        value={form.claimAmount}
                        onChange={handleChange}
                        min="1"
                        step="0.01"
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Claim Date</label><br />
                    <input
                        type="date"
                        name="claimDate"
                        value={form.claimDate}
                        onChange={handleChange}
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Description</label><br />
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Select Policy</label><br />
                    <select
                        name="policyId"
                        value={form.policyId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- Select a Policy --</option>

                        {policies.map((policy) => (
                            <option key={policy.id} value={policy.id}>
                                {getPolicyLabel(policy)}
                                {" | Coverage: ₹"}
                                {Number(
                                    policy.coverageAmount || 0
                                ).toLocaleString("en-IN")}
                                {policy.customer?.name
                                    ? ` | Customer: ${policy.customer.name}`
                                    : ""}
                            </option>
                        ))}
                    </select>
                </div>

                <br />

                <div>
                    <label>Select Hospital</label><br />
                    <select
                        name="hospitalId"
                        value={form.hospitalId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- Select a Hospital --</option>

                        {hospitals.map((hospital) => (
                            <option key={hospital.id} value={hospital.id}>
                                {getHospitalLabel(hospital)}
                            </option>
                        ))}
                    </select>
                </div>

                <br />

                <div>
                    <label>Status</label><br />
                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                    >
                        <option value="PENDING">PENDING</option>
                        <option value="APPROVED">APPROVED</option>
                        <option value="REJECTED">REJECTED</option>
                    </select>
                </div>

                {form.status === "REJECTED" && (
                    <div>
                        <br />
                        <label>Rejection Reason</label><br />
                        <input
                            name="rejectionReason"
                            value={form.rejectionReason}
                            onChange={handleChange}
                            placeholder="Enter rejection reason"
                        />
                    </div>
                )}

                <br />

                <button type="submit" disabled={saving}>
                    {saving
                        ? "Saving..."
                        : editingId !== null
                            ? "Update Claim"
                            : "Add Claim"}
                </button>{" "}

                {editingId !== null && (
                    <button type="button" onClick={resetForm}>
                        Cancel Edit
                    </button>
                )}
            </form>

            <hr />

            <h2>All Claims</h2>

            <button
                type="button"
                onClick={loadData}
                disabled={loading}
            >
                {loading ? "Loading..." : "Refresh Claims"}
            </button>

            {loading ? (
                <p>Loading claims...</p>
            ) : claims.length === 0 ? (
                <p>No claims found.</p>
            ) : (
                <div style={{ overflowX: "auto" }}>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Claim Number</th>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>Policy</th>
                                <th>Hospital</th>
                                <th>Status</th>
                                <th>Rejection Reason</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {claims.map((claim) => (
                                <tr key={claim.id}>
                                    <td>{claim.id}</td>
                                    <td>{claim.claimNumber || "-"}</td>
                                    <td>
                                        ₹{Number(
                                            claim.claimAmount || 0
                                        ).toLocaleString("en-IN")}
                                    </td>
                                    <td>{claim.claimDate || "-"}</td>
                                    <td>
                                        {claim.policy?.policyNumber ||
                                            policies.find(
                                                (policy) =>
                                                    Number(policy.id) ===
                                                    Number(getPolicyId(claim))
                                            )?.policyNumber ||
                                            getPolicyId(claim) ||
                                            "-"}
                                    </td>
                                    <td>
                                        {claim.hospital?.hospitalName ||
                                            hospitals.find(
                                                (hospital) =>
                                                    Number(hospital.id) ===
                                                    Number(getHospitalId(claim))
                                            )?.hospitalName ||
                                            getHospitalId(claim) ||
                                            "-"}
                                    </td>
                                    <td>{claim.status || "-"}</td>
                                    <td>{claim.rejectionReason || "-"}</td>
                                    <td>
                                        <button
                                            type="button"
                                            onClick={() => handleEdit(claim)}
                                        >
                                            Edit
                                        </button>{" "}

                                        <button
                                            type="button"
                                            onClick={() => handleDelete(claim.id)}
                                        >
                                            Delete
                                        </button>{" "}

                                        {claim.status === "PENDING" && (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleApprove(claim.id)
                                                    }
                                                >
                                                    Approve
                                                </button>{" "}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleReject(claim.id)
                                                    }
                                                >
                                                    Reject
                                                </button>{" "}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleProcess(claim.id)
                                                    }
                                                >
                                                    Process Automatically
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default AgentClaims;