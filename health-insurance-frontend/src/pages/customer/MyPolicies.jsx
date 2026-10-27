
import { useEffect, useState } from "react";
import api from "../../services/api";

function MyPolicies() {

    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const getPolicies = async () => {

            try {

                const response = await api.get(
                    "/policies/my-policies"
                );

                setPolicies(response.data);
                setLoading(false);

            } catch (error) {

                console.log(error);

                setError(
                    "Unable to load your policies."
                );

                setLoading(false);
            }
        };

        getPolicies();

    }, []);

    if (loading) {
        return <h2>Loading policies...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    return (
        <div>

            <h1>My Policies</h1>

            {policies.length === 0 ? (

                <p>
                    You don't have any policies yet.
                </p>

            ) : (

                <div>

                    {policies.map((policy) => (

                        <div key={policy.id}>

                            <h2>
                                Policy ID: {policy.id}
                            </h2>

                            <p>
                                <strong>Policy Name:</strong>{" "}
                                {policy.policyName}
                            </p>

                            <p>
                                <strong>Policy Number:</strong>{" "}
                                {policy.policyNumber}
                            </p>

                            <p>
                                <strong>Coverage Amount:</strong>{" "}
                                {policy.coverageAmount}
                            </p>

                            <p>
                                <strong>Premium:</strong>{" "}
                                {policy.premium}
                            </p>

                            <p>
                                <strong>Status:</strong>{" "}
                                {policy.status}
                            </p>

                            <hr />

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default MyPolicies;
