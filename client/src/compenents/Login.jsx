import logginStyles from "./Login.module.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./auth/AuthContext.jsx";

export const LoginPage = () => {
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();
    const [formState, setFormState] = useState({
        email: "",
        password: "",
        remember: false,
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFormState((prevState) => ({
            ...prevState,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage("");
        setIsSubmitting(true);

        const result = await login({
            email: formState.email,
            password: formState.password,
            remember: formState.remember,
        });

        setIsSubmitting(false);

        if (!result.ok) {
            setErrorMessage(result.message || "Unable to sign in.");
            return;
        }

        navigate("/dashboard", { replace: true });
    };

    return (
        <div className={logginStyles["container"]}>
            <div className={logginStyles["login-page"]}>
                <div className={`${logginStyles["login-form"]} card border-0`}> 
                    <div className={logginStyles["logo"]}>
                        <img src="/nexgencrm_new_logo.png" alt="App Logo" />
                    </div>
                    <h2>Welcome Back</h2>
                    <p className={logginStyles["subtitle"]}>Login to access your account</p>
                    <form onSubmit={handleSubmit}> 
                        {errorMessage ? (
                            <div className="alert alert-danger" role="alert" aria-live="polite">
                                {errorMessage}
                            </div>
                        ) : null}
                        <div className={logginStyles["form-group"]}>
                            <label htmlFor="email">Email Address</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                className="form-control"
                                placeholder="Enter your email"
                                autoComplete="email"
                                value={formState.email}
                                onChange={handleChange}
                                required 
                            />
                        </div>
                        <div className={logginStyles["form-group"]}>
                            <label htmlFor="password">Password</label>
                            <input 
                                type="password" 
                                id="password" 
                                name="password" 
                                className="form-control"
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                value={formState.password}
                                onChange={handleChange}
                                required 
                            />
                        </div>
                        <div className={logginStyles["form-options"]}>
                            <label className={`${logginStyles["remember-me"]} form-check d-flex align-items-center gap-2`}>
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="remember"
                                    checked={formState.remember}
                                    onChange={handleChange}
                                />
                                <span className="form-check-label">Remember me</span>
                            </label>
                            <a href="#" className={logginStyles["forgot-password"]}>Forgot Password?</a>
                        </div>
                        <button
                            type="submit"
                            className={`${logginStyles["login-btn"]} btn btn-primary w-100`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Signing In..." : "Sign In"}
                        </button>
                        <div className={logginStyles["signup-link"]}>
                            Don't have an account? <a href="#">Sign Up</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}