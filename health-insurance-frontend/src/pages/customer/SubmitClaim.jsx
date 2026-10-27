
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function SubmitClaim() {

    const [policyId, setPolicyId] = useState("");
    const [hospitalId, setHospitalId] = useState("");
    const [claimAmount, setClaimAmount] = useState("");
    const [description, setDescription] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (event) => {

        event.preventDefault();

        setMessage("");
        setError("");

        try {

            const claimData = {
                policyId: Number(policyId),
                hospitalId: hospitalId
                    ? Number(hospitalId)
                    : null,
                claimAmount: Number(claimAmount),
                description: description
            };

            await api.post(
                "/claims",
                claimData
            );

            setMessage(
                "Claim submitted successfully."
            );

            setPolicyId("");
            setHospitalId("");
            setClaimAmount("");
            setDescription("");

        } catch (error) {

            console.log(error);

            if (error.response) {

                setError(
                    error.response.data?.message ||
                    "Unable to submit claim."
                );

            } else {

                setError(
                    "Unable to connect to the server."
                );
            }
        }
    };

    return (
        <div>

            <h1>Submit Claim</h1>

            {message && (
                <p>
                    {message}
                </p>
            )}

            {error && (
                <p>
                    {error}
                </p>
            )}

            <form onSubmit={handleSubmit}>

                <div>

                    <label>Policy ID</label>

                    <br />

                    <input
                        type="number"
                        value={policyId}
                        onChange={(event) =>
                            setPolicyId(event.target.value)
                        }
                        placeholder="Enter policy ID"
                        required
                    />

                </div>

                <br />

                <div>

                    <label>Hospital ID</label>

                    <br />

                    <input
                        type="number"
                        value={hospitalId}
                        onChange={(event) =>
                            setHospitalId(event.target.value)
                        }
                        placeholder="Enter hospital ID"
                    />

                </div>

                <br />

                <div>

                    <label>Claim Amount</label>

                    <br />

                    <input
                        type="number"
                        value={claimAmount}
                        onChange={(event) =>
                            setClaimAmount(event.target.value)
                        }
                        placeholder="Enter claim amount"
                        required
                    />

                </div>

                <br />

                <div>

                    <label>Description</label>

                    <br />

                    <textarea
                        value={description}
                        onChange={(event) =>
                            setDescription(event.target.value)
                        }
                        placeholder="Enter claim description"
                        rows="5"
                        required
                    />

                </div>

                <br />

                <button type="submit">
                    Submit Claim
                </button>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/customer/dashboard")
                    }
                >
                    Cancel
                </button>

            </form>

        </div>
    );
}

export default SubmitClaim;