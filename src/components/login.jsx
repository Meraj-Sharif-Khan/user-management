import httpServices from "../service/httpServices";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    const [userData, setUserDate]= useState({email:'', password:''})
    const[error, setError] = useState();
    const apiEndpont = "api/auth/login"
    const navigate = useNavigate();
    
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
       const {data} = await httpServices.post(apiEndpont, userData);
       localStorage.setItem("jwt", JSON.stringify(data));
        setError();
        navigate("/", {replace:"true"});
    } catch (error) {
        setError(error.response.data.error);
    }
}

    return ( 
        <>        
        <div className="login-group">
            
            <section className="login-container">
                <Link href="/">
                <img className="login-container--brand" src="brandTheApp.PNG" alt="" />
                </Link>

                <section className="login-form m-3">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="text-body-secondary form-label">Start your journey</label>
                            <h3> Sign in to the App </h3>
                            {error && (<div className="alert alert-danger p-1"><span>{error}</span></div>)}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email address</label>
                            <input type="email" required className="form-control" id="email" aria-describedby="emailHelp" autoComplete="email"
                            value={userData.email} onChange={e => setUserDate({...userData, email:e.target.value})}/>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input type="password" required className="form-control" id="password" autoComplete="current-password"
                            value={userData.password} onChange={e => setUserDate({...userData, password:e.target.value})}/>
                        </div>

                        <div className="mb-3 form-check">
                            <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
                            <label className="form-check-label" htmlFor="exampleCheck1">Remember Me</label>
                        </div>

                        <button type="submit" className="btn btn-primary col-12">Submit</button>

                    </form>

                </section>

                <section className="help-links">

                    <div className="help-links--sign-up">
                        <p>Don't have an account?</p>
                        <Link to="/signup">Sign Up</Link>
                    </div>

                    <div className="help-links--forgot-password">
                        <Link to="/">Forgot password?</Link>
                    </div>

                </section>

            </section>

            <section className="login-background"></section>
        </div>
     </>

     );
}
 
export default Login;