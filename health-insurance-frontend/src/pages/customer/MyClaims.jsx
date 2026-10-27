import { useEffect, useState } from "react";
import api from "../../services/api";

function MyClaims() {

    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const getClaims = async () => {

            try {

                const response = await api.get(
                    "/claims/my-claims"
                );

                setClaims(response.data);
                setLoading(false);

            } catch (error) {

                console.log(error);

                setError(
                    "Unable to load your claims."
                );

                setLoading(false);
            }
        };

        getClaims();

    }, []);

    if (loading) {
        return <h2>Loading claims...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    return (
        <div>

            <h1>My Claims</h1>

            {claims.length === 0 ? (

                <p>
                    You don't have any claims yet.
                </p>

            ) : (

                <div>

                    {claims.map((claim) => (

                        <div key={claim.id}>

                            <h2>
                                Claim ID: {claim.id}
                            </h2>

                            <p>
                                <strong>Claim Amount:</strong>{" "}
                                {claim.claimAmount}
                            </p>

                            <p>
                                <strong>Status:</strong>{" "}
                                {claim.status}
                            </p>

                            <p>
                                <strong>Description:</strong>{" "}
                                {claim.description}
                            </p>

                            {claim.rejectionReason && (
                                <p>
                                    <strong>
                                        Rejection Reason:
                                    </strong>{" "}
                                    {claim.rejectionReason}
                                </p>
                            )}

                            <hr />

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default MyClaims;
