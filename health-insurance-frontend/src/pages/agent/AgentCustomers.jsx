import { useEffect, useState } from "react";
import api from "../../services/api";

function AgentCustomers() {

    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const getCustomers = async () => {

            try {

                const response = await api.get(
                    "/customers"
                );

                setCustomers(response.data);
                setLoading(false);

            } catch (error) {

                console.log(error);

                setError(
                    "Unable to load customers."
                );

                setLoading(false);
            }
        };

        getCustomers();

    }, []);

    if (loading) {
        return <h2>Loading customers...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    return (
        <div>

            <h1>Customers</h1>

            {customers.length === 0 ? (

                <p>
                    No customers found.
                </p>

            ) : (

                <div>

                    {customers.map((customer) => (

                        <div key={customer.id}>

                            <h2>
                                {customer.name}
                            </h2>

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

                            <hr />

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default AgentCustomers;