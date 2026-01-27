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
                <div className={logginStyles["login-form"]}>
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
                                placeholder="Enter your password"
                                required 
                            />
                        </div>
                        <div className={logginStyles["form-options"]}>
                            <label className={logginStyles["remember-me"]}>
                                <input type="checkbox" />
                                <span>Remember me</span>
                            </label>
                            <a href="#" className={logginStyles["forgot-password"]}>Forgot Password?</a>
                        </div>
                        <button type="submit" className={logginStyles["login-btn"]}>Sign In</button>
                        <div className={logginStyles["signup-link"]}>
                            Don't have an account? <a href="#">Sign Up</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}