import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (event) => {

        event.preventDefault();

        try {

            const loginData = {
                username: username,
                password: password
            };

            const response = await api.post(
                "/auth/login",
                loginData
            );

            localStorage.setItem(
                "token",
                response.data.token
            );

            localStorage.setItem(
                "username",
                response.data.username
            );

            localStorage.setItem(
                "role",
                response.data.role
            );

            console.log("Login successful");

            navigate("/home");

        } catch (error) {

            console.log("Login failed");

            if (error.response) {

                console.log(
                    "Error:",
                    error.response.data
                );

            } else {

                console.log(
                    "Error:",
                    error.message
                );
            }
        }
    };

    return (
        <div className="login-container">

            <div className="login-box">

                <h1>Health Insurance</h1>

                <h2>Login</h2>

                <form onSubmit={handleLogin}>

                    <div className="form-group">

                        <label>Username</label>

                        <input
                            type="text"
                            placeholder="Enter username"
                            value={username}
                            onChange={(event) =>
                                setUsername(event.target.value)
                            }
                        />

                    </div>

                    <div className="form-group">

                        <label>Password</label>

                        <input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                        />

                    </div>

                    <button type="submit">
                        Login
                    </button>

                </form>

            </div>

        </div>
    );
}

export default Login;