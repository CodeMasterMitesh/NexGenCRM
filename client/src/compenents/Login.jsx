import logginStyles from "./Login.module.css";
import { useNavigate } from 'react-router-dom';
// console.log(logginStyles);
export const LoginPage = () => {
    const navigate = useNavigate();
    
    addEventListener("submit", (e) => {
        e.preventDefault();
        console.log("Form submitted");
        navigate('/dashboard');
    });

    return (
        <div className={logginStyles["container"]}>
            <div className={logginStyles["login-page"]}>
                <div className={logginStyles["logo"]}>
                    <img src="/nexgencrm_new_logo.png" alt="App Logo" />
                </div>
                <div className={logginStyles["login-form"]}>
                    <h2>Login to Your Account</h2>
                    <form action="" method="POST"> 
                        <div className={logginStyles["form-group"]}>
                            <label htmlFor="email">Email:</label>
                            <input type="text" id="email" name="email" required />
                        </div>
                        <div className={logginStyles["form-group"]}>
                            <label htmlFor="password">Password:</label>
                            <input type="password" id="password" name="password" required />
                        </div>
                        <button type="submit">Login</button>
                    </form>
                </div>
            </div>
        </div>
    )
}