import logginStyles from "./Login.module.css";
import { useNavigate } from 'react-router-dom';
// console.log(logginStyles);
export const LoginPage = () => {
    const navigate = useNavigate();
    
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted");
        navigate('/dashboard');
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
                        <div className={logginStyles["form-group"]}>
                            <label htmlFor="email">Email Address</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                className="form-control"
                                placeholder="Enter your email"
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
                                required 
                            />
                        </div>
                        <div className={logginStyles["form-options"]}>
                            <label className={`${logginStyles["remember-me"]} form-check d-flex align-items-center gap-2`}>
                                <input className="form-check-input" type="checkbox" />
                                <span className="form-check-label">Remember me</span>
                            </label>
                            <a href="#" className={logginStyles["forgot-password"]}>Forgot Password?</a>
                        </div>
                        <button type="submit" className={`${logginStyles["login-btn"]} btn btn-primary w-100`}>Sign In</button>
                        <div className={logginStyles["signup-link"]}>
                            Don't have an account? <a href="#">Sign Up</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}